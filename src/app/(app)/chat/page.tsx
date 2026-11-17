'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import { TentorService } from '@/lib/supabase/service';
import { ChatMessage, Booking } from '@/lib/types';
import { MOCK_INITIAL_BOOKING } from '@/lib/data/mock-data';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const b = await TentorService.getBookingById('order-tk-884219');
      setBooking(b || MOCK_INITIAL_BOOKING);
      const chats = await TentorService.getChatMessages('order-tk-884219');
      setMessages(chats);
    }
    loadData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg = await TentorService.sendChatMessage({
      booking_id: booking?.id || 'order-tk-884219',
      sender_type: 'student',
      sender_name: 'Arga Pramudya',
      text: text.trim(),
    });

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate friendly tutor instant reply after 1.5 seconds if first reply
    setTimeout(async () => {
      const reply = await TentorService.sendChatMessage({
        booking_id: booking?.id || 'order-tk-884219',
        sender_type: 'tutor',
        sender_name: 'Kak Sarah Amanda, S.Si',
        text: 'Siap Arga! Catatan sudah aku rekap. Nanti kita bedah bareng soal nomor 3 dan 5 ya! 👍',
      });
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  const quickReplies = [
    'Halo Kak, mau tanya soal nomor 5 di modul',
    'Konfirmasi alamat rumah di Senopati no. 42',
    'Apakah perlu bawa kalkulator grafik?',
  ];

  return (
    <div className="flex flex-col h-[100dvh] w-full mx-auto bg-surface overflow-hidden">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/jadwal"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-variant text-on-surface"
          >
            <MaterialIcon name="arrow_back" className="text-xl" />
          </Link>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
              alt="Kak Sarah"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-surface" />
          </div>

          <div className="flex flex-col min-w-0">
            <h2 className="font-bold text-xs text-on-surface truncate">
              Kak Sarah Amanda, S.Si
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
              <span className="text-emerald-600 font-bold">Online</span>
              <span>•</span>
              <span className="truncate">Matematika SMA</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/jadwal"
            className="px-2.5 py-1.5 rounded-xl bg-surface-container-low text-primary text-[11px] font-bold flex items-center gap-1 border border-outline-variant/30"
          >
            <MaterialIcon name="qr_code_2" className="text-base" />
            <span>E-Tiket</span>
          </Link>
        </div>
      </header>

      {/* Escrow banner */}
      <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-900">
        <div className="flex items-center gap-1.5">
          <MaterialIcon name="verified_user" className="text-sm text-emerald-600" />
          <span>Dana aman di Rekber TentorKeun</span>
        </div>
        <Link href="/jadwal" className="font-bold text-emerald-800 hover:underline">
          Lihat Tiket
        </Link>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-container-lowest">
        {messages.map((msg) => {
          if (msg.sender_type === 'system') {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="inline-block px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-semibold">
                  {msg.text}
                </span>
              </div>
            );
          }

          const isMe = msg.sender_type === 'student';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${
                isMe ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 shadow-sm ${
                  isMe
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-surface-container text-on-surface rounded-bl-none border border-outline-variant/20'
                }`}
              >
                <p>{msg.text}</p>

                {/* File Attachment Card */}
                {msg.file_name && (
                  <div
                    onClick={() => setShowFileModal(true)}
                    className="p-2.5 rounded-xl bg-surface text-on-surface border border-outline-variant/30 flex items-center justify-between gap-2.5 cursor-pointer hover:bg-surface-container-low transition-colors shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                      <MaterialIcon name="picture_as_pdf" className="text-base" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-bold text-[11px] text-primary truncate">
                        {msg.file_name}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        {msg.file_size} • PDF Document
                      </p>
                    </div>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <MaterialIcon name="download" className="text-sm" />
                    </button>
                  </div>
                )}
              </div>

              <span className="text-[9px] text-outline-variant mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies Carousel */}
      <div className="p-2 bg-surface border-t border-outline-variant/20 flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickReplies.map((r, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(r)}
            className="px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface text-[10px] font-medium whitespace-nowrap hover:bg-primary/5 hover:text-primary transition-all"
          >
            {r}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div className="p-3 bg-surface border-t border-outline-variant/30">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => alert('Fitur upload berkas soal / foto tugas terbuka')}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors flex-shrink-0"
          >
            <MaterialIcon name="attach_file" className="text-xl" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tulis pesan untuk Kak Sarah..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-full bg-primary hover:bg-primary-container disabled:opacity-40 text-white flex items-center justify-center shadow-md shadow-primary/20 transition-all flex-shrink-0"
          >
            <MaterialIcon name="send" className="text-sm" />
          </button>
        </form>
      </div>

      {/* File Preview Modal */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-surface rounded-3xl p-5 shadow-2xl border border-outline-variant/30 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <MaterialIcon name="picture_as_pdf" className="text-3xl" />
            </div>

            <div>
              <h3 className="font-bold text-sm text-primary">
                Modul-Kalkulus-Cepat-UTBK-SarahAmanda.pdf
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                2.4 MB • Rangkuman Rumus & 30 Soal Prediksi UTBK
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-surface-container text-xs text-on-surface leading-relaxed text-left">
              Modul ini berisi rangkuman kilat bab turunan dan dalil rantai, lengkap dengan pembahasan trik eliminasi opsi cepat SNBT.
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFileModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-container text-xs font-bold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  alert('Mengunduh Modul-Kalkulus-Cepat-UTBK-SarahAmanda.pdf...');
                  setShowFileModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow flex items-center justify-center gap-1"
              >
                <MaterialIcon name="download" className="text-sm" />
                <span>Unduh File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

