'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import FilterSearchIcon from '@/icons/FilterSearchIcon';
import { SelectInput } from '@/ui-components/SelectInput';
import { AllFilters } from './filters';
import { PropertyFilters } from '@/services/properties/types';

interface Option {
  id: string | number;
  name: string;
  unavailable?: boolean;
}

type ActiveTab =
  | 'buy'
  | 'rent'
  | 'to_rent'
  | 'to_rent_out'
  | 'map'
  | 'evaluate'
  | 'fast_buy';

const propertyTypes: Option[] = [
  { id: 'apartment', name: 'Квартира' },
  { id: 'house', name: 'Дом' },
  { id: 'commercial', name: 'Коммерческая' },
  { id: 'land', name: 'Земельный участок' },
];

const roomOptions: Option[] = [
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4+', name: '4+' },
  { id: 'studio', name: 'Студия' },
];

export const MainBanner: FC<{ title: string }> = ({ title }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('buy');
  const [propertyType, setPropertyType] = useState('');
  const [rooms, setRooms] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  const [showPriceRange, setShowPriceRange] = useState(false);
  const [isAllFiltersOpen, setIsAllFiltersOpen] = useState(false);

  const handleSearch = () => {
    const searchParams = new URLSearchParams();

    if (propertyType) searchParams.append('propertyType', propertyType);
    if (rooms) searchParams.append('rooms', rooms);
    if (priceFrom) searchParams.append('priceFrom', priceFrom);
    if (priceTo) searchParams.append('priceTo', priceTo);

    const queryString = searchParams.toString();
    router.push(`/buy${queryString ? `?${queryString}` : ''}`);
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

  return (
    <div className="container relative py-8 md:py-10 md:pt-[22px] bg-gradient-to-b overflow-hidden ">
      <div
        className={clsx(
          'bg-white relative overflow-hidden z-0 rounded-[22px] px-4 sm:px-8 md:px-12 lg:px-[70px] py-6 sm:py-12 md:py-16 lg:py-[89px] bg-gradient-to-br from-[#0036a5] to-[#0058d4]',
          isAllFiltersOpen && 'rounded-b-none'
        )}
      >
        <Image
          src="/images/banner/building.png"
          alt="Building"
          width={695}
          height={695}
          className="absolute -right-12 z-0 top-0 opacity-[8%] z-[-1] pointer-events-none max-w-none"
        />
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-[60px]">
          <h1 className="text-xl md:text-[52px] font-extrabold text-white mb-1.5 tracking-tight uppercase transition-all duration-300 hover:scale-105 cursor-default">
            {title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white">
            ваш надежный партнер в сфере недвижимости Таджикистана
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
          {(
            [
              'buy',
              'rent',
              'to_rent',
              'to_rent_out',
              'map',
              'evaluate',
              'fast_buy',
            ] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-6 lg:px-9 py-2 sm:py-3 rounded-lg cursor-pointer transition-all duration-150 ease-in-out text-sm sm:text-base ${
                activeTab === tab
                  ? 'bg-[#FFDE2C] shadow-sm'
                  : 'bg-white text-gray-700 border border-[#CBD5E1] hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {tab === 'buy'
                ? 'Купить'
                : tab === 'rent'
                ? 'Продать'
                : tab === 'to_rent'
                ? 'Снять'
                : tab === 'to_rent_out'
                ? 'Сдать'
                : tab === 'map'
                ? 'На карте'
                : tab === 'evaluate'
                ? 'Оценить'
                : 'Cроч. выкуп'}
            </button>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">
            {/* Property Type */}
            <div className="sm:col-span-2 lg:col-span-1 lg:w-[273px]">
              <SelectInput
                value={propertyType}
                placeholder="Тип недвижимости"
                onChange={(value) => setPropertyType(value)}
                options={propertyTypes}
              />
            </div>

            {/* Rooms */}
            <div className="lg:w-[169px]">
              <SelectInput
                value={rooms}
                placeholder="Комнат"
                onChange={(value) => setRooms(value)}
                options={roomOptions}
              />
            </div>

            {/* Price Dropdown with expandable inputs */}
            <div className="lg:w-[241px] relative">
              <button
                onClick={() => setShowPriceRange(!showPriceRange)}
                className="w-full bg-white hover:bg-gray-50 px-4 py-3 rounded-lg text-left border border-gray-200 transition-colors flex items-center justify-between"
              >
                <span className="text-gray-500">
                  {priceFrom || priceTo
                    ? `${priceFrom || '0'} - ${priceTo || '∞'}`
                    : 'Цена'}
                </span>

                <svg
                  className={`w-4 h-4 transition-transform ${
                    showPriceRange ? 'rotate-180' : ''
                  }`}
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="#333"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Price Range Inputs - directly below */}
              {showPriceRange && (
                <div className="mt-2 grid grid-cols-2 gap-2 absolute">
                  <input
                    type="tel"
                    placeholder="От"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    className="px-3 py-2 border outline-0 border-gray-200 rounded-lg text-sm bg-white"
                  />
                  <input
                    type="tel"
                    placeholder="До"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    className="px-3 py-2 border outline-0 border-gray-200 rounded-lg text-sm bg-white"
                  />
                </div>
              )}
            </div>

            {/* Area Dropdown with expandable inputs */}
            {/* <div className="lg:w-[141px]">
              <button
                onClick={() => setShowAreaRange(!showAreaRange)}
                className="w-full bg-white hover:bg-gray-50 px-4 py-3 rounded-lg text-left border border-gray-200 transition-colors flex items-center justify-between"
              >
                <span className="text-gray-500">
                  {areaFrom || areaTo
                    ? `${areaFrom || '0'} - ${areaTo || '∞'} м²`
                    : 'Площадь'}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showAreaRange ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showAreaRange && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={areaFrom}
                    onChange={(e) => setAreaFrom(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={areaTo}
                    onChange={(e) => setAreaTo(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              )}
            </div> */}

            {/* All Filters Button */}
            <button
              className="sm:col-span-2 lg:col-span-1 lg:w-[197px] bg-[#F0F2F5] hover:bg-sky-100 text-slate-700 px-4 sm:px-6 lg:px-[25px] py-3 rounded-lg text-lg flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
              onClick={() => setIsAllFiltersOpen((prev) => !prev)}
            >
              <FilterSearchIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600" />
              <span>Все фильтры</span>
            </button>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="sm:col-span-2 lg:col-span-1 lg:w-[197px] cursor-pointer bg-[#FFDE2C] hover:bg-[#d9b90f] px-4 sm:px-6 lg:px-[71px] py-3 rounded-lg font-bold transition-all flex items-center justify-center"
            >
              Найти
            </button>
          </div>
        </div>
      </div>

      {/* All Filters Modal */}
      <AllFilters
        isOpen={isAllFiltersOpen}
        onClose={() => setIsAllFiltersOpen(false)}
        onSearch={handleAdvancedSearch}
      />
    </div>
  );
};
