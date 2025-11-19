import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalSidebar from '../components/ConditionalSidebar';
import ConditionalMain from '../components/ConditionalMain';
import { SessionProvider } from './SessionProvider';

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistem Manajemen Zakat Masjid",
  description: "Aplikasi untuk mengelola zakat fitrah, zakat mal, kas harian, dan pengeluaran masjid",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <SessionProvider>
          <div className="min-h-screen bg-gray-50">
            <ConditionalSidebar />
            <ConditionalMain>
              {children}
            </ConditionalMain>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
