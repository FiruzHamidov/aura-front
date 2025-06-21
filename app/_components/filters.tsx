'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { Field, Label, Switch } from '@headlessui/react';
import FilterSearchIcon from '@/icons/FilterSearchIcon';
import { FormInput } from '@/ui-components/FormInput';
import { SelectInput } from '@/ui-components/SelectInput';
import Image from 'next/image';

type ActiveTab = 'buy' | 'rent' | 'sell' | 'map';

interface Option {
  id: string | number;
  name: string;
  unavailable?: boolean;
}

const propertyTypes: Option[] = [
  { id: 'apartment', name: 'Квартира' },
  { id: 'house', name: 'Дом' },
  { id: 'commercial', name: 'Коммерческая' },
  { id: 'land', name: 'Земля' },
];

const roomOptions: Option[] = [
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4+', name: '4+' },
  { id: 'studio', name: 'Студия' },
];

const priceOptions: Option[] = [
  { id: '0-50k', name: '250 000' },
  { id: '50k-100k', name: '350 000' },
  { id: '100k-200k', name: '450 000' },
  { id: '200k+', name: '550 000' },
  { id: '1kk+', name: '1 550 000' },
];

const cityOptions: Option[] = [
  { id: 'dushanbe', name: 'Душанбе' },
  { id: 'khujand', name: 'Худжанд' },
];

const districtOptions: Option[] = [
  { id: 'sino', name: 'Сино' },
  { id: 'firdavsi', name: 'Фирдавси' },
  { id: 'somoni', name: 'Сомони' },
];

const apartmentTypeOptions: Option[] = [
  { id: 'studio', name: 'Студия' },
  { id: '1room', name: '1-комнатная' },
  { id: '2room', name: '2-комнатная' },
];

const repairOptions: Option[] = [
  { id: 'euro', name: 'Евроремонт' },
  { id: 'cosmetic', name: 'Косметический' },
  { id: 'none', name: 'Без ремонта' },
];

interface Option {
  id: string | number;
  name: string;
}

interface AllFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AllFiltersModal: FC<AllFiltersModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [propertyType, setPropertyType] = useState('Квартиры во вторичке');
  const [apartmentType, setApartmentType] = useState('Студия');
  const [city, setCity] = useState('Душанбе');
  const [district, setDistrict] = useState('Сино');
  const [priceFrom, setPriceFrom] = useState('0');
  const [priceTo, setPriceTo] = useState('0');
  const [areaFrom, setAreaFrom] = useState('0');
  const [areaTo, setAreaTo] = useState('0');
  const [floorFrom, setFloorFrom] = useState('1');
  const [floorTo, setFloorTo] = useState('-');
  const [repairType, setRepairType] = useState('Евроремонт');
  const [mortgageOption, setMortgageOption] = useState('mortgage');

  const modalRef = useRef<HTMLDivElement>(null);

  // Обработчик клика вне модалки
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`absolute inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}
    >
      {/* затемнение фона */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isOpen ? 'opacity-40' : 'opacity-0'
        }`}
      />

      {/* сама модалка */}
      <div
        ref={modalRef}
        className={`absolute top-[450px] left-0 right-0 w-[95%] mx-auto bg-white shadow-xl rounded-t-2xl p-6 transition-transform duration-300 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Все фильтры</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0036A5] text-white hover:bg-blue-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <form id="filter-form" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormInput
              label="Тип недвижимости"
              value={propertyType}
              onChange={(val) => setPropertyType(val)}
            />
            <SelectInput
              label="Тип квартиры"
              value={apartmentType}
              onChange={(val) => setApartmentType(val)}
              options={apartmentTypeOptions}
            />
            <SelectInput
              label="Город"
              value={city}
              onChange={(val) => setCity(val)}
              options={cityOptions}
            />
            <SelectInput
              label="Район"
              value={district}
              onChange={(val) => setDistrict(val)}
              options={districtOptions}
            />
            <FormInput
              label="Цена от"
              value={priceFrom}
              onChange={(val) => setPriceFrom(val)}
              placeholder="0с"
            />
            <FormInput
              label="Цена до"
              value={priceTo}
              onChange={(val) => setPriceTo(val)}
              placeholder="0с"
            />
            <FormInput
              label="Площадь от"
              value={areaFrom}
              onChange={(val) => setAreaFrom(val)}
              placeholder="0м²"
            />
            <FormInput
              label="Площадь до"
              value={areaTo}
              onChange={(val) => setAreaTo(val)}
              placeholder="0м²"
            />
            <FormInput
              label="Этаж от"
              value={floorFrom}
              onChange={(val) => setFloorFrom(val)}
              placeholder="0"
            />
            <FormInput
              label="Этаж до"
              value={floorTo}
              onChange={(val) => setFloorTo(val)}
              placeholder="0"
            />
            <SelectInput
              label="Ремонт"
              value={repairType}
              onChange={(val) => setRepairType(val)}
              options={repairOptions}
            />
          </div>

          <div className="mt-6">
            <FormInput label="Ориентир" value="Душанбе" onChange={() => {}} />
          </div>

          <div className="mt-6 flex gap-8">
            <Field className="flex items-center">
              <Switch
                checked={mortgageOption === 'mortgage'}
                onChange={(checked) =>
                  setMortgageOption(checked ? 'mortgage' : 'developer')
                }
                className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
              >
                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
              </Switch>
              <Label className="ml-3">Ипотека</Label>
            </Field>
            <Field className="flex items-center">
              <Switch
                checked={mortgageOption === 'developer'}
                onChange={(checked) =>
                  setMortgageOption(checked ? 'developer' : 'mortgage')
                }
                className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
              >
                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
              </Switch>
              <Label className="ml-3">От застройщика</Label>
            </Field>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-[#0036A5] text-white py-3 px-6 rounded-lg hover:bg-blue-800"
            >
              Найти объекты
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const HeroSearch: FC<{ title: string }> = ({ title }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('buy');
  const [propertyType, setPropertyType] = useState('');
  const [rooms, setRooms] = useState('');
  const [price, setPrice] = useState('');
  const [isAllFiltersOpen, setIsAllFiltersOpen] = useState(false);

  return (
    <div className="container relative py-8 md:py-10 md:pt-[22px] bg-gradient-to-b overflow-hidden">
      <div className="bg-white relative overflow-hidden z-0 rounded-[22px] px-4 sm:px-8 md:px-12 lg:px-[70px] py-6 sm:py-12 md:py-16 lg:py-[89px]">
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-[60px]">
          <h1 className="text-xl md:text-[52px] font-extrabold text-[#0036A5] mb-1.5 tracking-tight uppercase transition-all duration-300 hover:scale-105 cursor-default">
            {title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#353E5C]">
            ваш надежный партнер в сфере недвижимости в Таджикистане
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
          {(['buy', 'rent', 'sell', 'map'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-6 lg:px-9 py-2 sm:py-3 rounded-lg cursor-pointer transition-all duration-150 ease-in-out text-sm sm:text-base ${
                activeTab === tab
                  ? 'bg-[#0036A5] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-[#CBD5E1] hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {tab === 'buy'
                ? 'Купить'
                : tab === 'rent'
                ? 'Продать'
                : tab === 'sell'
                ? 'Аренда'
                : 'На карте'}
            </button>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">
          {/* Property Type - Full width on mobile, auto on desktop */}
          <div className="sm:col-span-2 lg:col-span-1 lg:w-[373px]">
            <SelectInput
              value={propertyType}
              placeholder="Тип недвижимости"
              onChange={(value) => setPropertyType(value)}
              options={propertyTypes}
            />
          </div>

          {/* Rooms */}
          <div className="lg:w-[169px]">
            <SelectInput
              value={rooms}
              placeholder="Комнат"
              onChange={(value) => setRooms(value)}
              options={roomOptions}
            />
          </div>

          {/* Price */}
          <div className="lg:w-[141px]">
            <SelectInput
              value={price}
              placeholder="Цена"
              onChange={(value) => setPrice(value)}
              options={priceOptions}
            />
          </div>

          {/* All Filters Button */}
          <button
            className="sm:col-span-2 lg:col-span-1 lg:w-[197px] bg-[#F0F2F5] hover:bg-sky-100 text-slate-700 px-4 sm:px-6 lg:px-[25px] py-3 sm:py-4 lg:py-[21px] rounded-lg text-lg flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
            onClick={() => setIsAllFiltersOpen(true)}
          >
            <FilterSearchIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600" />
            <span>Все фильтры</span>
          </button>

          {/* Search Button */}
          <button className="sm:col-span-2 lg:col-span-1 lg:w-[197px] cursor-pointer bg-[#0036A5] hover:bg-blue-800 text-white px-4 sm:px-6 lg:px-[71px] py-3 sm:py-4 lg:py-5 rounded-lg font-bold transition-colors flex items-center justify-center">
            Найти
          </button>
        </div>
        <Image
          src="/images/banner/building.png"
          alt="Building"
          width={695}
          height={695}
          className="absolute -right-12 z-0 top-0 opacity-[8%] pointer-events-none max-w-none"
        />
      </div>

      {/* All Filters Modal */}
      <AllFiltersModal
        isOpen={isAllFiltersOpen}
        onClose={() => setIsAllFiltersOpen(false)}
      />
    </div>
  );
};

export default HeroSearch;
