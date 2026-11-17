'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { TutorCard } from '@/components/tutors/TutorCard';
import { SlotBookingSheet } from '@/components/tutors/SlotBookingSheet';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { TentorService } from '@/lib/supabase/service';
import { Tutor } from '@/lib/types';
import { MOCK_SLOTS } from '@/lib/data/mock-data';

export default function AiMatchmakingResultPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  useEffect(() => {
    const res = TentorService.getLastMatchmakingResult();
    setData(res);
  }, []);

  if (!data) return null;

  const topTutor: Tutor = data.recommendedTutors[0];
  const otherTutors: Tutor[] = data.recommendedTutors.slice(1);

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <Header title="Hasil Rekomendasi AI" showBack backHref="/ai-matchmaking" />

      <main className="px-4 space-y-5 pt-3">
        {/* Top Context */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/40 text-secondary text-xs font-bold">
            <MaterialIcon name="stars" className="text-sm" />
            <span>Kalkulasi AI Selesai</span>
          </div>
          <h1 className="font-bold text-lg text-primary">
            3 Tentor Paling Cocok untuk {data.studentName}
          </h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Dihitung dari 412 database pengajar berbasis gaya belajar, kelemahan kalkulus, dan target lolos UTBK SNBT.
          </p>
        </div>

        {/* Student Profile Snapshot */}
        <div className="p-3.5 rounded-2xl bg-surface border border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
              {data.studentName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-xs text-on-surface">{data.studentName}</p>
              <p className="text-[11px] text-on-surface-variant">
                Kelas 12 SMA • Visual & Analitis
              </p>
            </div>
          </div>
          <Link
            href="/ai-matchmaking"
            className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5"
          >
            <span>Ubah Kriteria</span>
            <MaterialIcon name="edit" className="text-xs" />
          </Link>
        </div>

        {/* AI Insight Box */}
        <div className="p-4 rounded-3xl bg-surface-container-low border border-primary/20 space-y-2">
          <div className="flex items-center gap-2">
            <MaterialIcon name="smart_toy" className="text-primary text-base" />
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">
              Analisis Algoritma AI
            </h3>
          </div>
          <p className="text-xs text-on-surface leading-relaxed">
            {data.analysis}
          </p>
        </div>

        {/* Top 1 Champion Card */}
        {topTutor && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                <MaterialIcon name="military_tech" className="text-amber-500 text-base" />
                Rekomendasi Utama (Skor Tertinggi)
              </span>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {topTutor.match_score || 98}% Cocok
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-gradient-to-br from-primary/5 via-surface to-secondary-container/10 border-2 border-primary/30 shadow-md space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={topTutor.avatar_url}
                  alt={topTutor.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/20"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {topTutor.badge}
                  </span>
                  <Link href={`/tentor/${topTutor.id}`}>
                    <h3 className="font-bold text-sm text-primary mt-1 hover:underline truncate">
                      {topTutor.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-on-surface-variant truncate">{topTutor.university}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <MaterialIcon name="star" className="text-sm" filled />
                      {topTutor.rating}
                    </span>
                    <span className="text-outline-variant">•</span>
                    <span className="text-on-surface-variant">{topTutor.reviews_count} Sesi</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-surface border border-outline-variant/20 text-xs text-on-surface leading-relaxed">
                <strong className="text-primary font-semibold">Alasan AI:</strong>{' '}
                {topTutor.highlight}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-outline-variant/20">
                <div>
                  <span className="text-[10px] text-on-surface-variant block">Mulai dari</span>
                  <span className="text-sm font-extrabold text-primary">
                    Rp {topTutor.hourly_rate.toLocaleString('id-ID')}
                    <span className="text-[10px] font-normal text-on-surface-variant"> /sesi</span>
                  </span>
                </div>

                <button
                  onClick={() => setSelectedTutor(topTutor)}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary-container active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <MaterialIcon name="lock_clock" className="text-sm" />
                  <span>Kunci Slot Pilihan AI</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alternative Candidates */}
        {otherTutors.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant">
              Kandidat Rekomendasi Lainnya
            </h3>
            {otherTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} showMatchScore />
            ))}
          </div>
        )}

        {/* Comparison Matrix Table */}
        <section className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
          <div className="flex items-center gap-2">
            <MaterialIcon name="compare" className="text-primary text-lg" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
              Matriks Komparasi 3 Kandidat
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-on-surface-variant">
                  <th className="py-2 pr-2 font-bold">Kriteria</th>
                  <th className="py-2 px-2 font-bold text-primary">Kak Sarah</th>
                  <th className="py-2 px-2 font-bold text-secondary">Kak Dimas</th>
                  <th className="py-2 pl-2 font-bold text-on-surface">Kak Nabila</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-[11px]">
                <tr>
                  <td className="py-2.5 pr-2 font-semibold text-on-surface-variant">Gaya Mengajar</td>
                  <td className="py-2.5 px-2 font-bold text-primary">Visual & Mindmap</td>
                  <td className="py-2.5 px-2">Diskusi Interaktif</td>
                  <td className="py-2.5 pl-2">Komunikatif</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-2 font-semibold text-on-surface-variant">Kenaikan Skor</td>
                  <td className="py-2.5 px-2 font-bold text-emerald-600">+175 Poin</td>
                  <td className="py-2.5 px-2 text-emerald-600">+160 Poin</td>
                  <td className="py-2.5 pl-2 text-emerald-600">+140 Poin</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-2 font-semibold text-on-surface-variant">Tarif Sesi</td>
                  <td className="py-2.5 px-2 font-bold">Rp 120k</td>
                  <td className="py-2.5 px-2">Rp 135k</td>
                  <td className="py-2.5 pl-2">Rp 125k</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-2 font-semibold text-on-surface-variant">Skor Match AI</td>
                  <td className="py-2.5 px-2 font-black text-emerald-600">98% Match</td>
                  <td className="py-2.5 px-2 font-bold text-primary">94% Match</td>
                  <td className="py-2.5 pl-2 font-bold text-secondary">89% Match</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {selectedTutor && (
        <SlotBookingSheet
          tutor={selectedTutor}
          isOpen={Boolean(selectedTutor)}
          onClose={() => setSelectedTutor(null)}
          slots={MOCK_SLOTS.filter(
            (s) => s.tutor_id === selectedTutor.id || s.tutor_id === 'sarah-amanda'
          )}
        />
      )}
    </div>
  );
}

