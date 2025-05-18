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

type ActiveTab = 'buy' | 'rent' | 'sell';

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
    console.log('Filters submitted');
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
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel className="relative px-[90px] pt-[70px] pb-[45px] w-[960px] rounded-[22px] bg-white shadow-xl transition-all duration-300 ease-out data-closed:transform-[scale(98%)] data-closed:opacity-0 max-h-[calc(100vh-2rem)] flex flex-col">
            {/* Header - fixed at top */}
            <button
              onClick={onClose}
              className="absolute top-[30px] right-[30px] w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#0036A5] text-white hover:bg-blue-800 transition-colors"
              aria-label="Закрыть"
            >
              <svg
                width="14"
                height="14"
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

            <DialogTitle as="h3" className="text-[40px] mb-10 font-bold">
              Все фильтры
            </DialogTitle>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
              <form id="filter-form" onSubmit={handleSubmit}>
                {/* Basic filters section */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-[22px]">Основные</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[25px] gap-y-[22px]">
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

                  <div className="mt-4 flex items-center space-x-8">
                    <Field>
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
                    <Field>
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
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-[22px]">Стоимость</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-[22px]">Площадь</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-[22px]">Этаж</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="mb-8 w-[373px]">
                  <h3 className="text-2xl font-bold mb-[22px]">
                    Дополнительно
                  </h3>
                  <SelectInput
                    label="Ремонт"
                    value={repairType}
                    onChange={(value) => setRepairType(value)}
                    options={repairOptions}
                  />
                </div>
              </form>
            </div>

            {/* Footer - fixed at bottom */}
            <div className="p-6 md:p-8 bg-white">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-[309px] py-5 border border-[#BAC0CC] rounded-lg text-center hover:bg-gray-50 transition-colors"
                >
                  Сбросить фильтры
                </button>
                <button
                  type="submit"
                  form="filter-form"
                  className="w-[309px] py-[11px] bg-[#0036A5] text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
                >
                  <div>Поиск объектов</div>
                  <div className="text-sm">Найдено 718</div>
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

const HeroSearch: FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('buy');
  const [propertyType, setPropertyType] = useState('');
  const [rooms, setRooms] = useState('');
  const [price, setPrice] = useState('');
  const [isAllFiltersOpen, setIsAllFiltersOpen] = useState(false);

  return (
    <div className="relative py-16 sm:py-20 md:pt-[22px] bg-gradient-to-b overflow-hidden">
      <div>
        <div className="bg-white container rounded-[22px] px-[70px] py-[89px]">
          <div className="text-center mb-6 md:mb-[60px]">
            <h1 className="text-2xl sm:text-3xl md:text-[52px] font-extrabold text-[#0036A5] mb-1.5 tracking-tight">
              НЕДВИЖИМОСТЬ В ТАДЖИКИСТАНЕ
            </h1>
            <p className="sm:text-2xl text-[#353E5C]">
              ваш надежный партнер в сфере недвижимости в Таджикистане
            </p>
          </div>

          <div className="flex space-x-2 mb-6 md:mb-8">
            {(['buy', 'rent', 'sell'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-9 py-3 rounded-lg  cursor-pointer transition-all duration-150 ease-in-out ${
                  activeTab === tab
                    ? 'bg-[#0036A5] text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-[#CBD5E1] hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                {tab === 'buy'
                  ? 'Купить'
                  : tab === 'rent'
                  ? 'Аренда'
                  : 'Продать'}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="w-[373px]">
              <SelectInput
                value={propertyType}
                onChange={(value) => setPropertyType(value)}
                options={propertyTypes}
              />
            </div>

            <div className="w-[169px]">
              <SelectInput
                value={rooms}
                onChange={(value) => setRooms(value)}
                options={roomOptions}
              />
            </div>

            <div className="w-[141px]">
              <SelectInput
                value={price}
                onChange={(value) => setPrice(value)}
                options={priceOptions}
              />
            </div>

            <button
              className="w-[197px] bg-[#F0F2F5] hover:bg-sky-100 text-slate-700 px-[25px] py-[21px] rounded-lg text-sm flex items-center justify-center sm:justify-start transition-colors cursor-pointer"
              onClick={() => setIsAllFiltersOpen(true)}
            >
              <FilterSearchIcon className="h-6 w-6 mr-2 text-blue-600" />
              <span>Все фильтры</span>
            </button>

            <button className="w-[197px] cursor-pointer bg-[#0036A5] hover:bg-blue-800 text-white px-[71px] py-5 rounded-lg font-bold transition-colors justify-center">
              Найти
            </button>
          </div>
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
