'use client';

import { FC, useState } from 'react';
import { Listing } from './types';
import ListingCard from './listing-card';
import Link from 'next/link';
import { Tabs } from '@/ui-components/tabs/tabs';

type PropertyType = 'apartment' | 'house' | 'land' | 'commercial';

const sampleListings: Listing[] = [
  {
    id: 1,
    images: [
      {
        url: '/images/buy/big.png',
        alt: 'Современная спальня с деревянными панелями',
      },
      { url: '/images/buy/1.png', alt: 'Дополнительное фото 1' },
      { url: '/images/buy/2.jpeg', alt: 'Дополнительное фото 2' },
      { url: '/images/buy/3.jpeg', alt: 'Дополнительное фото 3' },
    ],
    isTop: true,
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
    type: 'apartment',
  },
  {
    id: 2,
    images: [
      { url: '/images/buy/1.png', alt: 'Квартира 2' },
      { url: '/images/buy/2.jpeg', alt: 'Дополнительное фото 1' },
      { url: '/images/buy/3.jpeg', alt: 'Дополнительное фото 2' },
      { url: '/images/buy/4.jpeg', alt: 'Дополнительное фото 3' },
    ],
    isTop: true,
    price: 333210,
    currency: 'с.',
    title: '1-комн. квартира, 1 этаж, 78 м²',
    locationName: 'Сино',
    description: 'Рынок Мехргон',
    roomCountLabel: '1-ком',
    area: 53,
    floorInfo: '1/12 этаж',
    type: 'apartment',
  },
  {
    id: 3,
    images: [
      { url: '/images/buy/2.jpeg', alt: 'Квартира 3' },
      { url: '/images/buy/3.jpeg', alt: 'Дополнительное фото 1' },
      { url: '/images/buy/4.jpeg', alt: 'Дополнительное фото 2' },
      { url: '/images/buy/5.jpeg', alt: 'Дополнительное фото 3' },
    ],
    isTop: true,
    price: 1000000,
    currency: 'с.',
    title: '4-комн. квартира, 4 этаж, 178 м²',
    locationName: 'Фирдавси',
    description: 'Профсоюз',
    roomCountLabel: '4-ком',
    area: 178,
    floorInfo: '4/16 этаж',
    type: 'apartment',
  },
  {
    id: 4,
    images: [
      { url: '/images/buy/3.jpeg', alt: 'Квартира 4' },
      { url: '/images/buy/4.jpeg', alt: 'Дополнительное фото 1' },
      { url: '/images/buy/5.jpeg', alt: 'Дополнительное фото 2' },
      { url: '/images/buy/6.jpeg', alt: 'Дополнительное фото 3' },
    ],
    isTop: true,
    price: 890000,
    currency: 'с.',
    title: '3-комн. квартира, 6 этаж, 100 м²',
    locationName: 'Фирдавси',
    description: 'Зеленый базар',
    roomCountLabel: '3-ком',
    area: 100,
    floorInfo: '6/12 этаж',
    type: 'apartment',
  },
  {
    id: 5,
    images: [
      { url: '/images/buy/4.jpeg', alt: 'Квартира 5' },
      { url: '/images/buy/5.jpeg', alt: 'Дополнительное фото 1' },
      { url: '/images/buy/6.jpeg', alt: 'Дополнительное фото 2' },
      { url: '/images/buy/7.jpeg', alt: 'Дополнительное фото 3' },
    ],
    isTop: true,
    price: 432000,
    currency: 'с.',
    title: '2-комн. квартира, 9 этаж, 78 м²',
    locationName: 'Фирдавси',
    description: 'Саховат базар',
    roomCountLabel: '2-ком',
    area: 78,
    floorInfo: '3/12 этаж',
    type: 'apartment',
  },
];

const tabOptions = [
  { key: 'apartment', label: 'Квартира' },
  { key: 'house', label: 'Дом' },
  { key: 'land', label: 'Земельный участок' },
  { key: 'commercial', label: 'Коммерческая' },
] as const;

const VipListings: FC<{ title?: string }> = ({ title = 'VIP объявления' }) => {
  const [activeType, setActiveType] = useState<PropertyType>('apartment');

  const filteredListings = sampleListings.filter(
    (listing) => !listing.type || listing.type === activeType
  );

  const firstListing = filteredListings[0];
  const smallListings = filteredListings.slice(1, 5);

  return (
    <section>
      <div className="container">
        <h2 className="text-2xl md:text-4xl font-bold text-[#020617] mb-6 md:mb-10">
          {title}
        </h2>
        <div className="mb-5 md:mb-8 overflow-auto">
          <Tabs
            hasBorder
            tabs={tabOptions}
            activeType={activeType}
            setActiveType={setActiveType}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {firstListing && (
            <div className="md:h-full min-h-[576px] md:max-h-[576px]">
              <Link href={`/apartment/${firstListing.id}`}>
                <ListingCard listing={firstListing} isLarge={true} />
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:max-h-[576px]">
            {smallListings.map((listing) => (
              <Link key={listing.id} href={`/apartment/${listing.id}`}>
                <ListingCard listing={listing} isLarge={false} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VipListings;
