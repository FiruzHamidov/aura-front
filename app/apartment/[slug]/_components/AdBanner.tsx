'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  client: string;
  slot: string;
  style?: React.CSSProperties;
}

// Narrowly-typed Window that may contain the adsbygoogle array
interface WindowWithAds extends Window {
  adsbygoogle?: unknown[];
}

export default function AdBanner({ client, slot, style }: AdBannerProps) {
  // avoid rendering the <ins> on the server to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === 'undefined') return;

    // capture the current ins element once for use inside this effect and cleanup
    const observedEl: HTMLModElement | null = insRef.current;

    const waitForAds = () =>
        new Promise<void>((resolve) => {
          // if adsbygoogle already present, resolve immediately
          if ((window as WindowWithAds).adsbygoogle) return resolve();

          const script = Array.from(document.scripts).find(
              (s) => typeof (s as HTMLScriptElement).src === 'string' && (s as HTMLScriptElement).src.includes('adsbygoogle.js')
          ) as HTMLScriptElement | undefined;

          if (script) {
            if ((window as WindowWithAds).adsbygoogle) return resolve();
            const loadedAttr = script.getAttribute('data-loaded');
            // readyState isn't always present on the TS declaration in some configs; narrow it with an intersection type
            const scriptReadyState = (script as HTMLScriptElement & { readyState?: string }).readyState;
            if (scriptReadyState === 'complete' || scriptReadyState === 'loaded' || loadedAttr === '1') return resolve();

            const onLoad = () => {
              try {
                script.setAttribute('data-loaded', '1');
              } catch {
                // ignore if script element is removed concurrently
              }
              script.removeEventListener('load', onLoad);
              resolve();
            };

            script.addEventListener('load', onLoad);
            // safety timeout in case load doesn't fire
            setTimeout(() => resolve(), 1500);
            return;
          }

          // if no script tag found, short delay and resolve — pushing later will still be attempted
          setTimeout(() => resolve(), 500);
        });

    const isVisible = (el: HTMLModElement | null) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };

    let pushed = false;
    let ro: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;
    let cancelled = false;

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const attemptPush = async () => {
      if (cancelled) return;
      const el = insRef.current;
      if (!el) return;
      if (el.getAttribute('data-adsbygoogle-status') === 'done') return;

      await waitForAds();
      if (cancelled || !insRef.current) return;
      if (!isVisible(el)) return;

      // try multiple times with small delays — helps when AdSense needs layout size
      for (let i = 0; i < 5 && !pushed && !cancelled; i++) {
        try {
          (window as WindowWithAds).adsbygoogle = (window as WindowWithAds).adsbygoogle || [];
          // ensure we call push on next tick so DOM is stable
          await sleep(0);
          // push may throw if AdSense isn't ready; wrap in try/catch
          try {
            ((window as WindowWithAds).adsbygoogle as unknown[]).push({});
            pushed = true;
            if (process.env.NODE_ENV !== 'production') {
              console.debug('[AdBanner] adsbygoogle.push() succeeded', { attempt: i + 1 });
            }
          } catch {
            if (process.env.NODE_ENV !== 'production') {
              console.debug('[AdBanner] adsbygoogle.push() threw, retrying');
            }
            await sleep(300);
          }
        } catch {
          if (process.env.NODE_ENV !== 'production') {
            console.debug('[AdBanner] adsbygoogle.push() failed, retrying');
          }
          await sleep(300);
        }
      }
    };

    // observe size changes and visibility to try pushing when layout stabilizes
    if (typeof ResizeObserver !== 'undefined' && observedEl) {
      ro = new ResizeObserver(() => {
        if (!pushed) attemptPush();
      });
      try {
        ro.observe(observedEl);
      } catch {
        // ignore observe errors (element may be detached)
      }
    }

    if (typeof IntersectionObserver !== 'undefined' && observedEl) {
      io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              if (!pushed) attemptPush();
            }
          },
          { root: null, threshold: 0 }
      );
      try {
        io.observe(observedEl);
      } catch {
        // ignore observe errors
      }
    }

    const t1 = window.setTimeout(() => attemptPush(), 600);
    const t2 = window.setTimeout(() => attemptPush(), 1500);

    const onResize = () => {
      if (!pushed) attemptPush();
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    return () => {
      cancelled = true;
      // use the captured observedEl (may be null)
      if (ro && observedEl) {
        try {
          ro.unobserve(observedEl);
        } catch {
          /* ignore */
        }
      }
      if (io && observedEl) {
        try {
          io.unobserve(observedEl);
        } catch {
          /* ignore */
        }
      }
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [client, slot, mounted]);

  const dataAdTest = process.env.NODE_ENV !== 'production' ? 'on' : undefined;

  return (
      <div style={style} aria-hidden="true">
        {/* Only render the <ins> after mount to avoid SSR/CSR mismatch */}
        {mounted && (
            <ins
                ref={insRef}
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format="auto"
                data-full-width-responsive="true"
                {...(dataAdTest ? { 'data-adtest': dataAdTest } : {})}
            />
        )}
      </div>
  );
}