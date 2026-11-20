'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_TUTORS } from '@/lib/data/mock-data';
import { MaterialIcon } from '../common/MaterialIcon';

const ORDER = ['SD', 'SMP', 'SMA', 'UTBK', 'Olimpiade'];
const LEVELS = ORDER.filter((l) => MOCK_TUTORS.some((t) => t.levels.includes(l)));
const LABEL: Record<string, string> = { UTBK: 'UTBK SNBT' };

const rupiah = (n: number) => 'Rp' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Pemilih jenjang yang benar-benar berfungsi: daftar tentor berganti saat jenjang dipilih. */
export function HeroPicker() {
  const [level, setLevel] = useState(LEVELS.includes('SMA') ? 'SMA' : LEVELS[0]);
  const tutors = MOCK_TUTORS.filter((t) => t.levels.includes(level))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant p-3 md:p-4">
      <p className="px-1 pb-2 text-sm font-bold text-primary">Tentor terbaik untuk jenjang</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3" role="group" aria-label="Pilih jenjang">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            aria-pressed={level === l}
            className={`h-9 px-4 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-200 active:scale-95 ${
              level === l ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            {LABEL[l] ?? l}
          </button>
        ))}
      </div>

      <ul key={level} className="min-h-[14.5rem]">
        {tutors.map((t, i) => (
          <li key={t.id} className="animate-in" style={{ animationDelay: `${i * 70}ms` }}>
            <Link
              href={`/tentor/${t.id}`}
              className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container transition-colors"
            >
              <img src={t.avatar_url} alt="" className="w-12 h-12 rounded-xl object-cover bg-surface-container-high flex-shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-primary leading-snug truncate">{t.name}</span>
                <span className="block text-sm text-on-surface-variant truncate">{t.badge}</span>
              </span>
              <span className="text-right flex-shrink-0">
                <span className="block font-bold text-sm text-primary">{rupiah(t.hourly_rate)}</span>
                <span className="block text-xs text-on-surface-variant">per jam</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/tentor"
        className="mt-1 px-2.5 py-2 text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
      >
        Lihat semua tentor
        <MaterialIcon name="arrow_forward" className="text-[1.125rem]" />
      </Link>
    </div>
  );
}
