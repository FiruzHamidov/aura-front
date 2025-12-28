import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PhoneIcon from '@/icons/PhoneIcon';
import WhatsappGreenIcon from '@/icons/WhatsappGreenIcon';
import type {
  NewBuilding,
  NewBuildingStats,
} from '@/services/new-buildings/types';
import { STORAGE_URL } from '@/constants/base-url';

interface PriceAndBuilderProps {
  building: NewBuilding;
  stats?: NewBuildingStats;
}

export const PriceAndBuilder: FC<PriceAndBuilderProps> = ({
  building,
  stats,
}) => {
  const developer = building.developer;

  if (!developer) {
    return null;
  }

  const phoneNumber = developer.phone || '+992 000 00 00 00';
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');

  // Format price display
  const priceDisplay = stats?.total_price?.formatted || 'По запросу';
  const pricePerSqm = stats?.price_per_sqm?.formatted;

  return (
    <div className="lg:w-1/3">
      <div className="bg-white rounded-[22px] py-[15px] px-[22px] mb-5">
        <div className="text-[#666F8D] text-lg mb-1.5">Цена</div>
        <div className="text-[32px] font-bold text-[#0036A5] mb-1.5">
          {priceDisplay}
        </div>
        <div className="text-lg text-[#666F8D]">{pricePerSqm}</div>
        {building.installment_available && (
          <div className="text-[#666F8D] text-sm">Доступна рассрочка</div>
        )}
      </div>

      <div className="bg-white rounded-[22px] px-4 py-5 md:px-8 md:py-10">
        <Link href={`/developers/${developer.id}`}>
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            {developer.logo_path && (
              <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden">
                <Image
                  src={`${STORAGE_URL}/${developer.logo_path}`}
                  alt={developer.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold mb-0.5">{developer.name}</h3>
              <div className="text-[#666F8D]">Застройщик</div>
            </div>
          </div>
        </Link>

        {developer.description && (
          <div className="text-[#666F8D] mb-4">{developer.description}</div>
        )}

        {developer.website && (
          <div className="mb-4">
            <Link
              href={developer.website}
              target="_blank"
              className="text-[#0036A5] hover:underline"
            >
              {developer.website}
            </Link>
          </div>
        )}

        <div className="mt-[14px] text-[#666F8D] text-lg space-y-2 md:space-y-3">
          {developer.under_construction_count !== undefined && (
            <div className="flex items-center justify-between">
              <span>Строится</span>
              <span>{developer.under_construction_count}</span>
            </div>
          )}
          {developer.built_count !== undefined && (
            <div className="flex items-center justify-between">
              <span>Построено</span>
              <span>{developer.built_count}</span>
            </div>
          )}
          {developer.founded_year && (
            <div className="flex items-center justify-between">
              <span>Год основания</span>
              <span>{developer.founded_year}</span>
            </div>
          )}
          {developer.total_projects !== undefined && (
            <div className="flex items-center justify-between">
              <span>Всего проектов</span>
              <span>{developer.total_projects}</span>
            </div>
          )}
        </div>
      </div>

      {phoneNumber && (
        <>
          <div className="bg-white rounded-[22px] px-8 py-4 mt-5">
            <Link
              href={`tel:${cleanPhone}`}
              className="w-full rounded-full flex items-center"
            >
              <div className="bg-[#0036A5] p-2.5 rounded-full w-11 h-11 mr-2">
                <PhoneIcon className="w-8 h-8 mr-1" />
              </div>
              <div>
                <div className="text-sm text-[#666F8D] mb-0.5">
                  Телефон застройщика
                </div>
                <div className="text-2xl font-bold">{phoneNumber}</div>
              </div>
            </Link>
          </div>

          <div className="bg-[#22C55E] text-white rounded-[22px] px-8 py-4 mt-5">
            <Link
              target="_blank"
              href={`https://wa.me/${cleanPhone}`}
              className="w-full rounded-full flex items-center"
            >
              <div className="flex items-center justify-center bg-white rounded-full w-11 h-11 mr-2">
                <WhatsappGreenIcon className="w-8 h-8 mr-1" />
              </div>
              <div>
                <div className="text-sm mb-0.5">Написать в</div>
                <div className="text-2xl font-bold">Whatsapp</div>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
