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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-2xl mx-auto h-16 px-2 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = item.activeMatch(pathname);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-all relative ${
                isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <div className="relative">
                <MaterialIcon
                  name={item.icon}
                  className={`text-[24px] transition-transform ${isActive ? 'scale-110' : ''}`}
                  filled={isActive}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1.5 bg-error text-white text-[10px] font-black rounded-full ring-2 ring-surface">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-primary' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
