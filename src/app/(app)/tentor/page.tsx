'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { BottomNav } from '@/components/navigation/BottomNav';
import { TutorCard } from '@/components/tutors/TutorCard';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { MOCK_TUTORS } from '@/lib/data/mock-data';

function TentorCatalogContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [search, setSearch] = useState(initialQuery);
  const [selectedSubject, setSelectedSubject] = useState('Semua');
  const [selectedMode, setSelectedMode] = useState<'all' | 'tatap_muka' | 'online'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc'>('rating');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setSearch(initialQuery);
    }
  }, [initialQuery]);

  const subjects = ['Semua', 'Matematika', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Inggris', 'UTBK'];

  const filteredTutors = MOCK_TUTORS.filter((tutor) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = tutor.name.toLowerCase().includes(q);
      const matchSubject = tutor.subjects.some((s) => s.toLowerCase().includes(q));
      const matchUniv = tutor.university.toLowerCase().includes(q);
      if (!matchName && !matchSubject && !matchUniv) return false;
    }

    if (selectedSubject !== 'Semua') {
      const matchSub = tutor.subjects.some((s) =>
        s.toLowerCase().includes(selectedSubject.toLowerCase())
      );
      if (!matchSub) return false;
    }

    if (selectedMode !== 'all') {
      if (!tutor.modes.includes(selectedMode)) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price_asc') return a.hourly_rate - b.hourly_rate;
    if (sortBy === 'price_desc') return b.hourly_rate - a.hourly_rate;
    return 0;
  });

  return (
    <div className="flex flex-col min-h-screen pb-24 lg:pb-10">
      {/* Header */}
      <Header title="Daftar Tentor Pilihan" showBack backHref="/beranda" />

      <main className="px-4 space-y-4 pt-3">
        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari guru, materi, atau topik..."
              className="w-full h-11 pl-10 pr-9 rounded-2xl bg-surface border border-outline-variant/40 text-xs text-on-surface placeholder:text-on-surface-variant/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <MaterialIcon
              name="search"
              className="absolute left-3 top-2.5 text-[20px] text-on-surface-variant"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface"
              >
                <MaterialIcon name="close" className="text-base" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilterDrawer(true)}
            className="h-11 px-3.5 rounded-2xl bg-surface border border-outline-variant/40 text-xs font-bold text-on-surface flex items-center gap-1.5 hover:bg-surface-container-low transition-colors shadow-sm"
          >
            <MaterialIcon name="tune" className="text-lg text-primary" />
            <span>Filter</span>
          </button>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {subjects.map((sub) => {
            const isSelected = selectedSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-surface text-on-surface border-outline-variant/30 hover:bg-surface-container-low'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* Mode Selector & Result Count */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
            <button
              onClick={() => setSelectedMode('all')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                selectedMode === 'all'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant'
              }`}
            >
              Semua Mode
            </button>
            <button
              onClick={() => setSelectedMode('tatap_muka')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                selectedMode === 'tatap_muka'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant'
              }`}
            >
              Tatap Muka
            </button>
            <button
              onClick={() => setSelectedMode('online')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                selectedMode === 'online'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant'
              }`}
            >
              Online
            </button>
          </div>

          <span className="text-[11px] text-on-surface-variant">
            Ditemukan <strong>{filteredTutors.length}</strong> tentor
          </span>
        </div>

        {/* AI Help Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-primary to-primary-container text-white shadow-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
              <MaterialIcon name="psychology" className="text-sm text-white" />
            </span>
            <h3 className="font-bold text-xs text-white">Bingung Memilih dari Puluhan Tentor?</h3>
          </div>
          <p className="text-[11px] text-slate-200 leading-relaxed mb-3">
            Biar sistem AI TentorKeun yang mencocokkan pengajar paling pas sesuai gaya belajar dan target nilai UTBK Anda dalam hitungan detik!
          </p>
          <Link
            href="/ai-matchmaking"
            className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow"
          >
            <MaterialIcon name="auto_awesome" className="text-sm" />
            <span>Coba Matchmaking AI Sekarang</span>
          </Link>
        </div>

        {/* Tutor Cards List */}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredTutors.length > 0 ? (
            filteredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3 p-8 text-center bg-surface rounded-3xl border border-outline-variant/30 space-y-3">
              <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center text-on-surface-variant">
                <MaterialIcon name="search_off" className="text-2xl" />
              </div>
              <h4 className="font-bold text-sm text-on-surface">Tidak ada tentor yang cocok</h4>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                Coba ubah kata kunci pencarian, filter mata pelajaran, atau gunakan fitur Matchmaking AI.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedSubject('Semua');
                  setSelectedMode('all');
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Filter Drawer / Modal */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0">
          <div className="w-full max-w-md bg-surface rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border-t border-outline-variant/30 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="font-bold text-base text-primary">Urutkan & Saring Tentor</h3>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-variant"
              >
                <MaterialIcon name="close" className="text-lg" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                Urutkan Berdasarkan
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'rating', label: 'Rating Tertinggi (4.9+)' },
                  { id: 'price_asc', label: 'Biaya Terendah' },
                  { id: 'price_desc', label: 'Biaya Tertinggi' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id as any)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                      sortBy === s.id
                        ? 'border-primary bg-primary/5 text-primary font-bold'
                        : 'border-outline-variant/30 text-on-surface'
                    }`}
                  >
                    <span>{s.label}</span>
                    {sortBy === s.id && <MaterialIcon name="check" className="text-sm" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowFilterDrawer(false)}
              className="w-full py-3 rounded-2xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}

export default function TentorCatalogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Memuat katalog...</div>}>
      <TentorCatalogContent />
    </Suspense>
  );
}
