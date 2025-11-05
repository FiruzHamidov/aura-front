'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Google AdSense Component for Next.js
 *
 * TROUBLESHOOTING CHECKLIST:
 *
 * 1. ✓ Script Loading: Check that AdSense script loads in layout.tsx
 * 2. ✓ Environment Variable: NEXT_PUBLIC_ENABLE_ADS=1 should be set in .env
 * 3. ✓ Ad Slot ID: Verify the adSlot prop matches your AdSense account
 * 4. ✓ Publisher ID: ca-pub-7044136892757742 should match your account
 * 5. Browser Console: Check for errors related to adsbygoogle
 * 6. Network Tab: Verify requests to googlesyndication.com
 * 7. AdSense Account: Ensure site is verified and ads.txt is configured
 * 8. Content Policy: Make sure content complies with AdSense policies
 * 9. Ad Serving Limits: Check if your account has any restrictions
 * 10. Testing: Remove data-adtest attribute to test real ads (currently controlled by env var)
 *
 * COMMON ISSUES:
 * - Ads take 24-48 hours to start showing after site approval
 * - Development mode shows "test" ads (data-adtest="on")
 * - Ad blockers will prevent ads from showing
 * - Invalid traffic or policy violations can block ads
 * - Page needs sufficient content to show ads
 */

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
                                  }: Props) {
    const insRef = useRef<HTMLElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        // Prevent double initialization in React StrictMode
        if (isInitialized.current) return;

        if (typeof window === 'undefined') {
            console.warn('AdSense: Window is undefined (SSR)');
            return;
        }

        const initializeAd = () => {
            try {
                console.log('🔍 Attempting to initialize ad for slot:', adSlot);

                // Check if AdSense script is loaded
                if (!window.adsbygoogle) {
                    console.warn('⚠️ AdSense script not loaded yet. Retrying...');
                    setTimeout(initializeAd, 500);
                    return;
                }

                // Ensure window.adsbygoogle is an array
                if (!Array.isArray(window.adsbygoogle)) {
                    window.adsbygoogle = [] as unknown as typeof window.adsbygoogle;
                }

                const ads = window.adsbygoogle as NonNullable<
                    typeof window.adsbygoogle
                >;

                // Check if the ins element exists and is in the DOM
                if (!insRef.current) {
                    console.warn('⚠️ Ad container element not found');
                    return;
                }

                // CRITICAL: Ensure the element is actually in the DOM and visible
                if (!document.body.contains(insRef.current)) {
                    console.warn('⚠️ Ad element not in DOM yet. Retrying...');
                    setTimeout(initializeAd, 100);
                    return;
                }

                // Check if element has dimensions (is visible)
                const rect = insRef.current.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) {
                    console.warn('⚠️ Ad element has no dimensions. Retrying...');
                    setTimeout(initializeAd, 100);
                    return;
                }

                // Check if already initialized
                const dataStatus = insRef.current.getAttribute(
                    'data-adsbygoogle-status'
                );
                if (dataStatus === 'done' || dataStatus === 'filled') {
                    console.log('ℹ️ Ad already initialized for slot:', adSlot);
                    setIsLoaded(true);
                    return;
                }

                console.log(
                    '✅ Element ready - Width:',
                    rect.width,
                    'Height:',
                    rect.height
                );
                console.log('🌐 Current URL:', window.location.href);
                console.log('🔑 Ad Client:', adClient);
                console.log('🎯 Ad Slot:', adSlot);
                console.log('📦 Element attributes:', {
                    client: insRef.current.getAttribute('data-ad-client'),
                    slot: insRef.current.getAttribute('data-ad-slot'),
                    format: insRef.current.getAttribute('data-ad-format'),
                });

                // Push ad to AdSense queue
                ads.push({} as unknown);
                isInitialized.current = true;
                setIsLoaded(true);
                console.log('✅ AdSense ad pushed successfully for slot:', adSlot);

                // Check if ad loaded after a delay
                setTimeout(() => {
                    const status = insRef.current?.getAttribute(
                        'data-adsbygoogle-status'
                    );
                    console.log('📊 Ad status after 2s:', status, 'for slot:', adSlot);
                    console.log(
                        '🔍 Status check - is null?',
                        status === null,
                        'is falsy?',
                        !status
                    );

                    if (!status) {
                        const isLocalhost =
                            window.location.hostname === 'localhost' ||
                            window.location.hostname === '127.0.0.1' ||
                            window.location.hostname.includes('local');

                        if (isLocalhost) {
                            // Localhost warning - not an error
                            console.warn('⚠️ IMPORTANT: You are testing on LOCALHOST!');
                            console.warn(
                                '   👉 AdSense only works on approved production domains'
                            );
                            console.warn(
                                '   👉 Deploy to your production domain (aura.tj) to see ads'
                            );
                            setError('Testing on localhost - ads only work on production');
                        } else {
                            // Production issue - this IS an error
                            console.error('❌ AdSense ad blocked on production. Check:');
                            console.error(
                                '   1. Account approved? (check AdSense dashboard)'
                            );
                            console.error('   2. Site verified in AdSense?');
                            console.error('   3. Policy violations or serving limits?');
                            console.error('   4. Ad blocker installed?');
                            console.error('   5. Check Network tab for 403 errors');
                            console.error(
                                '   👉 Visit: https://www.google.com/adsense/new/u/0/pub-7044136892757742/sites'
                            );
                            setError('Ad request blocked - check AdSense account');
                        }
                    } else if (status === 'unfilled') {
                        setError('No ads available for this page');
                        console.warn('⚠️ No ads available for this page');
                    } else {
                        console.log('✅ Ad loaded successfully! Status:', status);
                    }
                }, 2000);
            } catch (err) {
                console.error('❌ AdSense error for slot', adSlot, ':', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        };

        // Start initialization after a delay to ensure hydration is complete
        const timeout = setTimeout(initializeAd, 1000);

        return () => {
            clearTimeout(timeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div
            className={className}
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <ins
                className="adsbygoogle"
                style={{
                    display: 'block',
                    width: '100%',
                    minHeight: 90,
                    ...(style || {}),
                }}
                data-ad-client={adClient}
                data-ad-slot={String(adSlot)}
                data-ad-format="auto"
                data-full-width-responsive="true"
                ref={insRef as React.RefObject<HTMLModElement>}
            />
            {process.env.NODE_ENV === 'development' && (
                <div
                    style={{
                        fontSize: '11px',
                        color: '#666',
                        marginTop: '8px',
                        textAlign: 'center',
                    }}
                >
                    {!isLoaded && <div>⏳ Loading ad slot: {adSlot}...</div>}
                    {isLoaded && <div>✅ Ad initialized for slot: {adSlot}</div>}
                    {error && <div style={{ color: 'orange' }}>⚠️ {error}</div>}
                </div>
            )}
        </div>
    );
}
