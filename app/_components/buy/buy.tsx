import { FC } from 'react';
import { Listing } from './types';
import BuyCard from './buy-card';
import Link from 'next/link';

const sampleListings: Listing[] = [
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
  {
    id: 3,
    images: [
      { url: '/images/buy/1.png', alt: 'Квартира 3 изображение 1' },
      { url: '/images/buy/5.jpeg', alt: 'Квартира 3 изображение 2' },
      { url: '/images/buy/6.jpeg', alt: 'Квартира 3 изображение 3' },
    ],
    price: 1000000,
    currency: 'с.',
    title: '4-комн. квартира, 4 этаж, 178 м²',
    locationName: 'Фирдавси',
    description: 'Профсоюз',
    roomCountLabel: '4-ком',
    area: 178,
    floorInfo: '4/16 этаж',
    agent: {
      name: 'Мавзуна Шоева',
      role: 'топ-риелтор',
    },
    date: '22.10.2023',
  },
  {
    id: 4,
    images: [
      { url: '/images/buy/3.jpeg', alt: 'Квартира 4 изображение 1' },
      { url: '/images/buy/7.jpeg', alt: 'Квартира 4 изображение 2' },
      { url: '/images/buy/1.png', alt: 'Квартира 4 изображение 3' },
    ],
    price: 890000,
    currency: 'с.',
    title: '3-комн. квартира, 6 этаж, 100 м²',
    locationName: 'Фирдавси',
    description: 'Зеленый базар',
    roomCountLabel: '3-ком',
    area: 100,
    floorInfo: '6/12 этаж',
    agent: {
      name: 'Мавзуна Шоева',
      role: 'топ-риелтор',
    },
    date: '22.10.2023',
  },
  {
    id: 5,
    images: [
      { url: '/images/buy/4.jpeg', alt: 'Квартира 5 изображение 1' },
      { url: '/images/buy/2.jpeg', alt: 'Квартира 5 изображение 2' },
      { url: '/images/buy/5.jpeg', alt: 'Квартира 5 изображение 3' },
    ],
    price: 432000,
    currency: 'с.',
    title: '2-комн. квартира, 9 этаж, 78 м²',
    locationName: 'Фирдавси',
    description: 'Саховат базар',
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
    id: 6,
    images: [
      { url: '/images/buy/5.jpeg', alt: 'Квартира 6 изображение 1' },
      { url: '/images/buy/1.png', alt: 'Квартира 6 изображение 2' },
      { url: '/images/buy/3.jpeg', alt: 'Квартира 6 изображение 3' },
    ],
    price: 432000,
    currency: 'с.',
    title: '2-комн. квартира, 9 этаж, 78 м²',
    locationName: 'Фирдавси',
    description: 'Саховат базар',
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
    id: 7,
    images: [
      { url: '/images/buy/6.jpeg', alt: 'Квартира 7 изображение 1' },
      { url: '/images/buy/4.jpeg', alt: 'Квартира 7 изображение 2' },
      { url: '/images/buy/2.jpeg', alt: 'Квартира 7 изображение 3' },
    ],
    price: 432000,
    currency: 'с.',
    title: '2-комн. квартира, 9 этаж, 78 м²',
    locationName: 'Фирдавси',
    description: 'Саховат базар',
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
    id: 8,
    images: [
      { url: '/images/buy/7.jpeg', alt: 'Квартира 8 изображение 1' },
      { url: '/images/buy/5.jpeg', alt: 'Квартира 8 изображение 2' },
      { url: '/images/buy/6.jpeg', alt: 'Квартира 8 изображение 3' },
    ],
    price: 432000,
    currency: 'с.',
    title: '2-комн. квартира, 9 этаж, 78 м²',
    locationName: 'Фирдавси',
    description: 'Саховат базар',
    roomCountLabel: '2-ком',
    area: 78,
    floorInfo: '3/12 этаж',
    agent: {
      name: 'Мавзуна Шоева',
      role: 'топ-риелтор',
    },
    date: '22.10.2023',
  },
];

const Buy: FC = () => {
  return (
    <section>
      <div className="container mt-16 md:mt-20">
        <h2 className="text-2xl md:text-4xl font-bold text-[#020617] mb-6 md:mb-10">
          Купить
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-[14px]">
          {sampleListings.map((listing) => (
            <Link key={listing.id} href={`/apartment/${listing.id}`}>
              <BuyCard listing={listing} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Buy;
