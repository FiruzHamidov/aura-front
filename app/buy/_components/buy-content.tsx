'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Buy from '@/app/_components/buy/buy';
import { useGetPropertiesInfiniteQuery } from '@/services/properties/hooks';
import dynamic from 'next/dynamic';
import FilterSearchIcon from '@/icons/FilterSearchIcon';
import { AllFilters } from '@/app/_components/filters';
import { PropertyFilters } from '@/services/properties/types';
import BuyCardSkeleton from '@/ui-components/BuyCardSkeleton';
import { Tabs } from '@/ui-components/tabs/tabs';
import clsx from 'clsx';

type FilterType = 'list' | 'map';

const BuyMap = dynamic(() => import('./BuyMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[70vh] rounded-[22px] bg-gray-100 animate-pulse my-10" />
  ),
});

const tabOptions = [
  { key: 'list', label: 'Список' },
  { key: 'map', label: 'На карте' },
] as const;

export const BuyContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('list');
  const [isAllFiltersOpen, setIsAllFiltersOpen] = useState(false);

  // Room categories for quick filters
  const roomCategories = [
    { label: 'Студии', count: 20, value: '0' },
    { label: '1 комнатные', count: 110, value: '1' },
    { label: '2 комнатные', count: 321, value: '2' },
    { label: '3 комнатные', count: 444, value: '3' },
    { label: '4 комнатные', count: 68, value: '4' },
    { label: '5 комнатные', count: 22, value: '5' },
  ];

  const filters = {
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

  const {
    data: propertiesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useGetPropertiesInfiniteQuery(filters);

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

  const handleRoomFilterClick = (roomValue: string) => {
    if (roomValue === '0') {
      // For studio apartments set roomsFrom and roomsTo to 0
      router.push(`/buy?roomsFrom=0&roomsTo=0`);
    } else {
      // For other rooms set exact value
      router.push(`/buy?roomsFrom=${roomValue}&roomsTo=${roomValue}`);
    }
  };

  const handleAdvancedSearch = (filters: PropertyFilters) => {
    const searchParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== '0') {
        searchParams.append(key, value as string);
      }
    });

    const queryString = searchParams.toString();
    router.push(`/buy${queryString ? `?${queryString}` : ''}`);
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

  return (
    <div className="mb-[60px]">
      {/* Header with filter buttons - Styled like in the image */}
      <div
        className={clsx(
          'bg-white rounded-[22px] mx-auto w-full max-w-[1520px] mt-8',
          isAllFiltersOpen && 'rounded-b-none'
        )}
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#020617] mb-1">
                Купить квартиру вторичка
              </h1>
              <p className="text-[#666F8D]">
                {isLoading
                  ? 'Загрузка объявлений...'
                  : `Найдено ${propertiesForBuy.total || 750} объектов`}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <button
                onClick={() => setIsAllFiltersOpen(true)}
                className="flex items-center gap-2 bg-[#F0F2F5] hover:bg-gray-200 px-[19px] py-[21px] rounded-full mr-[18px]"
              >
                <FilterSearchIcon className="h-6 w-6 text-[#0036A5]" />
                <span>Все фильтры</span>
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
      <div className="mx-auto w-full max-w-[1520px] mb-6">
        <AllFilters
          isOpen={isAllFiltersOpen}
          onClose={() => setIsAllFiltersOpen(false)}
          onSearch={handleAdvancedSearch}
        />
      </div>

      {/* Room filter chips */}
      <div className="mx-auto w-full max-w-[1520px] mt-4 mb-6">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 py-2">
            {roomCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleRoomFilterClick(category.value)}
                className="shrink-0 whitespace-nowrap px-6 py-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-all"
              >
                <span className="font-medium">{category.label}</span>
                <span className="ml-1 text-[#666F8D]">{category.count}</span>
              </button>
            ))}
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
          {isFetchingNextPage && (
            <section>
              <div className="mx-auto w-full max-w-[1520px]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-[30px] mb-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <BuyCardSkeleton key={`loading-${index}`} />
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
      ) : (
        // Map view
        <div className="mx-auto w-full max-w-[1520px]">
          <BuyMap items={properties} />
        </div>
      )}
    </div>
  );
};
