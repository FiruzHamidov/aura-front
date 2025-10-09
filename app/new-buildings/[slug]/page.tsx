'use client';

import { useParams } from 'next/navigation';
import { PriceAndBuilder } from './_components/PriceAndBuilder';
import { Offers } from './_components/Offers';
import { ComfortNearby } from './_components/ComfortNearby';
import { BuildingInfo } from './_components/BuildingInfo';
import {
  useNewBuilding,
  useNewBuildingPhotos,
} from '@/services/new-buildings/hooks';

export default function NewBuilding() {
  const params = useParams<{ slug: string }>();
  const id = Number(params.slug);

  const { data: buildingResponse, isLoading } = useNewBuilding(id);
  const { data: photos } = useNewBuildingPhotos(id);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-[22px] mb-5" />
          <div className="h-64 bg-gray-200 rounded-[22px]" />
        </div>
      </div>
    );
  }

  if (!buildingResponse) {
    return (
      <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="text-center">Новостройка не найдена</div>
      </div>
    );
  }

  const building = buildingResponse.data;
  const stats = buildingResponse.stats;

  return (
    <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8 pt-8 pb-12">
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="lg:w-2/3">
          <BuildingInfo building={building} photos={photos || []} />
          <Offers building={building} />
          <ComfortNearby building={building} />
        </div>

        <PriceAndBuilder building={building} stats={stats} />
      </div>
    </div>
  );
}
