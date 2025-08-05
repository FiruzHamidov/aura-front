'use client';

import { FC, useCallback, useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import CableTVIcon from '@/icons/CabelTVIcon';
import ChildZoneIcon from '@/icons/ChildZoneIcon';
import ElevatorIcon from '@/icons/ElevatorIcon';
import GymIcon from '@/icons/GymIcon';
import HeatingIcon from '@/icons/HeatingIcon';
import ParkingIcon from '@/icons/ParkingIcon';
import SecurityIcon from '@/icons/SecurityIcon';
import VideoControlIcon from '@/icons/VideoControlIcon';
import PhotoGalleryModal from '@/ui-components/PhotoGalleryModal';
import { BuildingComponentProps } from './types';

export const BuildingInfo: FC<BuildingComponentProps> = ({ apartmentData }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: apartmentData.images.length > 1,
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

  // Track slide changes
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', onSelect);
    onSelect(); // Set initial index

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
            {apartmentData.title}
          </h1>
          <div className="text-[#666F8D] text-lg mb-2">
            {apartmentData.publishedAt}
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
            {apartmentData.images.map((image, index) => (
              <div
                key={index}
                className="relative min-w-full md:h-[490px] h-[200px] cursor-pointer hover:opacity-95 transition-opacity"
                style={{ flex: '0 0 100%' }}
                onClick={() => openModal(index)}
              >
                <Image
                  src={image}
                  alt={`Apartment image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
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

        {/* Custom navigation buttons */}
        <button
          onClick={scrollPrev}
          className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
          className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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

        {/* Pagination dots */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {apartmentData.images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                selectedIndex === index ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail gallery */}
      <div className="flex gap-2 md:gap-[18px]">
        {apartmentData.images.map((image, index) => (
          <button
            key={index}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors md:h-[120px] w-[120px] cursor-pointer hover:opacity-80 ${
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

      {/* Property Details */}
      <div className="mt-11 grid grid-cols-1 md:grid-cols-2 md:gap-32 gap-0">
        {/* Apartment details */}
        <div>
          <h2 className="text-2xl font-bold mb-6">О ЖК</h2>
          <div className="flex flex-col space-y-4 text-sm">
            <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
              <span className="text-[#666F8D]">Тип жилья</span>
              <span>{apartmentData.apartment.type}</span>
            </div>
            <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
              <span className="text-[#666F8D]">Общая площадь</span>
              <span>{apartmentData.apartment.area}</span>
            </div>
            <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
              <span className="text-[#666F8D]">Санузел</span>
              <span>{apartmentData.apartment.bathroom}</span>
            </div>
            <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
              <span className="text-[#666F8D]">Ремонт</span>
              <span>{apartmentData.apartment.repair}</span>
            </div>
            <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
              <span className="text-[#666F8D]">Район</span>
              <span>{apartmentData.apartment.district}</span>
            </div>
          </div>
        </div>

        {/* Building details */}
        <div>
          <h2 className="md:block hidden text-2xl font-bold mb-6 text-white">
            surpise surpise
          </h2>
          <div className="flex flex-col space-y-4 text-sm mt-6">
            <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
              <span className="text-[#666F8D]">Год постройки</span>
              <span>{apartmentData.building.year}</span>
            </div>
            <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
              <span className="text-[#666F8D]">Количество лифтов</span>
              <span>{apartmentData.building.elevators}</span>
            </div>
            <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
              <span className="text-[#666F8D]">Тип дома</span>
              <span>{apartmentData.building.type}</span>
            </div>
            <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
              <span className="text-[#666F8D]">Парковка</span>
              <span>{apartmentData.building.parking}</span>
            </div>
            <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
              <span className="text-[#666F8D]">Отопление</span>
              <span>{apartmentData.building.heating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-5">ЖК Норак Ривер</h2>
        <div className="text-[#666F8D] whitespace-pre-line">
          {apartmentData.description}
        </div>
      </div>

      {/* Amenities and features section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6 md:mb-10">
          Удобства и особенности
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[22px]">
          <div className="flex items-center">
            <ElevatorIcon className="w-8 h-8 mr-1" />

            <span className="text-[#666F8D] text-lg mb-2">
              Скоростные лифты
            </span>
          </div>

          <div className="flex items-center">
            <ParkingIcon className="w-8 h-8 mr-1" />

            <span className="text-[#666F8D] text-lg mb-2">
              Подземная парковка
            </span>
          </div>

          <div className="flex items-center">
            <VideoControlIcon className="w-8 h-8 mr-1" />

            <span className="text-[#666F8D] text-lg mb-2">Видеонаблюдение</span>
          </div>

          <div className="flex items-center">
            <SecurityIcon className="w-8 h-8 mr-1" />

            <span className="text-[#666F8D] text-lg mb-2">Охрана</span>
          </div>

          <div className="flex items-center">
            <ChildZoneIcon className="w-8 h-8 mr-1" />

            <span className="text-[#666F8D] text-lg mb-2">
              Детская площадка
            </span>
          </div>

          <div className="flex items-center">
            <GymIcon className="w-8 h-8 mr-1" />

            <span className="text-[#666F8D] text-lg mb-2">Фитнес-центр</span>
          </div>

          <div className="flex items-center">
            <HeatingIcon className="w-8 h-8 mr-1" />

            <span className="text-[#666F8D] text-lg mb-2">Отопление</span>
          </div>

          <div className="flex items-center">
            <CableTVIcon className="w-8 h-8 mr-1" />

            <span className="text-[#666F8D] text-lg mb-2">
              Кабельное телевидение
            </span>
          </div>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      <PhotoGalleryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        photos={apartmentData.images}
        initialIndex={selectedIndex}
      />
    </div>
  );
};
