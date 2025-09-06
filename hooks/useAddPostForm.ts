// src/hooks/useAddPostForm.ts
'use client';

import {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import {
    useCreatePropertyMutation,
    useGetBuildingTypesQuery,
    useGetContractTypesQuery,
    useGetHeatingTypesQuery,
    useGetLocationsQuery,
    useGetParkingTypesQuery,
    useGetPropertyTypesQuery,
    useGetRepairTypesQuery,
    useUpdatePropertyMutation,
} from '@/services/add-post';
import {showToast} from '@/ui-components/Toast';
import {Property} from '@/services/properties/types';
import {extractValidationMessages} from '@/utils/validationErrors';

// ⚠️ ВАЖНО: эти типы должны быть экспортированы в "@/services/add-post/types"
//  - CreatePropertyPayload: FormData | CreatePropertyRequest
//  - UpdatePropertyPayload:
//       | { id: string; formData: FormData }
//       | { id: string; json: Partial<CreatePropertyRequest> }
import type {
    CreatePropertyPayload,
    FormState as RawFormState,
    PhotoItem,
    UpdatePropertyPayload,
} from '@/services/add-post/types';

// Подменяем только поле photos — в UI всегда работаем с PhotoItem[]
type FormState = Omit<RawFormState, 'photos'> & { photos: PhotoItem[] };

/** Генератор стабильного client-id для DnD */
const cid = () =>
    typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(36).slice(2)}`;

/** Мини-хелпер: PATCH /properties/{id}/photos/reorder
 *  Отдельная ручка фиксации порядка существующих фото.
 *  На бэке это реализовано через applyOrder() + normalizePositions().
 */
async function reorderPropertyPhotos(propertyId: number | string, photoOrder: number[]) {
    const res = await fetch(`/api/properties/${propertyId}/photos/reorder`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({photo_order: photoOrder}),
    });
    if (!res.ok) throw new Error(`Reorder failed: ${res.status} ${await res.text()}`);
}

/** Начальное состояние формы */
const initialFormState: FormState = {
    title: '',
    description: '',
    location_id: '',
    moderation_status: 'approved',
    repair_type_id: '',
    heating_type_id: '',
    parking_type_id: '',
    contract_type_id: '',
    price: '',
    currency: 'TJS',
    total_area: '',
    living_area: '',
    floor: '',
    total_floors: '',
    year_built: '',
    youtube_link: '',
    condition: '',
    apartment_type: '',
    has_garden: false,
    has_parking: false,
    is_mortgage_available: false,
    is_from_developer: false,
    landmark: '',
    latitude: '',
    longitude: '',
    agent_id: '',
    photos: [], // ⚙️ В UI это всегда массив PhotoItem (см. тип выше)
    owner_phone: '',
    district: '',
    address: '',
};

interface UseAddPostFormProps {
    editMode?: boolean;
    propertyData?: Property;
}

export function useAddPostForm({editMode = false, propertyData}: UseAddPostFormProps = {}) {
    // --- Справочники (селекты) ---
    const {data: propertyTypes = []} = useGetPropertyTypesQuery();
    const {data: buildingTypes = []} = useGetBuildingTypesQuery();
    const {data: locations = []} = useGetLocationsQuery();
    const {data: repairTypes = []} = useGetRepairTypesQuery();
    const {data: heatingTypes = []} = useGetHeatingTypesQuery();
    const {data: parkingTypes = []} = useGetParkingTypesQuery();
    const {data: contractTypes = []} = useGetContractTypesQuery();

    // --- Мутации ---
    const createPropertyMutation = useCreatePropertyMutation();
    const updatePropertyMutation = useUpdatePropertyMutation();

    // --- Локальный стейт формы ---
    const [form, setForm] = useState<FormState>(initialFormState);
    const [selectedOfferType, setSelectedOfferType] = useState('sale');
    const [selectedModerationStatus, setSelectedModerationStatus] = useState('approved');
    const [selectedPropertyType, setSelectedPropertyType] = useState<number | null>(null);
    const [selectedBuildingType, setSelectedBuildingType] = useState<number | null>(null);
    const [selectedListingType, setSelectedListingType] = useState('regular');
    const [selectedRooms, setSelectedRooms] = useState<number | null>(null);

    const isInitialized = useRef(false);

    // --- Инициализация формы из propertyData (edit mode) ---
    useEffect(() => {
        if (editMode && propertyData && !isInitialized.current) {
            setForm({
                title: propertyData.title || '',
                description: propertyData.description || '',
                location_id: propertyData.location_id?.toString() || '',
                repair_type_id: propertyData.repair_type_id?.toString() || '',
                heating_type_id: propertyData.heating_type_id?.toString() || '',
                parking_type_id: propertyData.parking_type_id?.toString() || '',
                contract_type_id: propertyData.contract_type_id?.toString() || '',
                moderation_status: propertyData.moderation_status?.toString() || '',
                price: propertyData.price || '',
                currency: propertyData.currency || 'TJS',
                total_area: propertyData.total_area || '',
                living_area: propertyData.living_area || '',
                floor: propertyData.floor || '',
                total_floors: propertyData.total_floors || '',
                year_built: propertyData.year_built || '',
                youtube_link: propertyData.youtube_link || '',
                condition: propertyData.condition || '',
                apartment_type: propertyData.apartment_type || '',
                has_garden: propertyData.has_garden || false,
                has_parking: propertyData.has_parking || false,
                is_mortgage_available: propertyData.is_mortgage_available || false,
                is_from_developer: propertyData.is_from_developer || false,
                landmark: propertyData.landmark || '',
                latitude: propertyData.latitude || '',
                longitude: propertyData.longitude || '',
                agent_id: propertyData.agent_id?.toString() || '',
                // ⤵️ серверные фото приводим к единому типу PhotoItem
                photos: (propertyData.photos ?? []).map((p: any) => ({
                    id: cid(),                     // генерируем клиентский id для DnD
                    url: p.file_path || p.url,     // относительный путь из БД (добавь CDN-префикс при выводе)
                    serverId: p.id,                // id фото в таблице property_photos
                })),
                owner_phone: propertyData.owner_phone || '',
                district: propertyData.district || '',
                address: propertyData.address || '',
            });

            setSelectedOfferType(propertyData.offer_type || 'sale');
            setSelectedModerationStatus(propertyData.moderation_status || 'approved');
            setSelectedPropertyType(propertyData.type_id || null);
            setSelectedListingType(propertyData.listing_type || 'regular');
            setSelectedBuildingType(propertyData.status_id || null);
            setSelectedRooms(propertyData.rooms || null);

            isInitialized.current = true;
        }
    }, [editMode, propertyData?.id]);

    // --- Общий onChange полей формы ---
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, type, value} = e.target;
        const input = e.target as HTMLInputElement;
        const newValue = type === 'checkbox' ? input.checked : value;
        setForm((prev) => ({...prev, [name]: newValue}));
    };

    // --- Добавление новых файлов ---
    //   File -> PhotoItem (id + objectURL) чтобы поддержать превью и DnD.
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const additions: PhotoItem[] = Array.from(e.target.files).map((f) => ({
            id: cid(),
            url: URL.createObjectURL(f), // objectURL только для превью на клиенте
            file: f,                     // признак "новое фото"
        }));
        setForm((prev) => ({...prev, photos: [...prev.photos, ...additions]}));
    };

    // --- Удаление фото по индексу (только из UI массива) ---
    //   Для удаления с сервера отправляй отдельный список delete_photo_ids на бэк, если нужно.
    const removePhoto = (index: number) => {
        setForm((prev) => ({...prev, photos: prev.photos.filter((_, i) => i !== index)}));
    };

    // --- Применение нового порядка от PhotoUpload (DnD) ---
    const handleReorder = (next: PhotoItem[]) => {
        setForm((prev) => ({...prev, photos: next}));
    };

    // --- Сброс формы ---
    const resetForm = () => {
        setForm(initialFormState);
        setSelectedOfferType('sale');
        setSelectedModerationStatus('approved');
        setSelectedPropertyType(null);
        setSelectedBuildingType(null);
        setSelectedRooms(null);
        setSelectedListingType('regular');
        isInitialized.current = false;
    };

    // --- Валидация обязательных селектов ---
    const validateForm = () => {
        if (!selectedPropertyType || !selectedBuildingType || !selectedRooms) {
            showToast('error', 'Пожалуйста, заполните все обязательные поля');
            return false;
        }
        return true;
    };

    // --- Сабмит с сохранением порядка ---
    //   Создание: отправляем FormData (photos[] + photo_positions[]).
    //   Обновление: тоже FormData для дозагрузки, затем PATCH /photos/reorder с serverId в текущем порядке.
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        // 1) Плоские поля (без массива photos)
        const propertyDataToSubmit = {
            description: form.description,
            type_id: selectedPropertyType!,   // гарантируем, что validateForm() это проверил
            status_id: selectedBuildingType!,
            location_id: form.location_id,
            repair_type_id: form.repair_type_id,
            heating_type_id: form.heating_type_id,
            contract_type_id: form.contract_type_id,
            address: form.address,
            district: form.district,
            parking_type_id: form.parking_type_id,
            price: form.price,
            currency: form.currency,
            offer_type: selectedOfferType,
            moderation_status: selectedModerationStatus,
            listing_type: selectedListingType,
            rooms: selectedRooms!,
            total_area: form.total_area,
            living_area: form.living_area,
            floor: form.floor,
            total_floors: form.total_floors,
            year_built: form.year_built,
            condition: form.condition,
            apartment_type: form.apartment_type,
            has_garden: form.has_garden,
            has_parking: form.has_parking,
            is_mortgage_available: form.is_mortgage_available,
            is_from_developer: form.is_from_developer,
            landmark: form.landmark,
            owner_phone: form.owner_phone,
            youtube_link: form.youtube_link,
            latitude: form.latitude,
            longitude: form.longitude,
            agent_id: form.agent_id,
        };

        // 2) Сборка FormData:
        //   — все простые поля добавляем строками
        //   — новые фото кладём в photos[]
        //   — параллельно отдаём photo_positions[i] = индекс карточки в текущем UI-порядке
        const buildFormData = () => {
            const fd = new FormData();

            // Плоские поля
            Object.entries(propertyDataToSubmit).forEach(([k, v]) => {
                if (v !== undefined && v !== null) fd.append(k, String(v));
            });

            // Новые фото и их позиции (позиция = индекс на клиенте)
            let fileIndex = 0;
            form.photos.forEach((p, uiIndex) => {
                if (p.file) {
                    fd.append('photos[]', p.file);
                    fd.append(`photo_positions[${fileIndex}]`, String(uiIndex));
                    fileIndex += 1;
                }
            });

            return fd;
        };

        // 3) Список id существующих фото (из БД) в текущем UI-порядке — для reorder
        const existingPhotoOrder = form.photos
            .filter((p): p is PhotoItem & { serverId: number } => typeof p.serverId === 'number')
            .map((p) => p.serverId);

        try {
            if (editMode && propertyData?.id) {
                // ------ UPDATE ------
                const fd = buildFormData();

                // Для Laravel часто стабильней отправлять PATCH как POST c _method=PATCH
                if (!fd.has('_method')) fd.append('_method', 'PATCH');

                // Готовим строго типизированный payload под хук:
                const updatePayload: UpdatePropertyPayload = {
                    id: propertyData.id.toString(),
                    formData: fd, // <— FormData-ветка union-типа
                };

                await updatePropertyMutation.mutateAsync(updatePayload);

                // Фиксируем порядок существующих фото (без перезаливки)
                if (existingPhotoOrder.length) {
                    await reorderPropertyPhotos(propertyData.id, existingPhotoOrder);
                }

                showToast('success', 'Объявление успешно обновлено!');
            } else {
                // ------ CREATE ------
                const fd = buildFormData();

                // Строго типизированный payload: FormData | CreatePropertyRequest
                const createPayload: CreatePropertyPayload = fd;

                await createPropertyMutation.mutateAsync(createPayload);

                showToast('success', 'Объявление успешно добавлено!');
                resetForm();
            }
        } catch (err) {
            const messages = extractValidationMessages(err);
            if (messages) {
                showToast('error', `Исправьте ошибки:\n• ${messages.join('\n• ')}`);
                return;
            }
            console.error(err);
            showToast('error', editMode ? 'Ошибка при обновлении объявления' : 'Ошибка при добавлении объявления');
        }
    };

    return {
        // справочники
        propertyTypes,
        buildingTypes,
        locations,
        repairTypes,
        heatingTypes,
        parkingTypes,
        contractTypes,

        // форма и выборы
        form,
        selectedOfferType,
        selectedPropertyType,
        selectedBuildingType,
        selectedListingType,
        selectedModerationStatus,
        selectedRooms,

        // сеттеры
        setSelectedOfferType,
        setSelectedListingType,
        setSelectedPropertyType,
        setSelectedBuildingType,
        setSelectedModerationStatus,
        setSelectedRooms,

        // хендлеры
        handleChange,
        handleFileChange,
        removePhoto,
        handleReorder,
        handleSubmit,
        resetForm,

        // статус
        isSubmitting: editMode ? updatePropertyMutation.isPending : createPropertyMutation.isPending,
        editMode,
    };
}