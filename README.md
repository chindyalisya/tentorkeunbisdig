# TentorKeun - Tutoring Marketplace & AI Matchmaking Platform

Website resmi marketplace tentor les privat **TentorKeun** yang dibangun menggunakan **Next.js (App Router)** berdasarkan desain presisi dari **Stitch (Google)** dengan integrasi database **Supabase**.

---

## 🌟 Fitur Utama & Alur Pengguna

Aplikasi ini mencakup seluruh 12 layar utama yang telah dirancang di Google Stitch:

1. **Beranda (Mobile Landing Page)** (`/`)
   - Header interaktif dengan pemilihan lokasi (Jakarta Selatan, dsb.) dan notifikasi.
   - Kolom pencarian mata pelajaran, topik, dan tentor.
   - Banner unggulan dengan toggle peran ("Cari Tentor" & "Daftar Guru").
   - Filter cepat jenjang belajar (SD, SMP, SMA, UTBK SNBT, Olimpiade).
   - Banner **Konsultasi Pemetaan Belajar AI** (Gratis).
   - Daftar **Tentor Terpilih Minggu Ini** dari kampus ternama (ITB, UI, UGM, dsb.).
   - Kartu Garansi Keamanan Rekber 100%, E-Tiket Presensi, dan Rapor Evaluasi Sesi.

2. **Katalog & Filter Tentor** (`/tentor`)
   - Pencarian real-time dan penyaringan berbasis mata pelajaran (Matematika, Fisika, Kimia, Biologi, Bahasa Inggris).
   - Penyaringan mode belajar: **Tatap Muka** vs **Online HD**.
   - Penyortiran berdasarkan rating tertinggi dan tarif per sesi.
   - Kartu rekomendasi konsultasi AI khusus bagi siswa yang bingung memilih.

3. **Detail Profil Tentor** (`/tentor/[id]`)
   - Profil lengkap pengajar (misal: **Kak Sarah Amanda, S.Si** - Top 1% Tentor ITB).
   - Statistik jam terbang, ulasan rating (4.98), persentase kehadiran 100%.
   - Tab navigasi: **Profil & Metode**, **Jadwal Slot**, dan **Ulasan Siswa/Orang Tua**.
   - Sticky bottom action bar dengan harga dan tombol **"Kunci Slot Belajar"**.

4. **Konfirmasi Kunci Slot Belajar (Bottom Sheet)**
   - Modal drawer penahanan slot sementara dengan hitung mundur timer (14:59).
   - Pemilihan mode (Tatap Muka langsung ke rumah vs Online HD interaktif).
   - Pemilihan slot hari dan jam belajar yang tersedia.
   - Masukan topik/kendala belajar siswa.
   - Peringatan proteksi escrow Rekber TentorKeun.

5. **Layanan Checkout & Pembayaran** (`/checkout`)
   - Pilihan paket belajar fleksibel:
     - *1 Sesi Eksplorasi (90 Menit)*
     - *Paket Intensif 4 Sesi (Hemat 10%)*
     - *Paket Master 8 Sesi Garansi Naik Nilai (Hemat 20%)*
   - Formulir data siswa dan alamat rumah (untuk sesi tatap muka).
   - Pilihan metode pembayaran: BCA Virtual Account, Mandiri VA, dan QRIS.
   - Input voucher diskon (Gunakan kode promo `TENTORJUARA` untuk diskon Rp 25.000).
   - Rincian biaya transparan dengan biaya garansi rekber.

6. **Instruksi Pembayaran & Virtual Account** (`/pembayaran/[id]`)
   - Timer hitung mundur 24 jam.
   - Nomor BCA Virtual Account dengan tombol sekali klik salin.
   - Total nominal pembayaran presisi.
   - Panduan cara bayar berformat tab (BCA Mobile, KlikBCA, ATM BCA).
   - Tombol verifikasi instan **"Saya Sudah Membayar (Cek Status Otomatis)"**.

7. **Konfirmasi Pembayaran Berhasil & E-Tiket Sesi** (`/pembayaran/sukses/[id]`)
   - Animasi konfeti perayaan pembayaran berhasil.
   - Kartu E-Tiket digital resmi dengan kode booking unik (misal: `#TK-884219`).
   - Kode QR presensi kehadiran dan PIN validasi 6-digit.
   - Panduan tips persiapan sesi les pertama.

8. **Jadwal & Progres Belajar** (`/jadwal`)
   - Pengalih profil siswa aktif (Arga Pramudya - SMAN 8 Jakarta).
   - Tiket sesi terdekat dengan akses langsung ke QR presensi.
   - Garis waktu jadwal sesi pekan ini dan riwayat sesi.
   - Analisis kemajuan belajar: jam belajar, streak mingguan, dan grafik penguasaan materi (Kalkulus, Dalil Rantai, Nilai Maks/Min).
   - Akses cepat ke laporan rapor evaluasi sesi terakhir.

9. **Ruang Obrolan & Modul PDF** (`/chat`)
   - Percakapan interaktif real-time antara siswa dan tentor.
   - Pengiriman pesan instan dengan balasan otomatis interaktif.
   - Kartu berkas lampiran modul pelajaran: `Modul-Kalkulus-Cepat-UTBK-SarahAmanda.pdf` lengkap dengan tombol pratinjau & unduh.
   - Tombol pintas balasan cepat (*quick replies*).

10. **Rapor & Evaluasi Sesi** (`/rapor/[id]`)
    - Lembar evaluasi komprehensif pasca-sesi dari tentor.
    - Nilai skor sesi (misal: 87/100).
    - Analisis kompetensi topik berkategori status (*Sangat Baik*, *Paham Kuat*, *Perlu Latihan*).
    - Catatan evaluasi khusus dan rekomendasi langkah belajar selanjutnya dari tentor.
    - Lampiran latihan mandiri (`5 Soal Prediksi UTBK Turunan 2027.pdf`) dengan tombol penanda status selesai.

11. **Layanan Matchmaking AI Tentor** (`/ai-matchmaking`)
    - Kuisioner cerdas pemetaan karakter belajar siswa.
    - Pilihan gaya belajar: *Visual & Analitis Terstruktur*, *Auditori & Diskusi Terbuka*, *Drilling Soal & Trik Cepat*.
    - Pilihan kurikulum (Kurikulum Merdeka + UTBK, Cambridge/IB, K-13).
    - Input topik kendala belajar dan batas anggaran maksimal.
    - Animasi kalkulasi algoritma AI langkah-demi-langkah.

12. **Hasil Rekomendasi AI Tentor** (`/ai-matchmaking/hasil`)
    - Kartu tentor rekomendasi utama dengan Skor Kecocokan AI (misal: 98% Match).
    - Penjelasan alasan kecocokan berbasis analisis data.
    - Rekomendasi tentor alternatif lainnya.
    - Matriks komparasi tabel 3 kandidat (Gaya Belajar, Kenaikan Skor, Tarif, Skor Match AI).
    - Tombol langsung 1-klik untuk mengunci slot tentor rekomendasi AI.

13. **Akun & Preferensi** (`/akun`)
    - Ringkasan profil siswa aktif.
    - Indikator status koneksi Supabase Database (Mode Demo / Cloud Connected).
    - Statistik waktu belajar dan rata-rata skor.
    - Tombol pintas ke seluruh fitur dan tautan bantuan WhatsApp konsultan pendidikan.

---

## 🛠️ Desain & Teknologi (Tech Stack)

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) dengan palet warna dan token desain dari **Google Stitch**:
  - `primary`: `#000552`
  - `primary-container`: `#0a1680`
  - `secondary`: `#3d5d9d`
  - `surface`: `#fbf8ff`
  - Font: `Plus Jakarta Sans` & `Material Symbols Outlined`
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL dengan Row Level Security)
- **Animasi**: `canvas-confetti` untuk efek sukses pembayaran
- **Layanan Mock & Sinkronisasi**: Mendukung penyimpanan lokal reaktif (*LocalStorage fallback*) sehingga aplikasi dapat langsung dijalankan tanpa konfigurasi wajib, dan otomatis tersinkronisasi penuh saat kredensial Supabase dimasukkan.

---

## 🗄️ Panduan Database Supabase

Seluruh skema database PostgreSQL dan data awal telah disiapkan di folder `supabase/`:

- `supabase/schema.sql`: Berisi definisi tabel `profiles`, `tutors`, `tutor_slots`, `bookings`, `evaluations`, `chat_messages`, dan `ai_matchmakings` lengkap dengan RLS (Row Level Security) policies.
- `supabase/seed.sql`: Berisi data awal tentor terverifikasi, jadwal slot belajar, dan riwayat pesanan sesi.

### Cara Menghubungkan ke Supabase:

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/).
2. Buka menu **SQL Editor**, salin isi file [supabase/schema.sql](file:///c:/Users/hp/tentorkeunbisdig/supabase/schema.sql) dan jalankan (*Run*).
3. Salin isi file [supabase/seed.sql](file:///c:/Users/hp/tentorkeunbisdig/supabase/seed.sql) dan jalankan untuk mengisi data awal.
4. Buka **Project Settings** -> **API** di Supabase, lalu salin **Project URL** dan **anon public key**.
5. Buat atau perbarui file `.env.local` pada root proyek:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://proyek-anda.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
   ```
6. Mulai ulang server Next.js. Halaman `/akun` akan menampilkan status: **🟢 Supabase Terhubung**.

---

## 🚀 Menjalankan Aplikasi Secara Lokal

1. **Jalankan server aplikasi**:
   ```bash
   npm run start
   ```
   atau untuk mode pengembangan (hot-reload):
   ```bash
   npm run dev
   ```

2. Buka browser di [http://localhost:3000](http://localhost:3000).

3. Aplikasi telah dioptimalkan secara responsif dengan container mobile-app frame di layar desktop/laptop dan 100% full-screen responsif pada perangkat smartphone.
