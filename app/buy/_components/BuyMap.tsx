'use client';

import React, {FC, useCallback, useLayoutEffect, useMemo, useRef, useState,} from 'react';
import {
    Clusterer,
    FullscreenControl,
    GeolocationControl,
    Map,
    Placemark,
    TypeSelector,
    YMaps,
    ZoomControl,
} from '@pbe/react-yandex-maps';
import {Property} from '@/services/properties/types';
import BuyCard from '@/app/_components/buy/buy-card';
import {useProfile} from '@/services/login/hooks';
import type * as ymaps from 'yandex-maps';
import { createPortal } from 'react-dom';

const DEFAULT_CENTER: [number, number] = [38.559772, 68.787038];
const DEFAULT_ZOOM = 8;

const toNum = (v: unknown): number | null => {
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string' && v.trim() !== '') {
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    }
    return null;
};

type Point = { it: Property; coords: [number, number] };

type Props = {
    items: Property[];
    /** смещение карточки относительно пина */
    offset?: { x?: number; y?: number };
};

export const BuyMap: FC<Props> = ({items, offset = {x: 32, y: -468}}) => {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<ymaps.Map | null>(null);
    const {data: user} = useProfile();

    const points: Point[] = useMemo(() => {
        return (items ?? [])
            .map((it) => {
                const lat = toNum(it.latitude);
                const lng = toNum(it.longitude);
                if (lat === null || lng === null) return null;
                return {it, coords: [lat, lng] as [number, number]};
            })
            .filter(Boolean) as Point[];
    }, [items]);

    const firstCenter = points[0]?.coords ?? DEFAULT_CENTER;

    const [hovered, setHovered] = useState<Point | null>(null);
    const [selected, setSelected] = useState<Point | null>(null);
    const [hoverPos, setHoverPos] = useState<{ left: number; top: number } | null>(null);
    const [selectPos, setSelectPos] = useState<{ left: number; top: number } | null>(null);

    const project = useCallback(
        (coords: [number, number] | null, set: (p: { left: number; top: number } | null) => void) => {
            const map = mapRef.current;
            if (!map || !coords) { set(null); return; }

            try {
                const rawProj =
                    (map.options.get('projection', {}) as unknown) ??
                    ((typeof window !== 'undefined' &&
                        (window as unknown as { ymaps?: { projection?: { wgs84Mercator?: unknown } } })
                            .ymaps?.projection?.wgs84Mercator) as unknown);

                if (!rawProj || typeof (rawProj as ymaps.IProjection).toGlobalPixels !== 'function') {
                    set(null);
                    return;
                }

                const projection = rawProj as ymaps.IProjection;
                const zoom = map.getZoom();
                const globalPx = projection.toGlobalPixels(coords, zoom);
                const pagePt = map.converter.globalToPage(globalPx);

                const left = pagePt[0] + (offset.x ?? 0);
                const top  = pagePt[1] + (offset.y ?? 0);

                set({ left, top });
            } catch (e) {
                console.warn('project error', e);
                set(null);
            }
        },
        [offset.x, offset.y]
    );

    useLayoutEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        const recalc = () => {
            project(hovered?.coords ?? null, setHoverPos);
            project(selected?.coords ?? null, setSelectPos);
        };
        map.events.add('actiontick', recalc);
        map.events.add('boundschange', recalc);
        const ro = new ResizeObserver(recalc);
        if (wrapRef.current) ro.observe(wrapRef.current);
        recalc();
        return () => {
            map.events.remove('actiontick', recalc);
            map.events.remove('boundschange', recalc);
            ro.disconnect();
        };
    }, [hovered, selected, project]);

    const onMapInstance = useCallback(
        (map: ymaps.Map) => {
            mapRef.current = map;
            if (points.length > 1) {
                const lats = points.map((p) => p.coords[0]);
                const lngs = points.map((p) => p.coords[1]);
                const bounds: [[number, number], [number, number]] = [
                    [Math.min(...lats), Math.min(...lngs)],
                    [Math.max(...lats), Math.max(...lngs)],
                ];
                try {
                    // zoomMargin как массив и «поглощаем» Promise
                    void map.setBounds(bounds, {checkZoomRange: true, zoomMargin: [50, 50, 50, 50]});
                } catch {
                }
            }
        },
        [points]
    );

    return (
        <div ref={wrapRef} className="relative rounded-[22px] overflow-hidden">
            <YMaps query={{apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY}}>
                <Map
                    defaultState={{center: firstCenter, zoom: DEFAULT_ZOOM}}
                    width="100%"
                    height="70vh"
                    instanceRef={onMapInstance}
                    modules={[
                        'control.ZoomControl',
                        'control.GeolocationControl',
                        'control.FullscreenControl',
                        'control.TypeSelector',
                    ]}
                    options={{suppressMapOpenBlock: true}}
                    onClick={() => setHovered(null)}
                >
                    <ZoomControl options={{size: 'large', position: {right: 16, top: 16}}}/>
                    <GeolocationControl options={{position: {right: 16, top: 280}}}/>
                    <FullscreenControl options={{position: {right: 16, top: 240}}}/>
                    {/* У TypeSelector в typings нет position */}
                    <TypeSelector />

                    <Clusterer
                        options={{
                            preset: 'islands#invertedBlueClusterIcons',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: false,
                            clusterOpenBalloonOnClick: false,
                        }}
                    >
                        {points.map((p) => (
                            <Placemark
                                key={String(p.it.id)}
                                geometry={p.coords}
                                options={{
                                    iconLayout: 'default#image',
                                    iconImageHref: '/images/pin.svg',
                                    iconImageSize: [44, 56],
                                    iconImageOffset: [-22, -56],
                                    zIndex: 1000,
                                    hasHint: false,
                                    hasBalloon: false,
                                }}
                                onMouseEnter={() => {
                                    setHovered(p);
                                    project(p.coords, setHoverPos);
                                }}
                                onMouseLeave={() => {
                                    setHovered((prev) => (prev?.it.id === p.it.id ? null : prev));
                                }}
                                onClick={() => {
                                    setSelected(p);
                                    project(p.coords, setSelectPos);
                                }}
                            />
                        ))}
                    </Clusterer>
                </Map>

                {/* HOVER */}
                {hovered && hoverPos && (!selected || selected.it.id !== hovered.it.id) &&
                    typeof document !== 'undefined' &&
                    createPortal(
                        <div
                            className="pointer-events-none fixed z-[2147483647] max-w-[360px]" // большой z-index
                            style={{ left: hoverPos.left, top: hoverPos.top }}
                        >
                            <div className="scale-[0.95] origin-bottom-left opacity-95">
                                <div className="pointer-events-none">
                                    <BuyCard listing={hovered.it} user={user} />
                                </div>
                            </div>
                        </div>,
                        document.body
                    )
                }

                {/* CLICK */}
                {selected && selectPos && typeof document !== 'undefined' &&
                    createPortal(
                        <div
                            className="fixed z-[2147483647] max-w-[320px]"
                            style={{ left: selectPos.left, top: selectPos.top }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                <button
                                    onClick={() => setSelected(null)}
                                    className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-black/80 text-white text-sm"
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                                <BuyCard listing={selected.it} user={user} />
                            </div>
                        </div>,
                        document.body
                    )
                }
            </YMaps>
        </div>
    );
};

export default BuyMap;