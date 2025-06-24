import BusIcon from '@/icons/BusIcon';
import ChildZoneIcon from '@/icons/ChildZoneIcon';
import DownTownIcon from '@/icons/DownTownIcon';
import GymIcon from '@/icons/GymIcon';
import HospitalIcon from '@/icons/HospitalIcon';
import MarketIcon from '@/icons/MarketIcon';
import MosqueIcon from '@/icons/MosqueIcon';
import ParkIcon from '@/icons/ParkIcon';
import SchoolIcon from '@/icons/SchoolIcon';
import Image from 'next/image';

export const ComfortNearby = () => {
  return (
    <div className="bg-white rounded-[22px] px-4 py-5 md:py-10 md:px-[60px] mt-5">
      <h2 className="text-2xl font-bold mb-6 md:mb-8">Удобства рядом</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-y-8 gap-6">
        <div className="flex items-center">
          <div className="text-[#0036A5] mr-1">
            <MosqueIcon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[#667085] text-lg">Мечеть: </span>
            <span className="text-lg">830 м.</span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="text-[#0036A5] mr-1">
            <BusIcon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[#667085] text-lg">
              Общественный транспорт:{' '}
            </span>
            <span className="text-lg">160 м.</span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="text-[#0036A5] mr-1">
            <DownTownIcon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[#667085] text-lg">Центр города: </span>
            <span className="text-lg">700 м.</span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="text-[#0036A5] mr-1">
            <HospitalIcon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[#667085] text-lg">Больница: </span>
            <span className="text-lg">1,3 км.</span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="text-[#0036A5] mr-1">
            <GymIcon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[#667085] text-lg">Тренажерный зал: </span>
            <span className="text-lg">1 км.</span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="text-[#0036A5] mr-1">
            <ParkIcon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[#667085] text-lg">Парк: </span>
            <span className="text-lg">1,05 км.</span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="text-[#0036A5] mr-1">
            <SchoolIcon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[#667085] text-lg">Школа: </span>
            <span className="text-lg">600 м.</span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="text-[#0036A5] mr-1">
            <ChildZoneIcon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[#667085] text-lg">Детский сад: </span>
            <span className="text-lg">430 м.</span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="text-[#0036A5] mr-1">
            <MarketIcon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[#667085] text-lg">Супермаркет: </span>
            <span className="text-lg">430 м.</span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-10 md:mt-16 mb-6 md:mb-10">
        Расположение на карте
      </h2>

      <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
        <Image
          src="/images/buildings/map.png"
          alt="Расположение на карте"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};
