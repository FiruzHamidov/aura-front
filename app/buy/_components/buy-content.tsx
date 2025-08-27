'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Buy from '@/app/_components/buy/buy';
import { useGetPropertiesInfiniteQuery } from '@/services/properties/hooks';
import { Tabs } from '@/ui-components/tabs/tabs';
import BuyCardSkeleton from '@/ui-components/BuyCardSkeleton';

type FilterType = 'list' | 'map';

export const BuyContent = () => {
  const searchParams = useSearchParams();

  const [activeFilter, setActiveFilter] = useState<FilterType>('list');

  const filters = {
    priceFrom: searchParams.get('priceFrom') || undefined,
    priceTo: searchParams.get('priceTo') || undefined,
    city: searchParams.get('city') || undefined,
    repairType: searchParams.get('repairType') || undefined,
    type_id: searchParams.get('propertyType') || undefined,
    roomsFrom: searchParams.get('roomsFrom') || undefined,
    roomsTo: searchParams.get('roomsTo') || undefined,
    district: searchParams.get('district') || undefined,
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

  const properties = propertiesData?.pages.flatMap((page) => page.data) || [];

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
  }, [fetchNextPage, hasNextPage, isFetching]);

  if (isLoading) {
    return (
      <div className="mb-[60px]">
        <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[22px] p-[30px] my-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-2xl font-bold text-[#020617] mb-1">
                  Купить квартиру вторичка
                </h1>
                <p className="text-[#666F8D]">Загрузка объявлений...</p>
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

          {/* Skeleton grid */}
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
      </div>
    );
  }

  return (
    <div className="mb-[60px]">
      <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[22px] p-[30px] my-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#020617] mb-1">
                Купить квартиру вторичка
              </h1>
              <p className="text-[#666F8D]">
                Найдено {propertiesForBuy.total} объекта
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

      <Buy
        properties={propertiesForBuy}
        hasTitle={false}
        isLoading={isLoading}
      />

      {/* Loading more skeleton cards */}
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
        <div className="text-center py-4 text-gray-500">
          Больше объявлений нет
        </div>
      )}
    </div>
  );
};
