'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tutor } from '@/lib/types';
import { MaterialIcon } from '../common/MaterialIcon';
import { SlotBookingSheet } from './SlotBookingSheet';
import { MOCK_SLOTS } from '@/lib/data/mock-data';

interface TutorCardProps {
  tutor: Tutor;
  onSelectSlot?: (tutor: Tutor) => void;
  showMatchScore?: boolean;
}

export const TutorCard: React.FC<TutorCardProps> = ({
  tutor,
  showMatchScore = false,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <div className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 hover:border-primary/40 hover:shadow-md transition-all flex flex-col gap-3 group">
        {/* Top Info */}
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <img
              src={tutor.avatar_url}
              alt={tutor.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all"
            />
            {tutor.verified && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[11px] ring-2 ring-surface shadow">
                <MaterialIcon name="verified" className="text-[14px]" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wide bg-primary/10 px-2 py-0.5 rounded-full truncate">
                {tutor.badge}
              </span>
              {showMatchScore && tutor.match_score && (
                <span className="text-[11px] font-black text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <MaterialIcon name="stars" className="text-[13px]" />
                  {tutor.match_score}% Cocok
                </span>
              )}
            </div>

            <Link href={`/tentor/${tutor.id}`} className="block mt-1">
              <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors truncate">
                {tutor.name}
              </h3>
            </Link>
            <p className="text-xs text-on-surface-variant truncate">{tutor.university}</p>

            <div className="flex items-center gap-2 mt-1 text-xs">
              <div className="flex items-center gap-1 font-bold text-tertiary-fixed-dim">
                <MaterialIcon name="star" className="text-amber-500 text-[15px]" filled />
                <span className="text-on-surface">{tutor.rating}</span>
              </div>
              <span className="text-outline-variant">•</span>
              <span className="text-on-surface-variant">{tutor.reviews_count} Sesi Sukses</span>
            </div>
          </div>
        </div>

        {/* Subjects & Modes */}
        <div className="flex flex-wrap gap-1.5">
          {tutor.subjects.slice(0, 3).map((sub) => (
            <span
              key={sub}
              className="text-[11px] font-medium bg-surface-container-low text-on-surface px-2.5 py-1 rounded-xl border border-outline-variant/20"
            >
              {sub}
            </span>
          ))}
          {tutor.modes.includes('tatap_muka') && (
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-xl flex items-center gap-1">
              <MaterialIcon name="home_pin" className="text-[12px]" /> Tatap Muka
            </span>
          )}
          {tutor.modes.includes('online') && (
            <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-xl flex items-center gap-1">
              <MaterialIcon name="videocam" className="text-[12px]" /> Online
            </span>
          )}
        </div>

        {/* Bottom Price & Action */}
        <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-[10px] text-on-surface-variant block">Mulai dari</span>
            <span className="text-sm font-extrabold text-primary">
              Rp {tutor.hourly_rate.toLocaleString('id-ID')}
              <span className="text-[10px] font-normal text-on-surface-variant"> /sesi</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/tentor/${tutor.id}`}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
            >
              Detail
            </Link>
            <button
              onClick={() => setIsSheetOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-md shadow-primary/20 active:scale-95 transition-all flex items-center gap-1"
            >
              <MaterialIcon name="lock_clock" className="text-sm" />
              <span>Kunci Slot</span>
            </button>
          </div>
        </div>
      </div>

      <SlotBookingSheet
        tutor={tutor}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        slots={MOCK_SLOTS.filter((s) => s.tutor_id === tutor.id || s.tutor_id === 'sarah-amanda')}
      />
    </>
  );
};

