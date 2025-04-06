import { FC } from 'react';
import { Listing } from './types';
import ListingCard from './listing-card';

const sampleListings: Listing[] = [
  {
    id: 1,
    imageUrl: '/placeholder-images/listing-large.jpg',
    imageAlt: 'Современная спальня с деревянными панелями',
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
  },
  {
    id: 2,
    imageUrl: '/placeholder-images/listing-small-1.jpg',
    isTop: true,
    price: 333210,
    currency: 'с.',
    title: '1-комн. квартира, 1 этаж, 78 м²',
    locationName: 'Сино',
    description: 'Рынок Мехргон',
    roomCountLabel: '1-ком',
    area: 53,
    floorInfo: '1/12 этаж',
  },
  {
    id: 3,
    imageUrl: '/placeholder-images/listing-small-2.jpg',
    isTop: true,
    price: 1000000,
    currency: 'с.',
    title: '4-комн. квартира, 4 этаж, 178 м²',
    locationName: 'Фирдавси',
    description: 'Профсоюз',
    roomCountLabel: '4-ком',
    area: 178,
    floorInfo: '4/16 этаж',
  },
  {
    id: 4,
    imageUrl: '/placeholder-images/listing-small-3.jpg',
    isTop: true,
    price: 890000,
    currency: 'с.',
    title: '3-комн. квартира, 6 этаж, 100 м²',
    locationName: 'Фирдавси',
    description: 'Зеленый базар',
    roomCountLabel: '3-ком',
    area: 100,
    floorInfo: '6/12 этаж',
  },
  {
    id: 5,
    imageUrl: '/placeholder-images/listing-small-4.jpg',
    isTop: true,
    price: 432000,
    currency: 'с.',
    title: '2-комн. квартира, 9 этаж, 78 м²',
    locationName: 'Фирдавси',
    description: 'Саховат базар',
    roomCountLabel: '2-ком',
    area: 78,
    floorInfo: '3/12 этаж',
  },
];

const TopListings: FC = () => {
  return (
    <section>
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Топовые объявления
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleListings.map((listing, index) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isLarge={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopListings;
