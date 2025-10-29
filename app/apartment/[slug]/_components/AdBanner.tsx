'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    // Adsbygoogle is an array-like object that has a push method.
    adsbygoogle?: Array<unknown> & { push: (...items: unknown[]) => number };
  }
}

type Props = {
  adClient?: string;
  adSlot: string | number;
  style?: React.CSSProperties;
  className?: string;
  keyBy?: string | number;
};

export default function AdSenseAd({
  adClient = 'ca-pub-7044136892757742',
  adSlot,
  style,
  className,
  keyBy,
}: Props) {
  const insRef = useRef<HTMLModElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Ensure window.adsbygoogle is an array with a push method.
    if (!Array.isArray(window.adsbygoogle)) {
      window.adsbygoogle = [] as unknown as typeof window.adsbygoogle;
    }

    // Now safely narrow the type for TypeScript
    const ads = window.adsbygoogle as NonNullable<typeof window.adsbygoogle>;

    const timeout = setTimeout(() => {
      try {
        // Extra runtime guard in case something else mutated it.
        if (ads && typeof ads.push === 'function') {
          // push an empty config object as expected by AdSense
          ads.push({} as unknown);
        } else {
          // fallback: recreate and push (narrowed for TS)
          window.adsbygoogle = [] as unknown as typeof window.adsbygoogle;
          (window.adsbygoogle as NonNullable<typeof window.adsbygoogle>).push({} as unknown);
        }
      } catch (err) {
        console.warn('Adsense push error', err);
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [adSlot, keyBy, pathname]);

  return (
    <div className={className} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: 90, ...(style || {}) }}
        data-ad-client={adClient}
        data-ad-slot={String(adSlot)}
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-adtest={process.env.NEXT_PUBLIC_ENABLE_ADS !== '1' ? 'on' : undefined}
        ref={insRef}
      />
    </div>
  );
}