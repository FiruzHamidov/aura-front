'use client';

import { useState } from 'react';
import clsx from 'clsx';
import NewBuildingCard from '@/ui-components/new-buildings/new-buildings-card';

const newBuildings = [
  {
    id: 1,
    slug: 'norak-river',
    title: 'ЖК Норак Ривер',
    subtitle: 'Квартиры 6-10 этаж готов 4кв 2025',
    image: {
      src: '/images/buildings/norak.png',
      alt: 'ЖК Норак Ривер',
    },
    apartmentOptions: [
      { rooms: 1, area: 58, price: 420000 },
      { rooms: 1, area: 72, price: 532000 },
      { rooms: 2, area: 121, price: 800000 },
    ],
    location: 'Душанбе, Телман (Кукольный Театр "Лухтак")',
    developer: {
      name: 'МБ Бехруз',
      logo: '/images/developers/behruz.png',
    },
    hasInstallmentOption: false,
  },
  {
    id: 2,
    slug: 'khonai-orzu',
    title: 'ЖК Хонаи Орзу',
    subtitle: 'Квартиры 6-10 этаж готов 4кв 2025',
    image: {
      src: '/images/buildings/orzu.png',
      alt: 'ЖК Хонаи Орзу',
    },
    apartmentOptions: [
      { rooms: 1, area: 58, price: 420000 },
      { rooms: 1, area: 72, price: 532000 },
      { rooms: 2, area: 121, price: 800000 },
    ],
    location: 'Душанбе, Телман (Кукольный Театр "Лухтак")',
    developer: {
      name: 'Хонаи Орзу',
      logo: '/images/developers/orzu.png',
    },
    hasInstallmentOption: true,
  },
  {
    id: 3,
    slug: 'elite-house',
    title: 'ЖК ELite House',
    subtitle: 'Квартиры 6-10 этаж готов 4кв 2025',
    image: {
      src: '/images/buildings/elite.png',
      alt: 'ЖК ELite House',
    },
    apartmentOptions: [
      { rooms: 1, area: 58, price: 420000 },
      { rooms: 1, area: 72, price: 532000 },
      { rooms: 2, area: 121, price: 800000 },
    ],
    location: 'Душанбе, Телман (Кукольный Театр "Лухтак")',
    developer: {
      name: 'Ориф Сохтмон',
      logo: '/images/developers/orif.png',
    },
    hasInstallmentOption: true,
  },
];

export default function NewBuildings() {
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);

  return (
    <div className="pt-6 pb-[87px] container">
      <div className="md:flex justify-between items-center mb-10 bg-white rounded-[22px] p-[30px]">
        <div>
          <h1 className="text-2xl font-bold mb-1.5">Новостройки</h1>
          <p className="text-[#666F8D]">Найдено 750 объектов</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newBuildings.map((building) => (
          <NewBuildingCard
            key={building.id}
            id={building.id}
            slug={building.slug}
            title={building.title}
            subtitle={building.subtitle}
            image={building.image}
            apartmentOptions={building.apartmentOptions}
            location={building.location}
            developer={building.developer}
            hasInstallmentOption={building.hasInstallmentOption}
          />
        ))}
      </div>
    </div>
  );
}
