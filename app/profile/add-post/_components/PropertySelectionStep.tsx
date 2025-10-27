'use client';

import { SelectToggle } from '@/ui-components/SelectToggle';
import { Button } from '@/ui-components/Button';
import { SelectOption } from '@/services/add-post/types';
import { useEffect, useMemo } from "react";

interface PropertySelectionStepProps {
    isAgent: boolean;
    selectedModerationStatus: string;
    setSelectedModerationStatus: (type: string) => void;
    selectedOfferType: string;
    setSelectedOfferType: (type: string) => void;
    selectedListingType: string;
    setSelectedListingType: (type: string) => void;
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

const BASE_STATUSES: { id: string; name: string }[] = [
    { id: 'pending', name: 'На модерации' },
    { id: 'approved', name: 'Одобрено' },
    { id: 'rejected', name: 'Отклонено' },
    { id: 'draft', name: 'Черновик' },
    { id: 'deleted', name: 'Удалено' },
    { id: 'sold', name: 'Продано' },
    { id: 'sold_by_owner', name: 'Продано владельцем' },
    { id: 'rented', name: 'Арендовано' },
    { id: 'denied', name: 'Отказано клиентом' },
];

export function PropertySelectionStep({
                                          isAgent,
                                          selectedModerationStatus,
                                          setSelectedModerationStatus,
                                          selectedOfferType,
                                          setSelectedOfferType,
                                          selectedListingType,
                                          setSelectedListingType,
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
    const isValid = Boolean(selectedPropertyType && selectedBuildingType && selectedRooms);

    // Если агент и VIP/urgent -> принудительно pending
    useEffect(() => {
        if (isAgent && selectedListingType !== 'regular' && selectedModerationStatus !== 'pending') {
            setSelectedModerationStatus('pending');
        }
    }, [isAgent, selectedListingType, selectedModerationStatus, setSelectedModerationStatus]);

    /**
     * Фильтрация статусов:
     * - если агент и VIP/urgent -> только pending (как было раньше)
     * - иначе: отфильтровываем статусы, которые не подходят под selectedOfferType
     *   * при 'sale' удаляем 'rented'
     *   * при 'rent' удаляем 'sold' и 'sold_by_owner' и (если нужно) 'denied' — т.к. он про отказ в продаже
     */
    const moderationOptions = useMemo(() => {
        if (isAgent && selectedListingType !== 'regular') {
            return [{ id: 'pending', name: 'На модерации' }];
        }

        let list = BASE_STATUSES.slice();

        if (selectedOfferType === 'sale') {
            list = list.filter(s => s.id !== 'rented');
        } else if (selectedOfferType === 'rent') {
            list = list.filter(s => s.id !== 'sold' && s.id !== 'sold_by_owner');
        }

        return list;
    }, [isAgent, selectedListingType, selectedOfferType]);

    // Если текущий выбранный статус больше не доступен — сбрасываем его безопасно
    useEffect(() => {
        const ids = moderationOptions.map(o => o.id);
        if (!ids.includes(selectedModerationStatus)) {
            // Предпочтительно: pending, иначе первый доступный, иначе ''
            if (ids.includes('pending')) {
                setSelectedModerationStatus('pending');
            } else if (moderationOptions.length > 0) {
                setSelectedModerationStatus(moderationOptions[0].id);
            } else {
                setSelectedModerationStatus('');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moderationOptions, selectedModerationStatus]);

    const moderationDisabled = isAgent && selectedListingType !== 'regular';

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
                title="Тип объявления"
                options={[
                    { id: 'regular', name: 'Обычное' },
                    { id: 'vip', name: 'VIP' },
                    { id: 'urgent', name: 'Срочная продажа' },
                ]}
                selected={selectedListingType}
                setSelected={setSelectedListingType}
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

            <SelectToggle
                title="Статус модерации"
                options={moderationOptions}
                selected={selectedModerationStatus}
                setSelected={setSelectedModerationStatus}
                disabled={moderationDisabled}
            />

            <div className="flex justify-end">
                <Button onClick={onNext} disabled={!isValid} className="mt-8">
                    Продолжить
                </Button>
            </div>
        </div>
    );
}