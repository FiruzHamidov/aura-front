'use client';

import { FC, useCallback, useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import PhotoGalleryModal from '@/ui-components/PhotoGalleryModal';
import type {
  NewBuilding,
  NewBuildingPhoto,
} from '@/services/new-buildings/types';
import { STORAGE_URL } from '@/constants/base-url';

interface BuildingInfoProps {
  building: NewBuilding;
  photos: NewBuildingPhoto[];
}

export const BuildingInfo: FC<BuildingInfoProps> = ({ building, photos }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log({ building });

  const displayImages =
    photos.length > 0
      ? photos
          .sort(
            (a, b) =>
              (a.sort_order || a.order || 0) - (b.sort_order || b.order || 0)
          )
          .map((photo) =>
            photo.path
              ? `${STORAGE_URL}/${photo.path}`
              : photo.url || '/images/placeholder.png'
          )
      : ['/images/placeholder.png'];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: displayImages.length > 1,
  });

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
        setSelectedIndex(index);
      }
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

  const openModal = (index?: number) => {
    if (index !== undefined) {
      setSelectedIndex(index);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-[22px] px-4 py-5 md:py-10 md:px-[60px]">
      {/* Header section */}
      <div className="flex justify-between items-start mb-4 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold mb-0.5">
            {building.title}
          </h1>
          <div className="text-[#666F8D] text-lg mb-2">
            {building.address || 'Душанбе'}
          </div>
        </div>
      </div>

      {/* Image gallery with Embla */}
      <div className="relative mb-3 md:mb-5">
        <div
          className="overflow-hidden rounded-xl cursor-pointer"
          ref={emblaRef}
        >
          <div className="flex">
            {displayImages.map((image, index) => (
              <div
                key={index}
                className="relative min-w-full md:h-[490px] h-[200px] cursor-pointer hover:opacity-95 transition-opacity"
                style={{ flex: '0 0 100%' }}
                onClick={() => openModal(index)}
              >
                <Image
                  src={image}
                  alt={`${building.title} - фото ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="bg-white/90 px-3 py-1 rounded-full text-sm text-gray-800">
                    Нажмите для увеличения
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
              className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="#333"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Pagination dots */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    selectedIndex === index ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => scrollTo(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail gallery */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 md:gap-[18px] overflow-x-auto">
          {displayImages.map((image, index) => (
            <button
              key={index}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors md:h-[120px] w-[120px] cursor-pointer hover:opacity-80 shrink-0 ${
                selectedIndex === index
                  ? 'border-[#0036A5] border-4'
                  : 'border-transparent hover:border-[#0036A5]/50'
              }`}
              onClick={() => scrollTo(index)}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Property Details */}
      <div className="mt-11 grid grid-cols-1 md:grid-cols-2 md:gap-32 gap-0">
        {/* Building details */}
        <div>
          <h2 className="text-2xl font-bold mb-6">О ЖК</h2>
          <div className="flex flex-col space-y-4 text-sm">
            {building.stage && (
              <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                <span className="text-[#666F8D]">Стадия строительства</span>
                <span>{building.stage.name}</span>
              </div>
            )}
            {building.material && (
              <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                <span className="text-[#666F8D]">Материал</span>
                <span>{building.material.name}</span>
              </div>
            )}
            {building.floors_range && (
              <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                <span className="text-[#666F8D]">Этажность</span>
                <span>{building.floors_range}</span>
              </div>
            )}
            {building.completion_at && (
              <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                <span className="text-[#666F8D]">Срок сдачи</span>
                <span>
                  {new Date(building.completion_at).toLocaleDateString('ru-RU')}
                </span>
              </div>
            )}
            {building.heating !== undefined && (
              <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                <span className="text-[#666F8D]">Отопление</span>
                <span>{building.heating ? 'Да' : 'Нет'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional details */}
        <div>
          <h2 className="md:block hidden text-2xl font-bold mb-6 text-white">
            Особенности
          </h2>
          <div className="flex flex-col space-y-4 text-sm mt-6">
            {building.installment_available !== undefined && (
              <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                <span className="text-[#666F8D]">Рассрочка</span>
                <span>
                  {building.installment_available ? 'Доступна' : 'Нет'}
                </span>
              </div>
            )}
            {building.has_terrace !== undefined && (
              <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                <span className="text-[#666F8D]">Терраса</span>
                <span>{building.has_terrace ? 'Да' : 'Нет'}</span>
              </div>
            )}
            {building.latitude && building.longitude && (
              <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                <span className="text-[#666F8D]">Координаты</span>
                <span className="text-xs">
                  {Number(building.latitude).toFixed(4)},{' '}
                  {Number(building.longitude).toFixed(4)}
                </span>
              </div>
            )}
            {building.ceiling_height && (
              <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                <span className="text-[#666F8D]">Высота потолков</span>
                <span>{building.ceiling_height} м</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {building.description && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-5">{building.title}</h2>
          <div className="text-[#666F8D] whitespace-pre-line">
            {building.description}
          </div>
        </div>
      )}

      {/* Features section */}
      {building.features && building.features.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 md:mb-10">
            Удобства и особенности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[22px]">
            {building.features.map((feature) => (
              <div key={feature.id} className="flex items-center">
                <span className="text-[#666F8D] text-lg">{feature.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Gallery Modal */}
      <PhotoGalleryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        photos={displayImages}
        initialIndex={selectedIndex}
      />
    </div>
  );
};
