'use client';

import { useEffect, useState } from 'react';
import BuyCard from '@/app/_components/buy/buy-card';
import { axios } from '@/utils/axios';
import { Property } from '@/types/property';
import { Listing } from '@/app/_components/buy/types';

export default function MyListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await axios.get('/properties');
        const data = response.data.data;

        const mapped: Listing[] = (data as Property[]).map((item) => ({
          id: item.id,
          images: item.photos.length > 0
              ? item.photos.map((photo) => ({
                url: `https://back.aura.bapew.tj/storage/${photo.file_path}`,
                alt: item.title,
              }))
              : [
                {
                  url: '/images/no-image.png',
                  alt: 'Нет фото',
                },
              ],
          price: parseFloat(item.price),
          currency: item.currency === 'TJS' ? 'с.' : item.currency,
          title: `${item.apartment_type ?? (item.rooms ? `${item.rooms}-комн.` : '')} ${item.total_area} м²`,
          locationName: item.location?.city ?? '',
          description: item.landmark ?? '',
          roomCountLabel: item.rooms ? `${item.rooms}-ком` : '',
          area: item.total_area,
          floorInfo: `${item.floor}/${item.total_floors} этаж`,
          agent: {
            name: item.creator?.name ?? '',
            role: '',
          },
          date: item.created_at.split('T')[0],
        }));

        setListings(mapped);
      } catch (error) {
        console.error('Ошибка получения данных:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Загрузка...</div>;
  }

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px] h-max mb-10 md:mb-16">
        {listings.map((listing) => (
            <BuyCard key={listing.id} listing={listing} />
        ))}
      </div>
  );
}