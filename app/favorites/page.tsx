'use client';

import { useState } from 'react';
import { Listing } from '../_components/buy/types';
import SmallCard from '@/ui-components/small-card/small-card';

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
      <div className="bg-white rounded-full p-[30px] my-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#020617] mb-1">
              Избранное
            </h1>
            <p className="text-[#666F8D]">Найдено {objectsCount} объекта</p>
          </div>

          <div className="mt-4 md:mt-0 flex rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`rounded-full px-8 py-2 text-sm font-medium transition ${
                activeFilter === 'all'
                  ? 'bg-[#0036A5] text-white shadow'
                  : 'text-[#020617]'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setActiveFilter('sale')}
              className={`rounded-full px-8 py-2 text-sm font-medium transition ${
                activeFilter === 'sale'
                  ? 'bg-[#0036A5] text-white'
                  : 'text-[#020617]'
              }`}
            >
              Продажа
            </button>
            <button
              onClick={() => setActiveFilter('rent')}
              className={`rounded-full px-8 py-2 text-sm font-medium transition ${
                activeFilter === 'rent'
                  ? 'bg-[#0036A5] text-white'
                  : 'text-[#020617]'
              }`}
            >
              Аренда
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-[14px]">
        {favoritesListings.map((listing, index) => (
          <SmallCard key={listing.id} listing={listing} isLarge={index === 0} />
        ))}
      </div>
    </div>
  );
}
