'use client';

import { useState } from 'react';
import clsx from 'clsx';
import NewBuildingCard from '@/ui-components/new-buildings/new-buildings-card';
import {
  useNewBuildings,
  useNewBuildingPhotos,
} from '@/services/new-buildings/hooks';
import type { NewBuildingsFilters } from '@/services/new-buildings/types';

// eslint-disable-next-line
function NewBuildingCardWithPhotos({ building }: { building: any }) {
  const { data: photos } = useNewBuildingPhotos(building.id);

  return (
    <NewBuildingCard
      key={building.id}
      id={building.id}
      slug={building.id.toString()}
      title={building.title}
      subtitle={building.description || ''}
      photos={photos || []}
      image={{
        src:
          photos?.[0]?.path || building.photos?.[0]?.path
            ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${
                photos?.[0]?.path || building.photos?.[0]?.path
              }`
            : '/images/placeholder.png',
        alt: building.title,
      }}
      apartmentOptions={[]}
      location={building.address || 'Душанбе'}
      developer={
        building?.developer?.name
          ? {
              name: building.developer.name,
              logo_path: building.developer.logo_path,
            }
          : {
              name: 'Неизвестно',
              logo_path: '/images/placeholder.png',
            }
      }
      hasInstallmentOption={building.installment_available}
    />
  );
}

export default function NewBuildings() {
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [filters, setFilters] = useState<NewBuildingsFilters>({
    page: 1,
    per_page: 15,
  });

  const { data, isLoading, error } = useNewBuildings(filters);

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  if (isLoading) {
    return (
      <div className="pt-6 pb-[87px] mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-6 pb-[87px] mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <div className="text-center text-red-500 py-20">
          Ошибка загрузки данных
        </div>
      </div>
    );
  }

  const newBuildings = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="pt-6 pb-[87px] mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
      <div className="md:flex justify-between items-center mb-10 bg-white rounded-[22px] p-[30px]">
        <div>
          <h1 className="text-2xl font-bold mb-1.5">Новостройки</h1>
          <p className="text-[#666F8D]">Найдено {total} объектов</p>
        </div>

        <div className="md:mt-0 mt-6 flex items-center gap-2 bg-[#F0F2F5] rounded-full px-3 py-2.5">
          <button
            className={clsx(
              'py-[11px] px-[19px] rounded-full transition-colors cursor-pointer',
              !showOnlyDifferences
                ? 'bg-[#0036A5] text-white'
                : 'bg-white text-gray-700'
            )}
            onClick={() => setShowOnlyDifferences(false)}
          >
            Списком
          </button>
          <button
            className={clsx(
              'py-[11px] px-[19px] rounded-full transition-colors cursor-pointer',
              showOnlyDifferences
                ? 'bg-[#0036A5] text-white'
                : 'bg-white text-gray-700'
            )}
            onClick={() => setShowOnlyDifferences(true)}
          >
            На карте
          </button>
        </div>
      </div>

      {newBuildings.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Новостройки не найдены
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newBuildings.map((building) => (
              <NewBuildingCardWithPhotos
                key={building.id}
                building={building}
              />
            ))}
          </div>

          {/* Pagination */}
          {data && data.last_page && data.last_page > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(data.current_page - 1)}
                disabled={data.current_page === 1}
                className={clsx(
                  'px-4 py-2 rounded',
                  data.current_page === 1
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-[#0036A5] text-white hover:bg-[#002b85]'
                )}
              >
                Назад
              </button>
              <span className="px-4 py-2">
                Страница {data.current_page} из {data.last_page}
              </span>
              <button
                onClick={() => handlePageChange(data.current_page + 1)}
                disabled={data.current_page === data.last_page}
                className={clsx(
                  'px-4 py-2 rounded',
                  data.current_page === data.last_page
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-[#0036A5] text-white hover:bg-[#002b85]'
                )}
              >
                Вперед
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
