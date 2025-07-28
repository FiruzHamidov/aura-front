'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Buy from '@/app/_components/buy/buy';
import { useGetPropertiesQuery } from '@/services/properties/hooks';
import { Tabs } from '@/ui-components/tabs/tabs';

type FilterType = 'list' | 'map';

export const BuyContent = () => {
  const searchParams = useSearchParams();

  const [activeFilter, setActiveFilter] = useState<FilterType>('list');

  const filters = {
    priceFrom: searchParams.get('priceFrom') || undefined,
    priceTo: searchParams.get('priceTo') || undefined,
    city: searchParams.get('city') || undefined,
    repairType: searchParams.get('repairType') || undefined,
    propertyType: searchParams.get('propertyType') || undefined,
    rooms: searchParams.get('rooms') || undefined,
    district: searchParams.get('district') || undefined,
    areaFrom: searchParams.get('areaFrom') || undefined,
    areaTo: searchParams.get('areaTo') || undefined,
    floorFrom: searchParams.get('floorFrom') || undefined,
    floorTo: searchParams.get('floorTo') || undefined,
    listing_type: 'regular',
  };

  const { data: properties, isLoading } = useGetPropertiesQuery(filters);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mb-[60px]">
      <div className="container">
        <div className="bg-white rounded-[22px] p-[30px] my-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#020617] mb-1">
                Купить квартиру вторичка
              </h1>
              <p className="text-[#666F8D]">
                Найдено {properties?.data.length} объекта
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
      <Buy properties={properties} hasTitle={false} />;
    </div>
  );
};
