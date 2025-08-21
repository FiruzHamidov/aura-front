'use client';

import { FC, useState, useMemo } from 'react';
import { Listing } from './types';
import ListingCard from './listing-card';
import Link from 'next/link';
import { Tabs } from '@/ui-components/tabs/tabs';
import { PropertiesResponse, Property } from '@/services/properties/types';
import { STORAGE_URL } from '@/constants/base-url';
import ListingCardSkeleton from '@/ui-components/ListingCardSkeleton';
import {useProfile} from "@/services/login/hooks";


type PropertyType = 'apartment' | 'house' | 'land' | 'commercial';

const propertyTypeMap: Record<string, PropertyType> = {
  квартира: 'apartment',
  дом: 'house',
  'земельный участок': 'land',
  коммерческая: 'commercial',
  apartment: 'apartment',
  house: 'house',
  land: 'land',
  commercial: 'commercial',
};

const tabOptions = [
  { key: 'apartment', label: 'Квартира' },
  { key: 'house', label: 'Дом' },
  { key: 'land', label: 'Земельный участок' },
  { key: 'commercial', label: 'Коммерческая' },
] as const;

const TopListings: FC<{
  title?: string;
  isLoading?: boolean;
  properties: PropertiesResponse | undefined;
}> = ({ title = 'Топовые объявления', properties, isLoading }) => {
  const [activeType, setActiveType] = useState<PropertyType>('apartment');
  const { data: user } = useProfile();

  const listings = useMemo(() => {
    if (!properties?.data) return [];

    const topProperties = properties.data.filter(
      (property) => property.moderation_status === 'approved'
    );

    return topProperties.map((property: Property): Listing => {
      const images =
        property.photos && property.photos.length > 0
          ? property.photos.map((photo) => ({
              url: photo.file_path
                ? `${STORAGE_URL}/${photo.file_path}`
                : '/images/no-image.jpg',
              alt: property.title || 'Фото недвижимости',
            }))
          : [{ url: '/images/no-image.jpg', alt: 'Нет фото' }];

      const locationName =
        typeof property.location === 'string'
          ? property.location
          : property.location?.city || 'не указано';

      const floorInfo =
        property.floor && property.total_floors
          ? `${property.floor}/${property.total_floors} этаж`
          : 'Этаж не указан';

      const roomCountLabel =
        property.apartment_type ||
        (property.rooms ? `${property.rooms}-ком` : 'не указано');

      const typeFromApi = property.type?.name?.toLowerCase();
      const mappedType = typeFromApi
        ? propertyTypeMap[typeFromApi] || 'apartment'
        : 'house';

      return {
        id: property.id,
        images,
        isTop: true,
        price: parseFloat(property.price),
        currency: property.currency === 'TJS' ? 'с.' : property.currency,
        title: property.title || `${roomCountLabel}, ${property.total_area} м²`,
        locationName,
        listing_type: property.listing_type,
        description:
          property.description || property.landmark || 'Описание отсутствует',
        roomCountLabel,
        area: property.total_area ? parseFloat(property.total_area) : 0,
        floorInfo,
        agent: property.creator
          ? {
              name: property.creator.name || 'не указано',
              role: 'риелтор',
              avatarUrl: property.creator.photo
                ? `${STORAGE_URL}/${property.creator.photo}`
                : '',
            }
          : undefined,
        date: property.created_at
          ? new Date(property.created_at).toLocaleDateString('ru-RU')
          : undefined,
        type: mappedType,
      };
    });
  }, [properties]);

  const filteredListings = useMemo(() => {
    return listings.filter(
      (listing) => !listing.type || listing.type === activeType
    );
  }, [listings, activeType]);

  // Show skeleton loading state
  if (isLoading) {
    return (
      <section>
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-4xl font-bold text-[#020617] mb-6 md:mb-10">
            {title}
          </h2>
          <div className="mb-5 md:mb-8 overflow-auto">
            <Tabs
              tabs={tabOptions}
              activeType={activeType}
              setActiveType={setActiveType}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Large skeleton card */}
            <div className="md:h-full md:max-h-[576px]">
              <ListingCardSkeleton isLarge={true} />
            </div>

            {/* Small skeleton cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:max-h-[576px]">
              {Array.from({ length: 4 }).map((_, index) => (
                <ListingCardSkeleton key={index} isLarge={false} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!isLoading && filteredListings.length === 0) {
    return null;
  }

  const firstListing = filteredListings[0];
  const smallListings = filteredListings.slice(1, 5);

  return (
    <section>
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-4xl font-bold text-[#020617] mb-6 md:mb-10">
          {title}
        </h2>
        <div className="mb-5 md:mb-8 overflow-auto">
          <Tabs
            tabs={tabOptions}
            activeType={activeType}
            setActiveType={setActiveType}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {firstListing && (
            <div className="md:h-full md:max-h-[576px]">
              <Link href={`/apartment/${firstListing.id}`} className="max-h-[300px]">
                <ListingCard listing={firstListing} isLarge={true} user={user} />
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:max-h-[576px]">
            {smallListings.map((listing) => (
              <Link key={listing.id} href={`/apartment/${listing.id}`} className="max-h-[300px]">
                <ListingCard listing={listing} isLarge={false} user={user} />
              </Link>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default TopListings;
