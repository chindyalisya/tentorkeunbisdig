'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MaterialIcon } from '@/components/common/MaterialIcon';

interface Props {
  onSend: (text: string) => void;
  placeholder: string;
  disabled?: boolean;
  /** Teks pendek yang bisa diketuk untuk langsung terkirim; hanya tampil saat kolom kosong. */
  suggestions?: string[];
}

const MAX_LENGTH = 2000;

/**
 * Kolom tulis pesan: Enter mengirim, Shift+Enter baris baru, tinggi menyesuaikan isi.
 * Ukuran huruf 16px supaya iOS tidak memperbesar layar saat kolom difokus.
 */
export function Composer({ onSend, placeholder, disabled, suggestions = [] }: Props) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Fokus otomatis hanya di perangkat dengan kursor (desktop), agar keyboard layar tidak muncul sendiri di ponsel.
    if (window.matchMedia('(pointer: fine)').matches) ref.current?.focus();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [value]);

  const submit = (text = value) => {
    const clean = text.trim();
    if (!clean || disabled) return;
    onSend(clean);
    setValue('');
    ref.current?.focus();
  };

  return (
    <div className="bg-surface border-t border-outline-variant pb-safe">
      {suggestions.length > 0 && value === '' && (
        <div className="px-4 sm:px-6 pt-3 flex gap-2 overflow-x-auto no-scrollbar" aria-label="Pesan cepat">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => submit(s)}
              disabled={disabled}
              className="h-9 px-4 rounded-full border border-outline-variant bg-surface-container-lowest text-sm text-primary font-semibold whitespace-nowrap hover:bg-tertiary hover:border-primary/40 transition-colors active:scale-[0.97] disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="px-4 sm:px-6 py-3 flex items-end gap-2"
      >
        <label htmlFor="chat-input" className="sr-only">
          Tulis pesan
        </label>
        <textarea
          id="chat-input"
          ref={ref}
          rows={1}
          value={value}
          maxLength={MAX_LENGTH}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          className="flex-1 resize-none max-h-[140px] px-4 py-2.5 rounded-2xl bg-surface-container-low border border-outline-variant text-base leading-6 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Kirim pesan"
          className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 transition-all hover:bg-primary-container active:scale-95 disabled:opacity-35 disabled:active:scale-100"
        >
          <MaterialIcon name="send" className="text-xl" />
        </button>
      </form>
    </div>
  );
}
