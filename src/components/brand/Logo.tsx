import React from 'react';

/**
 * Lambang: huruf "t" yang kakinya menekuk naik menjadi tanda centang koreksi.
 * Dipakai sebagai huruf pertama wordmark ("t" + "entorkeun").
 */
export function LogoMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} fill="none" aria-hidden="true">
      <path
        d="M9 2.5V20C9 26.5 14 27 17.5 22.5L22 15.5M2 12.5H15"
        stroke="currentColor"
        strokeWidth="6.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  /** Ukuran teks wordmark; lambang mengikuti. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-[clamp(3rem,13vw,10rem)]',
};

export function Logo({ className = '', size = 'md' }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="TentorKeun"
      className={`inline-flex items-baseline font-extrabold leading-none tracking-[-0.04em] font-[family-name:var(--font-heading)] ${SIZES[size]} ${className}`}
    >
      <LogoMark className="h-[0.8em] w-[0.6em] mr-[0.01em] flex-shrink-0" />
      <span aria-hidden="true">entorkeun</span>
    </span>
  );
}
