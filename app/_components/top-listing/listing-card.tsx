'use client';

import { FC, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Listing } from './types';
import HeartIcon from '@/icons/HeartIcon';
import SettingsIcon from '@/icons/SettingsIcon';
import LocationIcon from '@/icons/LocationIcon';
import CalendarIcon from '@/icons/CalendarIcon';
import UserIcon from '@/icons/UserIcon';
import useEmblaCarousel from 'embla-carousel-react';
import clsx from 'clsx';

interface ListingCardProps {
  listing: Listing;
  isLarge?: boolean;
}

const ListingCard: FC<ListingCardProps> = ({ listing, isLarge = false }) => {
  const formattedPrice = listing.price.toLocaleString('ru-RU');

  const images = listing.images || [
    { url: listing.imageUrl, alt: listing.imageAlt || `Фото ${listing.title}` },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow duration-200`}
    >
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div key={index} className="min-w-full relative">
                <Image
                  src={image.url ?? ''}
                  alt={image.alt || `Фото ${listing.title}`}
                  width={isLarge ? 580 : 279}
                  height={isLarge ? 293 : 128}
                  className="w-full object-cover"
                  style={{
                    aspectRatio: isLarge ? '4/3' : '4/3',
                    height: isLarge ? '293px' : '128px',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {listing.isTop && (
          <span
            className={clsx(
              isLarge ? 'top-[22px] left-[22px]' : 'top-[14px] left-[14px]',
              'absolute bg-[#E1C116] text-[#020617] text-xs font-bold px-[18px] py-1 rounded-full shadow'
            )}
          >
            ТОП
          </span>
        )}

        <div className="absolute top-[22px] right-[22px] flex flex-col space-y-2">
          <div className="!bg-white/30 cursor-pointer p-2 rounded-full shadow transition w-9 h-9">
            <HeartIcon className="w-[18px] h-[18px] text-white" />
          </div>
          <div className="!bg-white/30 cursor-pointer p-2 rounded-full shadow transition w-9 h-9">
            <SettingsIcon className="w-[18px] h-[18px] text-white" />
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              className={`block w-2 h-2 bg-white rounded-full ${
                index === selectedIndex ? 'opacity-90' : 'opacity-50'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className={`p-4 flex flex-col flex-grow`}>
        <div className="flex justify-between items-center mb-2">
          <span
            className={`font-bold text-[#020617] ${
              isLarge ? 'text-xl' : 'text-lg'
            }`}
          >
            {formattedPrice} {listing.currency}
          </span>
          <div className="flex items-center text-xs text-[#666F8D] bg-[#EFF6FF] px-2 py-1 rounded-full">
            <LocationIcon className="mr-1 w-[14px] h-[14px]" />
            {listing.locationName}
          </div>
        </div>

        <h3
          className={`font-semibold mb-1 ${isLarge ? 'text-base' : 'text-sm'}`}
        >
          {listing.title}
        </h3>
        <p className={`text-gray-600 mb-3 ${isLarge ? 'text-sm' : 'text-xs'}`}>
          {listing.description}
        </p>

        <div
          className={`flex items-center space-x-3 text-[#666F8D] mb-4 ${
            isLarge ? 'text-sm' : 'text-xs'
          }`}
        >
          <span>{listing.roomCountLabel}</span>
          <span>{listing.area} кв/м²</span>
          <span>{listing.floorInfo}</span>
        </div>

        {isLarge && listing.agent && listing.date && (
          <div className="mt-auto pt-3 flex items-center justify-between text-xs border-t border-gray-100">
            <div className="flex items-center">
              <div className="rounded-full w-9 h-9 bg-[#F1F5F9] p-1.5 mr-1.5 flex items-center justify-center">
                <UserIcon className="h-[22px] w-[22px]" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#020617]">
                  {listing.agent.name}
                </div>
                <div className="text-[#666F8D] text-xs">
                  {listing.agent.role}
                </div>
              </div>
            </div>

            <div className="flex items-center text-[#666F8D]">
              <CalendarIcon className="mr-1 w-[14px] h-[14px]" />
              {listing.date}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
