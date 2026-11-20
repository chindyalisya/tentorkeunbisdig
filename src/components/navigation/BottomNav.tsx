'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MaterialIcon } from '../common/MaterialIcon';
import { NAV_ITEMS } from './nav-items';

/** Navigasi bawah untuk mobile & tablet. Di desktop (lg+) diganti Sidebar. */
export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe bg-surface border-t border-outline-variant">
      <div className="max-w-3xl mx-auto h-16 px-2 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = item.activeMatch(pathname);
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className="group flex flex-col items-center justify-center min-w-[64px] min-h-[48px] gap-0.5"
            >
              <span
                className={`relative flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200 ${
                  isActive ? 'bg-tertiary text-primary' : 'text-on-surface-variant group-hover:bg-surface-container'
                }`}
              >
                <MaterialIcon name={item.icon} className="text-[1.375rem]" filled={isActive} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute top-0 right-2 min-w-[1rem] px-1 bg-error text-white text-[0.625rem] font-bold rounded-full text-center">
                    {item.badge}
                  </span>
                )}
              </span>
              <span className={`text-[0.6875rem] ${isActive ? 'font-bold text-primary' : 'font-medium text-on-surface-variant'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
