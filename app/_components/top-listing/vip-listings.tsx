'use client';

import { FC, useState, useMemo } from 'react';
import { Listing } from './types';
import ListingCard from './listing-card';
import Link from 'next/link';
import { Tabs } from '@/ui-components/tabs/tabs';
import { PropertiesResponse, Property } from '@/services/properties/types';

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

const VipListings: FC<{
  title?: string;
  properties: PropertiesResponse | undefined;
}> = ({ title = 'VIP объявления', properties }) => {
  const [activeType, setActiveType] = useState<PropertyType>('apartment');

  const listings = useMemo(() => {
    if (!properties?.data) return [];

    return properties.data.map((property: Property): Listing => {
      const images =
        property.photos && property.photos.length > 0
          ? property.photos.map((photo) => ({
              url: photo.file_path
                ? `https://backend.aura.tj/storage/${photo.file_path}`
                : '/images/no-image.png',
              alt: property.title || 'Фото недвижимости',
            }))
          : [{ url: '/images/no-image.png', alt: 'Нет фото' }];

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
        : 'apartment';

      return {
        id: property.id,
        images,
        isTop: property.moderation_status === 'approved',
        price: parseFloat(property.price),
        currency: property.currency === 'TJS' ? 'с.' : property.currency,
        title: property.title || `${roomCountLabel}, ${property.total_area} м²`,
        locationName,
        description:
          property.description || property.landmark || 'Описание отсутствует',
        roomCountLabel,
        area: property.total_area || 0,
        floorInfo,
        agent: property.creator
          ? {
              name: property.creator.name || 'не указано',
              role: 'риелтор',
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

  const firstListing = filteredListings[0];
  const smallListings = filteredListings.slice(1, 5);

  if (filteredListings.length === 0) {
    return null;
  }

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
