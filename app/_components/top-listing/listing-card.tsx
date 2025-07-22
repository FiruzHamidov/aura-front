'use client';

import {FC, useState, useCallback, useEffect} from 'react';
import Image from 'next/image';
import {Listing} from './types';
import LocationIcon from '@/icons/LocationIcon';
import CalendarIcon from '@/icons/CalendarIcon';
import UserIcon from '@/icons/UserIcon';
import useEmblaCarousel from 'embla-carousel-react';
import clsx from 'clsx';
import WhiteSettingsIcon from '@/icons/WhiteSettingsIcon';
import FavoriteButton from '@/ui-components/favorite-button/favorite-button';

interface ListingCardProps {
    listing: Listing;
    isLarge?: boolean;
}

const ListingCard: FC<ListingCardProps> = ({listing, isLarge = false}) => {
    const formattedPrice = listing.price.toLocaleString('ru-RU');

    const images = listing.images || [
        {url: listing.imageUrl, alt: listing.imageAlt || `Фото ${listing.title}`},
    ];

    const [emblaRef, emblaApi] = useEmblaCarousel({loop: true});
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
            className={clsx(
                'bg-white rounded-xl overflow-hidden h-full hover:shadow-xs transition-shadow duration-200',
                isLarge ? 'md:px-[25px] md:py-[22px] p-4' : 'px-[14px] py-[15px]'
            )}
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
                                    className="w-full object-cover rounded-lg"
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

                <div
                    className={clsx(
                        'absolute flex flex-col space-y-2',
                        isLarge ? 'top-[22px] right-[22px]' : 'top-3 right-3'
                    )}
                >
                    <div
                        className="!bg-white/30 flex items-center justify-center cursor-pointer p-2 rounded-full shadow transition w-[37px] h-[37px]">
                        <FavoriteButton propertyId={listing.id}/>
                    </div>
                    <div
                        className="!bg-white/30 flex items-center justify-center cursor-pointer p-2 rounded-full shadow transition w-[37px] h-[37px]">
                        <WhiteSettingsIcon className="w-[18px] h-[18px]"/>
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
                        isLarge ? 'text-sm mb-8' : 'text-xs'
                    }`}
                >
                    <span>{listing.roomCountLabel}</span>
                    <span>{listing.area} кв/м²</span>
                    <span>{listing.floorInfo}</span>
                </div>

                {isLarge && listing.agent && listing.date && (
                    <div className="mt-auto pt-5 flex items-center justify-between text-xs">
                        <div className="flex items-center">
                            <div
                                className="rounded-full w-9 h-9 bg-[#F1F5F9] p-1.5 mr-1.5 flex items-center justify-center">
                                <UserIcon className="h-[22px] w-[22px]"/>
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
                            <CalendarIcon className="mr-1 w-[14px] h-[14px]"/>
                            {listing.date}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingCard;
