'use client';

import { FC, useState } from 'react';
import clsx from 'clsx';
import { Field, Label, Select } from '@headlessui/react';
import ChevronDownIcon from '@/icons/ChevronDownIcon';
import FilterSearchIcon from '@/icons/FilterSearchIcon';

type ActiveTab = 'buy' | 'rent' | 'sell';

interface Option {
  id: string | number;
  name: string;
  unavailable?: boolean;
}

const propertyTypes: Option[] = [
  { id: 'placeholder', name: 'Тип недвижимости', unavailable: true },
  { id: 'apartment', name: 'Квартира' },
  { id: 'house', name: 'Дом' },
  { id: 'commercial', name: 'Коммерческая' },
  { id: 'land', name: 'Земля' },
];

const roomOptions: Option[] = [
  { id: 'placeholder', name: 'Комнат', unavailable: true },
  { id: '1', name: '1 комната' },
  { id: '2', name: '2 комнаты' },
  { id: '3', name: '3 комнаты' },
  { id: '4+', name: '4+ комнаты' },
  { id: 'studio', name: 'Студия' },
];

const priceOptions: Option[] = [
  { id: 'placeholder', name: 'Цена', unavailable: true },
  { id: '0-50k', name: 'до 50 000 TJS' },
  { id: '50k-100k', name: '50 000 - 100 000 TJS' },
  { id: '100k-200k', name: '100 000 - 200 000 TJS' },
  { id: '200k+', name: 'от 200 000 TJS' },
];

const getSelectClasses = (hasValue: boolean): string => {
  return clsx(
    'block w-full appearance-none rounded-lg bg-sky-100/70 py-5 pl-4 pr-10 text-left text-sm',
    'border-none',
    hasValue ? 'text-slate-700' : 'text-gray-500',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60',
    'hover:bg-sky-100 transition-colors cursor-pointer',

    '[&>option]:text-gray-800 [&>option]:bg-white'
  );
};

const HeroSearch: FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('buy');

  const [propertyType, setPropertyType] = useState('');
  const [rooms, setRooms] = useState('');
  const [price, setPrice] = useState('');

  return (
    <div className="relative py-16 sm:py-20 md:py-5 bg-gradient-to-b overflow-hidden">
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="bg-white rounded-[22px] shadow-lg px-[70px] py-[93px]">
          <div className="text-center mb-6 md:mb-[60px]">
            <h1 className="text-2xl sm:text-3xl md:text-[52px] font-extrabold text-[#0036A5] mb-1.5 tracking-tight">
              НЕДВИЖИМОСТЬ В ТАДЖИКИСТАНЕ
            </h1>
            <p className="sm:text-2xl text-[#353E5C]">
              ваш надежный партнер в сфере недвижимости в Таджикистане
            </p>
          </div>

          <div className="flex space-x-2 mb-6 md:mb-8">
            {(['buy', 'rent', 'sell'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-9 py-3 rounded-lg  cursor-pointer transition-all duration-150 ease-in-out ${
                  activeTab === tab
                    ? 'bg-[#0036A5] text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-[#CBD5E1] hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                {tab === 'buy'
                  ? 'Купить'
                  : tab === 'rent'
                  ? 'Аренда'
                  : 'Продать'}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Field className="flex-grow basis-full sm:basis-1/4 md:basis-auto">
              <Label className="sr-only">Тип недвижимости</Label>{' '}
              <div className="relative">
                {' '}
                <Select
                  name="propertyType"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className={getSelectClasses(!!propertyType)}
                >
                  {propertyTypes.map((option) => (
                    <option
                      key={option.id}
                      value={option.id === 'placeholder' ? '' : option.id}
                      disabled={option.unavailable}
                      className={option.unavailable ? 'text-gray-500' : ''}
                    >
                      {option.name}
                    </option>
                  ))}
                </Select>
                <ChevronDownIcon
                  className="group pointer-events-none absolute top-5 right-2.5 w-5 h-5 fill-gray-500"
                  aria-hidden="true"
                />
              </div>
            </Field>

            <Field className="flex-grow basis-full sm:basis-1/4 md:basis-auto">
              <Label className="sr-only">Комнат</Label>
              <div className="relative">
                <Select
                  name="rooms"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  className={getSelectClasses(!!rooms)}
                >
                  {roomOptions.map((option) => (
                    <option
                      key={option.id}
                      value={option.id === 'placeholder' ? '' : option.id}
                      disabled={option.unavailable}
                      className={option.unavailable ? 'text-gray-500' : ''}
                    >
                      {option.name}
                    </option>
                  ))}
                </Select>
                <ChevronDownIcon
                  className="group pointer-events-none absolute top-5 right-2.5 size-5 fill-gray-500"
                  aria-hidden="true"
                />
              </div>
            </Field>

            <Field className="flex-grow basis-full sm:basis-1/4 md:basis-auto">
              <Label className="sr-only">Цена</Label>
              <div className="relative">
                <Select
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={getSelectClasses(!!price)}
                >
                  {priceOptions.map((option) => (
                    <option
                      key={option.id}
                      value={option.id === 'placeholder' ? '' : option.id}
                      disabled={option.unavailable}
                      className={option.unavailable ? 'text-gray-500' : ''}
                    >
                      {option.name}
                    </option>
                  ))}
                </Select>
                <ChevronDownIcon
                  className="group pointer-events-none absolute top-5 right-2.5 size-5 fill-gray-500"
                  aria-hidden="true"
                />
              </div>
            </Field>

            <button className="flex-grow basis-full sm:basis-1/4 md:basis-auto bg-sky-100/70 hover:bg-sky-100 text-slate-700 px-7 py-5 rounded-lg text-sm flex items-center justify-center sm:justify-start w-full sm:w-auto transition-colors">
              <FilterSearchIcon className="h-6 w-6 mr-2 text-blue-600" />
              <span>Все фильтры</span>
            </button>

            <button className="flex-grow cursor-pointer basis-full sm:basis-auto bg-[#0036A5] hover:bg-blue-800 text-white px-[71px] py-5 rounded-lg font-bold w-full sm:w-auto transition-colors justify-center">
              Найти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;
