import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Atkinson_Hyperlegible_Next } from "next/font/google";
import "./globals.css";

const heading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const body = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
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
  viewportFit: "cover",
  themeColor: "#fbfbf8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${heading.variable} ${body.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        {/* Ikon berupa teks (ligature): sembunyikan sampai font ikon siap supaya tidak muncul tulisan "arrow_forward".
            Skrip ini sengaja setelah stylesheet agar @font-face sudah terdaftar. Batas 3 detik sebagai jaring pengaman. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement,r=function(){d.classList.add('icons-ready')};setTimeout(r,3000);try{document.fonts.load('24px \"Material Symbols Outlined\"').then(r,r)}catch(e){r()}})()",
          }}
        />
      </head>
      <body className="min-h-full bg-background text-on-surface">
        {children}
      </body>
    </html>
  );
}
