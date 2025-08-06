import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Dihapus sepenuhnya
import "./globals.css";

export const metadata: Metadata = {
  title: "KEDEMPEL",
  description: "Laporan KAS HUT RI-80",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}