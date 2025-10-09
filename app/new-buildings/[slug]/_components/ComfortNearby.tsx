import { FC } from 'react';
import BusIcon from '@/icons/BusIcon';
import ChildZoneIcon from '@/icons/ChildZoneIcon';
import DownTownIcon from '@/icons/DownTownIcon';
import GymIcon from '@/icons/GymIcon';
import HospitalIcon from '@/icons/HospitalIcon';
import MarketIcon from '@/icons/MarketIcon';
import MosqueIcon from '@/icons/MosqueIcon';
import ParkIcon from '@/icons/ParkIcon';
import SchoolIcon from '@/icons/SchoolIcon';
import { NewBuilding, NearbyPlace } from '@/services/new-buildings/types';

interface ComfortNearbyProps {
  building: NewBuilding;
}

// Map place types to icons and labels
const placeConfig: Record<
  NearbyPlace['type'],
  { icon: React.ComponentType<{ className?: string }>; label: string }
> = {
  mosque: { icon: MosqueIcon, label: 'Мечеть' },
  bus_stop: { icon: BusIcon, label: 'Общественный транспорт' },
  downtown: { icon: DownTownIcon, label: 'Центр города' },
  hospital: { icon: HospitalIcon, label: 'Больница' },
  gym: { icon: GymIcon, label: 'Тренажерный зал' },
  park: { icon: ParkIcon, label: 'Парк' },
  school: { icon: SchoolIcon, label: 'Школа' },
  kindergarten: { icon: ChildZoneIcon, label: 'Детский сад' },
  supermarket: { icon: MarketIcon, label: 'Супермаркет' },
};

// Format distance in meters to readable format
const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters} м.`;
  }
  return `${(meters / 1000).toFixed(2)} км.`;
};

export const ComfortNearby: FC<ComfortNearbyProps> = ({ building }) => {
  const nearbyPlaces = building.nearby_places || [];
  const hasNearbyPlaces = nearbyPlaces.length > 0;

  return (
    <div className="bg-white rounded-[22px] px-4 py-5 md:py-10 md:px-[60px] mt-5">
      {hasNearbyPlaces && (
        <>
          <h2 className="text-2xl font-bold mb-6 md:mb-8">Удобства рядом</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-y-8 gap-6">
            {nearbyPlaces.map((place) => {
              const config = placeConfig[place.type];
              if (!config) return null;

              const Icon = config.icon;

              return (
                <div key={place.id} className="flex items-center">
                  <div className="text-[#0036A5] mr-1">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[#667085] text-lg">
                      {config.label}:{' '}
                    </span>
                    <span className="text-lg">
                      {formatDistance(place.distance)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <h2
        className={`text-2xl font-bold mb-6 md:mb-10 ${
          hasNearbyPlaces ? 'mt-10 md:mt-16' : ''
        }`}
      >
        Расположение на карте
      </h2>

      {building.latitude && building.longitude ? (
        <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
          <iframe
            src={`https://www.google.com/maps?q=${building.latitude},${building.longitude}&hl=ru&z=15&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Расположение на карте"
          />
        </div>
      ) : (
        <div className="relative h-[400px] w-full rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <p className="text-[#667085]">Координаты местоположения не указаны</p>
        </div>
      )}
    </div>
  );
};
