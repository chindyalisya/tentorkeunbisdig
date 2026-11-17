'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { BottomNav } from '@/components/navigation/BottomNav';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { TentorService } from '@/lib/supabase/service';
import { Booking } from '@/lib/types';
import { MOCK_INITIAL_BOOKING } from '@/lib/data/mock-data';

export default function JadwalPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'pekan_ini' | 'riwayat'>('pekan_ini');
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      const all = await TentorService.getAllBookings();
      setBookings(all.length > 0 ? all : [MOCK_INITIAL_BOOKING]);
    }
    loadData();
  }, []);

  const activeBooking = bookings[0] || MOCK_INITIAL_BOOKING;

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <Header
        title="Jadwal & Progres Belajar"
        showBack={false}
        rightAction={
          <div className="flex items-center gap-1">
            <Link
              href="/chat"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-variant/50 transition-colors"
              title="Pesan Tentor"
            >
              <MaterialIcon name="chat" className="text-[22px] text-primary" />
            </Link>
          </div>
        }
      />

      <main className="px-4 space-y-5 pt-3">
        {/* Student Switcher Bar */}
        <div className="p-3.5 rounded-2xl bg-surface border border-outline-variant/30 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white font-bold text-sm flex items-center justify-center shadow-sm">
              AP
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">
                Siswa Aktif
              </span>
              <p className="font-bold text-xs text-on-surface">Arga Pramudya</p>
              <p className="text-[10px] text-on-surface-variant">SMAN 8 Jakarta • Kelas 12 IPA</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-secondary bg-secondary-container/30 px-2 py-0.5 rounded-full">
            Semester Ganjil
          </span>
        </div>

        {/* Active Ticket Hero Card */}
        <section className="bg-gradient-to-br from-primary via-primary-container to-[#1a237e] rounded-3xl p-5 text-white shadow-xl shadow-primary/15 relative overflow-hidden space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-bold tracking-wide">
                <MaterialIcon name="event_upcoming" className="text-xs" />
                Sesi Les Terdekat
              </span>
              <h2 className="font-bold text-base text-white">{activeBooking.subject}</h2>
              <p className="text-xs text-slate-200">{activeBooking.topic}</p>
            </div>
            <button
              onClick={() => setShowQRModal(true)}
              className="p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 transition-all flex flex-col items-center gap-1"
            >
              <MaterialIcon name="qr_code_2" className="text-2xl text-amber-300" />
              <span className="text-[9px] font-bold">Buka Tiket</span>
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src={activeBooking.tutor_avatar}
                alt={activeBooking.tutor_name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/20"
              />
              <div>
                <p className="font-bold text-xs text-white">{activeBooking.tutor_name}</p>
                <p className="text-[10px] text-slate-300">
                  {activeBooking.session_date} ({activeBooking.session_time})
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-white text-primary px-2 py-1 rounded-xl">
              {activeBooking.mode === 'tatap_muka' ? 'Tatap Muka' : 'Online'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-200">
              <MaterialIcon name="verified_user" className="text-sm text-emerald-400" />
              <span>Proteksi Rekber Aktif</span>
            </div>
            <Link
              href="/chat"
              className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1"
            >
              <span>Chat Tentor</span>
              <MaterialIcon name="arrow_forward" className="text-xs" />
            </Link>
          </div>
        </section>

        {/* Tab Timeline Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('pekan_ini')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'pekan_ini'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant'
              }`}
            >
              Jadwal Pekan Ini
            </button>
            <button
              onClick={() => setActiveTab('riwayat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'riwayat'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant'
              }`}
            >
              Riwayat Sesi
            </button>
          </div>

          <Link href="/tentor" className="text-xs font-bold text-primary hover:underline">
            + Tambah Sesi
          </Link>
        </div>

        {/* Timeline Items */}
        <div className="space-y-2.5">
          <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 flex items-start justify-between shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                S1
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                  Besok • 16:00 WIB
                </span>
                <h4 className="font-bold text-xs text-on-surface">
                  Kalkulus & Turunan Aljabar UTBK
                </h4>
                <p className="text-[11px] text-on-surface-variant">Kak Sarah Amanda, S.Si</p>
                <p className="text-[10px] text-outline mt-0.5">Tatap Muka di Rumah Siswa</p>
              </div>
            </div>
            <button
              onClick={() => setShowQRModal(true)}
              className="px-3 py-1.5 rounded-xl bg-surface-container text-primary font-bold text-[11px] hover:bg-surface-variant"
            >
              E-Tiket
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 flex items-start justify-between shadow-sm opacity-90">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-surface-container text-on-surface-variant flex items-center justify-center font-bold text-xs flex-shrink-0">
                S2
              </div>
              <div>
                <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full inline-block mb-1">
                  Sabtu, 21 Nov • 10:00 WIB
                </span>
                <h4 className="font-bold text-xs text-on-surface">
                  Aplikasi Turunan & Garis Singgung
                </h4>
                <p className="text-[11px] text-on-surface-variant">Kak Sarah Amanda, S.Si</p>
                <p className="text-[10px] text-outline mt-0.5">Tatap Muka di Rumah Siswa</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded-xl">
              Terjadwal
            </span>
          </div>
        </div>

        {/* Progres Belajar Analytics */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
                Progres Belajar Arga
              </h3>
              <p className="text-[11px] text-on-surface-variant">Statistik pencapaian bulan ini</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Streak 4 Pekan 🔥
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-surface border border-outline-variant/30">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                <MaterialIcon name="schedule" className="text-base" />
              </div>
              <span className="text-[10px] text-on-surface-variant block">Total Jam Belajar</span>
              <span className="font-extrabold text-base text-primary">14.5 Jam</span>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1">+3 jam dari pekan lalu</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-outline-variant/30">
              <div className="w-8 h-8 rounded-xl bg-secondary-container/40 text-secondary flex items-center justify-center mb-2">
                <MaterialIcon name="trending_up" className="text-base" />
              </div>
              <span className="text-[10px] text-on-surface-variant block">Prediksi Skor SNBT</span>
              <span className="font-extrabold text-base text-secondary">685 Poin</span>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1">+45 poin dari diagnostik</p>
            </div>
          </div>

          {/* Mastery Progress Bars */}
          <div className="p-4 rounded-3xl bg-surface border border-outline-variant/30 space-y-3 text-xs">
            <h4 className="font-bold text-xs text-on-surface">Penguasaan Bab Matematika</h4>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-semibold text-on-surface">Kalkulus Diferensial</span>
                  <span className="font-bold text-primary">87%</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '87%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-semibold text-on-surface">Dalil Rantai & Implisit</span>
                  <span className="font-bold text-secondary">82%</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '82%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-semibold text-on-surface">Aplikasi Nilai Maks/Min</span>
                  <span className="font-bold text-amber-600">74%</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '74%' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Laporan Rapor & Evaluasi Tentor */}
        <section className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <MaterialIcon name="assignment" className="text-primary text-lg" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
                Rapor & Evaluasi Sesi Terakhir
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Nilai: 87/100
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-surface-container-low space-y-1.5 text-xs">
            <p className="font-bold text-xs text-on-surface">
              Matematika SMA: Kalkulus & Turunan Aljabar (Sesi 1)
            </p>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              &ldquo;Arga menunjukkan pemahaman sangat baik pada konsep dalil turunan rantai. Perlu penguatan pada eliminasi opsi cepat.&rdquo;
            </p>
            <p className="text-[10px] text-outline">— Kak Sarah Amanda, S.Si</p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/rapor/eval-sarah-arga-1"
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold text-center shadow hover:bg-primary-container transition-all flex items-center justify-center gap-1.5"
            >
              <MaterialIcon name="analytics" className="text-sm" />
              <span>Buka Rapor Komprehensif</span>
            </Link>

            <Link
              href="/chat"
              className="px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant/40 text-primary text-xs font-bold hover:bg-surface-container-low transition-all"
            >
              Chat
            </Link>
          </div>
        </section>
      </main>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-surface rounded-3xl p-6 shadow-2xl border border-outline-variant/30 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <span className="font-bold text-xs text-primary uppercase tracking-wider">
                Presensi Kehadiran Sesi
              </span>
              <button
                onClick={() => setShowQRModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-variant"
              >
                <MaterialIcon name="close" className="text-base" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Tunjukkan QR Code ini kepada {activeBooking.tutor_name} saat sesi dimulai
            </p>

            <div className="p-4 bg-white rounded-2xl shadow-inner border border-outline-variant/20 inline-block">
              <img
                src={activeBooking.qr_code}
                alt="QR Presensi"
                className="w-40 h-40 object-contain mx-auto"
              />
            </div>

            <div className="font-mono font-black text-base text-primary tracking-widest bg-surface-container py-2 rounded-xl">
              {activeBooking.ticket_code}
            </div>

            <button
              onClick={() => setShowQRModal(false)}
              className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold"
            >
              Tutup Tiket
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}

