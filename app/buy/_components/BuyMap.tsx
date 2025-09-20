'use client';

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import {
  Property,
  MapBounds,
  PropertyFilters,
  MapClusterProperties,
  MapPointProperties,
} from '@/services/properties/types';
import { useGetPropertiesMapQuery } from '@/services/properties/hooks';
import BuyCard from '@/app/_components/buy/buy-card';
import { useProfile } from '@/services/login/hooks';
import { useSearchParams } from 'next/navigation';
import type * as ymaps from 'yandex-maps';
import { createPortal } from 'react-dom';

const DEFAULT_CENTER: [number, number] = [38.559772, 68.787038];
const DEFAULT_ZOOM = 12;

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

export const BuyMap: FC<Props> = ({ items, offset = { x: 32, y: -468 } }) => {
  const searchParams = useSearchParams();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<ymaps.Map | null>(null);
  const { data: user } = useProfile();

  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
  const [useMapApi, setUseMapApi] = useState<boolean>(false);

  const points: Point[] = useMemo(() => {
    return (items ?? [])
      .map((it) => {
        const lat = toNum(it.latitude);
        const lng = toNum(it.longitude);
        if (lat === null || lng === null) return null;
        return { it, coords: [lat, lng] as [number, number] };
      })
      .filter(Boolean) as Point[];
  }, [items]);

  const firstCenter = points[0]?.coords ?? DEFAULT_CENTER;

  const mapFilters: PropertyFilters = useMemo(() => {
    return {
      priceFrom: searchParams.get('priceFrom') || undefined,
      priceTo: searchParams.get('priceTo') || undefined,
      city: searchParams.get('cities') || undefined,
      repairType: searchParams.get('repairs') || undefined,
      type_id:
        searchParams.get('propertyType') ||
        searchParams.get('apartmentTypes') ||
        undefined,
      roomsFrom: searchParams.get('roomsFrom') || undefined,
      roomsTo: searchParams.get('roomsTo') || undefined,
      districts: searchParams.get('districts') || undefined,
      areaFrom: searchParams.get('areaFrom') || undefined,
      areaTo: searchParams.get('areaTo') || undefined,
      floorFrom: searchParams.get('floorFrom') || undefined,
      floorTo: searchParams.get('floorTo') || undefined,
      listing_type: 'regular',
      offer_type: 'sale',
    };
  }, [searchParams]);

  const { data: mapData } = useGetPropertiesMapQuery(
    bounds,
    zoom,
    mapFilters,
    false,
    !!bounds
  );

  const displayPoints = useMemo(() => {
    if (useMapApi && zoom <= 11 && mapData) {
      return [];
    }

    return points;
  }, [useMapApi, zoom, mapData, points]);

  const [hovered, setHovered] = useState<Point | null>(null);
  const [selected, setSelected] = useState<Point | null>(null);
  const [hoverPos, setHoverPos] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [selectPos, setSelectPos] = useState<{
    left: number;
    top: number;
  } | null>(null);

  const project = useCallback(
    (
      coords: [number, number] | null,
      set: (p: { left: number; top: number } | null) => void
    ) => {
      const map = mapRef.current;
      if (!map || !coords) {
        set(null);
        return;
      }

      try {
        const rawProj =
          (map.options.get('projection', {}) as unknown) ??
          ((typeof window !== 'undefined' &&
            (
              window as unknown as {
                ymaps?: { projection?: { wgs84Mercator?: unknown } };
              }
            ).ymaps?.projection?.wgs84Mercator) as unknown);

        if (
          !rawProj ||
          typeof (rawProj as ymaps.IProjection).toGlobalPixels !== 'function'
        ) {
          set(null);
          return;
        }

        const projection = rawProj as ymaps.IProjection;
        const zoomLevel = map.getZoom();
        const globalPx = projection.toGlobalPixels(coords, zoomLevel);
        const pagePt = map.converter.globalToPage(globalPx);

        const left = pagePt[0] + (offset.x ?? 0);
        const top = pagePt[1] + (offset.y ?? 0);

        set({ left, top });
      } catch (e) {
        console.warn('project error', e);
        set(null);
      }
    },
    [offset.x, offset.y]
  );

  useEffect(() => {
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
      if (!map) {
        console.warn('Map instance is null');
        return;
      }

      mapRef.current = map;

      setTimeout(() => {
        try {
          if (!mapRef.current) return;

          if (points.length > 1) {
            const lats = points.map((p) => p.coords[0]);
            const lngs = points.map((p) => p.coords[1]);

            const padding = 0.01;
            const bounds: [[number, number], [number, number]] = [
              [Math.min(...lats) - padding, Math.min(...lngs) - padding],
              [Math.max(...lats) + padding, Math.max(...lngs) + padding],
            ];

            try {
              mapRef.current.setBounds(bounds, {
                checkZoomRange: true,
                // @ts-expect-error undocumented option
                zoomMargin: 100,
                duration: 500,
              });
            } catch (e) {
              console.warn('Error setting bounds:', e);
            }
          } else if (points.length === 1) {
            mapRef.current.setCenter(points[0].coords, 15, {
              duration: 500,
            });
          }

          try {
            const ymapsBounds = mapRef.current.getBounds();
            if (ymapsBounds) {
              setBounds({
                south: ymapsBounds[0][0],
                west: ymapsBounds[0][1],
                north: ymapsBounds[1][0],
                east: ymapsBounds[1][1],
              });
            }
            setZoom(mapRef.current.getZoom());

            setUseMapApi(points.length > 100);
          } catch (e) {
            console.warn('Error getting initial bounds:', e);
          }

          mapRef.current.events.add('boundschange', () => {
            if (!mapRef.current) return;

            try {
              const newBounds = mapRef.current.getBounds();
              if (newBounds) {
                setBounds({
                  south: newBounds[0][0],
                  west: newBounds[0][1],
                  north: newBounds[1][0],
                  east: newBounds[1][1],
                });
              }
              setZoom(mapRef.current.getZoom());
            } catch (e) {
              console.warn('Error in boundschange:', e);
            }
          });
        } catch (e) {
          console.error('Error initializing map:', e);
        }
      }, 300);
    },
    [points]
  );

  return (
    <div ref={wrapRef} className="relative rounded-[22px] overflow-hidden">
      <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY }}>
        <Map
          defaultState={{ center: firstCenter, zoom: DEFAULT_ZOOM }}
          width="100%"
          height="70vh"
          instanceRef={onMapInstance}
          modules={[
            'control.ZoomControl',
            'control.GeolocationControl',
            'control.FullscreenControl',
            'control.TypeSelector',
          ]}
          options={{ suppressMapOpenBlock: true }}
          onClick={() => setHovered(null)}
        >
          <ZoomControl
            options={{ size: 'large', position: { right: 16, top: 16 } }}
          />
          <GeolocationControl options={{ position: { right: 16, top: 280 } }} />
          <FullscreenControl options={{ position: { right: 16, top: 240 } }} />
          <TypeSelector />

          {/* API Clusters (when zoom <= 11) */}
          {useMapApi &&
            zoom <= 11 &&
            mapData?.features.map((feature, index) => {
              const isCluster = 'cluster' in feature.properties;
              if (isCluster) {
                const clusterProps = feature.properties as MapClusterProperties;
                return (
                  <Placemark
                    key={`cluster-${index}`}
                    geometry={feature.geometry.coordinates}
                    options={{
                      preset: 'islands#blueClusterIcons',
                      iconColor: '#0036A5',
                    }}
                    properties={{
                      iconContent: clusterProps.point_count.toString(),
                      hintContent: `${clusterProps.point_count} объектов`,
                    }}
                  />
                );
              }
              return null;
            })}

          {/* API Points (when zoom > 11) */}
          {useMapApi &&
            zoom > 11 &&
            mapData?.features.map((feature) => {
              const isPoint = !('cluster' in feature.properties);
              if (isPoint) {
                const pointProps = feature.properties as MapPointProperties;
                return (
                  <Placemark
                    key={`point-${pointProps.id}`}
                    geometry={feature.geometry.coordinates}
                    options={{
                      iconLayout: 'default#image',
                      iconImageHref: '/images/pin.svg',
                      iconImageSize: [44, 56],
                      iconImageOffset: [-22, -56],
                      zIndex: 1000,
                    }}
                    properties={{
                      hintContent: pointProps.title,
                    }}
                  />
                );
              }
              return null;
            })}

          {/* Regular clusterer for local data */}
          {!useMapApi && (
            <Clusterer
              options={{
                preset: 'islands#invertedBlueClusterIcons',
                groupByCoordinates: false,
                clusterDisableClickZoom: false,
                clusterOpenBalloonOnClick: false,
              }}
            >
              {displayPoints.map((p) => (
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
                    setHovered((prev) =>
                      prev?.it.id === p.it.id ? null : prev
                    );
                  }}
                  onClick={() => {
                    setSelected(p);
                    project(p.coords, setSelectPos);
                  }}
                />
              ))}
            </Clusterer>
          )}
        </Map>

        {/* HOVER */}
        {hovered &&
          hoverPos &&
          (!selected || selected.it.id !== hovered.it.id) &&
          typeof document !== 'undefined' &&
          createPortal(
            <div
              className="pointer-events-none fixed z-[2147483647] max-w-[360px]"
              style={{ left: hoverPos.left, top: hoverPos.top }}
            >
              <div className="scale-[0.95] origin-bottom-left opacity-95">
                <div className="pointer-events-none">
                  <BuyCard listing={hovered.it} user={user} />
                </div>
              </div>
            </div>,
            document.body
          )}

        {/* CLICK */}
        {selected &&
          selectPos &&
          typeof document !== 'undefined' &&
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
          )}
      </YMaps>
    </div>
  );
};

export default BuyMap;
