import { ReactNode, Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import Script from 'next/script'; // ← уже было добавлено
import './globals.css';
import Footer from './_components/footer';
import Header from './_components/header';
import MobileBottomNavigation from './_components/MobileBottomNavigation';
import { QueryProvider } from '@/utils/providers';
import 'react-toastify/dist/ReactToastify.css';
import YandexMetrikaClient from "@/yandex-metrika-client";

const interFont = Inter({ variable: '--font-inter', subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Aura Estate',
    description: 'made with love by Aura',
};

const YM_ID = Number(process.env.NEXT_PUBLIC_YM_ID ?? 104117823);

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ru">
        <body className={`${interFont.variable} antialiased`}>
        {/* Yandex.Metrika loader */}
        <Script
            id="ym-loader"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: `
(function(m,e,t,r,i,k,a){
  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}', 'ym');

ym(${YM_ID}, 'init', {
  ssr: true,
  webvisor: true,
  clickmap: true,
  ecommerce: "dataLayer",
  accurateTrackBounce: true,
  trackLinks: true
});
          `,
            }}
        />
        {/* /Yandex.Metrika loader */}

        {/* ВАЖНО: Клиентскую Метрику держим ВНУТРИ Suspense */}
        <Suspense fallback={null}>
            <QueryProvider>
                <Header />
                <main>{children}</main>
                <MobileBottomNavigation />
                <Footer />
            </QueryProvider>

            {/* SPA-хиты */}
            <YandexMetrikaClient ymId={YM_ID} />
        </Suspense>

        <ToastContainer />

        {/* noscript-пиксель */}
        <noscript>
            <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`https://mc.yandex.ru/watch/${YM_ID}`}
                    style={{ position: 'absolute', left: '-9999px' }}
                    alt=""
                />
            </div>
        </noscript>
        </body>
        </html>
    );
}