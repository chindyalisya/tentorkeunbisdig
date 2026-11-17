import Link from 'next/link';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { MOCK_TUTORS } from '@/lib/data/mock-data';

const NAV_LINKS = [
  { href: '#fitur', label: 'Fitur' },
  { href: '#cara-kerja', label: 'Cara Kerja' },
  { href: '#tentor', label: 'Tentor' },
];

const FEATURES = [
  {
    icon: 'psychology_alt',
    title: 'Matchmaking AI',
    desc: 'Jawab beberapa pertanyaan tentang gaya belajar dan target nilaimu, lalu dapatkan tentor yang paling cocok.',
  },
  {
    icon: 'shield',
    title: 'Rekber Aman',
    desc: 'Pembayaran ditahan dan baru dicairkan ke tentor setelah sesi les selesai.',
  },
  {
    icon: 'qr_code_scanner',
    title: 'E-Tiket Presensi',
    desc: 'Kehadiran setiap sesi divalidasi lewat kode QR, jadi jadwal belajar tercatat rapi.',
  },
  {
    icon: 'assignment',
    title: 'Rapor Evaluasi',
    desc: 'Pantau perkembangan materi dan latihan soal dari rapor yang diisi tentor setelah sesi.',
  },
];

const STEPS = [
  {
    title: 'Ceritakan kebutuhanmu',
    desc: 'Pilih jenjang dan mata pelajaran, atau biarkan AI memetakan gaya belajarmu.',
  },
  {
    title: 'Pilih tentor & jadwal',
    desc: 'Bandingkan profil, rating, dan tarif, lalu booking slot tatap muka atau online.',
  },
  {
    title: 'Belajar & pantau hasilnya',
    desc: 'Ikuti sesi, ngobrol di chat, unduh modul, dan lihat rapor perkembanganmu.',
  },
];

function rupiah(n: number) {
  return `Rp${n.toLocaleString('id-ID')}`;
}

export default function LandingPage() {
  const featured = MOCK_TUTORS[0];
  const preview = MOCK_TUTORS.slice(0, 3);

  return (
    <div className="bg-white text-on-surface">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-outline-variant/30">
        <div className="mx-auto max-w-6xl h-16 px-5 sm:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="TentorKeun">
            <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-base tracking-tighter">
              TK
            </span>
            <span className="font-extrabold text-lg text-primary tracking-tight">TentorKeun</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-primary transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <Link
            href="/beranda"
            className="h-10 px-5 inline-flex items-center rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-container transition-colors"
          >
            Buka Aplikasi
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 pt-14 pb-16 md:pt-24 md:pb-28 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary bg-secondary-fixed/60 px-3 py-1 rounded-full">
              <MaterialIcon name="verified" className="text-[14px]" />
              Les privat dengan garansi rekber
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-primary">
              Temukan tentor yang pas, belajar jadi lebih tenang.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-xl">
              TentorKeun mempertemukan siswa dengan tentor terverifikasi untuk Kurikulum Merdeka, Cambridge, dan
              persiapan UTBK SNBT. Cocokkan lewat AI, bayar aman, dan pantau progres di satu tempat.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/beranda"
                className="h-12 px-7 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-white font-semibold hover:bg-primary-container transition-colors"
              >
                Cari Tentor
                <MaterialIcon name="arrow_forward" className="text-[20px]" />
              </Link>
              <Link
                href="/ai-matchmaking"
                className="h-12 px-7 inline-flex items-center justify-center gap-2 rounded-full border border-outline-variant text-primary font-semibold hover:bg-surface-container-low transition-colors"
              >
                <MaterialIcon name="auto_awesome" className="text-[20px]" />
                Coba Matchmaking AI
              </Link>
            </div>
          </div>

          {/* Kartu pratinjau tentor */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-outline-variant/40 bg-white p-6 shadow-[0_20px_60px_-20px_rgba(0,5,82,0.18)]">
              <div className="flex items-center gap-4">
                <img
                  src={featured.avatar_url}
                  alt={featured.name}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                <div className="min-w-0">
                  <p className="font-bold text-primary truncate">{featured.name}</p>
                  <p className="text-sm text-on-surface-variant truncate">{featured.badge}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {featured.subjects.slice(0, 3).map((s) => (
                  <span key={s} className="text-xs font-medium px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-outline-variant/30 flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm font-bold text-primary">
                  <MaterialIcon name="star" filled className="text-[18px] text-tertiary-fixed-dim" />
                  {featured.rating}
                  <span className="font-normal text-on-surface-variant">({featured.reviews_count})</span>
                </span>
                <span className="text-sm text-on-surface-variant">
                  <b className="text-primary">{rupiah(featured.hourly_rate)}</b> / jam
                </span>
              </div>
            </div>
            <div className="hidden sm:flex absolute -bottom-5 -left-5 items-center gap-2 rounded-2xl bg-white border border-outline-variant/40 px-4 py-3 shadow-lg">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MaterialIcon name="shield" className="text-[18px]" />
              </span>
              <span className="text-xs font-semibold text-primary leading-tight">
                Dana aman
                <br />
                <span className="font-normal text-on-surface-variant">sampai sesi selesai</span>
              </span>
            </div>
          </div>
        </section>

        {/* Fitur */}
        <section id="fitur" className="scroll-mt-20 border-t border-outline-variant/30 bg-surface-container-low/50">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 md:py-24">
            <p className="text-sm font-semibold text-secondary">Fitur</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-primary max-w-2xl">
              Semua yang kamu butuhkan untuk belajar privat.
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-2xl bg-white border border-outline-variant/40 p-6">
                  <span className="w-11 h-11 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                    <MaterialIcon name={f.icon} className="text-[24px]" />
                  </span>
                  <h3 className="mt-5 font-bold text-primary">{f.title}</h3>
                  <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cara kerja */}
        <section id="cara-kerja" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 md:py-24">
            <p className="text-sm font-semibold text-secondary">Cara kerja</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
              Tiga langkah, langsung belajar.
            </h2>
            <ol className="mt-10 grid md:grid-cols-3 gap-8">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="text-5xl font-extrabold text-primary-fixed-dim">0{i + 1}</span>
                  <h3 className="mt-3 text-lg font-bold text-primary">{s.title}</h3>
                  <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Tentor */}
        <section id="tentor" className="scroll-mt-20 border-t border-outline-variant/30">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 md:py-24">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-secondary">Tentor</p>
                <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
                  Kenalan dengan beberapa tentor.
                </h2>
              </div>
              <Link href="/tentor" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Lihat semua
                <MaterialIcon name="arrow_forward" className="text-[18px]" />
              </Link>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {preview.map((t) => (
                <Link
                  key={t.id}
                  href={`/tentor/${t.id}`}
                  className="group rounded-2xl border border-outline-variant/40 bg-white p-5 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img src={t.avatar_url} alt={t.name} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <p className="font-bold text-primary truncate group-hover:underline">{t.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">{t.badge}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-on-surface-variant line-clamp-2">{t.subjects.slice(0, 3).join(' · ')}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 font-bold text-primary">
                      <MaterialIcon name="star" filled className="text-[16px] text-tertiary-fixed-dim" />
                      {t.rating}
                    </span>
                    <span className="text-on-surface-variant">{rupiah(t.hourly_rate)} / jam</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/tentor" className="sm:hidden mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Lihat semua tentor
              <MaterialIcon name="arrow_forward" className="text-[18px]" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 pb-16 md:pb-24">
          <div className="rounded-3xl bg-primary text-white px-6 py-12 md:px-16 md:py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Siap mulai belajar?</h2>
            <p className="mt-3 text-on-primary-container max-w-xl mx-auto">
              Cari tentor sesuai kebutuhanmu, atau biarkan AI yang memilihkan.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/beranda"
                className="h-12 px-7 inline-flex items-center justify-center rounded-full bg-white text-primary font-semibold hover:bg-primary-fixed transition-colors"
              >
                Buka Aplikasi
              </Link>
              <Link
                href="/ai-matchmaking"
                className="h-12 px-7 inline-flex items-center justify-center rounded-full border border-white/30 font-semibold hover:bg-white/10 transition-colors"
              >
                Matchmaking AI
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-outline-variant/30">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-on-surface-variant">
          <span className="font-bold text-primary">TentorKeun</span>
          <span>© {new Date().getFullYear()} TentorKeun. Platform marketplace tentor les privat.</span>
        </div>
      </footer>
    </div>
  );
}
