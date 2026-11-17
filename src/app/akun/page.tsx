'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { BottomNav } from '@/components/navigation/BottomNav';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function AkunPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [parentReminder, setParentReminder] = useState(true);

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <Header title="Akun Saya" />

      <main className="px-4 space-y-4 pt-3">
        {/* Profile Card */}
        <section className="bg-surface rounded-3xl p-5 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-primary text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-primary/20 flex-shrink-0">
            AP
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-sm text-on-surface truncate">Arga Pramudya</h2>
              <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
                <MaterialIcon name="verified" className="text-xs" />
              </span>
            </div>
            <p className="text-xs text-on-surface-variant truncate">
              arga.pramudya@student.sman8.sch.id
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Siswa Kelas 12 SMA
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Member Aktif
              </span>
            </div>
          </div>
        </section>

        {/* Database & Cloud Connection Status */}
        <section className="p-4 rounded-3xl bg-surface border border-outline-variant/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MaterialIcon name="database" className="text-base" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-on-surface">Status Database Supabase</h3>
                <p className="text-[10px] text-on-surface-variant">PostgreSQL & Auth Integration</p>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                isSupabaseConfigured
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {isSupabaseConfigured ? '🟢 Supabase Terhubung' : '🔵 Mode Demo / Offline DB'}
            </span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            {isSupabaseConfigured
              ? 'Aplikasi terhubung langsung ke proyek Supabase Anda. Semua pemesanan, data tentor, chat, dan rapor tersinkronisasi di cloud.'
              : 'Aplikasi berjalan dengan data lokal reaktif. Untuk menghubungkan ke project Supabase Anda, masukkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di file .env.local.'}
          </p>
        </section>

        {/* Learning Statistics */}
        <section className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant mb-3">
            Statistik Belajar Anda
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-2xl bg-surface-container-low">
              <span className="font-extrabold text-base text-primary block">4 Sesi</span>
              <span className="text-[10px] text-on-surface-variant">Paket Intensif</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-container-low">
              <span className="font-extrabold text-base text-emerald-600 block">14.5 Jam</span>
              <span className="text-[10px] text-on-surface-variant">Waktu Belajar</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-container-low">
              <span className="font-extrabold text-base text-secondary block">87/100</span>
              <span className="text-[10px] text-on-surface-variant">Rata-rata Skor</span>
            </div>
          </div>
        </section>

        {/* Quick Menu Links */}
        <section className="bg-surface rounded-3xl p-2 shadow-sm border border-outline-variant/30 divide-y divide-outline-variant/20 text-xs">
          <Link
            href="/jadwal"
            className="flex items-center justify-between p-3 hover:bg-surface-container-low rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <MaterialIcon name="calendar_today" className="text-base" />
              </div>
              <span className="font-bold text-on-surface">Jadwal & E-Tiket Sesi</span>
            </div>
            <MaterialIcon name="chevron_right" className="text-base text-outline-variant" />
          </Link>

          <Link
            href="/ai-matchmaking"
            className="flex items-center justify-between p-3 hover:bg-surface-container-low rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-secondary-container/40 text-secondary flex items-center justify-center">
                <MaterialIcon name="psychology" className="text-base" />
              </div>
              <span className="font-bold text-on-surface">Matchmaking AI Tentor</span>
            </div>
            <MaterialIcon name="chevron_right" className="text-base text-outline-variant" />
          </Link>

          <Link
            href="/chat"
            className="flex items-center justify-between p-3 hover:bg-surface-container-low rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <MaterialIcon name="chat" className="text-base" />
              </div>
              <span className="font-bold text-on-surface">Ruang Obrolan & Unduh Modul</span>
            </div>
            <MaterialIcon name="chevron_right" className="text-base text-outline-variant" />
          </Link>

          <Link
            href="/rapor/eval-sarah-arga-1"
            className="flex items-center justify-between p-3 hover:bg-surface-container-low rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <MaterialIcon name="assignment" className="text-base" />
              </div>
              <span className="font-bold text-on-surface">Rapor & Evaluasi Sesi</span>
            </div>
            <MaterialIcon name="chevron_right" className="text-base text-outline-variant" />
          </Link>
        </section>

        {/* Preferences Toggles */}
        <section className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-3 text-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant pb-2 border-b border-outline-variant/20">
            Preferensi & Notifikasi
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-on-surface">Notifikasi WhatsApp H-2 Jam</p>
              <p className="text-[10px] text-on-surface-variant">
                Pengingat jadwal sebelum tentor tiba
              </p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                notificationsEnabled ? 'bg-primary' : 'bg-surface-container'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-on-surface">Kirim Salinan Rapor ke Orang Tua</p>
              <p className="text-[10px] text-on-surface-variant">
                Laporan evaluasi otomatis dikirimkan ke Ibu/Ayah
              </p>
            </div>
            <button
              onClick={() => setParentReminder(!parentReminder)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                parentReminder ? 'bg-primary' : 'bg-surface-container'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  parentReminder ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Help & Support */}
        <section className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/30 text-xs text-center space-y-2">
          <p className="text-on-surface-variant">
            Butuh bantuan pemesanan atau konsultasi kurikulum?
          </p>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20TentorKeun,%20saya%20butuh%20bantuan%20konsultasi%20tentor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 transition-colors"
          >
            <MaterialIcon name="support_agent" className="text-sm" />
            <span>Hubungi Konsultan via WhatsApp</span>
          </a>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

