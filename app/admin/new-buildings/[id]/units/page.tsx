'use client';

import { useParams } from 'next/navigation';
import {
  useBuildingUnits,
  useDeleteBuildingUnit,
  useNewBuilding,
} from '@/services/new-buildings/hooks';
import Link from 'next/link';
import { Button } from '@/ui-components/Button';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function BuildingUnitsPage() {
  const params = useParams<{ id: string }>();
  const newBuildingId = Number(params.id);

  const { data: buildingResponse, isLoading: buildingLoading } =
    useNewBuilding(newBuildingId);
  const { data: units, isLoading: unitsLoading } =
    useBuildingUnits(newBuildingId);
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
      ) : !units || units.length === 0 ? (
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
        <div className="border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Комнат
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Площадь
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Этаж
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Блок ID
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {units.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {unit.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.rooms}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.area_total} м²
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.floor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.price.toLocaleString()} {unit.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          unit.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : unit.status === 'sold'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {unit.status === 'available'
                          ? 'Доступна'
                          : unit.status === 'sold'
                          ? 'Продана'
                          : 'Забронирована'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.block_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/new-buildings/${newBuildingId}/units/${unit.id}/edit`}
                        >
                          <Button variant="outline" size="sm">
                            <Pencil className="w-3 h-3" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(unit.id, unit.title)}
                          disabled={deleteUnit.isPending}
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <Link href={`/admin/new-buildings/${newBuildingId}`}>
          <Button variant="outline">← Вернуться к новостройке</Button>
        </Link>
      </div>
    </div>
  );
}
