'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Header } from '@/components/navigation/Header';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { TentorService } from '@/lib/supabase/service';
import { Booking } from '@/lib/types';
import { MOCK_INITIAL_BOOKING } from '@/lib/data/mock-data';

interface PaymentSuccessPageProps {
  params: Promise<{ id: string }>;
}

export default function PaymentSuccessPage({ params }: PaymentSuccessPageProps) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    async function fetchBooking() {
      const b = await TentorService.getBookingById(bookingId);
      setBooking(b || MOCK_INITIAL_BOOKING);
    }
    fetchBooking();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#000552', '#3d5d9d', '#99b8ff', '#f1b94c', '#4a54b7'],
      });
    } catch (e) {
      console.log('Confetti error:', e);
    }
  }, [bookingId]);

  if (!booking) return null;

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <Header title="Konfirmasi Pembayaran" showBack backHref="/" />

      <main className="px-4 space-y-5 pt-3">
        {/* Celebration Header */}
        <section className="text-center pt-2 space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center ring-8 ring-emerald-50 shadow-md">
            <MaterialIcon name="check_circle" className="text-4xl" filled />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-3 py-0.5 rounded-full uppercase tracking-wider inline-block">
              Pembayaran Terverifikasi
            </span>
            <h1 className="font-extrabold text-xl text-primary tracking-tight">
              Pembayaran Berhasil!
            </h1>
            <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">
              Sesi belajar Anda telah terjadwal resmi. E-Tiket pertemuan telah diterbitkan.
            </p>
          </div>
        </section>

        {/* Digital E-Tiket Card */}
        <div className="bg-surface rounded-3xl p-5 shadow-lg border border-outline-variant/30 space-y-4 relative overflow-hidden">
          {/* Decorative Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
                TK
              </div>
              <span className="font-bold text-xs text-primary tracking-wider uppercase">
                E-Tiket Sesi Belajar
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-on-surface-variant">
              #{booking.booking_code}
            </span>
          </div>

          {/* Sesi & Tentor Info */}
          <div className="flex items-start gap-3">
            <img
              src={booking.tutor_avatar}
              alt={booking.tutor_name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/20 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mb-1">
                {booking.package_name}
              </span>
              <h3 className="font-bold text-sm text-on-surface truncate">
                {booking.tutor_name}
              </h3>
              <p className="text-xs text-on-surface-variant truncate">{booking.subject}</p>
              <p className="text-[11px] font-semibold text-secondary mt-0.5">{booking.topic}</p>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/20 text-xs">
            <div className="p-2.5 rounded-xl bg-surface-container-low">
              <span className="text-[10px] text-on-surface-variant block">Jadwal Sesi 1</span>
              <span className="font-bold text-on-surface text-[11px] block mt-0.5">
                {booking.session_date}
              </span>
              <span className="text-[10px] text-primary font-semibold">{booking.session_time}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-container-low">
              <span className="text-[10px] text-on-surface-variant block">Siswa & Mode</span>
              <span className="font-bold text-on-surface text-[11px] block mt-0.5">
                {booking.student_name}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold uppercase">
                {booking.mode === 'tatap_muka' ? 'Tatap Muka' : 'Online HD'}
              </span>
            </div>
          </div>

          {/* QR Code & Verification Pin */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 via-surface to-secondary/10 border-2 border-dashed border-primary/30 flex flex-col items-center text-center space-y-3">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                Kode Validasi Kehadiran
              </span>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Tunjukkan QR code ini kepada tentor saat sesi dimulai untuk verifikasi
              </p>
            </div>

            {/* QR Code Image */}
            <div className="p-3 bg-white rounded-2xl shadow-md border border-outline-variant/20">
              <img
                src={booking.qr_code}
                alt="QR Code Tiket"
                className="w-32 h-32 object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-surface border border-outline-variant/30 shadow-sm font-mono font-black text-sm tracking-widest text-primary">
              <MaterialIcon name="key" className="text-sm text-secondary" />
              <span>{booking.ticket_code}</span>
            </div>
          </div>

          {/* Escrow Status Notice */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs">
            <MaterialIcon name="shield" className="text-emerald-700 text-base flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-emerald-950 leading-relaxed">
              <strong>Proteksi Rekber Aktif:</strong> Dana disimpan aman di sistem escrow TentorKeun. Pembayaran hanya akan diteruskan ke {booking.tutor_name} setelah QR validasi kehadiran dipindai.
            </p>
          </div>
        </div>

        {/* Preparation Tips */}
        <section className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-2 text-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface pb-2 border-b border-outline-variant/20">
            Persiapan Sesi Pertama
          </h3>
          <ul className="space-y-1.5 text-on-surface-variant leading-relaxed">
            <li className="flex items-start gap-2">
              <MaterialIcon name="check" className="text-emerald-600 text-xs mt-0.5 flex-shrink-0" />
              <span>Buka ruang obrolan untuk mengunduh modul rumus cepat kalkulus dari Kak Sarah.</span>
            </li>
            <li className="flex items-start gap-2">
              <MaterialIcon name="check" className="text-emerald-600 text-xs mt-0.5 flex-shrink-0" />
              <span>Sediakan buku catatan, alat tulis, dan soal-soal latihan yang ingin dibedah.</span>
            </li>
            <li className="flex items-start gap-2">
              <MaterialIcon name="check" className="text-emerald-600 text-xs mt-0.5 flex-shrink-0" />
              <span>Tentor akan hadir tepat waktu 10 menit sebelum jam 16:00 WIB.</span>
            </li>
          </ul>
        </section>

        {/* Next Action Buttons */}
        <div className="space-y-2 pt-1">
          <Link
            href="/chat"
            className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-lg shadow-primary/25 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <MaterialIcon name="chat" className="text-base" />
            <span>Buka Ruang Obrolan & Unduh Modul</span>
          </Link>

          <Link
            href="/jadwal"
            className="w-full py-3.5 rounded-2xl bg-surface border border-outline-variant/40 hover:bg-surface-container-low text-primary font-bold text-xs active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <MaterialIcon name="calendar_today" className="text-base" />
            <span>Lihat Jadwal & Progres Belajar</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

