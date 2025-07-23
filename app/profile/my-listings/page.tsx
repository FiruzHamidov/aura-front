'use client';

import Link from 'next/link';
import BuyCard from '@/app/_components/buy/buy-card';
import { useGetPropertiesQuery } from '@/services/properties/hooks';
import { Property } from '@/services/properties/types';

export default function MyListings() {
  const { data: properties, isLoading } = useGetPropertiesQuery({}, true);

  if (isLoading) {
    return (
      <div className="container">
        <div className="bg-white rounded-[22px] p-[30px] my-10">
          <h1 className="text-2xl font-bold text-[#020617] mb-1">
            Мои объявления
          </h1>
          <p className="text-[#666F8D]">Загрузка объявлений...</p>
        </div>
      </div>
    );
  }

  if (!properties || properties.data.length === 0) {
    return (
      <div className="container">
        <div className="bg-white rounded-[22px] p-[30px] my-10">
          <h1 className="text-2xl font-bold text-[#020617] mb-1">
            Мои объявления
          </h1>
          <p className="text-[#666F8D]">У вас пока нет объявлений</p>
          <div className="mt-4">
            <Link
              href="/profile/add-post"
              className="bg-[#0036A5] text-white px-4 py-2 rounded-lg"
            >
              Добавить объявление
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="bg-white rounded-[22px] p-[30px] my-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#020617] mb-1">
              Мои объявления
            </h1>
            <p className="text-[#666F8D]">
              Найдено {properties.data.length} объекта
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[14px] mb-10 md:mb-16">
        {properties.data.map((property: Property) => (
          <Link key={property.id} href={`/apartment/${property.id}`}>
            <BuyCard listing={property} />
          </Link>
        ))}
      </div>
    </div>
  );
}
