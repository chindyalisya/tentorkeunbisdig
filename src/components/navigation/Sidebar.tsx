'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MaterialIcon } from '../common/MaterialIcon';
import { NAV_ITEMS } from './nav-items';

/** Sidebar tetap di sisi kiri, hanya tampil di desktop (lg+). */
export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col bg-white border-r border-outline-variant/40 px-4 py-6">
      <Link href="/" className="flex items-center gap-2.5 px-2 mb-8" aria-label="TentorKeun - halaman utama">
        <span className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black text-lg tracking-tighter">
          TK
        </span>
        <span className="font-extrabold text-lg text-primary tracking-tight">TentorKeun</span>
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.activeMatch(pathname);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-primary text-white font-bold'
                  : 'text-on-surface-variant font-medium hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <MaterialIcon name={item.icon} filled={isActive} className="text-[22px]" />
              <span className="flex-1">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="px-1.5 min-w-[20px] text-center bg-error text-white text-[10px] font-black rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <Link
          href="/ai-matchmaking"
          className="flex items-center gap-2 px-3 py-3 rounded-xl border border-outline-variant/50 text-sm font-semibold text-primary hover:bg-surface-container-low transition-colors"
        >
          <MaterialIcon name="auto_awesome" className="text-[20px]" />
          Matchmaking AI
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 text-xs text-on-surface-variant hover:text-primary transition-colors"
        >
          <MaterialIcon name="arrow_back" className="text-[16px]" />
          Kembali ke halaman utama
        </Link>
      </div>
    </aside>
  );
};
