'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

/** Halaman daftar/dashboard boleh lebar; halaman form & detail dibatasi supaya nyaman dibaca. */
const WIDE_ROUTES = ['/beranda', '/tentor', '/jadwal', '/akun', '/chat'];

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isWide = WIDE_ROUTES.includes(pathname);

  return (
    <div className="min-h-screen bg-background lg:pl-64">
      <Sidebar />
      <div
        className={`mx-auto w-full relative flex flex-col min-h-screen ${
          isWide ? 'md:max-w-3xl lg:max-w-5xl' : 'md:max-w-3xl'
        }`}
      >
        {/* key = pathname: setiap pindah halaman, isi masuk dengan transisi singkat */}
        <div key={pathname} className="page-enter flex flex-col flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
