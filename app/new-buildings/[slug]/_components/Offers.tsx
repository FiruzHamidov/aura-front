import { FC, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { NewBuilding } from '@/services/new-buildings/types';
import BedIcon from '@/icons/BedIcon';
import ShowerIcon from '@/icons/ShowerIcon';
import PlanIcon from '@/icons/PlanIcon';
import FloorIcon from '@/icons/FloorIcon';

interface OffersProps {
  building: NewBuilding;
}

const formatCompletionQuarter = (dateStr?: string | null) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    const q = Math.floor(d.getMonth() / 3) + 1;
    return `Сдача в ${q} кв. ${d.getFullYear()}`;
  } catch {
    return '';
  }
};

const BlockTabs: React.FC<{
  blocks: any[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}> = ({ blocks, selected, onSelect }) => {
  return (
    <div className="flex gap-3 mb-6 overflow-x-auto">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-3 rounded-lg border cursor-pointer ${
          selected === null
            ? 'border-[#0036A5] bg-white text-[#0036A5]'
            : 'border-gray-200 bg-white'
        }`}
      >
        Все корпуса
      </button>
      {blocks.map((b) => (
        <button
          key={b.id}
          onClick={() => onSelect(b.id)}
          className={`flex flex-col items-start px-4 py-3 rounded-lg border text-left cursor-pointer ${
            selected === b.id
              ? 'border-[#0036A5] text-[#0036A5]'
              : 'border-gray-200 text-[#667085]'
          }`}
        >
          <span className="font-medium">{b.name}</span>
          <span className="text-xs mt-1">
            {formatCompletionQuarter(b.completion_at)}
          </span>
        </button>
      ))}
    </div>
  );
};

export const Offers: FC<OffersProps> = ({ building }) => {
  const units = building.units || [];
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);
  const [expandedRooms, setExpandedRooms] = useState<Set<number>>(new Set());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const toggleRoom = (rooms: number) => {
    const newExpanded = new Set(expandedRooms);
    if (newExpanded.has(rooms)) {
      newExpanded.delete(rooms);
    } else {
      newExpanded.add(rooms);
    }
    setExpandedRooms(newExpanded);
  };

  if (units.length === 0) {
    return (
      <div className="bg-white rounded-[22px] px-4 py-5 md:py-10 md:px-[60px] mt-5">
        <h2 className="text-2xl font-bold mb-6 md:mb-8">Предложения</h2>
        <div className="text-[#666F8D]">
          Информация о доступных квартирах скоро появится
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[22px] px-4 py-5 md:py-10 md:px-[60px] mt-5">
      <h2 className="text-2xl font-bold mb-6 md:mb-8">Предложения</h2>

      {/* Block tabs (Все корпуса + each block) */}
      {building.blocks && building.blocks.length > 0 && (
        <BlockTabs
          blocks={building.blocks}
          selected={selectedBlockId}
          onSelect={(id) => setSelectedBlockId(id)}
        />
      )}
      {building.units && building.units.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 md:mb-8">
            Показать планировки
          </h2>

          <div className="border-t border-b border-[#E3E6EA]">
            {(() => {
              const units = building.units || [];
              const unitsForBlock = selectedBlockId
                ? units.filter((u: any) => u.block_id === selectedBlockId)
                : units;

              // group by rooms (bedrooms || rooms || 0)
              const groups: Record<number, any[]> = {};
              unitsForBlock.forEach((u: any) => {
                const r = Number(u.bedrooms ?? u.rooms ?? 0);
                groups[r] = groups[r] || [];
                groups[r].push(u);
              });

              const roomKeys = Object.keys(groups)
                .map(Number)
                .sort((a, b) => a - b);

              const formatArea = (n: number) => `${n} м²`;

              const formatPrice = (n: number) => {
                if (!n) return '—';
                if (n >= 1000000) {
                  return `${(n / 1000000).toLocaleString('ru-RU', {
                    maximumFractionDigits: 1,
                  })} млн с.`;
                }
                return `${n.toLocaleString('ru-RU')} с.`;
              };

              const plural = (n: number) => {
                const mod10 = n % 10;
                const mod100 = n % 100;
                if (mod10 === 1 && mod100 !== 11) return 'предложение';
                if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14))
                  return 'предложения';
                return 'предложений';
              };

              return roomKeys.map((rooms) => {
                const items = groups[rooms];
                const areas = items
                  .map((i) => Number(i.area ?? i.total_area ?? 0))
                  .filter(Boolean);
                const minArea = areas.length ? Math.min(...areas) : null;

                const prices = items
                  .map((i) => Number(i.total_price ?? i.price ?? 0))
                  .filter(Boolean);
                const minPrice = prices.length ? Math.min(...prices) : null;
                const maxPrice = prices.length ? Math.max(...prices) : null;
                const isExpanded = expandedRooms.has(rooms);

                return (
                  <div key={rooms}>
                    <div className="py-5 px-2 border-b border-[#E3E6EA]">
                      {/* Заголовок */}
                      <div className="text-lg font-medium mb-2">
                        {rooms}-комнатные
                      </div>

                      {/* MOBILE */}
                      <div className="flex flex-col gap-2 text-sm md:hidden">
                        <div className="text-[#667085]">
                          {minArea ? `Площадь от ${minArea} м²` : '—'}
                        </div>

                        <div className="font-medium">
                          {minPrice !== null && maxPrice !== null
                            ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
                            : '—'}
                        </div>

                        <button
                            onClick={() => toggleRoom(rooms)}
                            className="flex items-center gap-2 text-[#0B66FF] underline w-fit"
                        >
                          <span>
                            {items.length} {plural(items.length)}
                          </span>

                          <svg
                              className={`w-4 h-4 transition-transform ${
                                  isExpanded ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* DESKTOP */}
                      <div className="hidden md:flex items-center justify-between">
                        <div className="text-[#667085]">
                          {minArea ? `От ${minArea} м²` : '—'}
                        </div>

                        <div className="font-medium">
                          {minPrice !== null && maxPrice !== null
                              ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
                              : '—'}
                        </div>

                        <button
                            onClick={() => toggleRoom(rooms)}
                          className="flex items-center gap-2 text-[#0B66FF] underline"
                        >
                          <span>
                            {items.length} {plural(items.length)}
                          </span>
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#F7FAFD]">
                        {items.map((unit) => (
                          <div
                            key={unit.id}
                            className="bg-white rounded-lg overflow-hidden border border-[#E3E6EA]"
                          >
                            <div className="flex gap-3 p-3 border-b border-[#E3E6EA]">
                              <div className="relative w-20 h-20 shrink-0 bg-[#F0F7FF] rounded">
                                <Image
                                  fill
                                  onClick={() =>
                                    setSelectedImage(
                                      '/images/buildings/plans/1.png'
                                    )
                                  }
                                  src="/images/buildings/plans/1.png"
                                  alt={unit.name ?? `Plan ${unit.id}`}
                                  className="object-contain p-2 cursor-pointer"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-[#0036A5]">
                                  {unit.bedrooms}-комн.
                                </div>
                                <div className="text-xs text-[#667085] mb-2">
                                  {unit.name || `Корпус ${unit.block_id}`}
                                </div>
                                <div className="text-[#0036A5] font-bold text-sm">
                                  {parseFloat(
                                    unit.total_price ?? '0'
                                  ).toLocaleString('ru-RU', {
                                    maximumFractionDigits: 0,
                                  })}{' '}
                                  с.
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-3">
                              <div className="flex gap-3">
                                <div className="flex items-center gap-1 text-[#667085] text-xs">
                                  <BedIcon className="w-4 h-4" />
                                  <span>{unit.bedrooms}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[#667085] text-xs">
                                  <ShowerIcon className="w-4 h-4" />
                                  <span>{unit.bathrooms}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[#667085] text-xs">
                                  <PlanIcon className="w-4 h-4" />
                                  <span>
                                    {parseFloat(
                                      String(unit.area ?? '0')
                                    ).toFixed(1)}{' '}
                                    м²
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-[#667085] text-xs">
                                  <FloorIcon className="w-4 h-4" />
                                  <span>{unit.floor}</span>
                                </div>
                              </div>

                              <div>
                                <span className="ml-auto text-sm text-[#667085]">
                                  {parseFloat(
                                    unit.price_per_sqm ?? '0'
                                  ).toLocaleString('ru-RU', {
                                    maximumFractionDigits: 0,
                                  })}{' '}
                                  с./м²
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>

          <div className="mt-4 text-sm text-[#667085]">
            Всего{' '}
            {selectedBlockId
              ? (building.units || []).filter(
                  (u) => u.block_id === selectedBlockId
                ).length
              : (building.units || []).length}{' '}
            квартир в ЖК
          </div>
        </div>
      )}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {units.map((unit) => (
          <div
            key={unit.id}
            className="bg-[#F7FAFD] rounded-xl overflow-hidden"
          >
            <div
              className="relative h-[188px] w-full bg-[#F0F7FF] rounded-xl mb-4 px-12 py-[18px] cursor-pointer"
              onClick={() => setSelectedImage('/images/buildings/plans/1.png')}
            >
              <Image
                fill
                src="/images/buildings/plans/1.png"
                alt={unit.name ?? `Plan + ${unit.id}`}
                className="object-contain p-2 rotate-270"
              />
            </div>

            <div className="px-4 pb-4">
              <h3 className="text-xl font-semibold mb-1">
                {unit.bedrooms} комнатная квартира
              </h3>
              <p className="text-[#667085] mb-3 text-sm">
                {unit.description || `Квартира ${unit.name}`}
              </p>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1 text-[#667085]">
                  <BedIcon className="w-5 h-5 mr-1" />
                  <span>{unit.bedrooms}</span>
                </div>

                <div className="flex items-center gap-1 text-[#667085]">
                  <ShowerIcon className="w-5 h-5 mr-1" />
                  <span>{unit.bathrooms}</span>
                </div>

                <div className="flex items-center gap-1 text-[#667085]">
                  <PlanIcon className="w-5 h-5 mr-1" />
                  <span>
                    {parseFloat(String(unit.area ?? '1')).toFixed(1)} м²
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[#667085]">
                  <FloorIcon className="w-5 h-5 mr-1" />
                  <span>{unit.floor}</span>
                </div>
              </div>

              <div className="flex items-center">
                <span className="text-[#0036A5] text-2xl font-bold">
                  {parseFloat(unit.total_price ?? '0').toLocaleString('ru-RU', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  с.
                </span>
                <span className="ml-auto text-sm text-[#667085]">
                  {parseFloat(unit.price_per_sqm ?? '0').toLocaleString(
                    'ru-RU',
                    {
                      maximumFractionDigits: 0,
                    }
                  )}{' '}
                  с./м²
                </span>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Plan preview"
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
