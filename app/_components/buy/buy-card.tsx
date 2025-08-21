'use client';

import {FC, useCallback, useEffect, useState} from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import LocationIcon from '@/icons/LocationIcon';
import CalendarIcon from '@/icons/CalendarIcon';
import WhiteSettingsIcon from '@/icons/WhiteSettingsIcon';
import FavoriteButton from '@/ui-components/favorite-button/favorite-button';
import {Property, PropertyPhoto} from '@/services/properties/types';
import {STORAGE_URL} from '@/constants/base-url';
import UserIcon from '@/icons/UserIcon';
import {User} from '@/services/login/types';
import ModerationModal from '@/app/_components/moderation-modal';
import Link from "next/link";

interface BuyCardProps {
    listing: Property;
    user?: User;
    isLarge?: boolean;
}

const BuyCard: FC<BuyCardProps> = ({listing, user, isLarge = false}) => {
    const formattedPrice = Number(listing.price).toLocaleString('ru-RU');

    const [emblaRef, emblaApi] = useEmblaCarousel({loop: true});
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const userRole =
        user?.role?.slug === 'admin' ? 'admin' : user?.role?.slug === 'agent' ? 'agent' : null;

    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

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

    const displayImages =
        listing.photos && listing.photos.length > 0
            ? listing.photos.map((photo: PropertyPhoto, index: number) => ({
                url: photo.file_path ? `${STORAGE_URL}/${photo.file_path}` : '/images/no-image.jpg',
                alt: `Фото ${listing.title || 'объявления'} ${index + 1}`,
            }))
            : [{url: '/images/no-image.jpg', alt: 'Нет фото'}];

    const displayTitle = `${listing.rooms} комн. ${
        listing.apartment_type || 'квартира,'
    } ${listing.floor ? `${listing.floor} этаж,` : ''} ${
        listing.total_area ? `${listing.total_area} м²` : ''
    } ${listing.address ? `${listing.landmark}` : ''}`;

    const displayLocation =
        typeof listing.location === 'object'
            ? listing.location?.city || 'не указано'
            : listing.location || 'не указано';

    const displayRooms = listing.rooms || 'не указано';
    const displayArea = listing.total_area || 0;
    const displayFloorInfo =
        listing.floor && listing.total_floors ? `${listing.floor}/${listing.total_floors} этаж` : 'Этаж не указан';
    const displayCurrency = listing.currency === 'TJS' ? 'с.' : listing.currency || 'с.';

    const displayAgent = listing.creator
        ? {
            name: listing.creator.name || 'не указано',
            role: 'риелтор',
            photo: listing.creator.photo ? `${STORAGE_URL}/${listing.creator.photo}` : '',
        }
        : null;

    const displayDate = listing.created_at
        ? new Date(listing.created_at).toLocaleDateString('ru-RU')
        : 'Дата не указана';

    return (
        <div
            className="bg-white rounded-xl overflow-hidden flex flex-col h-full hover:shadow-sm transition-shadow duration-200 p-4"
        >
            <div className="relative mb-3">
                <div className="overflow-hidden rounded-lg" ref={emblaRef}>
                    <div className="flex">
                        {displayImages.map((image, index) => (
                            <div key={index} className="min-w-full relative">
                                <Link href={`/apartment/${listing.id}`}
                                      onClick={(e) => isModalOpen && e.preventDefault()}>
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        width={600}
                                        height={400}
                                        className="w-full object-cover aspect-[4/3]"
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute top-2 md:top-[22px] right-2 md:right-[22px] flex flex-col space-y-2">
                    <FavoriteButton
                        propertyId={listing.id}
                        className="!bg-white/30 flex items-center justify-center cursor-pointer p-2 rounded-full shadow transition w-9 h-9"
                    />
                    <div
                        className="!bg-white/30 flex items-center justify-center cursor-pointer p-2 rounded-full shadow transition w-9 h-9"

                    >
                        <WhiteSettingsIcon className="w-[18px] h-[18px] text-white"/>
                    </div>

                    {userRole && (
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsModalOpen(true);
                            }}
                            className="!bg-white/30 flex items-center justify-center cursor-pointer p-2 rounded-full shadow transition w-9 h-9"
                            role="button"
                            aria-label="Открыть модерацию"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 20H21" stroke="white" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                                <path
                                    d="M16.5 3.5C16.8978 3.10218 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04016C19.0692 3.14676 19.303 3.30301 19.5 3.5C19.697 3.69699 19.8532 3.9308 19.9598 4.18819C20.0665 4.44558 20.1213 4.72142 20.1213 5C20.1213 5.27858 20.0665 5.55442 19.9598 5.81181C19.8532 6.0692 19.697 6.30301 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                    {displayImages.map((_, index) => (
                        <button
                            key={index}
                            className={`block w-2 h-2 bg-white rounded-full ${
                                index === selectedIndex ? 'opacity-90' : 'opacity-50'
                            }`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                scrollTo(index);
                            }}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-col flex-grow ">
                <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-[#020617]">{formattedPrice} {displayCurrency}</span>
                    <div className="flex items-center text-xs text-[#666F8D] bg-[#EFF6FF] px-2 py-1 rounded-full">
                        <LocationIcon className="mr-1 w-[18px] h-[18px]"/>
                        {displayLocation}
                    </div>
                </div>
                <Link href={`/apartment/${listing.id}`} onClick={(e) => isModalOpen && e.preventDefault()}>
                    <h3 className={`font-semibold text-base mb-2 ${isLarge ? 'lg:text-lg' : ''}`}>{displayTitle}</h3>
                </Link>


                <div className="flex items-center space-x-3 text-sm text-[#666F8D] mb-2">
                    <span>{displayRooms}-ком</span>
                    <span>{displayArea} м²</span>
                    <span>{displayFloorInfo}</span>
                </div>

                {displayAgent && (
                    <div className="mt-auto pt-3 flex items-center justify-between text-xs">
                        <div className="flex items-center justify-center">
                            {displayAgent.photo ? (
                                <Image
                                    src={displayAgent.photo}
                                    alt={displayAgent.name}
                                    width={36}
                                    height={36}
                                    className="rounded-full w-9 h-9 object-cover mr-2"
                                />
                            ) : (
                                <div className="rounded-full w-9 h-9 bg-[#F1F5F9] p-1.5 mr-1.5">
                                    <UserIcon className="h-[22px] w-[22px]"/>
                                </div>
                            )}
                            <div>
                                <div className="font-bold text-sm text-[#020617]">{displayAgent.name}</div>
                                <div className="text-[#666F8D] text-xs">{displayAgent.role}</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <CalendarIcon className="mr-1 w-[14px] h-[14px]"/>
                            {displayDate}
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && userRole && (
                <ModerationModal
                    property={listing}
                    onClose={() => setIsModalOpen(false)}
                    onUpdated={(updated) => {
                        Object.assign(listing, updated);
                    }}
                    userRole={userRole}
                />
            )}
        </div>
    );
};

export default BuyCard;