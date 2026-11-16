'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tutor, TutorSlot } from '@/lib/types';
import { MaterialIcon } from '../common/MaterialIcon';

interface SlotBookingSheetProps {
  tutor: Tutor;
  isOpen: boolean;
  onClose: () => void;
  slots: TutorSlot[];
}

export const SlotBookingSheet: React.FC<SlotBookingSheetProps> = ({
  tutor,
  isOpen,
  onClose,
  slots,
}) => {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<TutorSlot | null>(slots[0] || null);
  const [learningMode, setLearningMode] = useState<'tatap_muka' | 'online'>(
    tutor.modes.includes('tatap_muka') ? 'tatap_muka' : 'online'
  );
  const [topic, setTopic] = useState('Kalkulus & Turunan Aljabar UTBK');
  const [timeLeft, setTimeLeft] = useState(899); // 14:59

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProceedToCheckout = () => {
    const query = new URLSearchParams({
      tutorId: tutor.id,
      slotId: selectedSlot?.id || 'slot-1',
      mode: learningMode,
      date: selectedSlot?.date || '2026-11-18',
      time: selectedSlot ? `${selectedSlot.time_start} - ${selectedSlot.time_end} WIB` : '16:00 - 17:30 WIB',
      topic: topic || 'Pondasi Matematika & Latihan Soal',
    });
    router.push(`/checkout?${query.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface rounded-t-3xl p-5 shadow-2xl border-t border-outline-variant/30 flex flex-col max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-outline-variant/20">
          <div className="flex flex-col min-w-0 pr-1">
            <h2 className="text-base font-bold text-on-surface tracking-tight">
              Kunci Slot {tutor.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container text-xs font-semibold animate-pulse">
                <MaterialIcon name="timer" className="text-[13px]" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
              <p className="text-xs text-on-surface-variant truncate">
                Slot diamankan sementara
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Sheet"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface active:scale-95 transition-all"
          >
            <MaterialIcon name="close" className="text-lg" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4">
          {/* Tutor Info Preview */}
          <div className="p-3 rounded-2xl bg-surface-container-low flex items-center gap-3 border border-outline-variant/20">
            <img
              src={tutor.avatar_url}
              alt={tutor.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/20"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                {tutor.badge}
              </span>
              <p className="font-bold text-sm text-on-surface truncate">{tutor.name}</p>
              <p className="text-xs text-on-surface-variant truncate">{tutor.university}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-on-surface-variant">Tarif</p>
              <p className="text-sm font-bold text-primary">
                Rp {tutor.hourly_rate.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          {/* Mode Belajar */}
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
              Pilih Mode Belajar
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLearningMode('tatap_muka')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  learningMode === 'tatap_muka'
                    ? 'border-primary bg-primary/5 text-primary shadow-sm'
                    : 'border-outline-variant/40 bg-surface text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    learningMode === 'tatap_muka'
                      ? 'bg-primary text-white'
                      : 'bg-surface-variant text-on-surface-variant'
                  }`}
                >
                  <MaterialIcon name="home_pin" className="text-base" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">Tatap Muka</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Tentor ke rumah siswa</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLearningMode('online')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  learningMode === 'online'
                    ? 'border-primary bg-primary/5 text-primary shadow-sm'
                    : 'border-outline-variant/40 bg-surface text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    learningMode === 'online'
                      ? 'bg-primary text-white'
                      : 'bg-surface-variant text-on-surface-variant'
                  }`}
                >
                  <MaterialIcon name="videocam" className="text-base" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">Online HD</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Via Google Meet/Zoom</p>
                </div>
              </button>
            </div>
          </div>

          {/* Slot Waktu Tersedia */}
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
              Pilih Hari & Jam Sesi
            </label>
            <div className="space-y-2">
              {slots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-outline-variant/30 hover:border-outline-variant bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-primary text-white' : 'bg-surface-container text-primary'
                        }`}
                      >
                        <MaterialIcon name="schedule" className="text-base" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">
                          {slot.day_name}, {slot.date}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          {slot.time_start} - {slot.time_end} WIB ({slot.mode === 'tatap_muka' ? 'Tatap Muka' : 'Online'})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-secondary">Tersedia</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-primary bg-primary text-white' : 'border-outline'
                        }`}
                      >
                        {isSelected && <MaterialIcon name="check" className="text-[10px]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topik / Catatan Khusus */}
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">
              Topik Pembahasan / Keluhan Belajar
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Kalkulus Diferensial, Dalil Rantai, UTBK..."
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Escrow Guarantee Callout */}
          <div className="p-3 rounded-2xl bg-secondary-container/20 border border-secondary-container/40 flex items-start gap-2.5">
            <MaterialIcon name="verified_user" className="text-secondary text-lg flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-on-secondary-container leading-relaxed">
              <strong>Proteksi Rekber TentorKeun:</strong> Dana Anda disimpan aman di escrow dan baru dicairkan ke tentor setelah sesi les selesai & divalidasi dengan E-Tiket.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-outline-variant/20 flex items-center gap-3">
          <div className="flex-1">
            <span className="text-[10px] text-on-surface-variant block">Total Biaya Sesi</span>
            <span className="text-base font-extrabold text-primary">
              Rp {tutor.hourly_rate.toLocaleString('id-ID')}
            </span>
          </div>
          <button
            onClick={handleProceedToCheckout}
            className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-lg shadow-primary/25 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Kunci & Checkout</span>
            <MaterialIcon name="arrow_forward" className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};
