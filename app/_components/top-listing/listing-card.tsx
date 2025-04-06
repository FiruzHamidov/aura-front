import { FC } from 'react';
import Image from 'next/image';
import { Listing } from './types';
import HeartIcon from '@/icons/HeartIcon';
import SettingsIcon from '@/icons/SettingsIcon';

interface ListingCardProps {
  listing: Listing;
  isLarge?: boolean;
}

const ListingCard: FC<ListingCardProps> = ({ listing, isLarge = false }) => {
  const formattedPrice = listing.price.toLocaleString('ru-RU');

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <Image
          src={listing.imageUrl}
          alt={listing.imageAlt || `Фото ${listing.title}`}
          width={600}
          height={400}
          className="w-full object-cover aspect-[4/3]"
        />
        {listing.isTop && (
          <span className="absolute top-[22px] left-[22px] bg-[#E1C116] text-[#020617] text-lg font-bold px-6 py-1.5 rounded-full shadow">
            ТОП
          </span>
        )}
        <div className="absolute top-[22px] right-[22px] flex flex-col space-y-2">
          <div className="!bg-white/30 p-2 rounded-full shadow transition w-9 h-9">
            <HeartIcon className="w-[18px] h-[18px]" />
          </div>
          <div className="!bg-white/30 p-2 rounded-full shadow transition w-9 h-9">
            <SettingsIcon className="w-[18px] h-[18px]" />
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
          <span className="block w-2 h-2 bg-white rounded-full opacity-90"></span>
          <span className="block w-2 h-2 bg-white rounded-full opacity-50"></span>
          <span className="block w-2 h-2 bg-white rounded-full opacity-50"></span>
          <span className="block w-2 h-2 bg-white rounded-full opacity-50"></span>
        </div>
      </div>

      <div className={`p-4 flex flex-col flex-grow ${isLarge ? 'md:p-6' : ''}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl lg:text-2xl font-bold text-blue-900">
            {formattedPrice} {listing.currency}
          </span>
          <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {/* <FaMapMarkerAlt className="mr-1 text-gray-400" /> */}
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

        <div className="flex items-center space-x-3 text-xs text-gray-500 mb-4">
          <span>{listing.roomCountLabel}</span>
          <span className="text-gray-300">|</span>
          <span>{listing.area} кв/м²</span>
          <span className="text-gray-300">|</span>
          <span>{listing.floorInfo}</span>
        </div>

        {listing.agent && listing.date && (
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center">
              {listing.agent.avatarUrl ? (
                <Image
                  src={listing.agent.avatarUrl}
                  alt={listing.agent.name}
                  width={24}
                  height={24}
                  className="rounded-full mr-2"
                />
              ) : (
                <div>icon</div>
              )}
              <div>
                <div className="font-medium">{listing.agent.name}</div>
                <div className="text-gray-500">{listing.agent.role}</div>
              </div>
            </div>
            <div className="flex items-center">
              {/* <FaCalendarAlt className="mr-1 text-gray-400" /> */}
              {listing.date}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
