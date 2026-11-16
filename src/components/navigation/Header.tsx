'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MaterialIcon } from '../common/MaterialIcon';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  backHref,
  rightAction,
}) => {
  const router = useRouter();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Jakarta Selatan');

  const locations = [
    'Jakarta Selatan',
    'Jakarta Pusat',
    'Jakarta Barat',
    'Jakarta Timur',
    'Tangerang Selatan (BSD & Bintaro)',
    'Depok & Sekitarnya',
    'Bandung Kota',
    'Surabaya Pusat',
  ];

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <>
      <header className="sticky top-0 w-full z-40 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-md mx-auto">
          {showBack ? (
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={handleBack}
                className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-variant/50 transition-colors"
                aria-label="Kembali"
              >
                <MaterialIcon name="arrow_back" className="text-[22px]" />
              </button>
              <h1 className="font-bold text-lg text-primary truncate">
                {title || 'TentorKeun'}
              </h1>
            </div>
          ) : (
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center shadow-md shadow-primary/20 text-white font-black text-xl tracking-tighter">
                  TK
                </div>
              </Link>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  Lokasi Anda
                </span>
                <button
                  onClick={() => setShowLocationModal(true)}
                  className="flex items-center gap-1 text-left min-h-[22px] focus:outline-none group"
                >
                  <span className="text-sm font-bold text-primary truncate group-hover:text-primary-container">
                    {selectedLocation}
                  </span>
                  <MaterialIcon
                    name="expand_more"
                    className="text-[18px] text-primary flex-shrink-0 transition-transform group-hover:translate-y-0.5"
                  />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 flex-shrink-0">
            {rightAction ? (
              rightAction
            ) : (
              <div className="flex items-center gap-1">
                <Link
                  href="/jadwal"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-variant/50 transition-colors relative"
                  title="Jadwal Belajar"
                >
                  <MaterialIcon name="notifications" className="text-[22px]" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface animate-pulse" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-surface rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <MaterialIcon name="location_on" className="text-primary text-xl" />
                <h3 className="font-bold text-base text-primary">Pilih Kota & Area Belajar</h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-variant/50"
              >
                <MaterialIcon name="close" className="text-xl" />
              </button>
            </div>
            <div className="mt-4 space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setShowLocationModal(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl flex items-center justify-between text-sm transition-colors ${
                    selectedLocation === loc
                      ? 'bg-primary text-white font-bold'
                      : 'hover:bg-surface-variant/60 text-on-surface'
                  }`}
                >
                  <span>{loc}</span>
                  {selectedLocation === loc && (
                    <MaterialIcon name="check" className="text-lg text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
