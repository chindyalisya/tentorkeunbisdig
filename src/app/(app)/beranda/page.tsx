'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { BottomNav } from '@/components/navigation/BottomNav';
import { TutorCard } from '@/components/tutors/TutorCard';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { Reveal } from '@/components/motion/Reveal';
import { MOCK_TUTORS } from '@/lib/data/mock-data';

const JENJANG = [
  { id: 'Semua', name: 'Semua' },
  { id: 'SD', name: 'SD' },
  { id: 'SMP', name: 'SMP' },
  { id: 'SMA', name: 'SMA' },
  { id: 'UTBK', name: 'UTBK SNBT' },
  { id: 'Olimpiade', name: 'Olimpiade' },
];

const GUARANTEES = [
  { icon: 'shield', title: 'Dana ditahan sampai sesi selesai', desc: 'Kamu membayar ke TentorKeun. Tentor menerima dana setelah sesi tuntas.' },
  { icon: 'qr_code_scanner', title: 'Kehadiran dicatat lewat QR', desc: 'Setiap sesi punya e-tiket yang dipindai saat tentor tiba.' },
  { icon: 'assignment', title: 'Rapor setelah sesi', desc: 'Materi yang dibahas dan hasil latihan soal tercatat di rapor.' },
  { icon: 'chat', title: 'Chat dan modul', desc: 'Tanya tentor langsung dan unduh modul materi dari satu tempat.' },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJenjang, setSelectedJenjang] = useState<string>('SMA');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/tentor?q=${encodeURIComponent(q)}` : '/tentor');
  };

  const filteredTutors = MOCK_TUTORS.filter((t) => selectedJenjang === 'Semua' || t.levels.includes(selectedJenjang));
  const jenjangName = JENJANG.find((j) => j.id === selectedJenjang)?.name ?? selectedJenjang;

  return (
    <div className="flex flex-col min-h-screen pb-24 lg:pb-10">
      <Header />

      <main className="px-4 md:px-6 pt-6 md:pt-10 space-y-10 md:space-y-14">
        {/* Cari: panel papan tulis */}
        <section className="relative overflow-hidden rounded-2xl bg-primary-container text-white p-6 md:p-9">
          <svg
            viewBox="0 0 80 66"
            className="chalk-now hidden sm:block absolute -right-3 -bottom-5 w-32 md:w-52 text-white/20 pointer-events-none"
            fill="none"
            aria-hidden="true"
          >
            <path className="chalk-draw" pathLength={100} d="M6 36 L26 58 L72 6" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <h1 className="relative text-2xl md:text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] max-w-xl">
            Mau belajar apa hari ini?
          </h1>

          <form onSubmit={handleSearch} className="relative mt-6 max-w-2xl">
            <label htmlFor="cari" className="sr-only">
              Cari mata pelajaran, bab, atau nama tentor
            </label>
            <MaterialIcon name="search" className="absolute left-3.5 top-3.5 text-[1.375rem] text-on-surface-variant" />
            <input
              id="cari"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Mata pelajaran, bab, atau nama tentor"
              className="w-full h-12 pl-12 pr-28 rounded-full bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-shadow"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 h-9 px-5 rounded-full bg-primary text-on-primary text-sm font-bold hover:bg-primary-container transition-colors active:scale-[0.97]"
            >
              Cari
            </button>
          </form>

          <div className="relative mt-5 flex items-center gap-2 overflow-x-auto md:flex-wrap no-scrollbar pb-1" role="group" aria-label="Pilih jenjang">
            {JENJANG.map((item) => {
              const isSelected = selectedJenjang === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedJenjang(item.id)}
                  aria-pressed={isSelected}
                  className={`px-4 h-10 rounded-full text-sm whitespace-nowrap border transition-colors duration-200 active:scale-95 ${
                    isSelected
                      ? 'bg-white border-white text-primary font-bold'
                      : 'border-white/40 text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Matchmaking AI */}
        <Reveal>
          <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
            <span className="w-12 h-12 rounded-xl bg-tertiary text-primary flex items-center justify-center flex-shrink-0">
              <MaterialIcon name="psychology_alt" className="text-[1.75rem]" />
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg text-primary">Belum tahu harus pilih siapa?</h2>
              <p className="text-sm text-on-surface-variant mt-1 max-w-xl">
                Jawab beberapa pertanyaan tentang gaya belajar dan target skormu. Kami urutkan tentor dari yang paling cocok.
              </p>
            </div>
            <Link
              href="/ai-matchmaking"
              className="h-11 px-6 rounded-lg bg-primary text-on-primary text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-primary-container transition-colors active:scale-[0.97] flex-shrink-0"
            >
              Mulai diagnosis
            </Link>
          </section>
        </Reveal>

        {/* Tentor */}
        <section>
          <Reveal className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="font-bold text-xl text-primary">Tentor untuk {jenjangName}</h2>
              <p className="text-sm text-on-surface-variant mt-0.5">{filteredTutors.length} tentor tersedia</p>
            </div>
            <Link href="/tentor" className="text-sm font-semibold text-secondary hover:underline flex-shrink-0">
              Lihat semua
            </Link>
          </Reveal>

          {filteredTutors.length > 0 ? (
            <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredTutors.map((tutor, i) => (
                <Reveal key={`${selectedJenjang}-${tutor.id}`} variant="settle" delay={Math.min(i, 5) * 70}>
                  <TutorCard tutor={tutor} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-outline-variant p-8 text-center">
              <p className="font-bold text-primary">Belum ada tentor untuk jenjang ini</p>
              <p className="text-sm text-on-surface-variant mt-1">Coba jenjang lain atau lihat semua tentor.</p>
              <button
                onClick={() => setSelectedJenjang('Semua')}
                className="mt-4 h-10 px-5 rounded-lg bg-primary text-on-primary text-sm font-semibold"
              >
                Tampilkan semua
              </button>
            </div>
          )}
        </section>

        {/* Jaminan */}
        <section>
          <Reveal>
            <h2 className="font-bold text-xl text-primary">Yang kamu dapat di setiap sesi</h2>
          </Reveal>
          <div className="mt-5 grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
            {GUARANTEES.map((g, i) => (
              <Reveal key={g.title} delay={i * 80} className="flex gap-3">
                <span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 text-primary">
                  <MaterialIcon name={g.icon} className="text-[1.375rem]" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-primary leading-snug">{g.title}</h3>
                  <p className="text-sm text-on-surface-variant mt-1">{g.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
