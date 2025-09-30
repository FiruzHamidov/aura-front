'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
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
    useReorderPropertyPhotosMutation, useDeletePropertyPhotoMutation,
} from '@/services/add-post';
import { showToast } from '@/ui-components/Toast';
import { Property } from '@/services/properties/types';
import { extractValidationMessages } from '@/utils/validationErrors';

import type {
    CreatePropertyPayload,
    FormState as RawFormState,
    PhotoItem,
    UpdatePropertyPayload,
} from '@/services/add-post/types';

type FormState = Omit<RawFormState, 'photos'> & { photos: PhotoItem[] };

const cid = () =>
    typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(36).slice(2)}`;

type PropertyPhotoFromServer = {
    id: number;
    file_path?: string | null;
    url?: string | null;
};

// ---------- Начальное состояние ----------
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
    photos: [],
    owner_phone: '',
    owner_name: '',
    object_key: '',
    district: '',
    address: '',
};

interface UseAddPostFormProps {
    editMode?: boolean;
    propertyData?: Property;
}

export function useAddPostForm({ editMode = false, propertyData }: UseAddPostFormProps = {}) {

    const { data: propertyTypes = [] } = useGetPropertyTypesQuery();
    const { data: buildingTypes = [] } = useGetBuildingTypesQuery();
    const { data: locations = [] } = useGetLocationsQuery();
    const { data: repairTypes = [] } = useGetRepairTypesQuery();
    const { data: heatingTypes = [] } = useGetHeatingTypesQuery();
    const { data: parkingTypes = [] } = useGetParkingTypesQuery();
    const { data: contractTypes = [] } = useGetContractTypesQuery();

    const createPropertyMutation = useCreatePropertyMutation();
    const updatePropertyMutation = useUpdatePropertyMutation();
    const deletePhotoMutation = useDeletePropertyPhotoMutation();
    const reorderPhotosMutation = useReorderPropertyPhotosMutation();

    const [form, setForm] = useState<FormState>(initialFormState);
    const [selectedOfferType, setSelectedOfferType] = useState('sale');
    const [selectedModerationStatus, setSelectedModerationStatus] = useState('approved');
    const [selectedPropertyType, setSelectedPropertyType] = useState<number | null>(null);
    const [selectedBuildingType, setSelectedBuildingType] = useState<number | null>(null);
    const [selectedListingType, setSelectedListingType] = useState('regular');
    const [selectedRooms, setSelectedRooms] = useState<number | null>(null);

    const isInitialized = useRef(false);

    const mapServerPhotos = (photos: Property['photos'] | undefined | null): PhotoItem[] => {
        if (!photos) return [];
        return photos.map((p): PhotoItem => {
            const src = (p as unknown as PropertyPhotoFromServer);
            return {
                id: cid(),
                url: (src.file_path && String(src.file_path)) || (src.url && String(src.url)) || '',
                serverId: src.id,
            };
        });
    };

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
                photos: mapServerPhotos(propertyData.photos),
                owner_phone: propertyData.owner_phone || '',
                owner_name: propertyData.owner_name || '',
                object_key: propertyData.object_key || '',
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
    }, [editMode, propertyData?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // --- Общий onChange полей формы ---
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target;
        const input = e.target as HTMLInputElement;
        const newValue = type === 'checkbox' ? input.checked : value;
        setForm((prev) => ({ ...prev, [name]: newValue }));
    };

    // --- Добавление новых файлов (File -> PhotoItem) ---
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const additions: PhotoItem[] = Array.from(e.target.files).map((f) => ({
            id: cid(),
            url: URL.createObjectURL(f),
            file: f,
        }));
        setForm((prev) => ({ ...prev, photos: [...prev.photos, ...additions] }));
    };

    // --- Удаление фото по индексу (только UI) ---
    const removePhoto = async (index: number) => {
        const target = form.photos[index];
        if (!target) return;

        // 1) Оптимистично убираем из UI
        const prev = form.photos;
        const next = prev.filter((_, i) => i !== index);
        setForm((p) => ({ ...p, photos: next }));

        // 2) Если это серверное фото и мы в editMode — зовём DELETE
        if (editMode && target.serverId && propertyData?.id) {
            try {
                await deletePhotoMutation.mutateAsync({
                    propertyId: propertyData.id,
                    photoId: target.serverId,
                });

                // 3) (опционально) Подтвердим новый порядок оставшихся серверных фото
                const remainingServerIds = next
                    .filter((x): x is PhotoItem & { serverId: number } => typeof x.serverId === 'number')
                    .map((x) => x.serverId);

                if (remainingServerIds.length) {
                    await reorderPhotosMutation.mutateAsync({
                        id: propertyData.id,
                        order: remainingServerIds,
                    });
                }
            } catch (e) {
                // Откат UI при ошибке
                setForm((p) => ({ ...p, photos: prev }));
                showToast('error', 'Не удалось удалить фото. Проверьте доступ и повторите.');
                console.error(e);
            }
        }
        // Для локальных (новых) фото — API не нужен, удаление уже произошло в UI
    };

    // --- Применение нового порядка от DnD ---
    const handleReorder = (next: PhotoItem[]) => {
        setForm((prev) => ({ ...prev, photos: next }));
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
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        // 1) Плоские поля (без массива photos)
        const propertyDataToSubmit = {
            description: form.description,
            type_id: selectedPropertyType!,
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

        // 2) Сборка FormData (строго нормализуем булевы)
        const buildFormData = () => {
            const fd = new FormData();

            const appendKV = (key: string, value: unknown) => {
                if (value === null || value === undefined) return;
                if (typeof value === 'boolean') {
                    fd.append(key, value ? '1' : '0');
                    return;
                }
                if (value === 'true' || value === 'false') {
                    fd.append(key, value === 'true' ? '1' : '0');
                    return;
                }
                const s = String(value);
                if (s === '') return;
                fd.append(key, s);
            };

            Object.entries(propertyDataToSubmit).forEach(([k, v]) => appendKV(k, v));

            // Новые фото и их позиции (позиция = индекс карточки в UI)
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

        // 3) Текущий порядок существующих фото (по id из БД)
        const existingPhotoOrder = form.photos
            .filter((p): p is PhotoItem & { serverId: number } => typeof p.serverId === 'number')
            .map((p) => p.serverId);

        try {
            if (editMode && propertyData?.id) {
                // UPDATE: дозагрузка новых фото + обновление полей
                const fd = buildFormData();
                if (!fd.has('_method')) fd.append('_method', 'PUT');

                const updatePayload: UpdatePropertyPayload = {
                    id: propertyData.id.toString(),
                    formData: fd,
                };
                await updatePropertyMutation.mutateAsync(updatePayload);

                // фиксация порядка существующих фото (без перезаливки) — ВЫЗОВ API
                if (existingPhotoOrder.length) {
                    await reorderPhotosMutation.mutateAsync({
                        id: propertyData.id,
                        order: existingPhotoOrder,
                    });
                }

                showToast('success', 'Объявление успешно обновлено!');
            } else {
                // CREATE
                const fd = buildFormData();
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

        form,
        selectedOfferType,
        selectedPropertyType,
        selectedBuildingType,
        selectedListingType,
        selectedModerationStatus,
        selectedRooms,
        setSelectedOfferType,
        setSelectedListingType,
        setSelectedPropertyType,
        setSelectedBuildingType,
        setSelectedModerationStatus,
        setSelectedRooms,
        handleChange,
        handleFileChange,
        removePhoto,
        handleReorder,
        handleSubmit,
        resetForm,
        isSubmitting: editMode ? updatePropertyMutation.isPending : createPropertyMutation.isPending,
        editMode,
    };
}