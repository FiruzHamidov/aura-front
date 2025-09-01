// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { Tabs } from '@/ui-components/tabs/tabs';
import BuyCard from '../_components/buy/buy-card';

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

const tabs = [
  { label: 'Все параметры', key: 'all' },
  { label: 'Только различия', key: 'differences' },
] as const;

export default function Comparison() {
  const [activeType, setActiveType] = useState<string>('all');

  const hasDifference = (attribute: string) => {
    return (
      properties[0].attributes[attribute] !==
      properties[1].attributes[attribute]
    );
  };

  const filteredAttributes = attributeLabels.filter(
    (attr) => !activeType || hasDifference(attr)
  );

  return (
    <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8 py-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10 bg-white rounded-[22px] p-4 sm:p-[30px]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Сравнение</h1>
          <p className="text-[#666F8D] text-sm sm:text-base">
            Найдено 2 объекта
          </p>
        </div>

        <div className="w-full sm:w-auto overflow-x-auto hide-scrollbar">
          <Tabs
            tabs={tabs}
            activeType={activeType}
            setActiveType={setActiveType}
          />
        </div>
      </div>

      {/* Property cards - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-[30px] mb-8 sm:mb-[53px]">
        {properties.map((property) => (
          <div key={property.id} className="relative">
            <BuyCard listing={property} />
          </div>
        ))}
      </div>

      {/* Comparison table - mobile responsive */}
      <div className="bg-white rounded-[22px] overflow-hidden mb-16 sm:mb-[83px]">
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
                'flex flex-col sm:flex-row',
                isLightBackground ? 'bg-[#EFF6FF]' : 'bg-white'
              )}
            >
              {/* Mobile: Stack vertically */}
              <div className="sm:hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm text-[#667085] mb-2">{attribute}</div>
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">Объект 1</div>
                      {attribute.includes('площадь') ? (
                        <div className="text-base font-normal">
                          {properties[0].attributes[attribute].split('м²')[0]}
                          <span>
                            м<sup>2</sup>
                          </span>
                        </div>
                      ) : (
                        <div className="text-base font-normal">
                          {properties[0].attributes[attribute]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">Объект 2</div>
                      {attribute.includes('площадь') ? (
                        <div className="text-base font-normal">
                          {properties[1].attributes[attribute].split('м²')[0]}
                          <span>
                            м<sup>2</sup>
                          </span>
                        </div>
                      ) : (
                        <div className="text-base font-normal">
                          {properties[1].attributes[attribute]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop: Side by side */}
              <div className="hidden sm:flex w-full">
                <div className="w-1/2 px-4 sm:px-[30px] py-4">
                  <div className="text-sm sm:text-lg text-[#667085] mb-2 sm:mb-3">
                    {attribute}
                  </div>

                  {attribute.includes('площадь') ? (
                    <div className="text-lg sm:text-2xl font-normal">
                      {properties[0].attributes[attribute].split('м²')[0]}
                      <span>
                        м<sup>2</sup>
                      </span>
                    </div>
                  ) : (
                    <div className="text-lg sm:text-2xl font-normal">
                      {properties[0].attributes[attribute]}
                    </div>
                  )}
                </div>

                <div className="w-1/2 px-4 sm:px-[30px] py-4">
                  <div className="h-6 mb-2 sm:mb-3" />
                  {attribute.includes('площадь') ? (
                    <div className="text-lg sm:text-2xl font-normal">
                      {properties[1].attributes[attribute].split('м²')[0]}
                      <span>
                        м<sup>2</sup>
                      </span>
                    </div>
                  ) : (
                    <div className="text-lg sm:text-2xl font-normal">
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
