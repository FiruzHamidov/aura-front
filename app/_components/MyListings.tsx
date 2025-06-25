'use client';

import { useEffect, useState } from 'react';
import BuyCard from '@/app/_components/buy/buy-card';
import { Listing } from '@/app/_components/buy/types';
import { axios } from '@/utils/axios';

interface PropertyApiResponse {
    id: number;
    title: string;
    description: string;
    price: string;
    currency: string;
    apartment_type: string | null;
    rooms: number | null;
    total_area: number;
    floor: number;
    total_floors: number;
    location: {
        city: string;
    };
    landmark: string | null;
    creator: {
        name: string;
    };
    created_at: string;
    photos: { file_path: string }[];
}

export default function MyListings() {
    const [listings, setListings] = useState<Listing[]>([]);

    useEffect(() => {
        async function fetchProperties() {
            try {
                const response = await axios.get('/properties');
                const data: PropertyApiResponse[] = response.data.data;

                const mapped: Listing[] = data.map((item) => ({
                    id: item.id,
                    images: item.photos.length > 0
                        ? item.photos.map((photo) => ({
                            url: `https://back.aura.bapew.tj/storage/${photo.file_path}`,
                            alt: item.title,
                        }))
                        : [{
                            url: '/images/no-image.png',
                            alt: 'Нет фото',
                        }],
                    price: parseFloat(item.price),
                    currency: item.currency === 'TJS' ? 'с.' : item.currency,
                    title: `${item.apartment_type ?? (item.rooms ? `${item.rooms}-комн.` : '')} ${item.total_area} м²`,
                    locationName: item.location.city,
                    description: item.landmark ?? '',
                    roomCountLabel: item.rooms ? `${item.rooms}-ком` : '',
                    area: item.total_area,
                    floorInfo: `${item.floor}/${item.total_floors} этаж`,
                    agent: {
                        name: item.creator.name,
                        role: '', // пока оставим пустым
                    },
                    date: item.created_at.split('T')[0],
                }));

                setListings(mapped);
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchProperties();
    }, []);

    return (
        <div className="grid grid-cols-3 gap-[14px] h-max mb-10 md:mb-16">
            {listings.map((listing) => (
                <BuyCard key={listing.id} listing={listing} />
            ))}
        </div>
    );
}