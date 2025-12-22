'use client';

import {SelectToggle} from '@/ui-components/SelectToggle';
import {Button} from '@/ui-components/Button';
import {type FormState as RawFormState, type PhotoItem, SelectOption} from '@/services/add-post/types';
import {ChangeEvent, useEffect, useMemo, useState} from "react";

type FormWithPhotos = Omit<RawFormState, 'photos'> & { photos: PhotoItem[] };

interface PropertySelectionStepProps {
    isAgent: boolean;
    isEdit: boolean;
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
    form: FormWithPhotos;
}

const BASE_STATUSES: { id: string; name: string }[] = [
    {id: 'pending', name: 'На модерации'},
    {id: 'approved', name: 'Одобрено'},
];

const FULL_STATUSES: { id: string; name: string }[] = [
    {id: 'pending', name: 'На модерации'},
    {id: 'approved', name: 'Одобрено'},
    {id: 'sold', name: 'Продано агентом'},
    {id: 'sold_by_owner', name: 'Продано владельцем'},
    {id: 'rented', name: 'Арендовано'},
    {id: 'denied', name: 'Отказано клиентом'},
    // {id: 'deleted', name: 'Удалено'},
];

const STATUS_REQUIRING_COMMENT = ['sold', 'sold_by_owner', 'rented', 'denied', 'deleted'];

export function PropertySelectionStep({
                                          isAgent,
                                          isEdit,
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
                                          form
                                      }: PropertySelectionStepProps) {

    const [statusComment, setStatusComment] = useState<string>('');



    const isValidBase = Boolean(selectedPropertyType && selectedBuildingType && selectedRooms);

    // Если агент и VIP/urgent -> принудительно pending
    useEffect(() => {
        if (isAgent && selectedListingType !== 'regular' && selectedModerationStatus !== 'pending') {
            setSelectedModerationStatus('pending');
        }
        setStatusComment(form.status_comment)
    }, [isAgent, selectedListingType, selectedModerationStatus, setSelectedModerationStatus]);

    /**
     * Фильтрация статусов:
     * - если агент и VIP/urgent -> только pending (как было раньше)
     * - иначе: отфильтровываем статусы, которые не подходят под selectedOfferType
     *   * при 'sale' удаляем 'rented'
     *   * при 'rent' удаляем 'sold' и 'sold_by_owner' и (если нужно) 'denied' — т.к. он про отказ в продаже
     */

    const moderationOptions = useMemo(() => {
        // базовые статусы (делаем копию, не мутируем константу)
        let base = [...BASE_STATUSES];

        // админ может видеть "deleted"
        if (!isAgent) {
            base.push({id: 'deleted', name: 'Удалено'});
        }

        // если это создание — только базовые статусы
        if (!isEdit) {
            return base;
        }

        // агент + VIP / urgent → только pending
        if (isAgent && selectedListingType !== 'regular') {
            return [{id: 'pending', name: 'На модерации'}];
        }

        let list = [...FULL_STATUSES];

        // фильтрация по типу сделки
        if (selectedOfferType === 'sale') {
            list = list.filter(s => s.id !== 'rented');
        } else if (selectedOfferType === 'rent') {
            list = list.filter(s =>
                !['sold', 'sold_by_owner'].includes(s.id)
            );
        }

        // админ может удалять (гарантируем, что deleted только один)
        if (!isAgent && !list.some(s => s.id === 'deleted')) {
            list.push({id: 'deleted', name: 'Удалено'});
        }

        return list;
    }, [isEdit, isAgent, selectedListingType, selectedOfferType]);

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

    const mustProvideComment = STATUS_REQUIRING_COMMENT.includes(selectedModerationStatus);

    const isValid = isValidBase && (!mustProvideComment || (statusComment && statusComment.trim() !== ''));



    return (
        <div className="flex flex-col gap-6">
            <SelectToggle
                title="Сделка"
                options={[
                    {id: 'sale', name: 'Продажа'},
                    {id: 'rent', name: 'Аренда'},
                ]}
                selected={selectedOfferType}
                setSelected={setSelectedOfferType}
            />

            <SelectToggle
                title="Тип объявления"
                options={[
                    {id: 'regular', name: 'Обычное'},
                    {id: 'vip', name: 'VIP'},
                    {id: 'urgent', name: 'Срочная продажа'},
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

            {/* Показываем поле комментария к статусу если выбран требующий статус */}
            {mustProvideComment && (
                <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Причина смены статуса
                        (обязательно)</label>
                    <textarea
                        value={statusComment}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            form.status_comment = e.target.value
                            setStatusComment(form.status_comment)
                        }}
                        rows={4}
                        className="w-full p-3 border rounded-lg text-sm"
                        placeholder="Напишите причину изменения статуса..."
                    />
                </div>
            )}

            <div className="flex justify-end">
                <Button onClick={onNext} disabled={!isValid} className="mt-8">
                    Продолжить
                </Button>
            </div>
        </div>
    );
}