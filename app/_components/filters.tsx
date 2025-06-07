'use client';

import { FC, useState } from 'react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Label,
  Switch,
} from '@headlessui/react';
import FilterSearchIcon from '@/icons/FilterSearchIcon';
import { FormInput } from '@/ui-components/FormInput';
import { SelectInput } from '@/ui-components/SelectInput';

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

const AllFiltersModal: FC<{ isOpen: boolean; onClose: () => void }> = ({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleReset = () => {
    setPropertyType('Квартиры во вторичке');
    setApartmentType('Студия');
    setCity('Душанбе');
    setDistrict('Сино');
    setPriceFrom('0');
    setPriceTo('0');
    setAreaFrom('0');
    setAreaTo('0');
    setFloorFrom('1');
    setFloorTo('-');
    setRepairType('Евроремонт');
    setMortgageOption('mortgage');
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      as="div"
      className="relative z-50 focus:outline-none"
    >
      <div
        className="fixed inset-0 bg-black/30 transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-hidden">
        <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
          <DialogPanel className="relative px-4 sm:px-8 lg:px-[90px] pt-4 sm:pt-8 lg:pt-[70px] pb-4 sm:pb-6 lg:pb-[45px] w-full max-w-[960px] rounded-[22px] bg-white shadow-xl transition-all duration-300 ease-out data-closed:transform-[scale(98%)] data-closed:opacity-0 max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] flex flex-col">
            {/* Header - fixed at top */}
            <button
              onClick={onClose}
              className="absolute top-3 sm:top-6 lg:top-[30px] right-3 sm:right-6 lg:right-[30px] w-8 h-8 sm:w-10 sm:h-10 lg:w-[52px] lg:h-[52px] flex items-center justify-center rounded-full bg-[#0036A5] text-white hover:bg-blue-800 transition-colors"
              aria-label="Закрыть"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 lg:w-[14px] lg:h-[14px]"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L13 13M1 13L13 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <DialogTitle
              as="h3"
              className="text-xl sm:text-2xl lg:text-[40px] mb-4 sm:mb-6 lg:mb-10 font-bold pr-10 sm:pr-12"
            >
              Все фильтры
            </DialogTitle>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
              <form id="filter-form" onSubmit={handleSubmit}>
                {/* Basic filters section */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 lg:mb-[22px]">
                    Основные
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-[25px] lg:gap-y-[22px]">
                    <FormInput
                      label="Тип недвижимости"
                      value={propertyType}
                      onChange={(value) => setPropertyType(value)}
                    />

                    <SelectInput
                      label="Тип квартиры"
                      value={apartmentType}
                      onChange={(value) => setApartmentType(value)}
                      options={apartmentTypeOptions}
                    />

                    <SelectInput
                      label="Город"
                      value={city}
                      onChange={(value) => setCity(value)}
                      options={cityOptions}
                    />

                    <SelectInput
                      label="Район"
                      value={district}
                      onChange={(value) => setDistrict(value)}
                      options={districtOptions}
                    />
                  </div>

                  <div className="mt-4">
                    <FormInput
                      label="Ориентир"
                      value="Душанбе"
                      onChange={() => {}}
                    />
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
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
                </div>

                {/* Price section */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 lg:mb-[22px]">
                    Стоимость
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormInput
                      label="Цена от"
                      value={priceFrom}
                      onChange={(value) => setPriceFrom(value)}
                      placeholder="0с"
                    />
                    <FormInput
                      label="Цена до"
                      value={priceTo}
                      onChange={(value) => setPriceTo(value)}
                      placeholder="0с"
                    />
                  </div>
                </div>

                {/* Area section */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 lg:mb-[22px]">
                    Площадь
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormInput
                      label="Площадь от"
                      value={areaFrom}
                      onChange={(value) => setAreaFrom(value)}
                      placeholder="0м²"
                    />

                    <FormInput
                      label="Площадь до"
                      value={areaTo}
                      onChange={(value) => setAreaTo(value)}
                      placeholder="0м²"
                    />
                  </div>
                </div>

                {/* Floor section */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 lg:mb-[22px]">
                    Этаж
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormInput
                      label="Этаж от"
                      value={floorFrom}
                      onChange={(value) => setFloorFrom(value)}
                      placeholder="0"
                    />
                    <FormInput
                      label="Этаж до"
                      value={floorTo}
                      onChange={(value) => setFloorTo(value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Additional section */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 lg:mb-[22px]">
                    Дополнительно
                  </h3>
                  <div className="w-full lg:w-[373px]">
                    <SelectInput
                      label="Ремонт"
                      value={repairType}
                      onChange={(value) => setRepairType(value)}
                      options={repairOptions}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer - fixed at bottom */}
            <div className="pt-4 sm:pt-6 lg:pt-8 bg-white border-t border-gray-100">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto sm:min-w-[200px] lg:w-[309px] py-3 sm:py-4 lg:py-5 border border-[#BAC0CC] rounded-lg text-center hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Сбросить фильтры
                </button>
                <button
                  type="submit"
                  form="filter-form"
                  className="w-full sm:w-auto sm:min-w-[200px] lg:w-[309px] py-3 sm:py-4 lg:py-[11px] bg-[#0036A5] text-white rounded-lg font-medium hover:bg-blue-800 transition-colors text-sm sm:text-base"
                >
                  <div>Поиск объектов</div>
                  <div className="text-xs sm:text-sm">Найдено 718</div>
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
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
      <div className="bg-white rounded-[22px] px-4 sm:px-8 md:px-12 lg:px-[70px] py-6 sm:py-12 md:py-16 lg:py-[89px]">
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-[60px]">
          <h1 className="text-xl md:text-[52px] font-extrabold text-[#0036A5] mb-1.5 tracking-tight uppercase">
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
                ? 'Аренда'
                : tab === 'sell'
                ? 'Продать'
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
