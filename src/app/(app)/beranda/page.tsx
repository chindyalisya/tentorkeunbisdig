'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { BottomNav } from '@/components/navigation/BottomNav';
import { TutorCard } from '@/components/tutors/TutorCard';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { MOCK_TUTORS } from '@/lib/data/mock-data';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'cari' | 'mengajar'>('cari');
  const [selectedJenjang, setSelectedJenjang] = useState<string>('SMA');

  const jenjangList = [
    { id: 'Semua', name: 'Semua', icon: 'auto_stories' },
    { id: 'SD', name: 'SD', icon: 'child_care' },
    { id: 'SMP', name: 'SMP', icon: 'school' },
    { id: 'SMA', name: 'SMA', icon: 'menu_book' },
    { id: 'UTBK', name: 'UTBK SNBT', icon: 'psychology' },
    { id: 'Olimpiade', name: 'Olimpiade', icon: 'emoji_events' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tentor?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/tentor');
    }
  };

  const filteredTutors = MOCK_TUTORS.filter((t) => {
    if (selectedJenjang === 'Semua') return true;
    return t.levels.includes(selectedJenjang);
  });

  return (
    <div className="flex flex-col min-h-screen pb-24 lg:pb-10">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="px-4 md:px-6 space-y-6 pt-3 md:pt-5">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari mata pelajaran, bab, atau nama tentor..."
            className="w-full h-12 pl-11 pr-12 rounded-2xl bg-surface border border-outline-variant/40 text-xs text-on-surface placeholder:text-on-surface-variant/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <MaterialIcon
            name="search"
            className="absolute left-3.5 top-3 text-[20px] text-on-surface-variant"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-container transition-colors shadow"
          >
            <MaterialIcon name="arrow_forward" className="text-base" />
          </button>
        </form>

        {/* Hero Banner */}
        <section className="p-5 md:p-8 rounded-3xl bg-gradient-to-br from-primary via-primary-container to-[#1a237e] text-white shadow-xl shadow-primary/15 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-[11px] font-bold tracking-wide mb-2.5 border border-white/10">
              <MaterialIcon name="verified" className="text-[14px]" />
              #1 Tutoring Marketplace Bergaransi
            </span>

            <h1 className="font-bold text-xl md:text-3xl leading-tight text-white tracking-tight md:max-w-xl">
              Belajar lebih asyik bersama tentor pilihan terbaik
            </h1>

            <p className="text-xs md:text-sm text-slate-200 mt-2 md:mt-3 leading-relaxed md:max-w-lg">
              Akses tentor les privat unggulan dari UI, ITB, & UGM. Siap membimbing Kurikulum Merdeka, Cambridge, dan persiapan UTBK SNBT.
            </p>

            {/* Segmented Switcher */}
            <div className="mt-4 p-1 rounded-full bg-black/20 backdrop-blur-sm flex items-center max-w-xs border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('cari')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'cari'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <MaterialIcon name="search" className="text-sm" />
                <span>Cari Tentor</span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/tentor')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'mengajar'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <MaterialIcon name="school" className="text-sm" />
                <span>Daftar Guru</span>
              </button>
            </div>
          </div>
        </section>

        {/* Jenjang Belajar */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-on-surface">Pilih Jenjang Belajar</h2>
            <Link href="/tentor" className="text-xs font-semibold text-primary hover:underline">
              Lihat Semua
            </Link>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {jenjangList.map((item) => {
              const isSelected = selectedJenjang === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedJenjang(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                      : 'bg-surface text-on-surface border-outline-variant/30 hover:bg-surface-container-low'
                  }`}
                >
                  <MaterialIcon name={item.icon} className="text-base" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* AI Matchmaking Feature Card */}
        <section className="p-4 rounded-3xl bg-surface border border-secondary/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-secondary to-secondary-container text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-secondary/20">
              <MaterialIcon name="psychology_alt" className="text-2xl" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black tracking-wider text-secondary uppercase bg-secondary-container/40 px-2 py-0.5 rounded-full inline-block mb-1">
                Fitur Unggulan AI
              </span>
              <h3 className="font-bold text-sm text-primary leading-snug">
                Konsultasi Pemetaan Belajar AI
              </h3>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                Bingung memilih dari puluhan tentor? Cocokkan karakter belajar, target skor, & gaya belajar Anda dengan algoritma AI kami.
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-on-surface-variant block">Diagnosis Belajar</span>
              <span className="text-xs font-bold text-emerald-600">Gratis 100%</span>
            </div>
            <Link
              href="/ai-matchmaking"
              className="px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold shadow hover:bg-secondary/90 transition-all active:scale-95 flex items-center gap-1"
            >
              <span>Mulai Matchmaking</span>
              <MaterialIcon name="arrow_forward" className="text-sm" />
            </Link>
          </div>
        </section>

        {/* Tentor Terpilih Minggu Ini */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-sm text-on-surface">Tentor Terpilih Minggu Ini</h2>
              <p className="text-[11px] text-on-surface-variant">Top ratings & evaluasi belajar terbaik</p>
            </div>
            <Link href="/tentor" className="text-xs font-semibold text-primary hover:underline">
              Semua ({MOCK_TUTORS.length})
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </section>

        {/* Rekber & Guarantees */}
        <section className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <MaterialIcon name="verified_user" className="text-lg text-primary" />
            <span>Garansi Keamanan TentorKeun</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-surface border border-outline-variant/20">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5">
                <MaterialIcon name="shield" className="text-sm" />
              </div>
              <p className="font-bold text-on-surface text-[11px]">Rekber Aman 100%</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Dana hanya dicairkan setelah sesi les tuntas.</p>
            </div>

            <div className="p-3 rounded-2xl bg-surface border border-outline-variant/20">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5">
                <MaterialIcon name="qr_code_scanner" className="text-sm" />
              </div>
              <p className="font-bold text-on-surface text-[11px]">E-Tiket Presensi</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Validasi kehadiran sesi dengan kode QR aman.</p>
            </div>

            <div className="p-3 rounded-2xl bg-surface border border-outline-variant/20">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-1.5">
                <MaterialIcon name="assignment" className="text-sm" />
              </div>
              <p className="font-bold text-on-surface text-[11px]">Rapor Evaluasi Sesi</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Laporan perkembangan materi & latihan soal.</p>
            </div>

            <div className="p-3 rounded-2xl bg-surface border border-outline-variant/20">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-1.5">
                <MaterialIcon name="chat" className="text-sm" />
              </div>
              <p className="font-bold text-on-surface text-[11px]">Ruang Obrolan & Modul</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Konsultasi langsung & download modul materi.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
