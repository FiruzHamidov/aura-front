'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import Buy from '@/app/_components/buy/buy';
import { useGetPropertiesInfiniteQuery } from '@/services/properties/hooks';
import FilterSearchIcon from '@/icons/FilterSearchIcon';
import { AllFilters } from '@/app/_components/filters';
import { PropertyFilters } from '@/services/properties/types';
import BuyCardSkeleton from '@/ui-components/BuyCardSkeleton';
import { Tabs } from '@/ui-components/tabs/tabs';

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

  const formattedInitialFilters = {
    propertyTypes: searchParams.get('propertyTypes')?.split(',') || undefined,
    apartmentTypes: searchParams.get('apartmentTypes')?.split(',') || undefined,
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
  };

  const filters = {
    priceFrom: searchParams.get('priceFrom') || undefined,
    priceTo: searchParams.get('priceTo') || undefined,
    city: searchParams.get('cities') || undefined,
    repair_type_id: searchParams.get('repairs') || undefined,
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

  const [roomCategories, setRoomCategories] = useState([
    { label: '1 комнатные', count: '...', value: '1', isLoading: true },
    { label: '2 комнатные', count: '...', value: '2', isLoading: true },
    { label: '3 комнатные', count: '...', value: '3', isLoading: true },
    { label: '4 комнатные', count: '...', value: '4', isLoading: true },
    { label: '5 комнатные', count: '...', value: '5', isLoading: true },
  ]);

  const { data: oneRoom } = useGetPropertiesInfiniteQuery({
    ...filters,
    roomsFrom: '1',
    roomsTo: '1',
    per_page: 1000,
  });

  const { data: twoRooms } = useGetPropertiesInfiniteQuery({
    ...filters,
    roomsFrom: '2',
    roomsTo: '2',
    per_page: 1000,
  });

  const { data: threeRooms } = useGetPropertiesInfiniteQuery({
    ...filters,
    roomsFrom: '3',
    roomsTo: '3',
    per_page: 1000,
  });

  const { data: fourRooms } = useGetPropertiesInfiniteQuery({
    ...filters,
    roomsFrom: '4',
    roomsTo: '4',
    per_page: 1000,
  });

  const { data: fiveRooms } = useGetPropertiesInfiniteQuery({
    ...filters,
    roomsFrom: '5',
    roomsTo: '5',
    per_page: 1000,
  });

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

    router.push(`/buy?${params.toString()}`);
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
      <div
        className={clsx(
          'bg-white rounded-[22px] container mt-8',
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

            <div className="md:flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto [&>div]:w-full md:[&>div]:w-auto">
              <button
                onClick={() => setIsAllFiltersOpen(true)}
                className="flex items-center gap-2 bg-[#F0F2F5] hover:bg-gray-200 px-[19px] py-[21px] rounded-full mr-[18px] mb-4 md:mb-0 w-full md:w-auto"
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
      <div className="container px-0 mb-6">
        <AllFilters
          isOpen={isAllFiltersOpen}
          onClose={() => setIsAllFiltersOpen(false)}
          onSearch={handleAdvancedSearch}
          initialFilters={formattedInitialFilters}
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
