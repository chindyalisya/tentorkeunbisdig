'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

/** Halaman daftar/beranda boleh lebar (grid); halaman form/detail dibatasi supaya nyaman dibaca. */
const WIDE_ROUTES = ['/beranda', '/tentor'];

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isWide = WIDE_ROUTES.includes(pathname);

  return (
    <div className="min-h-screen bg-mesh-canvas lg:pl-64">
      <Sidebar />
      <div
        className={`mx-auto w-full relative flex flex-col min-h-screen bg-surface/60 lg:bg-transparent ${
          isWide ? 'md:max-w-3xl lg:max-w-5xl' : 'md:max-w-2xl'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
