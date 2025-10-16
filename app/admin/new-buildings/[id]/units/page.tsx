'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  useBuildingUnits,
  useDeleteBuildingUnit,
  useNewBuilding,
} from '@/services/new-buildings/hooks';
import Link from 'next/link';
import { Button } from '@/ui-components/Button';
import { Pencil, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { BuildingUnit } from '@/services/new-buildings/types';

type Paginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page?: number;
  total?: number;
};

export default function BuildingUnitsPage() {
  const params = useParams<{ id: string }>();
  const newBuildingId = Number(params.id);

  const [page, setPage] = useState(1);

  const { data: buildingResponse, isLoading: buildingLoading } =
      useNewBuilding(newBuildingId);

  // Привязываем результат хука к ожидаемому типу пагинации
  const rawUnitsQuery = useBuildingUnits(newBuildingId, page, 15);
  const { data: unitsResponseRaw, isLoading: unitsLoading, isFetching } =
      rawUnitsQuery as unknown as {
        data?: Paginated<BuildingUnit>;
        isLoading: boolean;
        isFetching?: boolean;
      };

  const deleteUnit = useDeleteBuildingUnit(newBuildingId);

  const building = buildingResponse?.data;

  const handleDelete = async (unitId: number, title: string) => {
    if (!confirm(`Удалить квартиру "${title}"?`)) return;

    try {
      await deleteUnit.mutateAsync(unitId);
      toast.success('Квартира удалена');
    } catch (err) {
      toast.error('Ошибка при удалении квартиры');
      console.error(err);
    }
  };

  if (buildingLoading) {
    return <div className="text-sm text-gray-500">Загрузка...</div>;
  }

  if (!building) {
    return <div>Новостройка не найдена</div>;
  }

  // unitsResponse соответствует пагинированному ответу: { data: [...], current_page, last_page, ... }
  const pagination = (unitsResponseRaw ?? null) as Paginated<BuildingUnit> | null;
  const unitsList = pagination?.data ?? [];

  if (!unitsResponseRaw && unitsLoading) {
    return <div className="text-sm text-gray-500">Загрузка квартир...</div>;
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Квартиры</h1>
            <p className="text-sm text-gray-500 mt-1">{building.title}</p>
          </div>
          <Link href={`/admin/new-buildings/${newBuildingId}/units/create`}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Добавить квартиру
            </Button>
          </Link>
        </div>

        {unitsLoading ? (
            <div className="text-sm text-gray-500">Загрузка квартир...</div>
        ) : !unitsList || unitsList.length === 0 ? (
            <div className="border rounded-2xl p-8 text-center text-gray-500">
              <p className="mb-4">Квартиры не найдены</p>
              <Link href={`/admin/new-buildings/${newBuildingId}/units/create`}>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить первую квартиру
                </Button>
              </Link>
            </div>
        ) : (
            <>
              <div className="border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Комнат</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Площадь</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Этаж</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Блок ID</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {unitsList.map((unit: BuildingUnit) => {

                      return (
                          <tr key={unit.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{unit.id}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{unit.name ?? `#${unit.id}`}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{unit.bedrooms ?? unit.rooms ?? '—'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{unit.area ?? unit.total_price ?? '—'} м²</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{unit.floor ?? '—'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{unit.price ? Number(unit.price).toLocaleString() : '—'} {unit.currency ?? ''}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                              status === 'available'
                                  ? 'bg-green-100 text-green-800'
                                  : status === 'sold'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {status === 'available' ? 'Доступна' : status === 'sold' ? 'Продана' : status === 'pending' ? 'На модерации' : 'Неизвестно'}
                          </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ unit.block_id ?? '—'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-2">
                                <Link href={`/admin/new-buildings/${newBuildingId}/units/${unit.id}/photos`} title="Фотографии">
                                  <Button variant="outline" size="sm">
                                    <ImageIcon className="w-3 h-3" />
                                  </Button>
                                </Link>
                                <Link href={`/admin/new-buildings/${newBuildingId}/units/${unit.id}/edit`}>
                                  <Button variant="outline" size="sm">
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={() => handleDelete(unit.id, unit.name ?? `#${unit.id}`)} disabled={deleteUnit.isPending}>
                                  <Trash2 className="w-3 h-3 text-red-600" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Пагинация */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">{isFetching ? 'Обновление...' : ''}</div>

                <div className="flex items-center gap-2">
                  <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={Boolean(pagination && pagination.current_page <= 1)}
                      className="px-3 py-1 border rounded"
                  >
                    ← Previous
                  </button>

                  {Array.from({ length: pagination?.last_page ?? 1 }, (_, i) => i + 1).map((p) => (
                      <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-3 py-1 border rounded ${p === (pagination?.current_page ?? 1) ? 'bg-gray-200' : ''}`}
                      >
                        {p}
                      </button>
                  ))}

                  <button
                      onClick={() => setPage((p) => Math.min(pagination?.last_page ?? p, p + 1))}
                      disabled={Boolean(pagination && pagination.current_page >= (pagination?.last_page ?? 1))}
                      className="px-3 py-1 border rounded"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
        )}

        <div className="flex justify-between items-center">
          <Link href={`/admin/new-buildings/${newBuildingId}`}>
            <Button variant="outline">← Вернуться к новостройке</Button>
          </Link>
        </div>
      </div>
  );
}