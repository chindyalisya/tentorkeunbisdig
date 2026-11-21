'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TentorService, formatClock } from '@/lib/supabase/service';
import type { ChatConnection, ChatMessage } from '@/lib/types';

/** Pesan di layar; `status` hanya ada untuk pesan yang belum dikonfirmasi server. */
export type UiMessage = ChatMessage & { status?: 'sending' | 'failed' };

export type ChatDraft = Omit<ChatMessage, 'id' | 'timestamp' | 'is_read' | 'created_at'>;

/**
 * Satu percakapan (per booking) dengan:
 * - riwayat dari Supabase, pesan baru lewat Realtime
 * - kirim optimistis (muncul langsung, bisa gagal lalu "coba lagi")
 * - sinkron ulang setiap koneksi Realtime tersambung (menutup celah saat offline)
 * Dipakai bersama oleh halaman siswa dan panel tentor.
 * Catatan: untuk berpindah percakapan, pasang `key={bookingId}` pada komponen pemakainya
 * supaya state-nya mulai bersih.
 */
export function useChat(bookingId: string | null) {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [connection, setConnection] = useState<ChatConnection>('connecting');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const drafts = useRef(new Map<string, ChatDraft>());

  const reload = useCallback(() => {
    if (!bookingId) return Promise.resolve();
    return TentorService.getChatMessages(bookingId)
      .then((server) => {
        const serverIds = new Set(server.map((m) => m.id));
        // Pesan yang belum dikonfirmasi server (mengirim/gagal) tetap dipertahankan di ujung.
        setMessages((prev) => [...server, ...prev.filter((m) => m.status && !serverIds.has(m.id))]);
        setLoadError(null);
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : 'Gagal memuat percakapan'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId) return;
    let active = true;

    const stop = TentorService.subscribeToChat(
      bookingId,
      (incoming) => {
        if (!active) return;
        setMessages((prev) => {
          if (prev.some((m) => m.id === incoming.id)) return prev;
          // Gema pesan kita sendiri: gantikan pesan sementara agar tidak dobel.
          const tempIdx = prev.findIndex(
            (m) =>
              m.status === 'sending' &&
              m.sender_type === incoming.sender_type &&
              m.booking_id === incoming.booking_id &&
              m.text === incoming.text
          );
          if (tempIdx >= 0) {
            const next = [...prev];
            next[tempIdx] = incoming;
            return next;
          }
          return [...prev, incoming];
        });
      },
      (status) => {
        if (!active) return;
        setConnection(status);
        // Tersambung (pertama kali atau setelah putus): ambil ulang supaya tidak ada pesan terlewat.
        if (status === 'live') void reload();
      }
    );

    void reload();
    return () => {
      active = false;
      stop();
    };
  }, [bookingId, reload]);

  const deliver = useCallback(async (tempId: string, draft: ChatDraft) => {
    try {
      const real = await TentorService.sendChatMessage(draft);
      drafts.current.delete(tempId);
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempId);
        return withoutTemp.some((m) => m.id === real.id) ? withoutTemp : [...withoutTemp, real];
      });
      return real;
    } catch {
      setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, status: 'failed' as const } : m)));
      return null;
    }
  }, []);

  const send = useCallback(
    async (draft: ChatDraft) => {
      const now = new Date().toISOString();
      const tempId = `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      drafts.current.set(tempId, draft);
      setMessages((prev) => [
        ...prev,
        { ...draft, id: tempId, timestamp: formatClock(now), is_read: false, created_at: now, status: 'sending' },
      ]);
      return deliver(tempId, draft);
    },
    [deliver]
  );

  const retry = useCallback(
    (tempId: string) => {
      const draft = drafts.current.get(tempId);
      if (!draft) return;
      setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, status: 'sending' as const } : m)));
      void deliver(tempId, draft);
    },
    [deliver]
  );

  return { messages, connection, loading, loadError, send, retry, reload };
}
