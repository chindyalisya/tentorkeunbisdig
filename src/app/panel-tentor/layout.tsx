import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel Tentor | TentorKeun',
  robots: { index: false, follow: false },
};

export default function PanelTentorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
