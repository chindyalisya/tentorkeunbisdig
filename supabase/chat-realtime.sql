-- ========================================================
-- CHAT REALTIME (siswa <-> tentor)
-- Jalankan SETELAH schema.sql dan seed.sql. Aman dijalankan berulang.
-- ========================================================

-- 1. Profil tentor terhubung ke baris tutors, supaya panel tentor tahu
--    percakapan mana saja yang boleh dibalas.
alter table public.profiles
  add column if not exists tutor_id text references public.tutors(id);

-- 2. Kolom "timestamp" diisi otomatis (jam WIB) kalau klien tidak mengirimnya.
alter table public.chat_messages
  alter column "timestamp" set default to_char(timezone('Asia/Jakarta', now()), 'HH24:MI');

create index if not exists chat_messages_booking_created_idx
  on public.chat_messages (booking_id, created_at);

-- 3. Row Level Security
--    - Siapa pun boleh membaca (demo: belum ada login siswa; booking_id berperan sebagai kunci).
--      Jika nanti siswa punya akun, ganti dengan policy berbasis auth.uid().
--    - Siswa (anon) HANYA boleh mengirim pesan bertipe 'student'.
--    - Pesan 'tutor' dan 'system' hanya boleh dikirim tentor yang login dan
--      memang pemilik booking tersebut.
drop policy if exists "Allow public insert to chat_messages" on public.chat_messages;
drop policy if exists "Students insert own messages" on public.chat_messages;
drop policy if exists "Tutors insert replies to own bookings" on public.chat_messages;
drop policy if exists "Users read own profile" on public.profiles;

create policy "Students insert own messages"
  on public.chat_messages for insert
  to anon, authenticated
  with check (sender_type = 'student');

create policy "Tutors insert replies to own bookings"
  on public.chat_messages for insert
  to authenticated
  with check (
    sender_type in ('tutor', 'system')
    and exists (
      select 1
      from public.profiles p
      join public.bookings b on b.tutor_id = p.tutor_id
      where p.id = auth.uid()
        and p.role = 'tutor'
        and b.id = chat_messages.booking_id
    )
  );

create policy "Users read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- 4. Aktifkan Realtime untuk tabel chat_messages.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'chat_messages'
  ) then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
end $$;

-- 5. Riwayat awal percakapan demo (hanya jika booking ada dan chat masih kosong).
insert into public.chat_messages (booking_id, sender_type, sender_name, text, file_name, file_size, file_type, "timestamp", is_read, created_at)
select v.booking_id, v.sender_type, v.sender_name, v.text, v.file_name, v.file_size, v.file_type, v."timestamp", true, v.created_at
from (values
  ('order-tk-884219', 'tutor',   'Kak Sarah Amanda, S.Si', 'Halo Arga! Salam kenal ya. Selamat datang di sesi bimbingan TentorKeun! 😊', null, null, null, '10:05', now() - interval '3 hours'),
  ('order-tk-884219', 'tutor',   'Kak Sarah Amanda, S.Si', 'Untuk persiapan sesi les tatap muka kita besok Rabu jam 16:00, aku sudah siapkan ringkasan rumus kilat dan kumpulan soal prediksi UTBK ya.', null, null, null, '10:06', now() - interval '2 hours 59 minutes'),
  ('order-tk-884219', 'tutor',   'Kak Sarah Amanda, S.Si', 'Silakan diunduh modulnya di bawah ini ya Arga:', 'Modul-Kalkulus-Cepat-UTBK-SarahAmanda.pdf', '2.4 MB', 'application/pdf', '10:07', now() - interval '2 hours 58 minutes'),
  ('order-tk-884219', 'student', 'Arga Pramudya',          'Halo Kak Sarah! Wah terima kasih banyak modulnya, sangat lengkap dan jelas banget rangkumannya. Sampai ketemu besok jam 4 sore di rumah ya Kak!', null, null, null, '10:15', now() - interval '2 hours 50 minutes'),
  ('order-tk-884219', 'system',  'Sistem TentorKeun',      '🔒 Dana belajar Anda aman dalam Rekber TentorKeun. E-Tiket pertemuan telah diterbitkan.', null, null, null, '10:16', now() - interval '2 hours 49 minutes')
) as v(booking_id, sender_type, sender_name, text, file_name, file_size, file_type, "timestamp", created_at)
where exists (select 1 from public.bookings where id = 'order-tk-884219')
  and not exists (select 1 from public.chat_messages where booking_id = 'order-tk-884219');

-- 6. AKUN TENTOR (lakukan sekali, manual):
--    a. Supabase Dashboard -> Authentication -> Users -> Add user (email + password).
--       Salin UUID user tersebut.
--    b. Jalankan (ganti UUID):
--
--    insert into public.profiles (id, full_name, role, tutor_id)
--    values ('00000000-0000-0000-0000-000000000000', 'Kak Sarah Amanda, S.Si', 'tutor', 'sarah-amanda')
--    on conflict (id) do update set role = 'tutor', tutor_id = excluded.tutor_id;
