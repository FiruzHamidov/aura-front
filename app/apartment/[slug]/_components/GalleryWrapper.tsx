'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import SettingsIcon from '@/icons/SettingsIcon';
import HeartIcon from '@/icons/HeartIcon';
import { Property } from '@/services/properties/types';
import { useProfile } from '@/services/login/hooks';
import MortgageCalculator from '../_components/MortgageCalculator';
import PhotoGalleryModal from '@/ui-components/PhotoGalleryModal';

interface Props {
  apartment: Property;
  photos: string[];
}

export default function GalleryWrapper({ apartment, photos }: Props) {
  const { data: user } = useProfile();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: photos.length > 1,
  });

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
      setSelectedIndex(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

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

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  const openModal = (index?: number) => {
    if (index !== undefined) {
      setSelectedIndex(index);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const phone = apartment.creator?.phone ?? '';
  const cleanPhone = phone.replace(/[^\d+]/g, '');

  const canEdit =
    (user && user.role?.slug === 'admin') ||
    (apartment.creator &&
      (user?.id === apartment.creator.id ||
        (apartment.agent_id && user?.id === apartment.agent_id)));

  return (
    <>
      <div className="container pt-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Левая часть */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-[22px] md:p-[30px] p-4">
              <div className="md:flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    {apartment.rooms} ком квартира, {apartment.floor} этаж,{' '}
                    {apartment.address || 'Адрес не указан'}
                  </h1>
                  <div className="text-[#666F8D] text-lg">
                    ID: {apartment.id}
                  </div>
                </div>
                <div className="flex gap-2 md:mt-0 mt-4">
                  {canEdit && (
                    <Link
                      href={`/profile/edit-post/${apartment.id}`}
                      className="w-14 h-14 rounded-full border border-[#0036A5] bg-[#0036A5] flex items-center justify-center hover:bg-blue-800 transition-colors"
                      title="Редактировать объявление"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 20H21"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.5 3.5C16.8978 3.10218 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04016C19.0692 3.14676 19.303 3.30301 19.5 3.5C19.697 3.69699 19.8532 3.9308 19.9598 4.18819C20.0665 4.44558 20.1213 4.72142 20.1213 5C20.1213 5.27858 20.0665 5.55442 19.9598 5.81181C19.8532 6.0692 19.697 6.30301 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  )}
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
                    <div
                      className="overflow-hidden rounded-xl cursor-pointer"
                      ref={emblaRef}
                    >
                      <div className="flex">
                        {photos.map((image, index) => (
                          <div
                            key={index}
                            className="relative min-w-full md:h-[387px] h-[200px] cursor-pointer hover:opacity-95 transition-opacity"
                            style={{ flex: '0 0 100%' }}
                            onClick={() => openModal(index)}
                          >
                            <Image
                              src={image}
                              alt={`Фото ${index + 1}`}
                              fill
                              className="object-cover"
                              priority={index === 0}
                              sizes="(max-width: 768px) 100vw, 75vw"
                            />
                            {/* Overlay hint */}
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                              <div className="bg-white/90 px-3 py-1 rounded-full text-sm text-gray-800">
                                Нажмите для увеличения
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Navigation arrows - only show if more than 1 photo */}
                    {photos.length > 1 && (
                      <>
                        <button
                          onClick={scrollPrev}
                          className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M15 18L9 12L15 6"
                              stroke="#333"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={scrollNext}
                          className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M9 18L15 12L9 6"
                              stroke="#333"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Dots indicator - only show if more than 1 photo */}
                    {photos.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                        {photos.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              selectedIndex === index
                                ? 'bg-white'
                                : 'bg-white/50'
                            }`}
                            onClick={() => scrollTo(index)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {photos.length > 1 && (
                    <div className="grid grid-cols-5 gap-2 mb-6">
                      {photos.map((image, index) => (
                        <button
                          key={index}
                          className={`relative cursor-pointer w-full aspect-square rounded-lg overflow-hidden border-2 transition-colors hover:opacity-80 ${
                            selectedIndex === index
                              ? 'border-blue-600'
                              : 'border-transparent hover:border-blue-300'
                          }`}
                          onClick={() => scrollTo(index)}
                        >
                          <Image
                            src={image}
                            alt={`Миниатюра ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 20vw, 15vw"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Описание</h2>
                <div className="text-[#666F8D] whitespace-pre-line">
                  {apartment.description || 'Описание не указано'}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/4">
            <div className="bg-white rounded-[22px] md:py-[30px] md:px-[22px] px-4 py-5 mb-6">
              <div className="text-[#666F8D] text-lg mb-1.5">Цена</div>
              <div className="text-[32px] font-bold text-[#0036A5]">
                {Number(apartment.price).toLocaleString('ru-RU')}{' '}
                {apartment.currency}
              </div>
            </div>

            {apartment.creator && (
              <div className="bg-white rounded-[22px] md:px-[26px] px-4 py-5 md:py-8">
                <h3 className="text-2xl font-bold mb-2">
                  {apartment.creator.name}
                </h3>
                <div className="text-[#666F8D] mb-4">Агент по недвижимости</div>

                <Link
                  href={`tel:${cleanPhone}`}
                  className="block w-full bg-[#0036A5] hover:bg-blue-800 text-white py-5 rounded-full text-center mb-4 transition-colors"
                >
                  {apartment.creator.phone}
                </Link>

                <div className="flex flex-col gap-3">
                  <Link
                    href={`https://wa.me/${cleanPhone}`}
                    className="w-full py-3 border border-[#25D366] text-[#25D366] rounded-full text-center hover:bg-[#25D366]/10 transition"
                    target="_blank"
                  >
                    WhatsApp
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <MortgageCalculator propertyPrice={apartment.price} />
      </div>

      <PhotoGalleryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        photos={photos}
        initialIndex={selectedIndex}
      />
    </>
  );
}
