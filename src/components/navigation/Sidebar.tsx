'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MaterialIcon } from '../common/MaterialIcon';
import { Logo } from '../brand/Logo';
import { NAV_ITEMS } from './nav-items';

/** Sidebar tetap di sisi kiri, hanya tampil di desktop (lg+). */
export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col bg-surface border-r border-outline-variant px-4 py-6">
      <Link href="/" className="px-2 mb-8 text-primary" aria-label="TentorKeun - halaman utama">
        <Logo size="md" />
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
                  ? 'bg-tertiary text-primary font-bold'
                  : 'text-on-surface-variant font-medium hover:bg-surface-container hover:text-primary'
              }`}
            >
              <MaterialIcon name={item.icon} filled={isActive} className="text-[1.375rem]" />
              <span className="flex-1">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="px-1.5 min-w-[20px] text-center bg-error text-white text-[0.6875rem] font-black rounded-full">
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
          className="flex items-center gap-2 px-3 py-3 rounded-xl border border-outline-variant text-sm font-semibold text-primary hover:bg-surface-container transition-colors"
        >
          <MaterialIcon name="auto_awesome" className="text-[1.25rem]" />
          Matchmaking AI
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 text-xs text-on-surface-variant hover:text-primary transition-colors"
        >
          <MaterialIcon name="arrow_back" className="text-[1rem]" />
          Kembali ke halaman utama
        </Link>
      </div>
    </aside>
  );
};
