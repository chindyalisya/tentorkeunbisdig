import React from 'react';
import type { ChatConnection } from '@/lib/types';

const COPY: Record<ChatConnection, { label: string; dot: string; text: string }> = {
  connecting: { label: 'Menyambungkan...', dot: 'bg-outline animate-pulse', text: 'text-on-surface-variant' },
  live: { label: 'Tersambung langsung', dot: 'bg-secondary', text: 'text-on-surface-variant' },
  offline: { label: 'Terputus, mencoba lagi', dot: 'bg-error animate-pulse', text: 'text-error' },
  local: { label: 'Mode demo (tanpa server)', dot: 'bg-tertiary-fixed-dim', text: 'text-on-surface-variant' },
};

export function ConnectionBadge({ status }: { status: ChatConnection }) {
  const c = COPY[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${c.text}`} role="status">
      <span className={`w-2 h-2 rounded-full ${c.dot}`} aria-hidden="true" />
      {c.label}
    </span>
  );
}
