'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { NewBuildingCardProps } from './types';
import BedIcon from '@/icons/BedIcon';
import PlanIcon from '@/icons/PlanIcon';
import { STORAGE_URL } from '@/constants/base-url';

const NewBuildingCard: FC<NewBuildingCardProps> = ({
  id,
  slug,
  title,
  subtitle,
  image,
  apartmentOptions,
  location,
  developer,
  hasInstallmentOption = false,
  className = '',
  onClick,
  photos = [],
}) => {
  const href = slug ? `/new-buildings/${slug}` : `/new-buildings/${id}`;

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

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Prepare display images
  const displayImages =
    photos && photos.length > 0
      ? photos.map((photo, index) => ({
          url: photo.path
            ? `${STORAGE_URL}/${photo.path}`
            : photo.url || '/images/placeholder.png',
          alt: `${title} - фото ${index + 1}`,
        }))
      : [
          {
            url: image.src,
            alt: image.alt,
          },
        ];

  return (
    <div
      className={`bg-white p-[18px] rounded-[22px] overflow-hidden transition-shadow duration-200 ${className}`}
      onClick={onClick}
    >
      {/* Building image slider */}
      <div className="relative mb-3">
        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
          <div className="flex">
            {displayImages.map((img, index) => (
              <div className="min-w-full relative" key={index}>
                <Link href={href}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === 0}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel dots */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
            {displayImages.map((_, index) => (
              <button
                key={index}
                className={`block w-2 h-2 bg-white rounded-full transition-opacity ${
                  index === selectedIndex ? 'opacity-90' : 'opacity-50'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  scrollTo(index);
                }}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="pt-5">
        {/* Building title and subtitle */}
        <Link href={href}>
          <h3 className="text-2xl font-bold mb-0.5">{title}</h3>
        </Link>
        <div className="text-[#666F8D] text-sm mb-3">{subtitle}</div>

        <div className="space-y-4 mb-5">
          {apartmentOptions.map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center">
                <div className="flex items-center text-[#666F8D] mr-2">
                  <BedIcon className="w-5 h-5 mr-1" />
                  {option.rooms}
                </div>
                <div className="flex items-center text-[#666F8D]">
                  <PlanIcon className="w-5 h-5 mr-1" />
                  {option.area} м²
                </div>
              </div>
              <div className="text-right text-[#666F8D]">
                {formatPrice(option.price)} {option.currency || 'с.'}
              </div>
            </div>
          ))}
        </div>

        <div className="text-[#666F8D] mb-3">{location}</div>

        <div className="flex items-center justify-between">
          <Link href={`/developers/${developer.id}`}>
            <div className="flex items-center">
              <div className="w-[60px] h-[60px] relative mr-3 overflow-hidden rounded-full">
                <Image
                  src={`${STORAGE_URL}/${developer.logo_path}`}
                  alt={`${developer.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-lg">{developer.name}</span>
            </div>
          </Link>

          {hasInstallmentOption && (
            <button className="bg-[#00C7EA] text-white px-5 py-1 rounded hover:bg-[#00B0E6] transition-colors">
              Рассрочка
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewBuildingCard;
