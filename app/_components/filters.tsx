'use client';

import { FC, FormEvent, useState } from 'react';
import { Field, Label, Switch } from '@headlessui/react';
import { FormInput } from '@/ui-components/FormInput';
import { SelectInput } from '@/ui-components/SelectInput';
import clsx from 'clsx';
import { PropertyFilters } from '@/services/properties/types';

interface Option {
  id: string | number;
  name: string;
  unavailable?: boolean;
}

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

interface AllFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: PropertyFilters) => void;
}

export const AllFilters: FC<AllFiltersProps> = ({
  isOpen,
  onClose,
  onSearch,
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
  // eslint-disable-next-line
  const [listingType, setListingType] = useState('regular');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const filters = {
      propertyType: propertyType || undefined,
      city: city || undefined,
      district: district || undefined,
      priceFrom: priceFrom || undefined,
      priceTo: priceTo || undefined,
      areaFrom: areaFrom || undefined,
      areaTo: areaTo || undefined,
      floorFrom: floorFrom || undefined,
      floorTo: floorTo || undefined,
      repairType: repairType || undefined,
      listing_type: listingType,
    };

    onSearch(filters);
  };

  return (
    <div className={`${isOpen ? 'block' : 'hidden pointer-events-none'}`}>
      <div
        className={`mx-auto bg-white px-4 sm:px-8 md:px-12 lg:px-[70px] p-6 transition-transform duration-300 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Все фильтры</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0036A5] text-white hover:bg-blue-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
                className="group relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition"
              >
                <span
                  className={clsx(
                    'size-5 translate-x-0.5 rounded-full shadow-lg transition group-data-checked:translate-x-5',
                    mortgageOption === 'mortgage'
                      ? 'bg-[#0036A5]'
                      : 'bg-[#BAC0CC]'
                  )}
                />
              </Switch>
              <Label className="ml-3">Ипотека</Label>
            </Field>

            <Field className="flex items-center">
              <Switch
                checked={mortgageOption === 'developer'}
                onChange={(checked) =>
                  setMortgageOption(checked ? 'developer' : 'mortgage')
                }
                className="group relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition focus:outline-none"
              >
                <span
                  className={clsx(
                    'size-5 translate-x-0.5 rounded-full shadow-lg transition group-data-checked:translate-x-5',
                    mortgageOption === 'developer'
                      ? 'bg-[#0036A5]'
                      : 'bg-[#BAC0CC]'
                  )}
                />
              </Switch>
              <Label className="ml-3">От застройщика</Label>
            </Field>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-[#0036A5] text-white py-3 px-6 rounded-lg hover:bg-blue-800 cursor-pointer"
            >
              Найти объекты
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
