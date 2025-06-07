import BuyCard from '@/app/_components/buy/buy-card';
import { Listing } from '@/app/_components/buy/types';

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

export default function ProfileFavorites() {
  return (
    <div className="grid grid-cols-3 gap-[14px] h-max mb-10 md:mb-16">
      {favoritesListings.map((listing, index) => (
        <BuyCard key={index} listing={listing} />
      ))}
    </div>
  );
}
