'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useBuildingUnit,
  useUpdateBuildingUnit,
  useNewBuilding,
  useBuildingBlocks,
} from '@/services/new-buildings/hooks';
import { Button } from '@/ui-components/Button';
import { toast } from 'react-toastify';
import Link from 'next/link';
import type { BuildingUnitPayload } from '@/services/new-buildings/types';

export default function EditBuildingUnitPage() {
  const params = useParams<{ id: string; unitId: string }>();
  const newBuildingId = Number(params.id);
  const unitId = Number(params.unitId);
  const router = useRouter();

  const { data: buildingResponse, isLoading: buildingLoading } =
    useNewBuilding(newBuildingId);
  const { data: blocks, isLoading: blocksLoading } =
    useBuildingBlocks(newBuildingId);
  const { data: unit, isLoading: unitLoading } = useBuildingUnit(
    newBuildingId,
    unitId
  );
  const updateUnit = useUpdateBuildingUnit(newBuildingId, unitId);

  const building = buildingResponse?.data;

  const [form, setForm] = useState<BuildingUnitPayload>({
    new_building_id: 0,
    block_id: 0,
    name: '',
    rooms: 1,
    area: 0,
    price_per_sqm: 0,
    currency: 'TJS',
    floor: 1,
    status: 'available',
  });

  useEffect(() => {
    if (unit) {
      setForm({
        new_building_id: newBuildingId,
        block_id: unit.block_id,
        name: unit.name,
        rooms: unit.rooms,
        area: unit.area,
        price_per_sqm: Number(unit.price_per_sqm),
        currency: unit.currency,
        floor: unit.floor,
        status: unit.status,
      });
    }
  }, [unit, newBuildingId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'rooms' ||
        name === 'area_total' ||
        name === 'price' ||
        name === 'floor' ||
        name === 'block_id'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Введите название квартиры');
      return;
    }

    if (form.block_id === 0) {
      toast.error('Выберите блок');
      return;
    }

    if (form.rooms < 1) {
      toast.error('Количество комнат должно быть положительным числом');
      return;
    }

    if (form.area <= 0) {
      toast.error('Площадь должна быть положительным числом');
      return;
    }

    if (form.price_per_sqm <= 0) {
      toast.error('Цена должна быть положительным числом');
      return;
    }

    if (form.floor < 1) {
      toast.error('Этаж должен быть положительным числом');
      return;
    }

    try {
      await updateUnit.mutateAsync(form);
      toast.success('Квартира обновлена');
      router.push(`/admin/new-buildings/${newBuildingId}/units`);
    } catch (err) {
      toast.error('Ошибка при обновлении квартиры');
      console.error(err);
    }
  };

  if (buildingLoading || blocksLoading || unitLoading) {
    return <div className="text-sm text-gray-500">Загрузка...</div>;
  }

  if (!building || !unit) {
    return <div>Данные не найдены</div>;
  }

  if (!blocks || blocks.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Редактировать квартиру</h1>
        <div className="border rounded-2xl p-8 text-center">
          <p className="text-gray-500 mb-4">
            Сначала нужно создать блоки для этой новостройки
          </p>
          <Link href={`/admin/new-buildings/${newBuildingId}/blocks`}>
            <Button>Перейти к блокам</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Редактировать квартиру</h1>
        <p className="text-sm text-gray-500 mt-1">
          Изменение квартиры {unit.name} в {building.title}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white border rounded-2xl p-6"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Блок *</label>
          <select
            name="block_id"
            value={form.block_id}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-[#BAC0CC] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0036A5] focus:border-transparent"
            required
          >
            <option value={0}>Выберите блок</option>
            {blocks.map((block) => (
              <option key={block.id} value={block.id}>
                {block.name} (Этажи {block.floors_from}-{block.floors_to})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Название квартиры *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Например: 2-комнатная, 68 м²"
            className="w-full px-4 py-3 rounded-lg border border-[#BAC0CC] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0036A5] focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Количество комнат *
            </label>
            <input
              type="number"
              name="rooms"
              value={form.rooms}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-3 rounded-lg border border-[#BAC0CC] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0036A5] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Этаж *</label>
            <input
              type="number"
              name="floor"
              value={form.floor}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-3 rounded-lg border border-[#BAC0CC] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0036A5] focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Площадь (м²) *
          </label>
          <input
            type="number"
            name="area"
            value={form.area}
            onChange={handleChange}
            min="0"
            step="0.1"
            className="w-full px-4 py-3 rounded-lg border border-[#BAC0CC] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0036A5] focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Цена *</label>
            <input
              type="number"
              name="price_per_sqm"
              value={form.price_per_sqm}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 rounded-lg border border-[#BAC0CC] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0036A5] focus:border-transparent"
              required
            />
          </div>

          {/*<div>*/}
          {/*  <label className="block text-sm font-medium mb-2">Валюта *</label>*/}
          {/*  <select*/}
          {/*    name="currency"*/}
          {/*    value={form.currency}*/}
          {/*    onChange={handleChange}*/}
          {/*    className="w-full px-4 py-3 rounded-lg border border-[#BAC0CC] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0036A5] focus:border-transparent"*/}
          {/*    required*/}
          {/*  >*/}
          {/*    <option value="TJS">TJS</option>*/}
          {/*    <option value="USD">USD</option>*/}
          {/*    <option value="EUR">EUR</option>*/}
          {/*  </select>*/}
          {/*</div>*/}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Статус *</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-[#BAC0CC] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0036A5] focus:border-transparent"
            required
          >
            <option value="available">Доступна</option>
            <option value="reserved">Забронирована</option>
            <option value="sold">Продана</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={updateUnit.isPending}>
            {updateUnit.isPending ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
          <Link href={`/admin/new-buildings/${newBuildingId}/units`}>
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
