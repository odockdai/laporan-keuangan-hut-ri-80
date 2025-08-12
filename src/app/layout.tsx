import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import Fab from "@/components/Fab";
import ClientOnly from "@/components/ClientOnly";

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
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen antialiased bg-gray-50 dark:bg-slate-900">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        {/* <ClientOnly>
          <Fab />
        </ClientOnly> */}
      </body>
    </html>
  );
}