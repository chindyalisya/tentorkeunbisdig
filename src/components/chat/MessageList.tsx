'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MaterialIcon } from '@/components/common/MaterialIcon';
import type { UiMessage } from '@/lib/hooks/useChat';

interface Props {
  messages: UiMessage[];
  /** Sisi mana yang dianggap "saya": gelembung berwarna dan rata kanan. */
  me: 'student' | 'tutor';
  loading?: boolean;
  typing?: boolean;
  typingLabel?: string;
  emptyText?: string;
  onOpenFile?: (m: UiMessage) => void;
  onRetry?: (id: string) => void;
}

const GROUP_GAP_MS = 5 * 60 * 1000;
const TZ = 'Asia/Jakarta';

const dayKey = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { timeZone: TZ });

function dayLabel(iso: string): string {
  const key = dayKey(iso);
  const now = new Date();
  if (key === dayKey(now.toISOString())) return 'Hari ini';
  if (key === dayKey(new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())) return 'Kemarin';
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ });
}

/** Dua pesan dianggap satu kelompok bila pengirim sama dan jaraknya dekat. */
function sameGroup(a: UiMessage | undefined, b: UiMessage | undefined): boolean {
  if (!a || !b) return false;
  if (a.sender_type !== b.sender_type || a.sender_type === 'system') return false;
  if (a.created_at && b.created_at) {
    if (dayKey(a.created_at) !== dayKey(b.created_at)) return false;
    return Math.abs(new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) < GROUP_GAP_MS;
  }
  return true;
}

export function MessageList({
  messages,
  me,
  loading,
  typing,
  typingLabel = 'Sedang mengetik',
  emptyText = 'Belum ada pesan. Mulai percakapan di bawah.',
  onOpenFile,
  onRetry,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const lastCount = useRef(0);
  const [unseen, setUnseen] = useState(0);

  const scrollToBottom = (smooth = true) => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (stick.current) setUnseen(0);
  };

  // Pembukaan awal langsung di dasar; selanjutnya ikuti pesan baru hanya jika pembaca memang di bawah.
  useLayoutEffect(() => {
    const added = messages.length - lastCount.current;
    const last = messages[messages.length - 1];
    const first = lastCount.current === 0;
    lastCount.current = messages.length;
    if (added <= 0) return;

    if (first) {
      scrollToBottom(false);
    } else if (stick.current || last?.sender_type === me) {
      scrollToBottom(true);
    } else {
      setUnseen((n) => n + added);
    }
  }, [messages, me]);

  useEffect(() => {
    if (typing && stick.current) scrollToBottom(true);
  }, [typing]);

  return (
    <div className="relative flex-1 min-h-0">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        role="log"
        aria-live="polite"
        aria-label="Percakapan"
        className="h-full overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 bg-surface-container-lowest"
      >
        {loading && messages.length === 0 && (
          <div className="space-y-3 animate-pulse" aria-label="Memuat percakapan">
            <div className="h-12 w-3/5 rounded-2xl bg-surface-container" />
            <div className="h-10 w-2/5 rounded-2xl bg-surface-container ml-auto" />
            <div className="h-16 w-4/5 rounded-2xl bg-surface-container" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <p className="text-center text-sm text-on-surface-variant py-16">{emptyText}</p>
        )}

        <div className="flex flex-col">
          {messages.map((msg, i) => {
            const prev = messages[i - 1];
            const next = messages[i + 1];
            const newDay = msg.created_at && (!prev?.created_at || dayKey(prev.created_at) !== dayKey(msg.created_at));
            const joinsPrev = sameGroup(prev, msg);
            const endsGroup = !sameGroup(msg, next);

            return (
              <React.Fragment key={msg.id}>
                {newDay && msg.created_at && (
                  <div className="flex justify-center my-4">
                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
                      {dayLabel(msg.created_at)}
                    </span>
                  </div>
                )}

                {msg.sender_type === 'system' ? (
                  <div className="flex justify-center my-3">
                    <span className="max-w-[90%] text-center px-3.5 py-1.5 rounded-xl bg-secondary-container/60 text-on-secondary-container text-xs leading-snug">
                      {msg.text}
                    </span>
                  </div>
                ) : (
                  <Bubble
                    msg={msg}
                    mine={msg.sender_type === me}
                    joinsPrev={joinsPrev}
                    endsGroup={endsGroup}
                    onOpenFile={onOpenFile}
                    onRetry={onRetry}
                  />
                )}
              </React.Fragment>
            );
          })}

          {typing && (
            <div className="mt-3 self-start" role="status">
              <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-surface-container flex items-center gap-1" aria-label={typingLabel}>
                <span className="w-1.5 h-1.5 rounded-full bg-outline animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-outline animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-outline animate-bounce" />
              </div>
            </div>
          )}
        </div>
      </div>

      {unseen > 0 && (
        <button
          type="button"
          onClick={() => {
            scrollToBottom(true);
            setUnseen(0);
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 h-9 pl-3.5 pr-4 rounded-full bg-primary text-on-primary text-sm font-bold shadow-lg inline-flex items-center gap-1.5 animate-in"
        >
          <MaterialIcon name="arrow_downward" className="text-base" />
          {unseen} pesan baru
        </button>
      )}
    </div>
  );
}

function Bubble({
  msg,
  mine,
  joinsPrev,
  endsGroup,
  onOpenFile,
  onRetry,
}: {
  msg: UiMessage;
  mine: boolean;
  joinsPrev: boolean;
  endsGroup: boolean;
  onOpenFile?: (m: UiMessage) => void;
  onRetry?: (id: string) => void;
}) {
  const radius = mine
    ? `rounded-2xl ${joinsPrev ? 'rounded-tr-md' : ''} ${endsGroup ? 'rounded-br-md' : ''}`
    : `rounded-2xl ${joinsPrev ? 'rounded-tl-md' : ''} ${endsGroup ? 'rounded-bl-md' : ''}`;

  return (
    <div className={`flex flex-col max-w-[88%] sm:max-w-[75%] ${mine ? 'self-end items-end' : 'self-start items-start'} ${joinsPrev ? 'mt-1' : 'mt-3'}`}>
      <div
        className={`px-4 py-2.5 text-[0.9375rem] leading-relaxed whitespace-pre-wrap break-words ${radius} ${
          mine
            ? msg.status === 'failed'
              ? 'bg-error text-on-error'
              : `bg-primary text-on-primary ${msg.status === 'sending' ? 'opacity-70' : ''}`
            : 'bg-surface-container-low text-on-surface border border-outline-variant/60'
        }`}
      >
        {msg.text}

        {msg.file_name && (
          <button
            type="button"
            onClick={() => onOpenFile?.(msg)}
            className="mt-2 w-full p-2.5 rounded-xl bg-surface text-on-surface border border-outline-variant/60 flex items-center gap-3 text-left hover:bg-surface-container-low transition-colors whitespace-normal"
          >
            <span className="w-10 h-10 rounded-lg bg-error-container text-error flex items-center justify-center flex-shrink-0">
              <MaterialIcon name="picture_as_pdf" className="text-xl" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-bold text-sm text-primary truncate">{msg.file_name}</span>
              <span className="block text-xs text-on-surface-variant">{msg.file_size}, PDF</span>
            </span>
            <MaterialIcon name="chevron_right" className="text-xl text-on-surface-variant" />
          </button>
        )}
      </div>

      {mine && msg.status === 'failed' ? (
        <button
          type="button"
          onClick={() => onRetry?.(msg.id)}
          className="mt-1 px-1 text-xs font-bold text-error inline-flex items-center gap-1 hover:underline"
        >
          <MaterialIcon name="refresh" className="text-sm" />
          Gagal terkirim. Coba lagi
        </button>
      ) : mine && msg.status === 'sending' ? (
        <span className="mt-1 px-1 text-xs text-outline">Mengirim...</span>
      ) : (
        endsGroup && <span className="mt-1 px-1 text-xs text-outline">{msg.timestamp}</span>
      )}
    </div>
  );
}
