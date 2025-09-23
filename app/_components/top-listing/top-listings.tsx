'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Tabs } from '@/ui-components/tabs/tabs';
import ListingCard from './listing-card';
import ListingCardSkeleton from '@/ui-components/ListingCardSkeleton';
import { PropertiesResponse, Property } from '@/services/properties/types';
import { STORAGE_URL } from '@/constants/base-url';
import { useGetPropertyTypesQuery } from '@/services/properties/hooks';
import type { Listing } from '@/app/_components/top-listing/types';
import {PropertyType} from "@/services/add-post";

type TabItem = { key: string; label: string };

const normalize = (s?: string | null) => (s ?? '').toString().trim().toLowerCase();

const fallbackTabs: ReadonlyArray<TabItem> = [
    { key: 'apartment', label: 'Квартира' },
    { key: 'house', label: 'Дом' },
    { key: 'land', label: 'Земельный участок' },
    { key: 'commercial', label: 'Коммерческая' },
] as const;

const PAGE_SIZE = 5;

const TopListings: FC<{
    title?: string;
    isLoading?: boolean;
    properties: PropertiesResponse | undefined;
}> = ({ title = 'Топовые объявления', properties, isLoading }) => {
    const { data: propertyTypesData, isLoading: isTypesLoading } = useGetPropertyTypesQuery();

    const tabs: TabItem[] = useMemo(() => {

        const mapped =
            (propertyTypesData as PropertyType[])
                .map((t) => {
                    const key = normalize(t?.slug) || normalize(t?.name);
                    const label = t?.name ?? t?.slug ?? '';
                    return key ? { key, label } : null;
                })
                .filter((x): x is TabItem => Boolean(x)) ?? [];
        return mapped.length > 0 ? mapped : [...fallbackTabs];
    }, [propertyTypesData]);

    const [activeType, setActiveType] = useState<string>(tabs[0]?.key ?? 'apartment');

    // Универсалка для строк
    const str = (v: string | number | boolean | null | undefined, fallback = ''): string => {
        if (v === null || v === undefined) return fallback;
        return String(v);
    };

    // Маппинг properties -> Listing
    const listings: Listing[] = useMemo(() => {
        if (!properties?.data) return [];
        return properties.data.map((property: Property): Listing => {
            const images =
                property.photos?.length
                    ? property.photos.map((photo) => ({
                        url: photo.file_path ? `${STORAGE_URL}/${photo.file_path}` : '/images/no-image.jpg',
                        alt: property.title || 'Фото недвижимости',
                    }))
                    : [{ url: '/images/no-image.jpg', alt: 'Нет фото' }];

            const locationName =
                typeof property.location === 'string'
                    ? property.location
                    : str(property.location?.city, 'не указано');

            const floorInfo =
                property.floor && property.total_floors
                    ? `${property.floor}/${property.total_floors} этаж`
                    : 'Этаж не указан';

            const roomCountLabel =
                str(property.apartment_type) || (property.rooms ? `${property.rooms}-ком` : 'не указано');

            const title =
                str(property.title) ||
                [roomCountLabel, property.total_area ? `${property.total_area} м²` : '']
                    .filter(Boolean)
                    .join(', ')
                    .trim();

            const typeSlug =
                normalize((property as Property)?.type?.slug) ||
                normalize((property as Property)?.type?.name) ||
                undefined;

            return {
                listing_type: property.listing_type, moderation_status: property.moderation_status,
                id: Number(property.id),
                images,
                price: parseFloat(String(property.price ?? 0)),
                currency: property.currency === 'TJS' ? 'с.' : str(property.currency, ''),
                title,
                locationName,
                description: str(property.description) || str(property.landmark) || 'Описание отсутствует',
                roomCountLabel,
                area: property.total_area ? parseFloat(String(property.total_area)) : 0,
                floorInfo,
                agent: property.creator
                    ? {
                        name: property.creator.name || 'не указано',
                        role: 'риелтор',
                        avatarUrl: property.creator.photo ? `${STORAGE_URL}/${property.creator.photo}` : undefined,
                    }
                    : undefined,
                date: property.created_at ? new Date(property.created_at).toLocaleDateString('ru-RU') : undefined,
                type: typeSlug
            };
        });
    }, [properties]);

    // Предраcсчитываем количество по каждому табу
    const countsByType = useMemo(() => {
        const map = new Map<string, number>();
        tabs.forEach((t) => map.set(t.key, 0));
        listings.forEach((l) => {
            const k = l.type;
            if (k && map.has(k)) map.set(k, (map.get(k) || 0) + 1);
        });
        return map;
    }, [tabs, listings]);

    // Выравниваем activeType: если текущий таб отсутствует или пуст — прыгаем на первый с count>0 (или просто первый)
    useEffect(() => {
        const exists = tabs.some((t) => t.key === activeType);
        const hasItems = (countsByType.get(activeType) || 0) > 0;
        if (!exists || !hasItems) {
            const nonEmpty = tabs.find((t) => (countsByType.get(t.key) || 0) > 0)?.key;
            setActiveType(nonEmpty || tabs[0]?.key || 'apartment');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabs, countsByType]);

    // Фильтр по активному типу
    const filtered = useMemo(() => {
        return listings.filter((l) => !l.type || l.type === activeType);
    }, [listings, activeType]);

    const [slide, setSlide] = useState(0);
    const totalSlides = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    useEffect(() => {
        setSlide(0);
    }, [activeType]);

    const pageStart = slide * PAGE_SIZE;
    const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

    // Скелетон
    if (isLoading || isTypesLoading) {
        return (
            <section>
                <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-4xl font-bold text-[#020617] mb-6 md:mb-10">{title}</h2>
                    <div className="mb-5 md:mb-8 overflow-auto hide-scrollbar">
                        <Tabs tabs={tabs} activeType={activeType} setActiveType={setActiveType} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="md:h-full md:max-h-[576px]">
                            <ListingCardSkeleton isLarge />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:max-h-[576px]">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <ListingCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // ВАЖНО: НЕ скрываем целиком секцию при пустом списке — иначе будет "мигание"
    const firstListing = pageItems[0];
    const smallListings = pageItems.slice(1, 5);

    return (
        <section>
            <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-4xl font-bold text-[#020617] mb-6 md:mb-10">{title}</h2>

                <div className="mb-5 md:mb-8 overflow-auto hide-scrollbar">
                    <Tabs tabs={tabs} activeType={activeType} setActiveType={setActiveType} />
                </div>

                {filtered.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">
                        По выбранному типу пока нет объявлений.
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 gap-5">
                            {firstListing && (
                                <div className="md:h-full md:max-h-[730px]">
                                    <Link href={`/apartment/${firstListing.id}`} className="max-h-[600px]">
                                        <ListingCard listing={firstListing} isLarge />
                                    </Link>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:max-h-[730px]">
                                {smallListings.map((l) => (
                                    <Link key={l.id} href={`/apartment/${l.id}`} className="max-h-[350px] min-h-[350px]">
                                        <ListingCard listing={l} />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {totalSlides > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <button
                                    onClick={() => setSlide((s) => Math.max(0, s - 1))}
                                    disabled={slide === 0}
                                    className="px-4 py-2 rounded-lg border disabled:opacity-50">
                                    ← Предыдущие
                                </button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalSlides }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSlide(i)}
                                            className={['w-2.5 h-2.5 rounded-full', i === slide ? 'bg-[#0036A5]' : 'bg-gray-300'].join(' ')}
                                            aria-label={`Слайд ${i + 1}`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => setSlide((s) => Math.min(totalSlides - 1, s + 1))}
                                    disabled={slide === totalSlides - 1}
                                    className="px-4 py-2 rounded-lg border disabled:opacity-50">
                                    Следующие →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default TopListings;