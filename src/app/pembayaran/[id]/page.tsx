'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { TentorService } from '@/lib/supabase/service';
import { Booking } from '@/lib/types';
import { MOCK_INITIAL_BOOKING } from '@/lib/data/mock-data';

interface PaymentInstructionPageProps {
  params: Promise<{ id: string }>;
}

export default function PaymentInstructionPage({ params }: PaymentInstructionPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [copiedVA, setCopiedVA] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [activeInstruction, setActiveInstruction] = useState<'mbca' | 'klikbca' | 'atm'>('mbca');
  const [isChecking, setIsChecking] = useState(false);

  // 24 hour countdown timer
  const [secondsLeft, setSecondsLeft] = useState(86395);

  useEffect(() => {
    async function loadBooking() {
      const b = await TentorService.getBookingById(bookingId);
      setBooking(b || MOCK_INITIAL_BOOKING);
    }
    loadBooking();

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-6 text-xs text-on-surface-variant">
        Memuat instruksi pembayaran...
      </div>
    );
  }

  const formatHours = () => {
    const hours = Math.floor(secondsLeft / 3600);
    const mins = Math.floor((secondsLeft % 3600) / 60);
    const secs = secondsLeft % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, type: 'va' | 'amount') => {
    navigator.clipboard.writeText(text);
    if (type === 'va') {
      setCopiedVA(true);
      setTimeout(() => setCopiedVA(false), 2000);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleSimulatePayment = async () => {
    setIsChecking(true);
    await new Promise((r) => setTimeout(r, 1200));
    await TentorService.updatePaymentStatus(booking.id, 'paid');
    router.push(`/pembayaran/sukses/${booking.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <Header title="Instruksi Pembayaran" showBack backHref="/" />

      <main className="px-4 space-y-4 pt-3">
        {/* Countdown Header */}
        <div className="p-4 rounded-3xl bg-surface border border-outline-variant/30 text-center space-y-1 shadow-sm">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Selesaikan Pembayaran Dalam
          </span>
          <div className="flex items-center justify-center gap-1.5 text-error font-extrabold text-2xl tracking-tight">
            <MaterialIcon name="alarm" className="text-xl animate-pulse" />
            <span>{formatHours()}</span>
          </div>
          <p className="text-[10px] text-on-surface-variant">
            Batas waktu: Besok, pukul 14:30 WIB
          </p>
        </div>

        {/* VA Card */}
        <div className="bg-surface rounded-3xl p-5 shadow-sm border border-outline-variant/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-7 rounded-lg bg-blue-700 text-white font-black text-xs flex items-center justify-center tracking-tighter">
                BCA
              </div>
              <div>
                <h2 className="font-bold text-sm text-on-surface">{booking.payment_method}</h2>
                <p className="text-[10px] text-on-surface-variant">Verifikasi Otomatis Real-time</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full">
              Instant
            </span>
          </div>

          {/* VA Number */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Nomor Virtual Account
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-base text-primary tracking-wider select-all">
                {booking.va_number}
              </span>
              <button
                onClick={() => copyToClipboard(booking.va_number.replace(/\s+/g, ''), 'va')}
                className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/40 text-xs font-bold text-primary hover:bg-primary/5 active:scale-95 transition-all flex items-center gap-1"
              >
                <MaterialIcon name="content_copy" className="text-xs" />
                <span>{copiedVA ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Total Amount */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Total Pembayaran Tepat
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-lg text-primary select-all">
                Rp {booking.total_amount.toLocaleString('id-ID')}
              </span>
              <button
                onClick={() => copyToClipboard(booking.total_amount.toString(), 'amount')}
                className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/40 text-xs font-bold text-primary hover:bg-primary/5 active:scale-95 transition-all flex items-center gap-1"
              >
                <MaterialIcon name="content_copy" className="text-xs" />
                <span>{copiedAmount ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Escrow Rekber Reminder */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
          <MaterialIcon name="verified_user" className="text-emerald-700 text-lg flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-900 leading-relaxed">
            <strong>Proteksi Rekber TentorKeun:</strong> Uang Anda tidak langsung diberikan ke pengajar. Dana disimpan di rekening penampung resmi sampai sesi les selesai dan E-Tiket Anda divalidasi.
          </p>
        </div>

        {/* Order Details Accordion Snapshot */}
        <div className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-2 text-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface pb-2 border-b border-outline-variant/20">
            Ringkasan Sesi Belajar
          </h3>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Tentor:</span>
            <span className="font-bold text-on-surface">{booking.tutor_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Paket:</span>
            <span className="font-semibold text-primary">{booking.package_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Topik:</span>
            <span className="font-semibold text-on-surface">{booking.topic}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Jadwal Sesi 1:</span>
            <span className="font-semibold text-on-surface">{booking.session_date} ({booking.session_time})</span>
          </div>
        </div>

        {/* Payment Guide Accordion */}
        <div className="bg-surface rounded-3xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface pb-2 border-b border-outline-variant/20">
            Panduan Cara Membayar
          </h3>

          <div className="flex rounded-xl bg-surface-container p-1 gap-1">
            {[
              { id: 'mbca', label: 'BCA Mobile' },
              { id: 'klikbca', label: 'KlikBCA' },
              { id: 'atm', label: 'ATM BCA' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveInstruction(tab.id as any)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeInstruction === tab.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-on-surface-variant space-y-2 pl-4 list-decimal">
            {activeInstruction === 'mbca' && (
              <ol className="list-decimal space-y-1.5 pl-2 leading-relaxed">
                <li>Buka aplikasi <strong>BCA mobile</strong> lalu pilih menu <strong>m-Transfer</strong>.</li>
                <li>Pilih opsi <strong>BCA Virtual Account</strong>.</li>
                <li>Masukkan nomor Virtual Account: <strong className="text-primary font-mono">{booking.va_number}</strong>.</li>
                <li>Periksa konfirmasi nama <strong>TentorKeun - {booking.student_name}</strong> dan jumlah tagihan.</li>
                <li>Masukkan PIN m-BCA Anda dan simpan bukti transaksi.</li>
              </ol>
            )}

            {activeInstruction === 'klikbca' && (
              <ol className="list-decimal space-y-1.5 pl-2 leading-relaxed">
                <li>Login ke <strong>KlikBCA Individual</strong>.</li>
                <li>Pilih menu <strong>Transfer Dana</strong> lalu klik <strong>Transfer ke BCA Virtual Account</strong>.</li>
                <li>Masukkan nomor Virtual Account <strong className="text-primary font-mono">{booking.va_number}</strong>.</li>
                <li>Validasi informasi tagihan dan selesaikan dengan respon KeyBCA Appli 1.</li>
              </ol>
            )}

            {activeInstruction === 'atm' && (
              <ol className="list-decimal space-y-1.5 pl-2 leading-relaxed">
                <li>Masukkan kartu ATM BCA dan 6 digit PIN Anda.</li>
                <li>Pilih menu <strong>Transaksi Lainnya</strong> → <strong>Transfer</strong> → <strong>Ke Rek BCA Virtual Account</strong>.</li>
                <li>Ketikkan nomor Virtual Account: <strong className="text-primary font-mono">{booking.va_number}</strong>.</li>
                <li>Periksa jumlah tagihan dan konfirmasi pembayaran.</li>
              </ol>
            )}
          </div>
        </div>

        {/* Action Check Status */}
        <div className="pt-2 space-y-2">
          <button
            onClick={handleSimulatePayment}
            disabled={isChecking}
            className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-lg shadow-primary/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi Pembayaran Otomatis...</span>
              </>
            ) : (
              <>
                <MaterialIcon name="sync" className="text-base" />
                <span>Saya Sudah Membayar (Cek Status Otomatis)</span>
              </>
            )}
          </button>

          <Link
            href="/"
            className="w-full py-2.5 rounded-xl text-center block text-xs font-semibold text-on-surface-variant hover:text-on-surface"
          >
            Kembali ke Beranda (Bayar Nanti)
          </Link>
        </div>
      </main>
    </div>
  );
}

