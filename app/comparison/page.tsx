// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import { useState } from 'react';
import clsx from 'clsx';
import SmallCard from '@/ui-components/small-card/small-card';

const properties = [
  {
    id: 1,
    images: [{ url: '/images/buy/1.png', alt: 'Property image 1' }],
    price: 2000,
    currency: 'с.',
    title: '2-комн. квартира, 9 этаж, 78 м²',
    locationName: 'Фирдавси',
    description: 'Зеленый базар',
    roomCountLabel: '2-ком',
    area: 78,
    floorInfo: '3/12 этаж',
    agent: {
      name: 'Махзуна Шоева',
      role: 'топ-риелтор',
    },
    date: '23.10.2023',
    attributes: {
      'Общая площадь': '19.30 м²',
      'Жилая площадь': '8.00 м²',
      Город: 'Душанбе',
      Этаж: '2',
      Балкон: 'Нет',
      'Материал стен': 'кирпичный',
      'Вид из окон': '2',
      Комнаты: 'изолированная',
      Ремонт: 'требует ремонта',
      Санузел: 'совмещенный',
      Лифт: 'Нет',
    },
  },
  {
    id: 2,
    images: [{ url: '/images/buy/2.jpeg', alt: 'Property image 2' }],
    price: 3000,
    currency: 'с.',
    title: '2-комн. квартира, 9 этаж, 78 м²',
    locationName: 'Сино',
    description: 'Зеленый базар',
    roomCountLabel: '2-ком',
    area: 78,
    floorInfo: '3/12 этаж',
    agent: {
      name: 'Мехрой Хизматов',
      role: 'топ-риелтор',
    },
    date: '23.10.2023',
    attributes: {
      'Общая площадь': '69.00 м²',
      'Жилая площадь': '10.00 м²',
      Город: 'Худжанд',
      Этаж: '12',
      Балкон: 'Нет',
      'Материал стен': 'блочный',
      'Вид из окон': '5',
      Комнаты: 'изолированная',
      Ремонт: 'Евроремонт',
      Санузел: 'раздельный',
      Лифт: 'Есть',
    },
  },
];

// Define attribute labels and their order for the comparison table
const attributeLabels = [
  'Общая площадь',
  'Жилая площадь',
  'Город',
  'Этаж',
  'Балкон',
  'Материал стен',
  'Вид из окон',
  'Комнаты',
  'Ремонт',
  'Санузел',
  'Лифт',
];

export default function Comparison() {
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);

  const hasDifference = (attribute: string) => {
    return (
      properties[0].attributes[attribute] !==
      properties[1].attributes[attribute]
    );
  };

  const filteredAttributes = attributeLabels.filter(
    (attr) => !showOnlyDifferences || hasDifference(attr)
  );

  return (
    <div className="container py-6">
      {/* Header section */}
      <div className="flex justify-between items-center mb-10 bg-white rounded-[22px] p-[30px]">
        <div>
          <h1 className="text-2xl font-bold">Сравнение</h1>
          <p className="text-[#666F8D]">Найдено 2 объекта</p>
        </div>

        <div className="flex items-center gap-2 bg-[#F0F2F5] rounded-full px-3 py-2.5">
          <button
            className={clsx(
              'py-[11px] px-[19px] rounded-full transition-colors cursor-pointer',
              !showOnlyDifferences
                ? 'bg-[#0036A5] text-white'
                : 'bg-white text-gray-700'
            )}
            onClick={() => setShowOnlyDifferences(false)}
          >
            Все параметры
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
            Только различия
          </button>
        </div>
      </div>

      {/* Property cards - using the custom BuyCard component */}
      <div className="grid grid-cols-4 gap-[14px] mb-[53px]">
        {properties.map((property) => (
          <div key={property.id} className="relative">
            <SmallCard
              listing={{
                id: property.id,
                images: [
                  { url: property.images[0].url, alt: property.images[0].alt },
                ],
                price: property.price,
                currency: property.currency,
                title: property.title,
                locationName: property.locationName,
                description: property.description,
                roomCountLabel: property.roomCountLabel,
                area: property.area,
                floorInfo: property.floorInfo,
                agent: {
                  name: property.agent.name,
                  role: property.agent.role,
                },
                date: property.date,
              }}
            />
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="bg-white rounded-[22px] overflow-hidden mb-[83px]">
        {filteredAttributes.map((attribute) => {
          const isLightBackground = [
            'Жилая площадь',
            'Этаж',
            'Материал стен',
            'Комнаты',
            'Санузел',
          ].includes(attribute);

          return (
            <div
              key={attribute}
              className={clsx(
                'flex',
                isLightBackground ? 'bg-[#EFF6FF]' : 'bg-white'
              )}
            >
              <div className="w-2/3 flex">
                <div className="w-1/2 px-[30px] py-4 font-medium">
                  <div className="w-1/3 h-6 mb-3 text-lg text-[#667085] text-nowrap whitespace-nowrap">
                    {attribute}
                  </div>

                  {attribute.includes('площадь') ? (
                    <div className="text-2xl font-normal">
                      {properties[0].attributes[attribute].split('м²')[0]}
                      <span>
                        м<sup>2</sup>
                      </span>
                    </div>
                  ) : (
                    <div className="text-2xl font-normal">
                      {properties[0].attributes[attribute]}
                    </div>
                  )}
                </div>

                <div className="w-1/2 px-[30px] py-4 font-medium">
                  <div className="w-1/3 h-6 mb-3" />
                  {attribute.includes('площадь') ? (
                    <div className="text-2xl font-normal">
                      {properties[1].attributes[attribute].split('м²')[0]}
                      <span>
                        м<sup>2</sup>
                      </span>
                    </div>
                  ) : (
                    <div className="text-2xl font-normal">
                      {properties[1].attributes[attribute]}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
