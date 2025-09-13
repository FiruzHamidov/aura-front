'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Buy from '@/app/_components/buy/buy';
import { useGetPropertiesInfiniteQuery } from '@/services/properties/hooks';
import { Tabs } from '@/ui-components/tabs/tabs';
import BuyCardSkeleton from '@/ui-components/BuyCardSkeleton';
import dynamic from 'next/dynamic';

type FilterType = 'list' | 'map';

const BuyMap = dynamic(() => import('./BuyMap'), {
  ssr: false,
  loading: () => (
      <div className="h-[70vh] rounded-[22px] bg-gray-100 animate-pulse my-10" />
  ),
});

export const BuyContent = () => {
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<FilterType>('list');

  const filters = {
    priceFrom: searchParams.get('priceFrom') || undefined,
    priceTo: searchParams.get('priceTo') || undefined,
    city: searchParams.get('cities') || undefined,
    repairType: searchParams.get('repairs') || undefined,
    type_id: searchParams.get('apartmentTypes') || undefined,
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

  // Шапка с табами — общая
  const Header = (
      <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[22px] p-[30px] my-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#020617] mb-1">
                Купить квартиру
              </h1>
              <p className="text-[#666F8D]">
                {isLoading ? 'Загрузка объявлений...' : `Найдено ${propertiesForBuy.total} объекта`}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Tabs
                  tabs={[
                    { key: 'list', label: 'Списком' },
                    { key: 'map', label: 'На карте' },
                  ]}
                  activeType={activeFilter}
                  setActiveType={setActiveFilter}
              />
            </div>
          </div>
        </div>
      </div>
  );

  if (isLoading) {
    return (
        <div className="mb-[60px]">
          {Header}
          <section>
            <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-[30px]">
                {Array.from({ length: 8 }).map((_, index) => (
                    <BuyCardSkeleton key={index} />
                ))}
              </div>
            </div>
          </section>
        </div>
    );
  }

  return (
      <div className="mb-[60px]">
        {Header}

        {activeFilter === 'list' ? (
            <>
              <Buy properties={propertiesForBuy} hasTitle={false} isLoading={isLoading} />
              {isFetchingNextPage && (
                  <section>
                    <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-[30px] mb-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <BuyCardSkeleton key={`loading-${index}`} />
                        ))}
                      </div>
                    </div>
                  </section>
              )}
              {!hasNextPage && properties.length > 0 && (
                  <div className="text-center py-4 text-gray-500">Больше объявлений нет</div>
              )}
            </>
        ) : (
            // ⬇️ режим "На карте"
            <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
              <BuyMap items={properties} />
            </div>
        )}
      </div>
  );
};