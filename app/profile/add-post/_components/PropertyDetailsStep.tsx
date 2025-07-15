'use client';

import { FormEvent, ChangeEvent } from 'react';
import { Input } from '@/ui-components/Input';
import { Select } from '@/ui-components/Select';
import { PhotoUpload } from '@/ui-components/PhotoUpload';
import { Button } from '@/ui-components/Button';
import { SelectOption, FormState } from '@/services/add-post/types';

interface PropertyDetailsStepProps {
  form: FormState;
  locations: SelectOption[];
  repairTypes: SelectOption[];
  heatingTypes: SelectOption[];
  parkingTypes: SelectOption[];
  onSubmit: (e: FormEvent) => void;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onPhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove: (index: number) => void;
  isSubmitting: boolean;
  onBack?: () => void;
}

export function PropertyDetailsStep({
  form,
  locations,
  repairTypes,
  heatingTypes,
  parkingTypes,
  onSubmit,
  onChange,
  onPhotoChange,
  onPhotoRemove,
  isSubmitting,
  onBack,
}: PropertyDetailsStepProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <h2 className="text-xl font-bold mb-4 text-[#666F8D]">Детали объекта</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Расположение"
          name="location_id"
          value={form.location_id}
          options={locations}
          labelField="city"
          onChange={onChange}
          required
        />

        <Select
          label="Ремонт"
          name="repair_type_id"
          value={form.repair_type_id}
          options={repairTypes}
          onChange={onChange}
        />

        <Select
          label="Отопление"
          name="heating_type_id"
          value={form.heating_type_id}
          options={heatingTypes}
          onChange={onChange}
        />

        <Select
          label="Парковка"
          name="parking_type_id"
          value={form.parking_type_id}
          options={parkingTypes}
          onChange={onChange}
        />

        <Input
          label="Телефон владельца"
          name="owner_phone"
          value={form.owner_phone}
          onChange={onChange}
          type="tel"
          placeholder="+992 XX XXX XX XX"
        />

        <Input
          label="Цена"
          name="price"
          type="number"
          value={form.price}
          onChange={onChange}
          placeholder="0"
          required
        />

        <Input
          label="Площадь (общая)"
          name="total_area"
          type="number"
          value={form.total_area}
          onChange={onChange}
          placeholder="0"
        />

        <Input
          label="Площадь (жилая)"
          name="living_area"
          type="number"
          value={form.living_area}
          onChange={onChange}
          placeholder="0"
        />

        <Input
          label="Этаж"
          name="floor"
          type="number"
          value={form.floor}
          onChange={onChange}
          placeholder="1"
        />

        <Input
          label="Всего этажей"
          name="total_floors"
          type="number"
          value={form.total_floors}
          onChange={onChange}
          placeholder="1"
        />

        <Input
          label="Год постройки"
          name="year_built"
          type="number"
          value={form.year_built}
          onChange={onChange}
          placeholder="2024"
        />

        <Input
          label="YouTube ссылка"
          name="youtube_link"
          value={form.youtube_link}
          onChange={onChange}
          placeholder="https://youtube.com/..."
        />
      </div>

      <PhotoUpload
        photos={form.photos}
        onPhotoChange={onPhotoChange}
        onPhotoRemove={onPhotoRemove}
        className="mt-6"
      />

      <Input
        label="Описание"
        name="description"
        value={form.description}
        onChange={onChange}
        textarea
        placeholder="Подробное описание объекта..."
        className="mt-4"
      />

      <div className="flex justify-between mt-6">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack} size="lg">
            Назад
          </Button>
        )}
        <div className="flex gap-3">
          <Button type="submit" loading={isSubmitting} size="lg">
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>
    </form>
  );
}
