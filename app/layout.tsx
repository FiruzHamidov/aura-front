// app/layout.tsx
import {ReactNode, Suspense} from 'react';
import type {Metadata, Viewport} from 'next';
import {Inter} from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Footer from './_components/footer';
import Header from './_components/header';
import MobileBottomNavigation from './_components/MobileBottomNavigation';
import {QueryProvider} from '@/utils/providers';
import YandexMetrikaClient from '@/yandex-metrika-client';
import {Sidebar} from '@/app/profile/_components/sidebar';
import {cookies} from 'next/headers';
import ToastProvider from "@/app/_components/_providers/ToastProvider";
import ClientChatMount from "@/app/_components/client-chat-mount";
import HeaderAndFooterGate from "@/app/_components/layout/HeaderAndFooterGate";
// import {GoogleAdSense} from "@mesmotronic/next-adsense";

const interFont = Inter({variable: '--font-inter', subsets: ['latin', 'cyrillic']});

const SITE_URL = 'https://aura.tj';
const YM_ID = Number(process.env.NEXT_PUBLIC_YM_ID ?? 104117823);

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Aura Estate — Недвижимость в Таджикистане',
        template: '%s — Aura Estate',
    },
    description:
        'Aura Estate — поиск, покупка и аренда недвижимости в Таджикистане. Умные фильтры, карта объектов, отзывы риелторов.',
    applicationName: 'Aura Estate',
    keywords: [
        'недвижимость',
        'квартиры',
        'аренда',
        'покупка',
        'Душанбе',
        'Таджикистан',
        'Aura Estate',
    ],
    authors: [{name: 'Aura'}],
    openGraph: {
        type: 'website',
        url: SITE_URL,
        siteName: 'Aura Estate',
        title: 'Aura Estate — Недвижимость в Таджикистане',
        description:
            'Поиск, покупка и аренда недвижимости в Таджикистане. Удобные фильтры, карта и отзывы.',
        images: [
            {
                url: '/icons/web-app-manifest-512x512.png', // положи картинку 1200x630
                width: 1200,
                height: 630,
                alt: 'Aura Estate',
            },
        ],
        locale: 'ru_RU',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Aura Estate — Недвижимость в Таджикистане',
        description:
            'Поиск, покупка и аренда недвижимости в Таджикистане. Удобные фильтры, карта и отзывы.',
        images: ['/icons/web-app-manifest-512x512.png'],
    },
    alternates: {
        canonical: '/',
        languages: {
            ru: '/',
        },
    },
    icons: {
        icon: [
            {url: '/icons/favicon.ico'},
            {url: '/icons/web-app-manifest-192x192.png', sizes: '32x32', type: 'image/png'},
            {url: '/icons/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png'},
            {url: '/icons/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png'},
        ],
        apple: [{url: '/icons/apple-touch-icon.png', sizes: '180x180'}],
    },
    manifest: '/site.webmanifest', // PWA манифест, если используешь
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
    appleWebApp: {
        statusBarStyle: 'default',
        title: 'Aura Estate',
        capable: true,
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
};

export default async function RootLayout({children}: { children: ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    return (
        <html lang="ru">
        <head>
            <meta name="theme-color" media="(prefers-color-scheme: light)" content="#00000000"/>
            <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#00000000"/>
            <meta name="mobile-web-app-capable" content="yes"/>


            <script async custom-element="amp-auto-ads"
                    src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js">
            </script>
            {/*<Script*/}
            {/*    id="google-adsense"*/}
            {/*    async*/}
            {/*    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7044136892757742"*/}
            {/*    crossOrigin="anonymous"*/}
            {/*    strategy="afterInteractive"*/}
            {/*/>*/}

            <script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7044136892757742"
                crossOrigin="anonymous"
            />

        </head>
        <body className={`${interFont.variable} antialiased`}>
        {/* Yandex.Metrika loader */}
        {/*<GoogleAdSense client={`${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`} />*/}
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

        <Suspense fallback={null}>
            <QueryProvider>
                <HeaderAndFooterGate>
                    <Header/>
                </HeaderAndFooterGate>

                {token && <Sidebar/>}
                <main>{children}</main>
                <ToastProvider/>
                <HeaderAndFooterGate>
                    <MobileBottomNavigation/>
                    <ClientChatMount/>
                    <Footer/>
                </HeaderAndFooterGate>

            </QueryProvider>

            {/* SPA-хиты */}
            <YandexMetrikaClient ymId={YM_ID}/>
        </Suspense>

        {/* noscript-пиксель */}
        <noscript>
            <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`https://mc.yandex.ru/watch/${YM_ID}`}
                    style={{position: 'absolute', left: '-9999px'}}
                    alt=""
                />
            </div>
        </noscript>
        </body>
        </html>
    );
}