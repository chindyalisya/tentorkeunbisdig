import Link from 'next/link';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { Logo } from '@/components/brand/Logo';
import { HeroPicker } from '@/components/landing/HeroPicker';
import { Reveal } from '@/components/motion/Reveal';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { MOCK_TUTORS } from '@/lib/data/mock-data';

const NAV_LINKS = [
  { href: '#cara-kerja', label: 'Cara kerja' },
  { href: '#rekber', label: 'Rekber' },
  { href: '#tentor', label: 'Tentor' },
];

const SUBJECTS = ['Matematika', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Inggris', 'UTBK SNBT', 'Olimpiade', 'Kalkulus'];

const STEPS = [
  {
    r0: '24%',
    r1: '34%',
    title: 'Tentukan kebutuhan',
    desc: 'Pilih jenjang dan mata pelajaran, atau jawab diagnosis singkat supaya tentor dicocokkan dengan gaya belajarmu.',
    path: 'M12 16 L26 6 V56',
  },
  {
    r0: '40%',
    r1: '52%',
    title: 'Pilih tentor dan jadwal',
    desc: 'Baca profil, rating, dan tarif per jam. Ambil slot yang masih kosong, tatap muka atau online.',
    path: 'M7 20 C7 2 36 2 33 22 C31 34 12 44 7 58 H36',
  },
  {
    r0: '56%',
    r1: '68%',
    title: 'Bayar lewat rekber, lalu belajar',
    desc: 'Pembayaran ditahan sampai sesi selesai. Setelah sesi, tentor mengisi rapor perkembanganmu.',
    path: 'M8 12 C16 2 36 6 32 22 C30 30 20 31 17 31 C30 31 36 40 33 50 C30 62 12 60 6 50',
  },
];

const OTHERS = [
  { title: 'Kehadiran dicatat', desc: 'Setiap sesi punya e-tiket berkode QR yang dipindai saat tentor tiba.' },
  { title: 'Rapor setelah sesi', desc: 'Materi yang dibahas dan hasil latihan soal tercatat, jadi perkembanganmu terlihat.' },
  { title: 'Chat dan modul', desc: 'Tanya langsung ke tentor dan unduh modul materi tanpa pindah aplikasi.' },
];

const H2 = 'font-extrabold leading-[1.02] tracking-[-0.035em] text-[clamp(1.9rem,4vw,3.25rem)]';
const rupiah = (n: number) => 'Rp' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

function SubjectRow({ tone }: { tone: 'strong' | 'soft' }) {
  const items = [...SUBJECTS, ...SUBJECTS];
  return (
    <div className={`flex items-center whitespace-nowrap ${tone === 'strong' ? 'text-primary' : 'text-primary-fixed-dim'}`}>
      {items.map((s, i) => (
        <span key={i} className="flex items-center">
          <span>{s}</span>
          <span className="inline-block w-[0.28em] h-[0.28em] rounded-full bg-current mx-[0.45em] opacity-60" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

const UNDERLINE = 'M3 10 Q 35 0 70 10 T 140 10 T 210 10 T 280 10 T 350 10 T 397 9';

export default function LandingPage() {
  return (
    <div className="bg-background text-on-surface overflow-x-clip">
      <ScrollProgress />

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-background border-b border-outline-variant">
        <div className="mx-auto max-w-7xl h-16 px-5 sm:px-10 flex items-center justify-between">
          <Link href="/" aria-label="TentorKeun, halaman utama" className="text-primary">
            <Logo size="md" />
          </Link>
          <nav className="hidden md:flex items-center gap-9 text-sm font-semibold text-on-surface-variant">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-primary transition-colors">
                {l.label}
              </a>
            ))}
          </nav>
          <Link
            href="/beranda"
            className="h-10 px-5 inline-flex items-center rounded-full bg-primary text-on-primary text-sm font-bold hover:bg-primary-container transition-colors active:scale-[0.97]"
          >
            Buka aplikasi
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-5 sm:px-10 pt-10 md:pt-16 pb-14 md:pb-20 grid grid-cols-[minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_26rem] gap-x-14 gap-y-10 items-start">
          <div className="min-w-0">
            <h1 className="font-extrabold text-primary leading-[0.95] tracking-[-0.04em] text-[clamp(2.6rem,9vw,5.25rem)] xl:text-[clamp(3.25rem,6vw,5.25rem)]">
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="hero-l1 block">
                  <span className="word" style={{ ['--i' as string]: 0 }}>Pelajaran</span>
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="hero-l2 block">
                  <span className="word" style={{ ['--i' as string]: 1 }}>sulit?</span>
                </span>
              </span>
              <span className="block pb-[0.1em]">
                <span className="hero-l3 block">
                  <span className="relative inline-block chalk-now text-secondary">
                    <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em] text-primary">
                      <span className="word" style={{ ['--i' as string]: 2 }}>Tentorkeun.</span>
                    </span>
                    <svg
                      viewBox="0 0 400 18"
                      preserveAspectRatio="none"
                      className="absolute left-0 -bottom-[0.02em] w-full h-[0.13em]"
                      fill="none"
                      aria-hidden="true"
                      style={{ ['--cd' as string]: '1.05s' }}
                    >
                      <path className="chalk-draw" pathLength={100} d={UNDERLINE} stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </span>
            </h1>

            <Reveal className="mt-8 md:mt-10">
              <p className="text-base md:text-lg text-on-surface-variant leading-relaxed max-w-xl">
                Pilih jenjang, bandingkan tentor terverifikasi beserta tarif per jam, lalu booking sesi tatap muka atau online.
                Dana baru diteruskan ke tentor setelah sesi selesai.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link
                  href="/beranda"
                  className="group h-12 pl-7 pr-5 inline-flex items-center gap-2.5 rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-colors active:scale-[0.97]"
                >
                  Cari tentor
                  <MaterialIcon name="arrow_forward" className="text-[1.25rem] transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/ai-matchmaking"
                  className="font-bold text-primary underline decoration-2 underline-offset-[6px] decoration-primary/30 hover:decoration-primary transition-colors"
                >
                  Coba matchmaking AI
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal variant="settle" delay={150} className="xl:mt-3">
            <HeroPicker />
          </Reveal>
        </section>

        {/* Pita mata pelajaran: bergeser berlawanan arah mengikuti scroll */}
        <div className="border-y border-outline-variant py-4 md:py-6 overflow-hidden" aria-hidden="true">
          <div className="row-a font-extrabold tracking-[-0.04em] leading-none text-[clamp(2rem,5.5vw,4.5rem)]">
            <SubjectRow tone="strong" />
          </div>
          <div className="row-b mt-1.5 font-extrabold tracking-[-0.04em] leading-none text-[clamp(2rem,5.5vw,4.5rem)]">
            <SubjectRow tone="soft" />
          </div>
        </div>

        {/* Cara kerja: panel biru, langkah menyala sesuai scroll */}
        <section id="cara-kerja" className="scroll-mt-16 bg-primary-container text-white rounded-t-[2rem] md:rounded-t-[3rem]">
          <div className="steps-wrap md:h-[260vh]">
            <div className="md:sticky md:top-0 md:h-screen md:flex md:items-center">
              <div className="mx-auto w-full max-w-7xl px-5 sm:px-10 py-16 md:py-0 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-center">
                <Reveal>
                  <h2 className={`${H2} text-[clamp(2rem,4.4vw,3.75rem)]`}>Tiga langkah sampai sesi pertama</h2>
                  <p className="mt-5 text-on-primary-container max-w-sm md:text-lg">
                    Tanpa perlu menghubungi tentor satu per satu.
                  </p>
                </Reveal>

                <ol className="space-y-9 md:space-y-11">
                  {STEPS.map((s) => (
                    <li
                      key={s.title}
                      className="step flex items-center gap-6 md:gap-8"
                      style={{ ['--r0' as string]: s.r0, ['--r1' as string]: s.r1 }}
                    >
                      <svg viewBox="0 0 44 66" className="w-11 h-16 md:w-14 md:h-20 flex-shrink-0 text-white" fill="none" aria-hidden="true">
                        <path className="numeral" pathLength={100} d={s.path} stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight">{s.title}</h3>
                        <p className="mt-1.5 text-on-primary-container max-w-md">{s.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Rekber: koin bergerak mengikuti scroll */}
        <section id="rekber" className="scroll-mt-16 mx-auto max-w-7xl px-5 sm:px-10 py-16 md:py-28">
          <Reveal>
            <h2 className={`${H2} text-primary max-w-2xl`}>Uangmu aman sampai sesi selesai</h2>
            <p className="mt-5 text-base md:text-lg text-on-surface-variant max-w-xl">
              Kamu membayar ke TentorKeun, bukan langsung ke tentor. Dana ditahan, lalu diteruskan setelah sesi tuntas.
            </p>
          </Reveal>

          <div className="rekber-track mt-14 md:mt-20 mx-11 sm:mx-16 relative h-36">
            <div className="absolute top-7 inset-x-0 h-1.5 rounded-full bg-outline-variant" />
            <div className="coin-fill absolute top-7 left-0 w-full h-1.5 rounded-full bg-primary" />

            {[
              { left: '0%', icon: 'person', label: 'Kamu membayar' },
              { left: '50%', icon: 'lock', label: 'Dana ditahan' },
              { left: '100%', icon: 'school', label: 'Tentor menerima' },
            ].map((n, i) => (
              <div key={n.label} className="absolute top-0 -translate-x-1/2 flex flex-col items-center w-24 sm:w-40" style={{ left: n.left }}>
                <span className="relative w-14 h-14 rounded-full bg-surface-container-lowest border-2 border-primary text-primary flex items-center justify-center">
                  {i === 1 ? (
                    <>
                      <MaterialIcon name="lock" className="done-out text-[1.5rem] absolute" />
                      <MaterialIcon name="check" className="done-in text-[1.75rem] absolute" />
                    </>
                  ) : (
                    <MaterialIcon name={n.icon} className="text-[1.5rem]" />
                  )}
                </span>
                <span className="mt-3 text-xs sm:text-sm font-bold text-primary text-center leading-snug relative">
                  {i === 1 ? (
                    <>
                      <span className="done-out">Dana ditahan</span>
                      <span className="done-in absolute inset-x-0 top-0">Sesi selesai</span>
                    </>
                  ) : (
                    n.label
                  )}
                </span>
              </div>
            ))}

            {/* Koin: pembungkus selebar lintasan digeser, koin menempel di ujung kanannya */}
            <div className="coin-track absolute top-7 left-0 w-full h-0 pointer-events-none" aria-hidden="true">
              <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-full bg-primary text-on-primary font-extrabold text-sm flex items-center justify-center ring-4 ring-background">
                Rp
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-16 grid grid-cols-[minmax(0,1fr)] sm:grid-cols-3 gap-x-10 gap-y-8">
            {OTHERS.map((o, i) => (
              <Reveal key={o.title} delay={i * 100} className="border-t-2 border-primary pt-4">
                <h3 className="font-bold text-lg text-primary">{o.title}</h3>
                <p className="mt-1.5 text-on-surface-variant">{o.desc}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Tentor: daftar bergaya indeks */}
        <section id="tentor" className="scroll-mt-16 mx-auto max-w-7xl px-5 sm:px-10 pb-16 md:pb-28">
          <Reveal className="flex items-end justify-between gap-6 mb-7 md:mb-10">
            <h2 className={`${H2} text-primary`}>Kenalan dengan tentornya</h2>
            <Link href="/tentor" className="hidden sm:inline-flex font-bold text-primary underline decoration-2 underline-offset-[6px] decoration-primary/30 hover:decoration-primary flex-shrink-0">
              Lihat semua
            </Link>
          </Reveal>

          <div className="border-t border-outline-variant">
            {MOCK_TUTORS.map((t, i) => (
              <Reveal key={t.id} delay={Math.min(i, 4) * 70}>
                <Link
                  href={`/tentor/${t.id}`}
                  className="group relative isolate flex items-center gap-4 md:gap-8 py-5 md:py-7 px-2 md:px-7 border-b border-outline-variant overflow-hidden"
                >
                  <span className="absolute inset-0 -z-10 bg-primary origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100" />
                  <h3 className="flex-1 min-w-0 text-xl md:text-3xl font-bold tracking-[-0.025em] text-primary group-hover:text-white group-focus-visible:text-white transition-colors duration-300 truncate">
                    {t.name}
                  </h3>
                  <span className="hidden xl:block w-56 text-on-surface-variant group-hover:text-on-primary-container transition-colors duration-300">
                    {t.badge}
                  </span>
                  <span className="text-right flex-shrink-0 text-primary group-hover:text-white transition-colors duration-300">
                    <b className="block md:text-lg">{rupiah(t.hourly_rate)}</b>
                    <span className="text-xs md:text-sm opacity-70">per jam</span>
                  </span>
                  <img
                    src={t.avatar_url}
                    alt=""
                    className="hidden md:block absolute right-28 top-1/2 -translate-y-1/2 translate-x-6 w-14 h-14 rounded-full object-cover bg-surface-container-high opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"
                  />
                  <span className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-primary text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:border-white group-hover:-rotate-45 transition-all duration-300">
                    <MaterialIcon name="arrow_forward" className="text-[1.25rem]" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Ajakan + footer */}
        <section className="bg-primary-container text-white rounded-t-[2rem] md:rounded-t-[3rem]">
          <div className="mx-auto max-w-7xl px-5 sm:px-10 pt-16 md:pt-24 pb-10">
            <Reveal variant="none">
              <h2 className="font-extrabold leading-[0.98] tracking-[-0.04em] text-[clamp(2.3rem,6.5vw,5.25rem)]">
                <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  <span className="wordx" style={{ ['--i' as string]: 0 }}>Cari tentor</span>
                </span>
                <span className="block pb-[0.1em]">
                  <span className="relative inline-block">
                    <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                      <span className="wordx" style={{ ['--i' as string]: 1 }}>pertamamu.</span>
                    </span>
                    <svg viewBox="0 0 400 18" preserveAspectRatio="none" className="absolute left-0 -bottom-[0.02em] w-full h-[0.13em] text-on-primary-container" fill="none" aria-hidden="true" style={{ ['--cd' as string]: '0.6s' }}>
                      <path className="chalk-draw" pathLength={100} d={UNDERLINE} stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </h2>
            </Reveal>

            <Reveal delay={200} className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href="/beranda"
                className="group h-12 pl-7 pr-5 inline-flex items-center gap-2.5 rounded-full bg-white text-primary font-bold hover:bg-primary-fixed transition-colors active:scale-[0.97]"
              >
                Buka aplikasi
                <MaterialIcon name="arrow_forward" className="text-[1.25rem] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href="/ai-matchmaking" className="font-bold underline decoration-2 underline-offset-[6px] decoration-white/40 hover:decoration-white transition-colors">
                Coba matchmaking AI
              </Link>
            </Reveal>

            <footer className="mt-20 md:mt-28 pt-7 border-t border-white/20 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <Logo size="lg" className="text-white" />
              <p className="text-on-primary-container max-w-xs text-sm md:text-right">
                Marketplace tentor les privat, dari Kurikulum Merdeka sampai UTBK SNBT.
              </p>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
