'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

declare global {
  type BX24Api = {
    init(cb: () => void): void;
    placement: { info(): { options?: { ID?: number | string } } };
    getDomain(): string;
    resizeWindow(width: number, height: number): void;
  };
  interface Window {
    BX24?: BX24Api;
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

type WidgetProperty = {
  id: number;
  title?: string | null;
  price?: number | null;
};

type TokenResponse = { token: string };

function normalizePropertiesResponse(input: unknown): WidgetProperty[] {
  if (Array.isArray(input)) {
    return input as WidgetProperty[];
  }
  if (input && typeof input === 'object') {
    const maybe = input as { data?: unknown };
    if (Array.isArray(maybe.data)) {
      return maybe.data as WidgetProperty[];
    }
  }
  return [];
}

export default function PropertiesWidget() {
    const [jwt, setJwt] = useState<string>('');
    const [items, setItems] = useState<WidgetProperty[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError]   = useState<string | null>(null);

    const dealIdRef = useRef<number | null>(null);
    const domainRef = useRef<string | null>(null);

    // ждём появления BX24 и инициализируем
    useEffect(() => {
        let mounted = true;

        const waitBx = () =>
            new Promise<void>((resolve) => {
                if (typeof window !== 'undefined') {
                    const bx = window.BX24;
                    if (bx) return resolve();
                }
                const t = setInterval(() => {
                    const bx = typeof window !== 'undefined' ? window.BX24 : undefined;
                    if (bx) { clearInterval(t); resolve(); }
                }, 100);
                // safety timeout
                setTimeout(() => { clearInterval(t); resolve(); }, 5000);
            });

        const init = async () => {
            setError(null);
            await waitBx();

            const bx = window.BX24;
            if (!bx) {
                setError('BX24 API недоступен в этом контексте');
                return;
            }

            bx.init(async () => {
                try {
                    const info = bx.placement.info(); // {options:{ID: dealId}}
                    const domain = bx.getDomain();
                    const dealId = info?.options?.ID;

                    domainRef.current = domain || null;
                    dealIdRef.current = dealId ? Number(dealId) : null;

                    const tokRes = await fetch(`${API_BASE}/b24/token`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ domain, dealId }),
                    });
                    if (!tokRes.ok) {
                        const txt = await tokRes.text().catch(() => '');
                        throw new Error(`Не удалось получить JWT: ${tokRes.status} ${txt}`);
                    }
                    const tok = (await tokRes.json()) as TokenResponse;
                    if (mounted) setJwt(tok.token);

                    // первоначальная подгонка высоты
                    tryResize();
                } catch (e: unknown) {
                    console.error(e);
                    const msg = e instanceof Error ? e.message : 'Ошибка инициализации виджета';
                    if (mounted) setError(msg);
                }
            });
        };

        init();
        return () => { mounted = false; };
    }, []);

    const tryResize = () => {
        // Подгоняем высоту iFrame под контент
        try {
            const bx = typeof window !== 'undefined' ? window.BX24 : undefined;
            if (bx) {
                const h = Math.min(1400, Math.max(300, document.body.scrollHeight));
                bx.resizeWindow(document.body.scrollWidth, h);
            }
        } catch {}
    };

    // загрузка объектов по вашему API `/properties`
    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                offer_type: 'sale',
                per_page: '20',
                priceFrom: '300000',
            }).toString();

            const res = await fetch(`${API_BASE}/properties?${params}`, {
                headers: {
                    // ключевой момент — b24.jwt middleware ждёт Bearer JWT
                    Authorization: `Bearer ${jwt}`,
                },
            });
            if (!res.ok) {
                const txt = await res.text().catch(() => '');
                throw new Error(`Ошибка загрузки: ${res.status} ${txt}`);
            }
            const data = (await res.json()) as unknown;
            const list = normalizePropertiesResponse(data);
            setItems(list);
            tryResize();
        } catch (e: unknown) {
            console.error(e);
            const msg = e instanceof Error ? e.message : 'Не удалось загрузить объекты';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const isReady = useMemo(() => Boolean(jwt), [jwt]);

    return (
        <div style={{ padding: 16, fontFamily: 'inherit' }}>
            <h3 style={{ margin: 0, marginBottom: 12 }}>Подбор объектов</h3>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                    disabled={!isReady || loading}
                    onClick={load}
                    style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: 'none',
                        background: '#0036A5',
                        color: 'white',
                        cursor: isReady && !loading ? 'pointer' : 'not-allowed',
                        opacity: isReady && !loading ? 1 : 0.6,
                    }}
                >
                    {loading ? 'Загрузка…' : 'Загрузить'}
                </button>

                {!isReady && <span style={{ fontSize: 12, color: '#666F8D' }}>получаем доступ…</span>}
            </div>

            {error && (
                <div style={{
                    background: '#FFF1F0',
                    color: '#A8071A',
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 12,
                    border: '1px solid #ffccc7'
                }}>
                    {error}
                </div>
            )}

            <ul style={{ margin: 0, paddingLeft: 16 }}>
                {items.map((p: WidgetProperty) => (
                    <li key={p.id} style={{ marginBottom: 6 }}>
                        {p.title || `Объект #${p.id}`} — {p.price ?? '—'}
                    </li>
                ))}
            </ul>
        </div>
    );
}