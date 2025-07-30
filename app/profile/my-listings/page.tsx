'use client';

import { useState } from 'react';
import Link from 'next/link';
import BuyCard from '@/app/_components/buy/buy-card';
import {
  useGetMyPropertiesQuery,
  useGetPropertiesQuery,
} from '@/services/properties/hooks';
import { Property } from '@/services/properties/types';

export default function MyListings() {
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const [page, setPage] = useState(1);

  const isMyListings = activeTab === 'my';
  const filters = { page, listing_type: 'regular' };

  const myQuery = useGetMyPropertiesQuery(filters, true);
  const allQuery = useGetPropertiesQuery(filters);

  const properties = isMyListings ? myQuery.data : allQuery.data;
  const isLoading = isMyListings ? myQuery.isLoading : allQuery.isLoading;

  const tabTitle = isMyListings ? 'Мои объявления' : 'Все объявления';

  const handleTabChange = (tab: 'my' | 'all') => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="md:container">
      <div className="bg-white rounded-[22px] p-[30px] mt-10 sm:mt-0">
        {/* Таб-переключатель */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg text-sm  ${
              activeTab === 'my'
                ? 'bg-[#0036A5] text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => handleTabChange('my')}
          >
            Мои объявления
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm  ${
              activeTab === 'all'
                ? 'bg-[#0036A5] text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => handleTabChange('all')}
          >
            Все объявления
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#020617] mb-1">{tabTitle}</h1>
          {isLoading ? (
            <p className="text-[#666F8D]">Загрузка объявлений...</p>
          ) : !properties || properties.data.length === 0 ? (
            <>
              <p className="text-[#666F8D]">
                {isMyListings
                  ? 'У вас пока нет объявлений'
                  : 'Нет доступных объявлений'}
              </p>
              {isMyListings && (
                <div className="mt-4">
                  <Link
                    href="/profile/add-post"
                    className="bg-[#0036A5] text-white px-4 py-2 rounded-lg"
                  >
                    Добавить объявление
                  </Link>
                </div>
              )}
            </>
          ) : (
            <p className="text-[#666F8D]">Найдено {properties.total} объекта</p>
          )}
        </div>
      </div>

      {/* Карточки */}
      {!isLoading && properties && properties.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 2xl-grid-cols-3 gap-[14px] mb-10 md:mb-16">
            {properties.data.map((property: Property) => (
              <Link key={property.id} href={`/apartment/${property.id}`}>
                <BuyCard listing={property} />
              </Link>
            ))}
          </div>

          {/* Пагинация */}
          <div className="flex justify-center items-center gap-4 mb-10">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={!properties.prev_page_url}
              className={`px-4 py-2 rounded-lg border ${
                properties.prev_page_url
                  ? 'text-[#0036A5] border-[#0036A5]'
                  : 'text-gray-400 border-gray-300 cursor-not-allowed'
              }`}
            >
              ← Назад
            </button>
            <span className="text-[#020617] ">
              Страница {properties.current_page} из {properties.last_page}
            </span>
            <button
              onClick={() =>
                setPage((prev) =>
                  properties.last_page
                    ? Math.min(prev + 1, properties.last_page)
                    : prev + 1
                )
              }
              disabled={!properties.next_page_url}
              className={`px-4 py-2 rounded-lg border ${
                properties.next_page_url
                  ? 'text-[#0036A5] border-[#0036A5]'
                  : 'text-gray-400 border-gray-300 cursor-not-allowed'
              }`}
            >
              Вперёд →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
