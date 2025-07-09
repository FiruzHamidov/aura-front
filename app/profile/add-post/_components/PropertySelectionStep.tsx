'use client';

import { SelectToggle } from '@/ui-components/SelectToggle';
import { Button } from '@/ui-components/Button';
import { SelectOption } from '@/services/add-post/types';

interface PropertySelectionStepProps {
  selectedOfferType: string;
  setSelectedOfferType: (type: string) => void;
  selectedPropertyType: number | null;
  setSelectedPropertyType: (type: number | null) => void;
  selectedBuildingType: number | null;
  setSelectedBuildingType: (type: number | null) => void;
  selectedRooms: number | null;
  setSelectedRooms: (rooms: number | null) => void;
  propertyTypes: SelectOption[];
  buildingTypes: SelectOption[];
  onNext: () => void;
}

export function PropertySelectionStep({
  selectedOfferType,
  setSelectedOfferType,
  selectedPropertyType,
  setSelectedPropertyType,
  selectedBuildingType,
  setSelectedBuildingType,
  selectedRooms,
  setSelectedRooms,
  propertyTypes,
  buildingTypes,
  onNext,
}: PropertySelectionStepProps) {
  const isValid = selectedPropertyType && selectedBuildingType && selectedRooms;

  return (
    <div className="flex flex-col gap-6">
      <SelectToggle
        title="Сделка"
        options={[
          { id: 'sale', name: 'Продажа' },
          { id: 'rent', name: 'Аренда' },
        ]}
        selected={selectedOfferType}
        setSelected={setSelectedOfferType}
      />

      <SelectToggle
        title="Тип недвижимости"
        options={propertyTypes}
        selected={selectedPropertyType}
        setSelected={setSelectedPropertyType}
      />

      <SelectToggle
        title="Тип объекта"
        options={buildingTypes}
        selected={selectedBuildingType}
        setSelected={setSelectedBuildingType}
      />

      <SelectToggle
        title="Количество комнат"
        options={[1, 2, 3, 4, 5, 6].map((num) => ({
          id: num,
          name: num === 6 ? '6 и больше' : `${num}-комнатные`,
        }))}
        selected={selectedRooms}
        setSelected={setSelectedRooms}
      />

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!isValid} className="mt-8">
          Продолжить
        </Button>
      </div>
    </div>
  );
}
