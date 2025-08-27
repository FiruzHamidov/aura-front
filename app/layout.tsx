import { ReactNode, Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import './globals.css';
import Footer from './_components/footer';
import Header from './_components/header';
import MobileBottomNavigation from './_components/MobileBottomNavigation';
import { QueryProvider } from '@/utils/providers';
import 'react-toastify/dist/ReactToastify.css';

const interFont = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Aura Estate',
  description: 'made with love by Aura',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${interFont.variable} antialiased`}>
        <Suspense>
          <QueryProvider>
            <Header />
            <main>{children}</main>
            <MobileBottomNavigation />
            <Footer />
          </QueryProvider>
        </Suspense>
        <ToastContainer />
      </body>
    </html>
  );
}
