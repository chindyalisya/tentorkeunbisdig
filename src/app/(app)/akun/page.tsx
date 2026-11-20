'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { BottomNav } from '@/components/navigation/BottomNav';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { Reveal } from '@/components/motion/Reveal';
import { isSupabaseConfigured } from '@/lib/supabase/client';

const MENU = [
  { href: '/jadwal', icon: 'calendar_today', label: 'Jadwal dan e-tiket sesi' },
  { href: '/chat', icon: 'chat_bubble', label: 'Obrolan dan unduh modul' },
  { href: '/rapor/eval-sarah-arga-1', icon: 'assignment', label: 'Rapor dan evaluasi sesi' },
  { href: '/ai-matchmaking', icon: 'psychology', label: 'Matchmaking AI tentor' },
];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`w-12 h-7 rounded-full p-0.5 flex-shrink-0 transition-colors duration-200 ${
        checked ? 'bg-primary' : 'bg-outline-variant'
      }`}
    >
      <span
        className={`block w-6 h-6 rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function AkunPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [parentReminder, setParentReminder] = useState(true);

  return (
    <div className="flex flex-col min-h-screen pb-24 lg:pb-10">
      <Header title="Akun" />

      <main className="px-4 md:px-6 pt-6 md:pt-8 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-8 lg:gap-10 items-start">
        {/* Kolom kiri: profil dan ringkasan */}
        <div className="space-y-6">
          <Reveal as="section" className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary text-on-primary font-extrabold text-xl flex items-center justify-center flex-shrink-0">
              AP
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-xl text-primary truncate">Arga Pramudya</h2>
              <p className="text-sm text-on-surface-variant truncate">arga.pramudya@student.sman8.sch.id</p>
              <p className="text-sm text-on-surface-variant mt-0.5">Siswa kelas 12 SMA</p>
            </div>
          </Reveal>

          <Reveal as="section" delay={80}>
            <h3 className="font-bold text-sm text-on-surface-variant mb-3">Belajarmu sejauh ini</h3>
            <dl className="grid grid-cols-3 rounded-xl border border-outline-variant bg-surface-container-lowest divide-x divide-outline-variant">
              {[
                { v: '4', l: 'sesi paket intensif' },
                { v: '14,5', l: 'jam belajar' },
                { v: '87', l: 'rata-rata skor' },
              ].map((s) => (
                <div key={s.l} className="p-4">
                  <dd className="font-extrabold text-2xl text-primary font-[family-name:var(--font-heading)]">{s.v}</dd>
                  <dt className="text-xs text-on-surface-variant mt-1 leading-snug">{s.l}</dt>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal as="section" delay={120} className="rounded-xl bg-surface-container p-4 text-sm">
            <p className="font-bold text-primary">Butuh bantuan memilih tentor atau kurikulum?</p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20TentorKeun,%20saya%20butuh%20bantuan%20konsultasi%20tentor"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-container transition-colors active:scale-[0.97]"
            >
              <MaterialIcon name="support_agent" className="text-[1.125rem]" />
              Chat konsultan di WhatsApp
            </a>
          </Reveal>
        </div>

        {/* Kolom kanan: menu dan pengaturan */}
        <div className="space-y-6">
          <Reveal as="section">
            <h3 className="font-bold text-sm text-on-surface-variant mb-3">Pintasan</h3>
            <nav className="rounded-xl border border-outline-variant bg-surface-container-lowest divide-y divide-outline-variant overflow-hidden">
              {MENU.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  className="group flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-primary hover:bg-surface-container transition-colors"
                >
                  <MaterialIcon name={m.icon} className="text-[1.375rem] text-on-surface-variant" />
                  <span className="flex-1">{m.label}</span>
                  <MaterialIcon
                    name="chevron_right"
                    className="text-xl text-outline transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              ))}
            </nav>
          </Reveal>

          <Reveal as="section" delay={80}>
            <h3 className="font-bold text-sm text-on-surface-variant mb-3">Pengingat</h3>
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest divide-y divide-outline-variant">
              <div className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-bold text-sm text-primary">WhatsApp 2 jam sebelum sesi</p>
                  <p className="text-sm text-on-surface-variant">Pengingat jadwal sebelum tentor tiba.</p>
                </div>
                <Toggle
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled((v) => !v)}
                  label="Pengingat WhatsApp 2 jam sebelum sesi"
                />
              </div>
              <div className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-bold text-sm text-primary">Salinan rapor ke orang tua</p>
                  <p className="text-sm text-on-surface-variant">Rapor evaluasi dikirim otomatis ke Ibu atau Ayah.</p>
                </div>
                <Toggle
                  checked={parentReminder}
                  onChange={() => setParentReminder((v) => !v)}
                  label="Kirim salinan rapor ke orang tua"
                />
              </div>
            </div>
          </Reveal>

          <Reveal as="section" delay={120} className="text-sm text-on-surface-variant">
            <p>
              <span className="font-bold text-primary">Sumber data:</span>{' '}
              {isSupabaseConfigured
                ? 'terhubung ke proyek Supabase. Pemesanan, tentor, chat, dan rapor tersimpan di cloud.'
                : 'data demo lokal. Untuk memakai Supabase, isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.'}
            </p>
          </Reveal>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
