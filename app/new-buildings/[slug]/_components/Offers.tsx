import { FC } from 'react';
import BedIcon from '@/icons/BedIcon';
import FloorIcon from '@/icons/FloorIcon';
import PlanIcon from '@/icons/PlanIcon';
import ShowerIcon from '@/icons/ShowerIcon';
import Image from 'next/image';
import type { NewBuilding } from '@/services/new-buildings/types';

interface OffersProps {
  building: NewBuilding;
}

export const Offers: FC<OffersProps> = ({ building }) => {
  const units = building.units || [];

  if (units.length === 0) {
    return (
      <div className="bg-white rounded-[22px] px-4 py-5 md:py-10 md:px-[60px] mt-5">
        <h2 className="text-2xl font-bold mb-6 md:mb-8">Предложения</h2>
        <div className="text-[#666F8D]">
          Информация о доступных квартирах скоро появится
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[22px] px-4 py-5 md:py-10 md:px-[60px] mt-5">
      <h2 className="text-2xl font-bold mb-6 md:mb-8">Предложения</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {units.map((unit) => (
          <div
            key={unit.id}
            className="bg-[#F7FAFD] rounded-xl overflow-hidden"
          >
            <div className="relative h-[188px] w-full bg-[#F0F7FF] rounded-xl mb-4 px-12 py-[18px]">
              <Image
                fill
                src="/images/buildings/plans/1.png"
                alt={unit.name ?? `Plan + ${unit.id}`}
                className="object-contain p-2 rotate-270"
              />
            </div>

            <div className="px-4 pb-4">
              <h3 className="text-xl font-semibold mb-1">
                {unit.bedrooms} комнатная квартира
              </h3>
              <p className="text-[#667085] mb-3 text-sm">
                {unit.description || `Квартира ${unit.name}`}
              </p>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1 text-[#667085]">
                  <BedIcon className="w-5 h-5 mr-1" />
                  <span>{unit.bedrooms}</span>
                </div>

                <div className="flex items-center gap-1 text-[#667085]">
                  <ShowerIcon className="w-5 h-5 mr-1" />
                  <span>{unit.bathrooms}</span>
                </div>

                <div className="flex items-center gap-1 text-[#667085]">
                  <PlanIcon className="w-5 h-5 mr-1" />
                  <span>{parseFloat(unit.area ?? '1').toFixed(1)} м²</span>
                </div>

                <div className="flex items-center gap-1 text-[#667085]">
                  <FloorIcon className="w-5 h-5 mr-1" />
                  <span>{unit.floor}</span>
                </div>
              </div>

              <div className="flex items-center">
                <span className="text-[#0036A5] text-2xl font-bold">
                  {parseFloat(unit.total_price ?? '0').toLocaleString('ru-RU', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  с.
                </span>
                <span className="ml-auto text-sm text-[#667085]">
                  {parseFloat(unit.price_per_sqm ?? '0').toLocaleString(
                    'ru-RU',
                    {
                      maximumFractionDigits: 0,
                    }
                  )}{' '}
                  с./м²
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
