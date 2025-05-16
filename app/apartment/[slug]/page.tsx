'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import SettingsIcon from '@/icons/SettingsIcon';
import HeartIcon from '@/icons/HeartIcon';
import MortgageCalculator from './_components/MortgageCalculator';

const apartmentData = {
  id: '13568442',
  title: '2-комн. квартира, 9 этаж, 78 м², Зеленый базар',
  publishedAt: 'Вчера 13:01',
  price: '432 000 с.',
  images: [
    '/images/buy/1.png',
    '/images/buy/2.jpeg',
    '/images/buy/3.jpeg',
    '/images/buy/4.jpeg',
    '/images/buy/5.jpeg',
  ],
  agent: {
    name: 'Cавоев Шорух',
    position: 'Менеджер по продажам',
    image: '/images/team/1.png',
    phone: '(+992) 902 90 66 90',
  },
  apartment: {
    type: 'Вторичка',
    area: '72,2 м²',
    bathroom: '1',
    repair: 'Косметический',
    district: 'Сино',
  },
  building: {
    year: '2014',
    elevators: '2',
    type: 'Панельный',
    parking: 'Открытая',
    heating: 'Центральное',
  },
  description: `Id 4412. Удобная квартира в престижной локации!

Светлая и невероятно атмосферная квартира с функциональной распашной планировкой:
-- грамотное зонирование создает эффект просторной прихожей с системой хранения
-- уютная гостиная, которая может быть использована как спальня
-- кухня правильной формы, вмещающая все необходимое
-- большой санузел с невероятной ванной
-- изолированная комната с застекленной лоджией.

Благодаря ремонту квартира готова к проживанию. Выровнены стены, пол, заменены окна, радиаторы и коммуникации, электрическая разводка, кондиционеры.

Очень чистый подъезд после капремонта. Соседи поддерживают состояние МОПов.

В пешей доступности все, что нужно для жизни: школы, детские сады, поликлиники, магазины, аптеки, банки, рестораны, торговые центры. Совсем рядом современный Аптекарский огород. В шаговой доступности 3 станции метро: Сухаревская, Комсомольская и Проспект Мира.

Прозрачная история права (в семье с 1999 года). Полная стоимость в ДКП. Помощь в оформлении ипотеки.`,
};

export default function Apartment() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
        setSelectedIndex(index);
      }
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
    // @ts-expect-error no null check
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
    // @ts-expect-error no null check
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Main content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-[22px] p-[30px]">
            {/* Header section */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {apartmentData.title}
                </h1>
                <div className="text-[#666F8D] text-lg">
                  Опубликовано: {apartmentData.publishedAt} Номер объявления:{' '}
                  {apartmentData.id}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-14 h-14 rounded-full border border-[#BAC0CC] flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                  <SettingsIcon className="w-6 h-6 text-[#1E3A8A]" />
                </button>

                <button
                  className="w-14 h-14 rounded-full border border-[#BAC0CC] flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                  onClick={toggleFavorite}
                >
                  <HeartIcon className="w-6 h-6 text-[#1E3A8A]" />
                </button>
              </div>
            </div>

            {/* Image gallery with Embla */}
            <div className="relative mb-4">
              <div className="overflow-hidden rounded-xl" ref={emblaRef}>
                <div className="flex">
                  {apartmentData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative min-w-full h-[387px]"
                      style={{ flex: '0 0 100%' }}
                    >
                      <Image
                        src={image}
                        alt={`Apartment image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom navigation buttons */}
              <button
                onClick={scrollPrev}
                className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="#333"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                onClick={scrollNext}
                className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#333"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Pagination dots */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {apartmentData.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      selectedIndex === index ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => scrollTo(index)}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail gallery */}
            <div className="grid grid-cols-5 gap-2">
              {apartmentData.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedIndex === index
                      ? 'border-blue-600'
                      : 'border-transparent hover:border-blue-300'
                  }`}
                  onClick={() => scrollTo(index)}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* 3D View Button */}
            <button className="mt-11 w-full border border-[#BAC0CC] rounded-lg py-[17px] flex items-center justify-center text-[#353E5C] hover:bg-gray-50 transition-colors">
              <span className="mr-2">Посмотреть объект в 3D пространстве</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L4 6V18L12 22L20 18V6L12 2Z"
                  stroke="#0036A5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 14L4 10M12 14V22M12 14L20 10M4 6L12 10L20 6"
                  stroke="#0036A5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Property Details */}
            <div className="mt-11 grid grid-cols-1 md:grid-cols-2 gap-32">
              {/* Apartment details */}
              <div>
                <h2 className="text-2xl font-bold mb-4">О квартире</h2>
                <div className="flex flex-col space-y-4 text-sm">
                  <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                    <span className="text-[#666F8D]">Тип жилья</span>
                    <span>{apartmentData.apartment.type}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                    <span className="text-[#666F8D]">Общая площадь</span>
                    <span>{apartmentData.apartment.area}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                    <span className="text-[#666F8D]">Санузел</span>
                    <span>{apartmentData.apartment.bathroom}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                    <span className="text-[#666F8D]">Ремонт</span>
                    <span>{apartmentData.apartment.repair}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                    <span className="text-[#666F8D]">Район</span>
                    <span>{apartmentData.apartment.district}</span>
                  </div>
                </div>
              </div>

              {/* Building details */}
              <div>
                <h2 className="text-2xl font-bold mb-4">О доме</h2>
                <div className="flex flex-col space-y-4 text-sm">
                  <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                    <span className="text-[#666F8D]">Год постройки</span>
                    <span>{apartmentData.building.year}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                    <span className="text-[#666F8D]">Количество лифтов</span>
                    <span>{apartmentData.building.elevators}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                    <span className="text-[#666F8D]">Тип дома</span>
                    <span>{apartmentData.building.type}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                    <span className="text-[#666F8D]">Парковка</span>
                    <span>{apartmentData.building.parking}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E3E6EA] pb-2">
                    <span className="text-[#666F8D]">Отопление</span>
                    <span>{apartmentData.building.heating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-5">Описание</h2>
              <div className="text-[#666F8D] whitespace-pre-line">
                {apartmentData.description}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/4">
          {/* Price card */}
          <div className="bg-white rounded-[22px] py-[30px] px-[22px] mb-6">
            <div className="text-[#666F8D] text-lg mb-1.5">Цена</div>
            <div className="text-[32px] font-bold text-[#0036A5]">
              {apartmentData.price}
            </div>
          </div>

          {/* Agent card */}
          <div className="bg-white rounded-[22px] px-[26px] py-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden">
                <Image
                  src={apartmentData.agent.image}
                  alt={apartmentData.agent.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-0.5">
                  {apartmentData.agent.name}
                </h3>
                <div className="text-[#666F8D]">
                  {apartmentData.agent.position}
                </div>
              </div>
            </div>

            <Link
              href={`tel:${apartmentData.agent.phone.replace(/[^\d+]/g, '')}`}
              className="block w-full bg-[#0036A5] hover:bg-blue-800 text-white py-5 rounded-full text-center font-medium mb-4 transition-colors"
            >
              {apartmentData.agent.phone}
            </Link>

            <button className="w-full py-[19px] border border-[#BAC0CC] rounded-full text-center hover:bg-gray-50 transition-colors text-[#353E5C]">
              Получить консультацию
            </button>
          </div>
        </div>
      </div>
      <MortgageCalculator />
    </div>
  );
}
