'use client';

import { useState } from 'react';
import { Listing } from '../_components/buy/types';
import { Tabs } from '@/ui-components/tabs/tabs';
import BuyCard from '../_components/buy/buy-card';

type FilterType = 'all' | 'sale' | 'rent';

const favoritesListings: Listing[] = [
  {
    id: 1,
    images: [
      {
        url: '/images/buy/1.png',
        alt: 'Современная спальня с деревянными панелями 1',
      },
      {
        url: '/images/buy/2.jpeg',
        alt: 'Современная спальня с деревянными панелями 2',
      },
      {
        url: '/images/buy/3.jpeg',
        alt: 'Современная спальня с деревянными панелями 3',
      },
    ],
    price: 432000,
    currency: 'с.',
    title: '2-комн. квартира, 9 этаж, 78 м²',
    locationName: 'Фирдавси',
    description: 'Зеленый базар',
    roomCountLabel: '2-ком',
    area: 78,
    floorInfo: '3/12 этаж',
    agent: {
      name: 'Мавзуна Шоева',
      role: 'топ-риелтор',
    },
    date: '22.10.2023',
  },
  {
    id: 2,
    images: [
      { url: '/images/buy/2.jpeg', alt: 'Квартира 2 изображение 1' },
      { url: '/images/buy/3.jpeg', alt: 'Квартира 2 изображение 2' },
      { url: '/images/buy/4.jpeg', alt: 'Квартира 2 изображение 3' },
    ],
    price: 333210,
    currency: 'с.',
    title: '1-комн. квартира, 1 этаж, 78 м²',
    locationName: 'Сино',
    description: 'Рынок Мехргон',
    roomCountLabel: '1-ком',
    area: 53,
    floorInfo: '1/12 этаж',
    agent: {
      name: 'Мавзуна Шоева',
      role: 'топ-риелтор',
    },
    date: '22.10.2023',
  },
];

export default function Favorites() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredListings =
    activeFilter === 'all'
      ? favoritesListings
      : favoritesListings.filter((listing) => listing.type === activeFilter);

  const objectsCount = filteredListings.length;

  return (
    <div className="container">
      <div className="bg-white rounded-[22px] p-[30px] my-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#020617] mb-1">
              Избранное
            </h1>
            <p className="text-[#666F8D]">Найдено {objectsCount} объекта</p>
          </div>

          <div className="mt-4 md:mt-0">
            <Tabs
              tabs={[
                { key: 'all', label: 'Все' },
                { key: 'sale', label: 'Продажа' },
                { key: 'rent', label: 'Аренда' },
              ]}
              activeType={activeFilter}
              setActiveType={setActiveFilter}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-[14px] mb-10 md:mb-16">
        {favoritesListings.map((listing, index) => (
          <BuyCard key={index} listing={listing} />
        ))}
      </div>
    </div>
  );
}
