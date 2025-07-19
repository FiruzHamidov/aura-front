'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import SettingsIcon from '@/icons/SettingsIcon';
import HeartIcon from '@/icons/HeartIcon';
import { Property } from '@/services/properties/types';
import MortgageCalculator from '../_components/MortgageCalculator';

interface Props {
    apartment: Property;
    photos: string[];
}

export default function GalleryWrapper({ apartment, photos }: Props) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    const scrollTo = useCallback(
        (index: number) => {
            emblaApi?.scrollTo(index);
            setSelectedIndex(index);
        },
        [emblaApi]
    );

    const scrollPrev = useCallback(() => {
        emblaApi?.scrollPrev();
        setSelectedIndex(emblaApi?.selectedScrollSnap() ?? 0);
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        emblaApi?.scrollNext();
        setSelectedIndex(emblaApi?.selectedScrollSnap() ?? 0);
    }, [emblaApi]);

    const toggleFavorite = () => setIsFavorite(!isFavorite);

    const phone = apartment.creator?.phone ?? '';
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    return (
        <div className="container pt-8 pb-12">
            <div className="flex flex-col lg:flex-row gap-5">
                {/* Левая часть */}
                <div className="lg:w-3/4">
                    <div className="bg-white rounded-[22px] md:p-[30px] p-4">
                        <div className="md:flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold mb-2">
                                    {apartment.title || 'Объект без названия'}
                                </h1>
                                <div className="text-[#666F8D] text-lg">ID: {apartment.id}</div>
                            </div>
                            <div className="flex gap-2 md:mt-0 mt-4">
                                <button className="w-14 h-14 rounded-full border border-[#BAC0CC] flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                                    <SettingsIcon className="w-6 h-6 text-[#1E3A8A]" />
                                </button>
                                <button
                                    className="w-14 h-14 rounded-full border border-[#BAC0CC] flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                                    onClick={toggleFavorite}
                                >
                                    <HeartIcon className="w-6 h-6 text-[#1E3A8A]" />
                                </button>
                            </div>
                        </div>

                        {/* Галерея */}
                        {photos.length > 0 && (
                            <>
                                <div className="relative mb-4">
                                    <div className="overflow-hidden rounded-xl" ref={emblaRef}>
                                        <div className="flex">
                                            {photos.map((image, index) => (
                                                <div
                                                    key={index}
                                                    className="relative min-w-full md:h-[387px] h-[200px]"
                                                    style={{ flex: '0 0 100%' }}
                                                >
                                                    <Image
                                                        src={image}
                                                        alt={`Фото ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        priority={index === 0}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={scrollPrev}
                                        className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={scrollNext}
                                        className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M9 18L15 12L9 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                                        {photos.map((_, index) => (
                                            <button
                                                key={index}
                                                className={`w-2 h-2 rounded-full ${selectedIndex === index ? 'bg-white' : 'bg-white/50'}`}
                                                onClick={() => scrollTo(index)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-5 gap-2 mb-6">
                                    {photos.map((image, index) => (
                                        <button
                                            key={index}
                                            className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                                                selectedIndex === index ? 'border-blue-600' : 'border-transparent hover:border-blue-300'
                                            }`}
                                            onClick={() => scrollTo(index)}
                                        >
                                            <Image src={image} alt={`Миниатюра ${index + 1}`} fill className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Описание */}
                        <div className="mt-6">
                            <h2 className="text-2xl font-bold mb-4">Описание</h2>
                            <div className="text-[#666F8D] whitespace-pre-line">{apartment.description}</div>
                        </div>
                    </div>
                </div>

                {/* Боковая панель */}
                <div className="lg:w-1/4">
                    <div className="bg-white rounded-[22px] md:py-[30px] md:px-[22px] px-4 py-5 mb-6">
                        <div className="text-[#666F8D] text-lg mb-1.5">Цена</div>
                        <div className="text-[32px] font-bold text-[#0036A5]">
                            {apartment.price} {apartment.currency}
                        </div>
                    </div>

                    {apartment.creator && (
                        <div className="bg-white rounded-[22px] md:px-[26px] px-4 py-5 md:py-8">
                            <h3 className="text-2xl font-bold mb-2">{apartment.creator.name}</h3>
                            <div className="text-[#666F8D] mb-4">Агент</div>

                            <Link
                                href={`tel:${cleanPhone}`}
                                className="block w-full bg-[#0036A5] hover:bg-blue-800 text-white py-5 rounded-full text-center font-medium mb-4 transition-colors"
                            >
                                {apartment.creator.phone}
                            </Link>

                            <div className="flex flex-col gap-3">
                                <Link
                                    href={`https://wa.me/${cleanPhone}`}
                                    className="w-full py-3 border border-[#25D366] text-[#25D366] rounded-full text-center font-medium hover:bg-[#25D366]/10 transition"
                                    target="_blank"
                                >
                                    WhatsApp
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <MortgageCalculator />
        </div>
    );
}