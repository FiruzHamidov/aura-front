'use client';

import { FC, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Listing } from './types';
import HeartIcon from '@/icons/HeartIcon';
import SettingsIcon from '@/icons/SettingsIcon';
import LocationIcon from '@/icons/LocationIcon';
import UserIcon from '@/icons/UserIcon';
import CalendarIcon from '@/icons/CalendarIcon';
import useEmblaCarousel from 'embla-carousel-react';

interface BuyCardProps {
  listing: Listing;
  isLarge?: boolean;
}

const BuyCard: FC<BuyCardProps> = ({ listing, isLarge = false }) => {
  const formattedPrice = listing.price.toLocaleString('ru-RU');

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
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-200 p-4">
      <div className="relative mb-3">
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="flex">
            {listing.images.map((image, index) => (
              <div key={index} className="min-w-full relative">
                <Image
                  src={image.url}
                  alt={image.alt || `Фото ${listing.title}`}
                  width={600}
                  height={400}
                  className="w-full object-cover aspect-[4/3]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-2 md:top-[22px] right-2 md:right-[22px] flex flex-col space-y-2">
          <div className="!bg-white/30 cursor-pointer p-2 rounded-full shadow transition w-9 h-9">
            <HeartIcon className="w-[18px] h-[18px] text-white" />
          </div>
          <div className="!bg-white/30 cursor-pointer p-2 rounded-full shadow transition w-9 h-9">
            <SettingsIcon className="w-[18px] h-[18px] text-white" />
          </div>
        </div>
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
          {listing.images.map((_, index) => (
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

      <div className="flex flex-col flex-grow ">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-[#020617]">
            {formattedPrice} {listing.currency}
          </span>
          <div className="flex items-center text-xs text-[#666F8D] bg-[#EFF6FF] px-2 py-1 rounded-full">
            <LocationIcon className="mr-1 w-[18px] h-[18px]" />
            {listing.locationName}
          </div>
        </div>

        <h3
          className={`font-semibold text-base mb-1 ${
            isLarge ? 'lg:text-lg' : ''
          }`}
        >
          {listing.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">{listing.description}</p>

        <div className="flex items-center space-x-3 text-sm text-[#666F8D] mb-4">
          <span>{listing.roomCountLabel}</span>
          <span>{listing.area} кв/м²</span>
          <span>{listing.floorInfo}</span>
        </div>

        {listing.agent && listing.date && (
          <div className="mt-auto pt-3 flex items-center justify-between text-xs">
            <div className="flex items-center justify-center">
              {listing.agent.avatarUrl ? (
                <Image
                  src={listing.agent.avatarUrl}
                  alt={listing.agent.name}
                  width={24}
                  height={24}
                  className="rounded-full mr-2"
                />
              ) : (
                <div className="rounded-full w-9 h-9 bg-[#F1F5F9] p-1.5 mr-1.5">
                  <UserIcon className="h-[22px] w-[22px]" />
                </div>
              )}
              <div>
                <div className="font-bold text-sm text-[#020617]">
                  {listing.agent.name}
                </div>
                <div className="text-[#666F8D] text-xs">
                  {listing.agent.role}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <CalendarIcon className="mr-1 w-[14px] h-[14px]" />
              {listing.date}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyCard;
