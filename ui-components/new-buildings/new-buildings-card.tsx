'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
}) => {
  const href = slug ? `/new-buildings/${slug}` : `/new-buildings/${id}`;

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <div
      className={`bg-white p-[18px] rounded-[22px] overflow-hidden transition-shadow duration-200 ${className}`}
      onClick={onClick}
    >
      {/* Building image */}
      <Link href={href}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      </Link>

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
              <div className="text-right  text-[#666F8D]">
                {formatPrice(option.price)} {option.currency || 'с.'}
              </div>
            </div>
          ))}
        </div>

        <div className="text-[#666F8D] mb-3">{location}</div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-[60px] h-[60px] relative mr-3 overflow-hidden rounded-full">
              <Image
                src={`${STORAGE_URL}/${developer.logo_path}`}
                alt={`${developer.name} logo`}
                fill
              />
            </div>
            <span className="text-lg">{developer.name}</span>
          </div>

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
