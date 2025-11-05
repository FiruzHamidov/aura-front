'use client';
import {useEffect} from 'react';

type Props = {
    adClient?: string;
    adSlot: string | number;
    style?: React.CSSProperties;
    className?: string;
};

export default function AdSenseAd({
                                      adClient = 'ca-pub-7044136892757742',
                                      adSlot,
                                      style,
                                      className,
                                  }: Props) {

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // create array if missing
        if (!Array.isArray(window.adsbygoogle)) {
            window.adsbygoogle = [] as unknown as typeof window.adsbygoogle;
        }

        // ищем именно те <ins>, которые ещё не помечены как initialized by AdSense
        const uninitialized = document.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status="done"])');

        if (uninitialized.length === 0) {
            // ничего инициализировать — безопасно не вызывать push
            return;
        }

        try {
            window.adsbygoogle.push({});
        } catch (e) {
            console.error('Error loading ads:', e);
        }
    }, [adSlot]);

    return (
        <div className={className} style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
            <script async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7044136892757742"
                    crossOrigin="anonymous"></script>

            <ins
                className="adsbygoogle"
                style={{display: 'block', width: '100%', minHeight: 90, ...(style || {})}}
                data-ad-client="ca-pub-7044136892757742"
                data-ad-slot="5085881730"
                data-ad-format="auto"
                data-full-width-responsive="true"
                data-adtest="on"
            />
        </div>

    );
}