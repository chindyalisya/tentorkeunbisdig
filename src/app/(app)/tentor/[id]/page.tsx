'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { SlotBookingSheet } from '@/components/tutors/SlotBookingSheet';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { MOCK_TUTORS, MOCK_SLOTS } from '@/lib/data/mock-data';

interface TutorProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function TutorProfilePage({ params }: TutorProfilePageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const tutorId = resolvedParams.id;

  const tutor =
    MOCK_TUTORS.find((t) => t.id === tutorId) || MOCK_TUTORS[0]; // fallback to Sarah Amanda
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profil' | 'slot' | 'ulasan'>('profil');

  const slots = MOCK_SLOTS.filter(
    (s) => s.tutor_id === tutor.id || s.tutor_id === 'sarah-amanda'
  );

  const reviews = [
    {
      name: 'Arga Pramudya',
      grade: 'Kelas 12 SMA (Lolos SNBT)',
      rating: 5,
      date: '10 Nov 2026',
      text: 'Kak Sarah cara jelasin kalkulus turunan benar-benar bikin paham logikanya, bukan cuma ngafalin rumus. Nilai TO UTBK ku naik dari 540 ke 715!',
    },
    {
      name: 'Ibu Ratna (Orang Tua)',
      grade: 'Orang Tua Siswa Kelas 11',
      rating: 5,
      date: '28 Okt 2026',
      text: 'Sangat tepat waktu, komunikatif, dan setelah sesi selalu ada laporan rapor evaluasi belajar detail. Anak saya jadi antusias belajar matematika.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-28">
      {/* Header */}
      <Header
        title="Profil Tentor"
        showBack
        backHref="/tentor"
        rightAction={
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-variant/50 transition-colors"
            >
              <MaterialIcon
                name={isBookmarked ? 'bookmark_added' : 'bookmark_border'}
                className={`text-[22px] ${isBookmarked ? 'text-primary' : 'text-on-surface'}`}
                filled={isBookmarked}
              />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${tutor.name} - TentorKeun`,
                    url: window.location.href,
                  });
                } else {
                  alert('Tautan profil tentor telah disalin!');
                }
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-variant/50 transition-colors"
            >
              <MaterialIcon name="share" className="text-[22px] text-on-surface" />
            </button>
          </div>
        }
      />

      <main className="px-4 space-y-5 pt-3">
        {/* Tutor Hero Card */}
        <section className="bg-surface rounded-3xl p-5 shadow-sm border border-outline-variant/30 flex flex-col items-center text-center relative overflow-hidden">
          <div className="relative mb-3">
            <img
              src={tutor.avatar_url}
              alt={tutor.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-primary/10 shadow-md"
            />
            {tutor.verified && (
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center ring-2 ring-surface shadow">
                <MaterialIcon name="verified" className="text-base" />
              </span>
            )}
          </div>

          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-1.5">
            {tutor.badge}
          </span>

          <h1 className="font-bold text-lg text-on-surface">{tutor.name}</h1>
          <p className="text-xs text-primary font-semibold mt-0.5">{tutor.title}</p>
          <p className="text-xs text-on-surface-variant mt-0.5 flex items-center justify-center gap-1">
            <MaterialIcon name="school" className="text-sm text-on-surface-variant" />
            <span>{tutor.university}</span>
          </p>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-4 border-t border-outline-variant/20">
            <div className="p-2 rounded-2xl bg-surface-container-low text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-sm">
                <MaterialIcon name="star" className="text-base" filled />
                <span className="text-on-surface">{tutor.rating}</span>
              </div>
              <span className="text-[10px] text-on-surface-variant block mt-0.5">Rating Tentor</span>
            </div>

            <div className="p-2 rounded-2xl bg-surface-container-low text-center">
              <span className="font-bold text-sm text-primary block">{tutor.reviews_count}+</span>
              <span className="text-[10px] text-on-surface-variant block mt-0.5">Sesi Selesai</span>
            </div>

            <div className="p-2 rounded-2xl bg-surface-container-low text-center">
              <span className="font-bold text-sm text-emerald-600 block">100%</span>
              <span className="text-[10px] text-on-surface-variant block mt-0.5">Kehadiran</span>
            </div>
          </div>
        </section>

        {/* Tab Switcher */}
        <div className="p-1 rounded-2xl bg-surface-container flex items-center">
          <button
            onClick={() => setActiveTab('profil')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profil'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-on-surface-variant'
            }`}
          >
            Profil & Metode
          </button>
          <button
            onClick={() => setActiveTab('slot')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'slot'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-on-surface-variant'
            }`}
          >
            Jadwal Slot ({slots.length})
          </button>
          <button
            onClick={() => setActiveTab('ulasan')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ulasan'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-on-surface-variant'
            }`}
          >
            Ulasan ({reviews.length})
          </button>
        </div>

        {activeTab === 'profil' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Bio & Pengalaman */}
            <section className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant">
                Tentang & Filosofi Mengajar
              </h3>
              <p className="text-xs text-on-surface leading-relaxed">{tutor.bio}</p>
              <div className="pt-2 flex items-center gap-2">
                <span className="text-[11px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-xl border border-primary/20">
                  Gaya: {tutor.teaching_style}
                </span>
              </div>
            </section>

            {/* Mode Belajar & Cakupan Lokasi */}
            <section className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant">
                Mode Belajar & Wilayah
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="p-3 rounded-2xl bg-surface-container-low flex items-start gap-3 border border-outline-variant/20">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <MaterialIcon name="home_pin" className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">Tatap Muka Langsung</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Tentor hadir langsung ke rumah siswa. Area: {tutor.location}.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-surface-container-low flex items-start gap-3 border border-outline-variant/20">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                    <MaterialIcon name="videocam" className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">Online Interaktif HD</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Sesi 1-on-1 via Google Meet + papan tulis digital interaktif & rekaman sesi.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Topik & Mata Pelajaran */}
            <section className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant">
                Materi / Kurikulum yang Dikuasai
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tutor.subjects.map((sub) => (
                  <span
                    key={sub}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-surface-container-low text-primary border border-outline-variant/30"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'slot' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant">
              Slot Tersedia Pekan Ini
            </h3>
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="p-3.5 rounded-2xl bg-surface border border-outline-variant/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <MaterialIcon name="calendar_month" className="text-xl" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-on-surface">
                      {slot.day_name}, {slot.date}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      {slot.time_start} - {slot.time_end} WIB •{' '}
                      {slot.mode === 'tatap_muka' ? 'Tatap Muka' : 'Online'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSheetOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow hover:bg-primary-container"
                >
                  Pilih
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ulasan' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant">
              Testimoni Siswa & Orang Tua
            </h3>
            {reviews.map((rev, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-surface border border-outline-variant/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">{rev.name}</h4>
                    <p className="text-[10px] text-on-surface-variant">{rev.grade}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <MaterialIcon name="star" className="text-sm" filled />
                    <span className="text-xs font-bold text-on-surface">{rev.rating}.0</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">&ldquo;{rev.text}&rdquo;</p>
                <span className="text-[10px] text-outline block">{rev.date}</span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-40 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 p-3 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-on-surface-variant block">Tarif Sesi Belajar</span>
            <span className="text-base font-extrabold text-primary">
              Rp {tutor.hourly_rate.toLocaleString('id-ID')}
              <span className="text-xs font-normal text-on-surface-variant"> /sesi (90 mnt)</span>
            </span>
          </div>

          <button
            onClick={() => setIsSheetOpen(true)}
            className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-lg shadow-primary/25 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <MaterialIcon name="lock_clock" className="text-base" />
            <span>Kunci Slot Belajar</span>
          </button>
        </div>
      </div>

      <SlotBookingSheet
        tutor={tutor}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        slots={slots}
      />
    </div>
  );
}

