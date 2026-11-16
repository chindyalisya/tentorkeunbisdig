import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TentorKeun - Platform Marketplace Tentor Les Privat & AI Matchmaking",
  description:
    "Temukan tentor privat terverifikasi terbaik dengan AI Matchmaking, garansi perlindungan rekber, e-tiket sesi belajar, evaluasi rapor komprehensif, dan live chat.",
  keywords: ["TentorKeun", "Les Privat", "Tentor UTBK", "Guru Les", "Marketplace Pendidikan"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000552",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-100 items-center justify-start text-on-surface">
        {/* Responsive Mobile-Centered Frame Container */}
        <div className="w-full max-w-md min-h-screen bg-mesh-canvas flex flex-col relative shadow-2xl sm:my-0 md:my-0 border-x border-outline-variant/30 overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
