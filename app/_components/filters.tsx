'use client';

import { FC, FormEvent, useState, useEffect } from 'react';
import { FormInput } from '@/ui-components/FormInput';
import MultiSelectInput, {
  MultiOption,
} from '@/ui-components/MultiSelectInput';
import { PropertyFilters } from '@/services/properties/types';
import {
  useGetBuildingTypesQuery,
  useGetLocationsQuery,
  useGetPropertyTypesQuery,
  useGetRepairTypesQuery,
} from '@/services/add-post';

interface Option {
  id: string | number;
  slug?: string;
  name: string;
  unavailable?: boolean;
}

const districtOptions: Option[] = [
  { id: 'Сино', name: 'Сино' },
  { id: 'Шохмансур', name: 'Шохмансур' },
  { id: 'Фирдавси', name: 'Фирдавси' },
  { id: 'Сомони', name: 'Сомони' },
];

interface AllFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: PropertyFilters) => void;
  initialFilters?: {
    propertyTypes?: string[];
    apartmentTypes?: string[];
    cities?: string[];
    districts?: string[];
    repairs?: string[];
    priceFrom?: string;
    priceTo?: string;
    roomsFrom?: string;
    roomsTo?: string;
    areaFrom?: string;
    areaTo?: string;
    floorFrom?: string;
    floorTo?: string;
  };
}

export const AllFilters: FC<AllFiltersProps> = ({
  isOpen,
  onClose,
  onSearch,
  initialFilters = {},
}) => {
  const { data: propertyTypes } = useGetPropertyTypesQuery();
  const { data: buildingTypes } = useGetBuildingTypesQuery();
  const { data: locationTypes } = useGetLocationsQuery();
  const { data: repairTypes } = useGetRepairTypesQuery();

  const propertyTypeOpts: MultiOption[] = (propertyTypes ?? []).map(
    (x: ApiEntity) => ({
      id: x.id ?? x.slug ?? x.name,
      name: x.name,
      slug: x.slug,
    })
  );

  const repairTypeOpts: MultiOption[] = (repairTypes ?? []).map(
    (x: ApiEntity) => ({
      id: x.id ?? x.slug ?? x.name,
      name: x.name,
      slug: x.slug,
    })
  );

  const buildingTypeOpts: MultiOption[] = (buildingTypes ?? []).map(
    (x: ApiEntity) => ({
      id: x.id ?? x.slug ?? x.name,
      name: x.name,
      slug: x.slug,
    })
  );

  const cityOpts: MultiOption[] = (locationTypes ?? []).map(
    (loc: LocationEntity) => ({
      id: loc.id ?? loc.city ?? loc.name ?? String(Math.random()),
      name: loc.city ?? loc.name ?? 'Город',
    })
  );

  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<
    Array<string | number>
  >([]);
  const [selectedApartmentTypes, setSelectedApartmentTypes] = useState<
    Array<string | number>
  >([]);
  const [selectedCities, setSelectedCities] = useState<Array<string | number>>(
    []
  );
  const [districts, setDistricts] = useState<Array<string | number>>([]);
  const [repairs, setRepairs] = useState<Array<string | number>>([]);

  const [priceFrom, setPriceFrom] = useState('0');
  const [priceTo, setPriceTo] = useState('0');
  const [roomsFrom, setRoomsFrom] = useState('0');
  const [roomsTo, setRoomsTo] = useState('0');
  const [areaFrom, setAreaFrom] = useState('0');
  const [areaTo, setAreaTo] = useState('0');
  const [floorFrom, setFloorFrom] = useState('1');
  const [floorTo, setFloorTo] = useState('3');
  // eslint-disable-next-line
  const [mortgageOption] = useState<'mortgage' | 'developer'>('mortgage');
  // eslint-disable-next-line
  const [listingType, setListingType] = useState<'regular' | 'vip'>('regular');

  useEffect(() => {
    if (isOpen && initialFilters) {
      if (initialFilters.propertyTypes) {
        setSelectedPropertyTypes(
          Array.isArray(initialFilters.propertyTypes)
            ? initialFilters.propertyTypes
            : [initialFilters.propertyTypes]
        );
      }

      if (initialFilters.apartmentTypes) {
        setSelectedApartmentTypes(
          Array.isArray(initialFilters.apartmentTypes)
            ? initialFilters.apartmentTypes
            : [initialFilters.apartmentTypes]
        );
      }

      if (initialFilters.cities) {
        setSelectedCities(
          Array.isArray(initialFilters.cities)
            ? initialFilters.cities
            : [initialFilters.cities]
        );
      }

      if (initialFilters.districts) {
        setDistricts(
          Array.isArray(initialFilters.districts)
            ? initialFilters.districts
            : [initialFilters.districts]
        );
      }

      if (initialFilters.repairs) {
        setRepairs(
          Array.isArray(initialFilters.repairs)
            ? initialFilters.repairs
            : [initialFilters.repairs]
        );
      }

      if (initialFilters.priceFrom) setPriceFrom(initialFilters.priceFrom);
      if (initialFilters.priceTo) setPriceTo(initialFilters.priceTo);
      if (initialFilters.roomsFrom) setRoomsFrom(initialFilters.roomsFrom);
      if (initialFilters.roomsTo) setRoomsTo(initialFilters.roomsTo);
      if (initialFilters.areaFrom) setAreaFrom(initialFilters.areaFrom);
      if (initialFilters.areaTo) setAreaTo(initialFilters.areaTo);
      if (initialFilters.floorFrom) setFloorFrom(initialFilters.floorFrom);
      if (initialFilters.floorTo) setFloorTo(initialFilters.floorTo);
    }
  }, [isOpen, initialFilters]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const filters = {
      propertyTypes: selectedPropertyTypes.length
        ? selectedPropertyTypes.map(String)
        : undefined,

      apartmentTypes: selectedApartmentTypes.length
        ? selectedApartmentTypes.map(String)
        : undefined,

      cities: selectedCities.length ? selectedCities.map(String) : undefined,

      districts: districts.length ? districts.map(String) : undefined,

      repairs: repairs.length ? repairs.map(String) : undefined,

      priceFrom: priceFrom && priceFrom !== '0' ? priceFrom : undefined,
      priceTo: priceTo && priceTo !== '0' ? priceTo : undefined,

      areaFrom: areaFrom && areaFrom !== '0' ? areaFrom : undefined,
      areaTo: areaTo && areaTo !== '0' ? areaTo : undefined,

      floorFrom:
        floorFrom && floorFrom !== '0' && floorFrom !== '1'
          ? floorFrom
          : undefined,
      floorTo:
        floorTo && floorTo !== '0' && floorTo !== '3' ? floorTo : undefined,

      listing_type: listingType === 'regular' ? undefined : listingType,
      offer_type: 'sale',
    };

    const cleanedFilters = Object.fromEntries(
      // eslint-disable-next-line
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    );

    onSearch(cleanedFilters as unknown as PropertyFilters);
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
            <MultiSelectInput
              label="Тип недвижимости"
              options={propertyTypeOpts}
              value={selectedPropertyTypes}
              onChange={setSelectedPropertyTypes}
              placeholder="Выберите типы недвижимости"
            />

            <MultiSelectInput
              label="Тип квартиры"
              options={buildingTypeOpts}
              value={selectedApartmentTypes}
              onChange={setSelectedApartmentTypes}
              placeholder="Выберите типы квартир"
            />

            <MultiSelectInput
              label="Город"
              options={cityOpts}
              value={selectedCities}
              onChange={setSelectedCities}
              placeholder="Выберите города"
            />

            <MultiSelectInput
              label="Район"
              options={districtOptions as MultiOption[]}
              value={districts}
              onChange={setDistricts}
              placeholder="Выберите районы"
            />
          </div>

          {/* числовые поля + ремонт */}
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
            <FormInput
              label="Цена от"
              value={priceFrom}
              onChange={setPriceFrom}
              placeholder="0с"
            />
            <FormInput
              label="Цена до"
              value={priceTo}
              onChange={setPriceTo}
              placeholder="0с"
            />
            <FormInput
              label="Количество комнат от"
              value={roomsFrom}
              onChange={setRoomsFrom}
              placeholder="0"
            />
            <FormInput
              label="Количество комнат до"
              value={roomsTo}
              onChange={setRoomsTo}
              placeholder="0"
            />
            <FormInput
              label="Площадь от"
              value={areaFrom}
              onChange={setAreaFrom}
              placeholder="0м²"
            />
            <FormInput
              label="Площадь до"
              value={areaTo}
              onChange={setAreaTo}
              placeholder="0м²"
            />
            <FormInput
              label="Этаж от"
              value={floorFrom}
              onChange={setFloorFrom}
              placeholder="0"
            />
            <FormInput
              label="Этаж до"
              value={floorTo}
              onChange={setFloorTo}
              placeholder="0"
            />

            <MultiSelectInput
              label="Ремонт"
              options={repairTypeOpts}
              value={repairs}
              onChange={setRepairs}
              placeholder="Выберите типы ремонта"
            />

            <FormInput label="Ориентир" value="Душанбе" onChange={() => {}} />
          </div>

          {/* переключатели (по желанию) */}
          {/*
          <div className="mt-6 flex gap-8">
            <Field className="flex items-center">
              <Switch
                checked={mortgageOption === 'mortgage'}
                onChange={(checked) => setMortgageOption(checked ? 'mortgage' : 'developer')}
                className="group relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition"
              >
                <span
                  className={clsx(
                    'size-5 translate-x-0.5 rounded-full shadow-lg transition group-data-checked:translate-x-5',
                    mortgageOption === 'mortgage' ? 'bg-[#0036A5]' : 'bg-[#BAC0CC]'
                  )}
                />
              </Switch>
              <Label className="ml-3">Ипотека</Label>
            </Field>

            <Field className="flex items-center">
              <Switch
                checked={mortgageOption === 'developer'}
                onChange={(checked) => setMortgageOption(checked ? 'developer' : 'mortgage')}
                className="group relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition focus:outline-none"
              >
                <span
                  className={clsx(
                    'size-5 translate-x-0.5 rounded-full shadow-lg transition group-data-checked:translate-x-5',
                    mortgageOption === 'developer' ? 'bg-[#0036A5]' : 'bg-[#BAC0CC]'
                  )}
                />
              </Switch>
              <Label className="ml-3">От застройщика</Label>
            </Field>
          </div>
          */}

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

interface ApiEntity {
  id: string | number;
  name: string;
  slug?: string;
}

interface LocationEntity {
  id: string | number;
  city?: string;
  name?: string;
}
