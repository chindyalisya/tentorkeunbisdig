'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Session } from '@supabase/supabase-js';
import { Logo } from '@/components/brand/Logo';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { Composer } from '@/components/chat/Composer';
import { ConnectionBadge } from '@/components/chat/ConnectionBadge';
import { MessageList } from '@/components/chat/MessageList';
import { useChat } from '@/lib/hooks/useChat';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { TentorService } from '@/lib/supabase/service';
import { TutorAuth, TutorProfile } from '@/lib/supabase/tutor-auth';
import type { ChatConnection, ConversationSummary } from '@/lib/types';

const TUTOR_SUGGESTIONS = [
  'Boleh kirim foto soalnya?',
  'Coba tuliskan dulu yang diketahui dan ditanyakan ya.',
  'Siap, sampai ketemu di sesi nanti.',
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

function shortTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const tz = 'Asia/Jakarta';
  const same = d.toLocaleDateString('en-CA', { timeZone: tz }) === new Date().toLocaleDateString('en-CA', { timeZone: tz });
  return same
    ? d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: tz }).replace('.', ':')
    : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', timeZone: tz });
}

const byRecent = (a: ConversationSummary, b: ConversationSummary) =>
  (b.last?.created_at ?? b.booking.created_at).localeCompare(a.last?.created_at ?? a.booking.created_at);

export default function PanelTentorPage() {
  return isSupabaseConfigured ? <Gate /> : <SetupNotice />;
}

/* ---------- Belum ada Supabase ---------- */

function SetupNotice() {
  return (
    <Screen>
      <Card title="Panel tentor butuh Supabase">
        <p className="text-on-surface-variant">
          Balasan tentor dikirim lewat Supabase Realtime, jadi panel ini aktif setelah proyek Supabase tersambung.
        </p>
        <ol className="mt-4 space-y-2 text-sm text-on-surface list-decimal pl-5">
          <li>
            Jalankan <code className="font-mono">supabase/schema.sql</code>, <code className="font-mono">seed.sql</code>, lalu{' '}
            <code className="font-mono">chat-realtime.sql</code> di SQL Editor.
          </li>
          <li>
            Isi <code className="font-mono">.env.local</code> dengan <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> dan{' '}
            <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, lalu mulai ulang server.
          </li>
          <li>Buat akun tentor di Authentication, lalu tautkan lewat SQL (contohnya ada di bawah file chat-realtime.sql).</li>
        </ol>
        <Link href="/chat" className="mt-6 inline-flex font-bold text-primary underline decoration-2 underline-offset-[6px] decoration-primary/30 hover:decoration-primary">
          Buka chat siswa (mode demo)
        </Link>
      </Card>
    </Screen>
  );
}

/* ---------- Gerbang login ---------- */

type Phase = 'checking' | 'signed-out' | 'not-tutor' | 'ready' | 'error';

/** Hasil pemeriksaan profil untuk satu pengguna. */
type ProfileResult = { userId: string; profile: TutorProfile | null; error?: string };

function Gate() {
  // undefined = belum tahu; null = tidak login
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [result, setResult] = useState<ProfileResult | null>(null);

  useEffect(() => {
    let active = true;
    TutorAuth.getSession().then((s) => active && setSession(s));
    const stop = TutorAuth.onChange((s) => active && setSession(s));
    return () => {
      active = false;
      stop();
    };
  }, []);

  // Profil dimuat di efek terpisah (bukan di dalam callback auth) supaya tidak berebut kunci klien Supabase.
  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    let active = true;
    TutorAuth.getProfile(userId)
      .then((profile) => active && setResult({ userId, profile }))
      .catch((e) =>
        active && setResult({ userId, profile: null, error: e instanceof Error ? e.message : 'Gagal memuat profil' })
      );
    return () => {
      active = false;
    };
  }, [userId]);

  // Fase diturunkan dari session + hasil pemeriksaan, bukan disimpan terpisah.
  const current = result && result.userId === userId ? result : null;
  const profile = current?.profile ?? null;
  const error = current?.error ?? null;
  const phase: Phase =
    session === undefined ? 'checking'
      : session === null ? 'signed-out'
        : !current ? 'checking'
          : current.error ? 'error'
            : current.profile ? 'ready'
              : 'not-tutor';

  if (phase === 'checking') {
    return (
      <Screen>
        <p className="text-on-surface-variant" role="status">Memeriksa sesi...</p>
      </Screen>
    );
  }
  if (phase === 'signed-out') return <LoginForm />;
  if (phase === 'not-tutor') {
    return (
      <Screen>
        <Card title="Akun ini belum terdaftar sebagai tentor">
          <p className="text-on-surface-variant">
            Masuk berhasil, tetapi akun belum punya profil tentor. Minta admin menautkan akunmu ke data tentor (tabel{' '}
            <code className="font-mono">profiles</code>, kolom <code className="font-mono">role</code> dan{' '}
            <code className="font-mono">tutor_id</code>).
          </p>
          <button type="button" onClick={() => void TutorAuth.signOut()} className="mt-6 h-11 px-6 rounded-full border border-outline-variant font-bold text-primary hover:bg-surface-container-low">
            Keluar
          </button>
        </Card>
      </Screen>
    );
  }
  if (phase === 'error' || !profile) {
    return (
      <Screen>
        <Card title="Profil belum bisa dimuat">
          <p className="text-on-surface-variant" role="alert">{error}</p>
          <button type="button" onClick={() => void TutorAuth.signOut()} className="mt-6 h-11 px-6 rounded-full border border-outline-variant font-bold text-primary hover:bg-surface-container-low">
            Keluar
          </button>
        </Card>
      </Screen>
    );
  }
  return <Workspace profile={profile} />;
}

function Screen({ children }: { children: React.ReactNode }) {
  return <main className="min-h-[100dvh] bg-background flex items-center justify-center p-5">{children}</main>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-3xl p-7 sm:p-9">
      <Logo size="md" className="text-primary mb-6" />
      <h1 className="font-extrabold text-2xl tracking-[-0.02em] text-primary mb-3">{title}</h1>
      {children}
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await TutorAuth.signIn(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal masuk');
      setBusy(false);
    }
  };

  const field =
    'w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant text-base text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15';

  return (
    <Screen>
      <Card title="Masuk ke panel tentor">
        <form onSubmit={submit} className="space-y-4 mt-5">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-primary mb-1.5">Email</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-primary mb-1.5">Kata sandi</label>
            <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
          </div>
          {error && (
            <p role="alert" className="px-3.5 py-2.5 rounded-xl bg-error-container text-on-error-container text-sm">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy || !email || !password}
            className="w-full h-12 rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-colors active:scale-[0.98] disabled:opacity-40"
          >
            {busy ? 'Masuk...' : 'Masuk'}
          </button>
        </form>
      </Card>
    </Screen>
  );
}

/* ---------- Ruang kerja tentor ---------- */

function Workspace({ profile }: { profile: TutorProfile }) {
  const [convs, setConvs] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [listConn, setListConn] = useState<ChatConnection>('connecting');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const knownIds = useRef(new Set<string>());

  const loadList = useCallback(
    () =>
      TentorService.getTutorConversations(profile.tutor_id)
        .then((list) => {
          knownIds.current = new Set(list.map((c) => c.booking.id));
          setConvs([...list].sort(byRecent));
          setListError(null);
        })
        .catch((e) => setListError(e instanceof Error ? e.message : 'Gagal memuat percakapan'))
        .finally(() => setLoading(false)),
    [profile.tutor_id]
  );

  useEffect(() => {
    void loadList();
    // Langganan ini menerima pesan dari semua booking; hanya yang milik tentor ini yang dipakai.
    const stop = TentorService.subscribeToAllChats(
      (m) => {
        if (!knownIds.current.has(m.booking_id)) return;
        setConvs((prev) =>
          prev
            .map((c) => (c.booking.id === m.booking_id ? { ...c, last: m, needsReply: m.sender_type === 'student' } : c))
            .sort(byRecent)
        );
      },
      (s) => {
        setListConn(s);
        if (s === 'live') void loadList(); // sinkron ulang setelah tersambung, juga menangkap booking baru
      }
    );
    const onVisible = () => document.visibilityState === 'visible' && void loadList();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [loadList]);

  // Layar lebar: percakapan teratas terbuka otomatis. Ponsel: tampil daftar dulu, thread terbuka setelah dipilih.
  const threadOpenOnMobile = selectedId !== null;
  const selected = convs.find((c) => c.booking.id === (selectedId ?? convs[0]?.booking.id)) ?? null;
  const waiting = convs.filter((c) => c.needsReply).length;

  return (
    <div className="h-[100dvh] bg-surface md:grid md:grid-cols-[22rem_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)] overflow-hidden">
      {/* Daftar percakapan */}
      <aside className={`${threadOpenOnMobile ? 'hidden md:flex' : 'flex'} h-full min-h-0 flex-col border-r border-outline-variant bg-surface`}>
        <div className="px-5 h-16 flex items-center justify-between border-b border-outline-variant flex-shrink-0">
          <div className="min-w-0">
            <Logo size="md" className="text-primary" />
          </div>
          <button
            type="button"
            onClick={() => void TutorAuth.signOut()}
            className="h-9 px-3.5 rounded-full border border-outline-variant text-sm font-bold text-primary hover:bg-surface-container-low"
          >
            Keluar
          </button>
        </div>

        <div className="px-5 py-4 border-b border-outline-variant flex-shrink-0">
          <p className="text-sm text-on-surface-variant">Masuk sebagai</p>
          <p className="font-bold text-primary truncate">{profile.full_name}</p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <ConnectionBadge status={listConn} />
            {waiting > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-xs font-bold">
                {waiting} menunggu balasan
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="p-5 space-y-3 animate-pulse" aria-label="Memuat percakapan">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-surface-container" />
              ))}
            </div>
          )}

          {listError && (
            <div role="alert" className="m-4 p-3 rounded-xl bg-error-container text-on-error-container text-sm">
              {listError}{' '}
              <button type="button" onClick={() => void loadList()} className="font-bold underline underline-offset-4">
                Coba lagi
              </button>
            </div>
          )}

          {!loading && !listError && convs.length === 0 && (
            <p className="p-6 text-sm text-on-surface-variant text-center">
              Belum ada siswa yang memesan sesi denganmu. Percakapan muncul di sini setelah ada pesanan.
            </p>
          )}

          <ul>
            {convs.map((c) => {
              const active = c.booking.id === selected?.booking.id;
              const preview = c.last
                ? `${c.last.sender_type === 'tutor' ? 'Kamu: ' : ''}${c.last.file_name ? `Berkas ${c.last.file_name}` : c.last.text}`
                : 'Belum ada pesan';
              return (
                <li key={c.booking.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.booking.id)}
                    aria-current={active ? 'true' : undefined}
                    className={`w-full text-left px-5 py-4 flex items-center gap-3.5 border-b border-outline-variant/60 transition-colors ${active ? 'bg-tertiary' : 'hover:bg-surface-container-low'
                      }`}
                  >
                    <span className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {initials(c.booking.student_name)}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className={`truncate text-primary ${c.needsReply ? 'font-extrabold' : 'font-bold'}`}>
                          {c.booking.student_name}
                        </span>
                        <span className="text-xs text-outline flex-shrink-0">{shortTime(c.last?.created_at)}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className={`flex-1 truncate text-sm ${c.needsReply ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
                          {preview}
                        </span>
                        {c.needsReply && <span className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" aria-label="Menunggu balasan" />}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Percakapan terpilih */}
      <section className={`${threadOpenOnMobile ? 'flex' : 'hidden md:flex'} h-full min-h-0 min-w-0 flex-col`}>
        {selected ? (
          <Thread key={selected.booking.id} conv={selected} onBack={() => setSelectedId(null)} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-on-surface-variant">
            <MaterialIcon name="forum" className="text-5xl text-outline-variant mb-3" />
            <p className="font-bold text-primary">Pilih percakapan</p>
            <p className="text-sm mt-1">Balasanmu langsung sampai ke siswa.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function Thread({ conv, onBack }: { conv: ConversationSummary; onBack: () => void }) {
  const { booking } = conv;
  const { messages, connection, loading, loadError, send, retry, reload } = useChat(booking.id);

  const handleSend = (text: string) => {
    void send({
      booking_id: booking.id,
      sender_type: 'tutor',
      sender_name: booking.tutor_name,
      text,
    });
  };

  return (
    <>
      <header className="min-h-16 px-3 sm:px-5 py-2.5 border-b border-outline-variant flex items-center gap-3 flex-shrink-0">
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali ke daftar"
          className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface flex-shrink-0"
        >
          <MaterialIcon name="arrow_back" className="text-xl" />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-primary truncate leading-tight">
            {booking.student_name}
            <span className="font-normal text-on-surface-variant text-sm"> · {booking.student_grade}</span>
          </h2>
          <p className="text-xs text-on-surface-variant truncate">
            {booking.subject}, {booking.topic}
          </p>
          <p className="text-xs text-on-surface-variant truncate">
            {booking.session_date}, {booking.session_time} · {booking.mode === 'tatap_muka' ? 'Tatap muka' : 'Online'}
            {booking.mode === 'tatap_muka' && booking.student_address ? ` · ${booking.student_address}` : ''}
          </p>
        </div>
        <div className="hidden sm:block flex-shrink-0">
          <ConnectionBadge status={connection} />
        </div>
      </header>

      {loadError && (
        <div role="alert" className="px-5 py-2.5 bg-error-container text-on-error-container text-sm flex items-center gap-3 flex-shrink-0">
          <span className="flex-1">Percakapan belum bisa dimuat. {loadError}</span>
          <button type="button" onClick={() => void reload()} className="font-bold underline underline-offset-4">
            Muat ulang
          </button>
        </div>
      )}

      <MessageList
        messages={messages}
        me="tutor"
        loading={loading}
        emptyText="Belum ada pesan. Sapa siswamu lebih dulu."
        onRetry={retry}
      />

      <Composer onSend={handleSend} placeholder={`Balas ${booking.student_name.split(' ')[0]}...`} suggestions={TUTOR_SUGGESTIONS} />
    </>
  );
}
