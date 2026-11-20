'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MaterialIcon } from '../common/MaterialIcon';
import { LogoMark } from '../brand/Logo';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  rightAction?: React.ReactNode;
}

const LOCATIONS = [
  'Jakarta Selatan',
  'Jakarta Pusat',
  'Jakarta Barat',
  'Jakarta Timur',
  'Tangerang Selatan (BSD & Bintaro)',
  'Depok & Sekitarnya',
  'Bandung Kota',
  'Surabaya Pusat',
];

export const Header: React.FC<HeaderProps> = ({ title, showBack = false, backHref, rightAction }) => {
  const router = useRouter();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Jakarta Selatan');

  const handleBack = () => (backHref ? router.push(backHref) : router.back());

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-surface border-b border-outline-variant">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-2 w-full">
          {showBack ? (
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={handleBack}
                className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
                aria-label="Kembali"
              >
                <MaterialIcon name="arrow_back" className="text-[1.375rem]" />
              </button>
              <h1 className="font-bold text-lg text-primary truncate">{title || 'TentorKeun'}</h1>
            </div>
          ) : title ? (
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/beranda" className="lg:hidden text-primary flex-shrink-0" aria-label="Beranda">
                <LogoMark className="w-6 h-8" />
              </Link>
              <h1 className="font-bold text-xl text-primary truncate">{title}</h1>
            </div>
          ) : (
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/beranda" className="lg:hidden text-primary flex-shrink-0" aria-label="Beranda">
                <LogoMark className="w-6 h-8" />
              </Link>
              <button
                onClick={() => setShowLocationModal(true)}
                className="flex items-center gap-1.5 text-left min-h-[2.75rem] group"
                aria-haspopup="dialog"
              >
                <MaterialIcon name="location_on" className="text-[1.25rem] text-on-surface-variant" />
                <span className="flex flex-col leading-tight min-w-0">
                  <span className="text-[0.6875rem] text-on-surface-variant">Belajar di sekitar</span>
                  <span className="text-sm font-bold text-primary truncate group-hover:underline">{selectedLocation}</span>
                </span>
                <MaterialIcon name="expand_more" className="text-[1.125rem] text-primary flex-shrink-0" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 flex-shrink-0">
            {rightAction ?? (
              <Link
                href="/jadwal"
                className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors relative"
                title="Jadwal belajar"
                aria-label="Jadwal belajar"
              >
                <MaterialIcon name="notifications" className="text-[1.375rem]" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {showLocationModal && (
        <div
          className="fixed inset-0 z-50 bg-primary/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowLocationModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Pilih kota dan area belajar"
        >
          <div
            className="animate-in w-full max-w-md bg-surface rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl border border-outline-variant"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
              <h3 className="font-bold text-base text-primary">Pilih kota dan area belajar</h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container"
                aria-label="Tutup"
              >
                <MaterialIcon name="close" className="text-xl" />
              </button>
            </div>
            <div className="mt-4 space-y-1 max-h-72 overflow-y-auto pr-1">
              {LOCATIONS.map((loc) => {
                const active = selectedLocation === loc;
                return (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationModal(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between text-sm transition-colors ${
                      active ? 'bg-tertiary text-primary font-bold' : 'hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <span>{loc}</span>
                    {active && <MaterialIcon name="check" className="text-lg" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
