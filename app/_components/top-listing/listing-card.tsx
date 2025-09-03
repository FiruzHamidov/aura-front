'use client';

import { FC, useState, useCallback, useEffect, MouseEvent } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import LocationIcon from '@/icons/LocationIcon';
import CalendarIcon from '@/icons/CalendarIcon';
import UserIcon from '@/icons/UserIcon';
import WhiteSettingsIcon from '@/icons/WhiteSettingsIcon';
import FavoriteButton from '@/ui-components/favorite-button/favorite-button';
import { User } from '@/services/login/types';
import { LISTING_TYPE_META } from '@/services/properties/types';
import VerifiedIcon from '@/icons/Verified';
import { addToComparison } from '@/utils/comparison';
import { Listing } from './types';
// import ModerationModal from "@/app/_components/moderation-modal";
// import {Property} from "@/services/properties/types";

interface ListingCardProps {
  listing: Listing;
  isLarge?: boolean;
  user?: User;
}

const ListingCard: FC<ListingCardProps> = ({ listing, isLarge = false }) => {
  const router = useRouter();

  const formattedPrice = listing.price.toLocaleString('ru-RU');

  const images = listing.images || [
    { url: listing.imageUrl, alt: listing.imageAlt || `Фото ${listing.title}` },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // const userRole =
  //     user?.role?.slug === 'admin' ? 'admin' : user?.role?.slug === 'agent' ? 'agent' : null;

  const handleCompareClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const ids = addToComparison(listing.id);

    if (ids.length === 2) {
      router.push('/comparison');
    } else {
      toast.success('Объект добавлен к сравнению');
    }
  };

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  // const [isModalOpen, setIsModalOpen] = useState(false);

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
      className={clsx(
        'bg-white rounded-xl overflow-hidden h-full hover:shadow-xs transition-shadow duration-200',
        isLarge ? 'md:px-[25px] md:py-[22px] p-4' : 'px-[14px] py-[15px]'
      )}
    >
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div key={index} className="min-w-full">
                <div
                  className="relative w-full overflow-hidden rounded-lg"
                  style={{ height: isLarge ? 450 : 200 }} // задаём высоту контейнера
                >
                  <Image
                    src={image.url ?? ''}
                    alt={`Фото ${listing.title}`}
                    fill
                    className="object-cover" // заполняет контейнер, без искажений (возможна обрезка краёв)
                    sizes="(min-width: 768px) 580px, 100vw"
                    priority={index === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {listing.listing_type && (
          <span
            className={clsx(
              isLarge ? 'top-[22px] left-[22px]' : 'top-[14px] left-[14px]',
              'absolute text-xs font-bold px-[18px] py-1 rounded-full shadow',
              'backdrop-blur-sm ring-1 ring-black/10',
              LISTING_TYPE_META[listing.listing_type]?.classes ??
                'bg-slate-200 text-slate-900'
            )}
            title={LISTING_TYPE_META[listing.listing_type]?.label}
          >
            {LISTING_TYPE_META[listing.listing_type]?.label ?? 'Статус'}
          </span>
        )}

        <div
          className={clsx(
            'absolute flex flex-col space-y-2',
            isLarge ? 'top-[22px] right-[22px]' : 'top-3 right-3'
          )}
        >
          <div className="!bg-white/30 flex items-center justify-center cursor-pointer p-2 rounded-full shadow transition w-[37px] h-[37px]">
            <FavoriteButton propertyId={listing.id} />
          </div>
          <div
            onClick={handleCompareClick}
            role="button"
            aria-label="Добавить к сравнению"
            className="!bg-white/30 flex items-center justify-center cursor-pointer p-2 rounded-full shadow transition w-[37px] h-[37px]"
          >
            <WhiteSettingsIcon className="w-[18px] h-[18px]" />
          </div>

          {/*{userRole && (*/}
          {/*    <div*/}
          {/*        onClick={(e) => {*/}
          {/*          e.preventDefault();*/}
          {/*          e.stopPropagation();*/}
          {/*          setIsModalOpen(true);*/}
          {/*        }}*/}
          {/*        className="!bg-white/30 flex items-center justify-center cursor-pointer p-2 rounded-full shadow transition w-9 h-9"*/}
          {/*        role="button"*/}
          {/*        aria-label="Открыть модерацию"*/}
          {/*    >*/}
          {/*      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">*/}
          {/*        <path d="M12 20H21" stroke="white" strokeWidth="2" strokeLinecap="round"*/}
          {/*              strokeLinejoin="round"/>*/}
          {/*        <path*/}
          {/*            d="M16.5 3.5C16.8978 3.10218 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04016C19.0692 3.14676 19.303 3.30301 19.5 3.5C19.697 3.69699 19.8532 3.9308 19.9598 4.18819C20.0665 4.44558 20.1213 4.72142 20.1213 5C20.1213 5.27858 20.0665 5.55442 19.9598 5.81181C19.8532 6.0692 19.697 6.30301 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z"*/}
          {/*            stroke="white"*/}
          {/*            strokeWidth="2"*/}
          {/*            strokeLinecap="round"*/}
          {/*            strokeLinejoin="round"*/}
          {/*        />*/}
          {/*      </svg>*/}
          {/*    </div>*/}
          {/*)}*/}
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

      <div className="pt-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <span
            className={`font-bold ${
              isLarge ? 'text-[32px] text-[#1E3A8A]' : 'text-2xl text-[#0036A5]'
            }`}
          >
            {formattedPrice} {listing.currency}
          </span>
          <div
            className={clsx(
              'flex items-center text-[#666F8D] bg-[#EFF6FF] px-2 py-0.5 rounded-full',
              isLarge ? 'text-sm' : 'text-xs'
            )}
          >
            <LocationIcon
              className={clsx(
                'mr-0.5',
                isLarge ? 'w-6 h-6 mt-1' : 'w-[18px] h-[18px]'
              )}
            />
            {listing.locationName}
          </div>
        </div>

        <h3
          className={`mb-1 ${isLarge ? 'text-2xl font-normal' : 'text-base'}`}
        >
          {listing.title} {listing.description.substring(0, 55)}
        </h3>

        <div
          className={`flex items-center space-x-3 text-[#666F8D] ${
            isLarge ? 'text-sm mb-1' : 'text-xs'
          }`}
        >
          <span>{listing.roomCountLabel}</span>
          <span>{listing.area} кв/м²</span>
          <span>{listing.floorInfo}</span>
        </div>

        {isLarge && listing.agent && listing.date && (
          <div className="mt-auto pt-5 flex items-center justify-between text-xs">
            <div className="flex items-center">
              {listing.agent.avatarUrl ? (
                <Image
                  src={listing.agent.avatarUrl}
                  alt={listing.agent.name}
                  width={36}
                  height={36}
                  className="rounded-full w-9 h-9 object-cover mr-2"
                />
              ) : (
                <div className="rounded-full w-9 h-9 bg-[#F1F5F9] p-1.5 mr-1.5 flex items-center justify-center">
                  <UserIcon className="h-[22px] w-[22px]" />
                </div>
              )}

              <div className="flex items-center">
                <div className="font-bold text-sm text-[#020617]">
                  {listing.agent.name}
                </div>
                <VerifiedIcon className="w-4 h-4 ml-1" />
                {/*<div className="text-[#666F8D] text-xs">*/}
                {/*  {listing.agent.role}*/}
                {/*</div>*/}
              </div>
            </div>

            <div className="flex items-center text-[#666F8D]">
              <CalendarIcon className="mr-1 w-[14px] h-[14px]" />
              {listing.date}
            </div>
          </div>
        )}
      </div>
      {/*{isModalOpen && userRole && (*/}
      {/*    // <ModerationModal*/}
      {/*    //     property={listing as Property}*/}
      {/*    //     onClose={() => setIsModalOpen(false)}*/}
      {/*    //     onUpdated={(updated) => {*/}
      {/*    //       Object.assign(listing, updated);*/}
      {/*    //     }}*/}
      {/*    //     userRole={userRole}*/}
      {/*    // />*/}
      {/*)}*/}
    </div>
  );
};

export default ListingCard;
