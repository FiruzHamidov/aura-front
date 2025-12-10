'use client';

import {FC, useEffect, useMemo, useState, useRef} from 'react';
import dynamic from 'next/dynamic';
import {useRouter, useSearchParams} from 'next/navigation';
import clsx from 'clsx';
import Buy from '@/app/_components/buy/buy';
import {useGetPropertiesInfiniteQuery} from '@/services/properties/hooks';
import {AllFilters} from '@/app/_components/filters';
import {PropertyFilters} from '@/services/properties/types';
import BuyCardSkeleton from '@/ui-components/BuyCardSkeleton';
import {Tabs} from '@/ui-components/tabs/tabs';
import {useGetPropertyTypesQuery} from "@/services/add-post";

import Router from 'next/router';
import {ArrowUpWideNarrow, ListFilterPlus} from "lucide-react";

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

interface AdsBannerProps {
    "data-ad-slot": string;
    "data-ad-format": string;
    "data-full-width-responsive": string;
    "data-ad-layout"?: string;
}

const AdBanner = (props: AdsBannerProps) => {
    useEffect(() => {
        const pushAd = () => {
            try {
                if (window.adsbygoogle) {
                    window.adsbygoogle.push({});
                    return true;
                }
            } catch {
                // noop
            }
            return false;
        };

        // Try immediately and then periodically for up to ~3 seconds
        if (!pushAd()) {
            const intervalId = window.setInterval(() => {
                if (pushAd()) {
                    clearInterval(intervalId);
                }
            }, 200);

            // safety clear after 3 seconds
            setTimeout(() => clearInterval(intervalId), 3000);
        }

        // push on route changes as well
        const handleRouteChange = () => {
            try {
                pushAd();
            } catch { /* noop */
            }
        };

        Router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            Router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, []);

    return (
        <ins
            className="adsbygoogle adbanner-customize mt-2"
            style={{
                display: 'block',
                overflow: 'hidden',
                border: process.env.NODE_ENV === 'development' ? '1px solid red' : 'none',
                minWidth: '250px'
            }}
            data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
            {...props}
        />
    );
};

const SortPopup: FC<{
    isOpen: boolean;
    onClose: () => void;
    offerType: string;
}> = ({isOpen, onClose, offerType}) => {
    const [selected, setSelected] = useState<string | null>(null);

    // lock body scroll when open
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    // init selected from query params when popup opens
    useEffect(() => {
        if (!isOpen) return;
        const params = new URLSearchParams(window.location.search);
        const sort = params.get('sort');
        const dir = params.get('dir') || 'desc';
        if (!sort) {
            setSelected('none');
            return;
        }
        setSelected(`${sort}:${dir}`);
    }, [isOpen]);

    if (!isOpen) return null;

    const applySelection = (value: string) => {
        if (!value) return;
        const params = new URLSearchParams(window.location.search);

        if (value === 'none') {
            params.delete('sort');
            params.delete('dir');
        } else {
            const [sort, dir] = value.split(':');
            params.set('sort', sort);
            params.set('dir', dir as 'asc' | 'desc');
        }

        const base = offerType === 'rent' ? '/rent-offers' : '/buy';
        const qs = params.toString();
        window.history.pushState({}, '', `${base}${qs ? `?${qs}` : ''}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center"
            aria-modal="true"
            role="dialog"
        >
            <div onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

            <div onClick={(e) => e.stopPropagation()} className="relative z-77 w-full max-w-md mx-4 bg-white rounded-3xl shadow-lg">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold">Сортировать по</div>
                        <button onClick={onClose} className="text-gray-500 text-sm">Закрыть</button>
                    </div>

                    <form
                        onSubmit={(e) => { e.preventDefault(); if (selected) applySelection(selected); }}
                        className="flex flex-col gap-2"
                    >
                        <fieldset className="flex flex-col gap-1" aria-label="Сортировка">
                            <label className="inline-flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 cursor-pointer">
                                <input type="radio" name="sort" value="listing_type:desc" checked={selected === 'listing_type:desc'} onChange={() => setSelected('listing_type:desc')} />
                                <span>По типу</span>
                            </label>

                            <div className="border-t my-1" />

                            <label className="inline-flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 cursor-pointer">
                                <input type="radio" name="sort" value="price:asc" checked={selected === 'price:asc'} onChange={() => setSelected('price:asc')} />
                                <span>Цена — по возрастанию</span>
                            </label>
                            <label className="inline-flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 cursor-pointer">
                                <input type="radio" name="sort" value="price:desc" checked={selected === 'price:desc'} onChange={() => setSelected('price:desc')} />
                                <span>Цена — по убыванию</span>
                            </label>

                            <div className="border-t my-1" />

                            <label className="inline-flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 cursor-pointer">
                                <input type="radio" name="sort" value="total_area:asc" checked={selected === 'total_area:asc'} onChange={() => setSelected('total_area:asc')} />
                                <span>Площадь — по возрастанию</span>
                            </label>
                            <label className="inline-flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 cursor-pointer">
                                <input type="radio" name="sort" value="total_area:desc" checked={selected === 'total_area:desc'} onChange={() => setSelected('total_area:desc')} />
                                <span>Площадь — по убыванию</span>
                            </label>

                            <div className="border-t my-1" />

                            <label className="inline-flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 cursor-pointer">
                                <input type="radio" name="sort" value="date:desc" checked={selected === 'date:desc'} onChange={() => setSelected('date:desc')} />
                                <span>Дата — новые сверху</span>
                            </label>
                            <label className="inline-flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 cursor-pointer">
                                <input type="radio" name="sort" value="date:asc" checked={selected === 'date:asc'} onChange={() => setSelected('date:asc')} />
                                <span>Дата — старые сверху</span>
                            </label>

                            <div className="border-t my-1" />

                            <label className="inline-flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 cursor-pointer">
                                <input type="radio" name="sort" value="none" checked={selected === 'none'} onChange={() => setSelected('none')} />
                                <span>Без сортировки (по умолчанию)</span>
                            </label>
                        </fieldset>

                        <div className="mt-4 flex items-center justify-between gap-2">
                            <button type="button" onClick={() => { if (selected) applySelection(selected); }} className="flex-1 bg-[#0036A5] text-white px-4 py-2 rounded">Применить</button>
                            <button type="button" onClick={() => { setSelected('none'); const params = new URLSearchParams(window.location.search); params.delete('sort'); params.delete('dir'); const base = offerType === 'rent' ? '/rent-offers' : '/buy'; window.history.pushState({}, '', `${base}${params.toString() ? `?${params.toString()}` : ''}`); window.dispatchEvent(new PopStateEvent('popstate')); onClose(); }} className="flex-1 border border-gray-200 px-4 py-2 rounded">Сброс</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

type FilterType = 'list' | 'map';

const BuyMap = dynamic(() => import('./BuyMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[100vh] rounded-[22px] bg-gray-100 animate-pulse my-10"/>
    ),
});

const tabOptions = [
    {key: 'list', label: 'Список'},
    {key: 'map', label: 'На карте'},
] as const;

export const BuyContent: FC<{ offer_type_props?: string }> = ({offer_type_props = 'sale'}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<FilterType>('list');
    const [isAllFiltersOpen, setIsAllFiltersOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const {data: propertyTypesList} = useGetPropertyTypesQuery();
    const formattedInitialFilters = useMemo(
        () => ({
            propertyTypes: searchParams.get('propertyTypes')?.split(',') || undefined,
            apartmentTypes:
                searchParams.get('apartmentTypes')?.split(',') || undefined,
            cities: searchParams.get('cities')?.split(',') || undefined,
            districts: searchParams.get('districts')?.split(',') || undefined,
            repairs: searchParams.get('repairs')?.split(',') || undefined,
            priceFrom: searchParams.get('priceFrom') || undefined,
            priceTo: searchParams.get('priceTo') || undefined,
            roomsFrom: searchParams.get('roomsFrom') || undefined,
            roomsTo: searchParams.get('roomsTo') || undefined,
            areaFrom: searchParams.get('areaFrom') || undefined,
            areaTo: searchParams.get('areaTo') || undefined,
            floorFrom: searchParams.get('floorFrom') || undefined,
            floorTo: searchParams.get('floorTo') || undefined,
            landmark: searchParams.get('landmark') || undefined,
            sort: searchParams.get('sort') || undefined,
            dir: searchParams.get('dir') || undefined,
        }),
        [searchParams]
    );

    const filters = {
        priceFrom: searchParams.get('priceFrom') || undefined,
        priceTo: searchParams.get('priceTo') || undefined,
        city: searchParams.get('cities') || undefined,
        repair_type_id: searchParams.get('repairs') || undefined,
        type_id: searchParams.get('propertyTypes') || '',
        roomsFrom: searchParams.get('roomsFrom') || undefined,
        roomsTo: searchParams.get('roomsTo') || undefined,
        districts: searchParams.get('districts') || undefined,
        areaFrom: searchParams.get('areaFrom') || undefined,
        areaTo: searchParams.get('areaTo') || undefined,
        floorFrom: searchParams.get('floorFrom') || undefined,
        floorTo: searchParams.get('floorTo') || undefined,
        landmark: searchParams.get('landmark') || undefined,
        sort: searchParams.get('sort') || 'listing_type',
        dir: searchParams.get('dir') || 'desc',
        listing_type: '',
        offer_type: offer_type_props,
    };

    const {
        data: propertiesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isFetching,
    } = useGetPropertiesInfiniteQuery(filters);

    const [roomCategories, setRoomCategories] = useState([
        {label: '1 комнатные', count: '...', value: '1', isLoading: true},
        {label: '2 комнатные', count: '...', value: '2', isLoading: true},
        {label: '3 комнатные', count: '...', value: '3', isLoading: true},
        {label: '4 комнатные', count: '...', value: '4', isLoading: true},
        {label: '5 комнатные', count: '...', value: '5', isLoading: true},
    ]);

    const {data: oneRoom} = useGetPropertiesInfiniteQuery({
        ...filters,
        roomsFrom: '1',
        roomsTo: '1',
        per_page: 1000,
    });

    const {data: twoRooms} = useGetPropertiesInfiniteQuery({
        ...filters,
        roomsFrom: '2',
        roomsTo: '2',
        per_page: 1000,
    });

    const {data: threeRooms} = useGetPropertiesInfiniteQuery({
        ...filters,
        roomsFrom: '3',
        roomsTo: '3',
        per_page: 1000,
    });

    const {data: fourRooms} = useGetPropertiesInfiniteQuery({
        ...filters,
        roomsFrom: '4',
        roomsTo: '4',
        per_page: 1000,
    });

    const {data: fiveRooms} = useGetPropertiesInfiniteQuery({
        ...filters,
        roomsFrom: '5',
        roomsTo: '5',
        per_page: 1000,
    });

    const selectedTypeNames = useMemo(() => {
        const idsParam = searchParams.get('propertyTypes');
        if (!idsParam || !propertyTypesList) return null;

        const ids = idsParam.split(',').map((n) => Number(n)).filter(Boolean);
        const names = propertyTypesList
            .filter((t) => ids.includes(t.id))
            .map((t) => t.name);

        if (names.length === 0) return null;
        if (names.length === 1) return names[0];
        if (names.length === 2) return `${names[0]} и ${names[1]}`;
        return `${names[0]} и ещё ${names.length - 1}`;
    }, [searchParams, propertyTypesList]);

    useEffect(() => {
        const updatedCategories = [...roomCategories];

        if (oneRoom) {
            updatedCategories[0] = {
                ...updatedCategories[0],
                count: oneRoom.pages[0].total.toString(),
                isLoading: false,
            };
        }

        if (twoRooms) {
            updatedCategories[1] = {
                ...updatedCategories[1],
                count: twoRooms.pages[0].total.toString(),
                isLoading: false,
            };
        }

        if (threeRooms) {
            updatedCategories[2] = {
                ...updatedCategories[2],
                count: threeRooms.pages[0].total.toString(),
                isLoading: false,
            };
        }

        if (fourRooms) {
            updatedCategories[3] = {
                ...updatedCategories[3],
                count: fourRooms.pages[0].total.toString(),
                isLoading: false,
            };
        }

        if (fiveRooms) {
            updatedCategories[4] = {
                ...updatedCategories[4],
                count: fiveRooms.pages[0].total.toString(),
                isLoading: false,
            };
        }

        setRoomCategories(updatedCategories);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oneRoom, twoRooms, threeRooms, fourRooms, fiveRooms]);

    const properties = useMemo(
        () => propertiesData?.pages.flatMap((page) => page.data) || [],
        [propertiesData]
    );

    const propertiesForBuy = {
        data: properties,
        current_page: 1,
        last_page:
            propertiesData?.pages[propertiesData.pages.length - 1]?.last_page || 1,
        per_page: 10,
        total:
            propertiesData?.pages[propertiesData.pages.length - 1]?.total ||
            properties.length,
        from: 1,
        to: properties.length,
        first_page_url: '',
        last_page_url: '',
        links: [],
        next_page_url: hasNextPage ? 'next' : null,
        path: '',
        prev_page_url: null,
    };

    const [selectedRooms, setSelectedRooms] = useState<string[]>(() => {
        const roomsFrom = searchParams.get('roomsFrom');
        const roomsTo = searchParams.get('roomsTo');

        if (roomsFrom && roomsTo) {
            const minRoom = parseInt(roomsFrom, 10);
            const maxRoom = parseInt(roomsTo, 10);

            if (!isNaN(minRoom) && !isNaN(maxRoom)) {
                const selectedRoomValues = [];
                for (let i = minRoom; i <= maxRoom; i++) {
                    selectedRoomValues.push(i.toString());
                }
                return selectedRoomValues;
            } else if (roomsFrom === roomsTo) {
                return [roomsFrom];
            }
        }
        return [];
    });

    const handleRoomFilterClick = (roomValue: string) => {
        const newSelectedRooms = [...selectedRooms];
        const roomIndex = newSelectedRooms.indexOf(roomValue);

        if (roomIndex > -1) {
            newSelectedRooms.splice(roomIndex, 1);
        } else {
            newSelectedRooms.push(roomValue);
        }

        setSelectedRooms(newSelectedRooms);

        const params = new URLSearchParams(searchParams.toString());

        if (newSelectedRooms.length === 0) {
            params.delete('roomsFrom');
            params.delete('roomsTo');
        } else {
            const roomValues = newSelectedRooms.map((r) => parseInt(r, 10));
            const minRoom = Math.min(...roomValues);
            const maxRoom = Math.max(...roomValues);

            params.set('roomsFrom', minRoom.toString());
            params.set('roomsTo', maxRoom.toString());
        }

        router.push(`${offer_type_props === 'rent' ? '/rent-offers' : '/buy'}?${params.toString()}`);
    };

    const handleAdvancedSearch = (filters: PropertyFilters) => {
        // Start from current URL params so we preserve existing sort/dir and any other params
        const params = new URLSearchParams(window.location.search);

        // Apply/overwrite filter values from the form. If a value is empty/falsey, remove it.
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== '' && value !== '0') {
                params.set(key, value as string);
            } else {
                params.delete(key);
            }
        });

        // Keep existing sort/dir in params (we didn't touch them above)
        const queryString = params.toString();
        router.push(`${offer_type_props === 'rent' ? '/rent-offers' : '/buy'}${queryString ? `?${queryString}` : ''}`);
        setIsAllFiltersOpen(false);
    };

    useEffect(() => {
        if (activeFilter !== 'list') return;
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 1000 &&
                hasNextPage &&
                !isFetching
            ) {
                fetchNextPage();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchNextPage, hasNextPage, isFetching, activeFilter]);

    // Reload / reapply filters when sort/dir query params change.
    // We store previous values to avoid calling repeatedly.
    const prevSortRef = useRef<string | null>(null);
    const prevDirRef = useRef<string | null>(null);

    useEffect(() => {
        const currentSort = searchParams.get('sort');
        const currentDir = searchParams.get('dir') || 'desc';

        // if no change — do nothing
        if (prevSortRef.current === currentSort && prevDirRef.current === currentDir) return;

        // update prev values
        prevSortRef.current = currentSort;
        prevDirRef.current = currentDir;

        // call handleAdvancedSearch to reapply current filters together with new sort
        // formattedInitialFilters comes from searchParams and represents current filter state
        try {
            handleAdvancedSearch(filters);
        } catch {
            // fallback — refresh router
            router.refresh();
        }
    }, [searchParams.toString()]);

    return (
        <div className="mb-[60px] relative">
            <div
                className={clsx(
                    ' mx-auto w-full max-w-[1520px]  px-4 sm:px-6 lg:px-8 z-5 relative',
                    isAllFiltersOpen && 'rounded-b-none',
                    activeFilter === 'map' ? 'mt-2' : 'mt-8'
                )}
            >
                <div className={`rounded-[22px] ${activeFilter === 'map' ? 'bg-transparent p-2' : 'bg-white p-6'}`}>
                    <div className={`flex flex-col md:flex-row items-start md:items-center ${activeFilter === 'map' ? 'justify-end' : 'justify-between'}`}>
                        <div className={`${activeFilter === 'map' ? 'hidden' : ''}`}>
                            <h1 className="text-2xl font-bold text-[#020617] mb-1">
                                {selectedTypeNames ? `${offer_type_props === 'rent' ? 'Аренда' : 'Купить'}: ${selectedTypeNames}` : `${offer_type_props === 'rent' ? 'Аренда недвижимости' : 'Купить недвижимость'}`}
                            </h1>
                            <p className="text-[#666F8D]">
                                {isLoading
                                    ? 'Загрузка объявлений...'
                                    : `Найдено ${propertiesForBuy.total || 0} объектов`}
                            </p>
                        </div>

                        <div
                            className={`md:flex items-center gap-4  md:mt-0 w-full md:w-auto  ${activeFilter === 'map' ? 'flex' : 'mt-4'}`}>
                            <div className="relative">
                                <button
                                    onClick={() => setIsSortOpen(true)}
                                    className={`flex items-center justify-center gap-2 bg-[#F0F2F5] hover:bg-gray-200 p-4 rounded-full  mb-4 md:mb-0 w-full md:w-auto cursor-pointer ${activeFilter === 'map' ? 'hidden' : ''}`}
                                >
                                    <ArrowUpWideNarrow className="h-6 w-6 text-[#0036A5]"/>
                                    <span>Сортировка</span>
                                </button>
                                <SortPopup isOpen={isSortOpen} onClose={() => setIsSortOpen(false)}
                                           offerType={offer_type_props}/>
                            </div>
                            <button
                                onClick={() => setIsAllFiltersOpen(!isAllFiltersOpen)}
                                className={clsx(
                                    'flex items-center justify-center gap-2 bg-[#F0F2F5] hover:bg-gray-200  rounded-full   cursor-pointer transition-all duration-300',
                                    activeFilter === 'map'
                                        ? ' shadow-lg w-[60px] h-[60px] p-0 !rounded-full justify-center items-center '
                                        : 'w-full md:w-auto p-4 mb-4 md:mb-0'
                                )}
                            >
                                <ListFilterPlus
                                    className={clsx(
                                        'text-[#0036A5] transition-transform duration-300',
                                        activeFilter === 'map' ? 'h-4 w-4' : 'h-6 w-6'
                                    )}
                                />
                                <span className={clsx(activeFilter === 'map' && 'hidden')}>Все фильтры</span>
                            </button>

                            <Tabs
                                tabs={tabOptions}
                                activeType={activeFilter}
                                setActiveType={setActiveFilter}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="container px-0 mb-6 ">
                <AllFilters
                    isOpen={isAllFiltersOpen}
                    onClose={() => setIsAllFiltersOpen(false)}
                    onSearch={handleAdvancedSearch}
                    initialFilters={formattedInitialFilters}
                    propertyTypes={propertyTypesList ?? []}
                />
            </div>

            {/* Room filter chips */}
            <div className="mt-4 mb-6 container px-0">
                <div className="overflow-x-auto hide-scrollbar">
                    <div className="flex gap-2 py-2">
                        {roomCategories.map((category, index) => {
                            const isSelected = selectedRooms.includes(category.value);
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleRoomFilterClick(category.value)}
                                    className={`cursor-pointer shrink-0 whitespace-nowrap px-6 py-3 rounded-full transition-all ${
                                        isSelected
                                            ? 'bg-[#0036A5] text-white border border-[#0036A5]'
                                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="font-medium">{category.label}</span>
                                    <span
                                        className={`ml-1 ${
                                            isSelected ? 'text-white' : 'text-[#666F8D]'
                                        }`}
                                    >
                    {category.isLoading ? '...' : category.count}
                  </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Property listings */}
            {activeFilter === 'list' ? (
                <>
                    <Buy
                        properties={propertiesForBuy}
                        hasTitle={false}
                        isLoading={isLoading}
                    />
                    {/* Inline ad slot between listings */}
                    <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
                        <div className="my-6">
                            <AdBanner data-ad-slot="5085881730" data-ad-format="auto"
                                      data-full-width-responsive="true"/>
                        </div>
                    </div>
                    {isFetchingNextPage && (
                        <section>
                            <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[30px] my-8">
                                    {Array.from({length: 4}).map((_, index) => (
                                        <BuyCardSkeleton key={`loading-${index}`}/>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                    {!hasNextPage && properties.length > 0 && (
                        <div className="text-center py-4 text-gray-500">
                            Больше объявлений нет
                        </div>
                    )}
                </>
            ) :    (
                // Map view
                <div className='h-[70vh]'>
                    <div className="mx-auto w-full h-[80vh] absolute top-[-10px] sm:top-[-10px] z-1 pb-[800px]">
                        <BuyMap items={properties} baseFilters={filters}/>
                    </div>
                </div>
            )}
        </div>
    );
};
