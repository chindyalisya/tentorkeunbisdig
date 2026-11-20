'use client';

import React, { useEffect, useRef } from 'react';

type Variant = 'up' | 'settle' | 'wipe' | 'mark' | 'none';

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: Variant;
  /** Jeda dalam ms, untuk menyusun urutan muncul */
  delay?: number;
  once?: boolean;
}

/**
 * Memunculkan elemen saat masuk viewport. Gaya awalnya hanya aktif jika JS jalan
 * dan pengguna tidak meminta "kurangi gerakan" (lihat globals.css).
 */
export function Reveal({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  once = true,
  className = '',
  style,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-in');
            if (once) io.unobserve(el);
          } else if (!once) {
            el.classList.remove('is-in');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      data-v={variant}
      className={`reveal ${className}`}
      style={{ ...style, ['--d' as string]: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
