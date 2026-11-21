'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { Composer } from '@/components/chat/Composer';
import { ConnectionBadge } from '@/components/chat/ConnectionBadge';
import { MessageList } from '@/components/chat/MessageList';
import { TentorService } from '@/lib/supabase/service';
import { Booking } from '@/lib/types';
import { MOCK_INITIAL_BOOKING } from '@/lib/data/mock-data';
import { getTutorReply, typingDelay } from '@/lib/chat-reply';
import { useChat, UiMessage } from '@/lib/hooks/useChat';

const BOOKING_ID = 'order-tk-884219';
const DEMO_MODULE = 'Modul-Kalkulus-Cepat-UTBK-SarahAmanda.pdf';

const QUICK_REPLIES = [
  'Halo Kak, mau tanya soal nomor 5 di modul',
  'Konfirmasi alamat rumah di Senopati no. 42',
  'Apakah perlu bawa kalkulator grafik?',
];

export default function ChatPage() {
  const [booking, setBooking] = useState<Booking>(MOCK_INITIAL_BOOKING);
  const [file, setFile] = useState<UiMessage | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [demoTyping, setDemoTyping] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const { messages, connection, loading, loadError, send, retry, reload } = useChat(BOOKING_ID);
  const isDemo = connection === 'local';

  useEffect(() => {
    TentorService.getBookingById(BOOKING_ID).then((b) => b && setBooking(b));
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // Modal berkas: Escape menutup, fokus pindah ke tombol Tutup.
  useEffect(() => {
    if (!file) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFile(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [file]);

  const showToast = (text: string) => {
    setToast(text);
    timers.current.push(setTimeout(() => setToast(null), 3200));
  };

  const handleSend = (text: string) => {
    void send({
      booking_id: BOOKING_ID,
      sender_type: 'student',
      sender_name: booking.student_name,
      text,
    });

    // Mode demo (tanpa Supabase): tentor disimulasikan. Dengan Supabase, tentor membalas dari /panel-tentor.
    if (isDemo) {
      const recent = messages.filter((m) => m.sender_type === 'tutor').map((m) => m.text);
      const reply = getTutorReply(text, recent, booking);
      setDemoTyping(true);
      timers.current.push(
        setTimeout(() => {
          setDemoTyping(false);
          void send({
            booking_id: BOOKING_ID,
            sender_type: 'tutor',
            sender_name: booking.tutor_name,
            text: reply,
          });
        }, typingDelay(reply))
      );
    }
  };

  return (
    <div className="flex h-[100dvh] w-full bg-surface overflow-hidden">
      <div className="flex flex-col flex-1 min-w-0 lg:border-r lg:border-outline-variant">
        {/* Header */}
        <header className="bg-surface border-b border-outline-variant px-3 sm:px-4 h-16 flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/jadwal"
              aria-label="Kembali ke jadwal"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface flex-shrink-0"
            >
              <MaterialIcon name="arrow_back" className="text-xl" />
            </Link>

            <img
              src={booking.tutor_avatar}
              alt=""
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/15 flex-shrink-0"
            />

            <div className="min-w-0">
              <h1 className="font-bold text-base text-primary truncate leading-tight">{booking.tutor_name}</h1>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-on-surface-variant truncate hidden sm:inline">{booking.subject}</span>
                <span className="text-outline hidden sm:inline" aria-hidden="true">·</span>
                <ConnectionBadge status={connection} />
              </div>
            </div>
          </div>

          <Link
            href="/jadwal"
            className="h-10 px-3.5 rounded-full border border-outline-variant text-primary text-sm font-bold inline-flex items-center gap-1.5 hover:bg-surface-container-low transition-colors flex-shrink-0"
          >
            <MaterialIcon name="qr_code_2" className="text-lg" />
            <span>E-Tiket</span>
          </Link>
        </header>

        {/* Rekber */}
        <div className="px-4 sm:px-6 py-2 bg-secondary-container/60 border-b border-outline-variant text-sm text-on-secondary-container flex items-center gap-2 flex-shrink-0">
          <MaterialIcon name="verified_user" className="text-base" />
          <span className="flex-1 min-w-0 truncate">Dana aman di Rekber TentorKeun</span>
          <Link href="/jadwal" className="font-bold underline underline-offset-4 decoration-primary/30 hover:decoration-primary flex-shrink-0">
            Lihat tiket
          </Link>
        </div>

        {loadError && (
          <div className="px-4 sm:px-6 py-2.5 bg-error-container text-on-error-container text-sm flex items-center gap-3 flex-shrink-0" role="alert">
            <span className="flex-1">Percakapan belum bisa dimuat. {loadError}</span>
            <button type="button" onClick={() => void reload()} className="font-bold underline underline-offset-4">
              Muat ulang
            </button>
          </div>
        )}

        <MessageList
          messages={messages}
          me="student"
          loading={loading}
          typing={demoTyping}
          typingLabel={`${booking.tutor_name} sedang mengetik`}
          emptyText={`Belum ada pesan. Tulis pertanyaanmu untuk ${booking.tutor_name}.`}
          onOpenFile={setFile}
          onRetry={retry}
        />

        <Composer
          onSend={handleSend}
          placeholder={`Tulis pesan untuk ${booking.tutor_name.split(',')[0]}...`}
          suggestions={QUICK_REPLIES}
        />
      </div>

      {/* Panel info sesi (desktop lebar) */}
      <aside className="hidden xl:flex w-72 flex-shrink-0 flex-col gap-5 p-6 overflow-y-auto bg-surface-container-low">
        <div>
          <h2 className="font-bold text-sm text-on-surface-variant mb-3">Sesi ini</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <img src={booking.tutor_avatar} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="font-bold text-primary leading-snug">{booking.tutor_name}</p>
                <p className="text-on-surface-variant text-xs truncate">{booking.tutor_title}</p>
              </div>
            </div>
            <dl className="space-y-2 pt-2 border-t border-outline-variant">
              <div>
                <dt className="text-xs text-on-surface-variant">Mata pelajaran</dt>
                <dd className="font-semibold text-primary">{booking.subject}</dd>
              </div>
              <div>
                <dt className="text-xs text-on-surface-variant">Topik</dt>
                <dd className="font-semibold text-primary">{booking.topic}</dd>
              </div>
              <div>
                <dt className="text-xs text-on-surface-variant">Jadwal</dt>
                <dd className="font-semibold text-primary">
                  {booking.session_date}, {booking.session_time}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-on-surface-variant">Cara belajar</dt>
                <dd className="font-semibold text-primary">{booking.mode === 'tatap_muka' ? 'Tatap muka' : 'Online'}</dd>
              </div>
            </dl>
          </div>
        </div>
        <Link
          href="/jadwal"
          className="h-10 rounded-lg border border-outline-variant text-sm font-semibold text-primary inline-flex items-center justify-center hover:bg-surface-container transition-colors"
        >
          Lihat jadwal
        </Link>
      </aside>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="animate-in fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] max-w-[90vw] px-4 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface text-sm shadow-lg"
        >
          {toast}
        </div>
      )}

      {/* Pratinjau berkas */}
      {file && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setFile(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="file-title"
            onClick={(e) => e.stopPropagation()}
            className="animate-in w-full max-w-sm bg-surface rounded-2xl p-6 shadow-2xl border border-outline-variant space-y-4 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-error-container text-error mx-auto flex items-center justify-center">
              <MaterialIcon name="picture_as_pdf" className="text-3xl" />
            </div>

            <div>
              <h2 id="file-title" className="font-bold text-base text-primary break-words">
                {file.file_name}
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                {file.file_size}, dikirim {file.sender_name.split(',')[0]}
              </p>
            </div>

            {file.file_name === DEMO_MODULE && (
              <p className="p-3 rounded-xl bg-surface-container text-sm text-on-surface leading-relaxed text-left">
                Rangkuman kilat bab turunan dan dalil rantai, lengkap dengan 30 soal prediksi dan trik eliminasi opsi cepat SNBT.
              </p>
            )}

            <div className="flex gap-2">
              <button
                ref={closeBtn}
                type="button"
                onClick={() => setFile(null)}
                className="flex-1 h-11 rounded-xl bg-surface-container text-sm font-bold text-primary hover:bg-surface-container-high transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  showToast('Berkas contoh: belum ada file sungguhan untuk diunduh.');
                }}
                className="flex-1 h-11 rounded-xl bg-primary text-on-primary text-sm font-bold inline-flex items-center justify-center gap-1.5 hover:bg-primary-container transition-colors"
              >
                <MaterialIcon name="download" className="text-lg" />
                Unduh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
