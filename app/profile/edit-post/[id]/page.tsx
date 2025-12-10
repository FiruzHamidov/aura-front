'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {FormLayout} from '@/ui-components/FormLayout';
import {ProgressIndicator} from '@/ui-components/ProgressIndicator';
import {PropertySelectionStep} from '../../add-post/_components/PropertySelectionStep';
import {PropertyDetailsStep} from '../../add-post/_components/PropertyDetailsStep';
import {useAddPostForm} from '@/hooks/useAddPostForm';
import {useMultiStepForm} from '@/hooks/useMultiStepForm';
import {useGetPropertyByIdQuery} from '@/services/properties/hooks';
import {Property} from '@/services/properties/types';
import {useProfile} from '@/services/login/hooks';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import {axios} from "@/utils/axios";
import {Button} from "@/ui-components/Button";
import {ArrowLeft, ArrowRight} from "lucide-react";

const STEPS = ['Основная информация', 'Детали и фото'];

export default function EditPost() {
    const {id} = useParams();
    const router = useRouter();
    const {data: user} = useProfile();

    const [agents, setAgents] = useState<{ id: number; name: string }[]>([]);
    const [agentsLoading, setAgentsLoading] = useState(false);

    // загрузка списка агентов (для админа)
    // загрузка списка агентов (для админа)
    useEffect(() => {
        if (!user) return;
        if (user.role?.slug !== 'admin') return;

        (async () => {
            try {
                setAgentsLoading(true);
                // корректно типизируем ответ axios: data будет массивом агентов
                const { data } = await axios.get<{ id: number; name: string }[]>('/user/agents');
                if (Array.isArray(data)) {
                    setAgents(data.map((a) => ({ id: Number(a.id), name: String(a.name) })));
                } else {
                    setAgents([]);
                }
            } catch (err) {
                console.error('Failed to load agents', err);
                setAgents([]);
            } finally {
                setAgentsLoading(false);
            }
        })();
    }, [user]);

    const {
        data: propertyData,
        isLoading,
        error,
    } = useGetPropertyByIdQuery(id as string);

    // Convert property data to match add-post Property type
    const convertedPropertyData: Partial<Property> | undefined = propertyData
        ? {
            id: propertyData.id,
            description: propertyData.description,
            price: propertyData.price,
            currency: propertyData.currency,
            rooms: propertyData.rooms,
            floor: propertyData.floor,
            title: propertyData.title,
            address: propertyData.address,
            district: propertyData.district,
            creator: propertyData.creator,
            agent_id: propertyData.agent_id,
            type_id: propertyData.type_id,
            status_id: propertyData.status_id,
            location_id: propertyData.location_id,
            repair_type_id: propertyData.repair_type_id,
            developer_id: propertyData.developer_id,
            contract_type_id: propertyData.contract_type_id,
            heating_type_id: propertyData.heating_type_id,
            parking_type_id: propertyData.parking_type_id,
            total_area: propertyData.total_area,
            land_size: propertyData.land_size,
            living_area: propertyData.living_area,
            total_floors: propertyData.total_floors,
            year_built: propertyData.year_built,
            youtube_link: propertyData.youtube_link,
            condition: propertyData.condition,
            apartment_type: propertyData.apartment_type,
            has_garden: propertyData.has_garden,
            has_parking: propertyData.has_parking,
            is_mortgage_available: propertyData.is_mortgage_available,
            is_from_developer: propertyData.is_from_developer,
            is_full_apartment: propertyData.is_full_apartment,
            is_for_aura: propertyData.is_for_aura,
            is_business_owner: propertyData.is_business_owner,
            landmark: propertyData.landmark,
            latitude: propertyData.latitude,
            longitude: propertyData.longitude,
            owner_phone: propertyData.owner_phone,
            owner_name: propertyData.owner_name,
            object_key: propertyData.object_key,
            offer_type: propertyData.offer_type,
            photos: propertyData.photos,
            moderation_status: propertyData.moderation_status,
            created_by: propertyData.created_by ?? propertyData.creator?.id ?? null,
        }
        : undefined;

    // Check if user has permission to edit
    useEffect(() => {
        if (propertyData && user) {
            const canEdit =
                (user && user.role?.slug === 'admin') ||
                (propertyData.creator &&
                    (user?.id === propertyData.creator.id ||
                        (propertyData.agent_id && user?.id === propertyData.agent_id)));

            if (!canEdit) {
                router.push('/profile');
            }
        }
    }, [propertyData, user, router]);

    const formData = useAddPostForm({
        editMode: true,
        propertyData: convertedPropertyData as Property | undefined,
    });

    const guardActive = (formData.isDirty || formData.hasNewFiles) && !formData.isSubmitting;
    useUnsavedChanges(guardActive, 'Все несохранённые изменения будут потеряны. Выйти?');

    const {currentStep, nextStep, prevStep} = useMultiStepForm({
        totalSteps: 2,
        initialStep: 1,
    });

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await formData.handleSubmit(e);
        router.push(`/apartment/${id}`);
    };

    if (isLoading) {
        return (
            <FormLayout title="Загрузка..." description="Загружаем данные объявления">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-lg">Загрузка...</div>
                </div>
            </FormLayout>
        );
    }

    if (error || !propertyData) {
        return (
            <FormLayout
                title="Ошибка"
                description="Не удалось загрузить данные объявления"
            >
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-lg text-red-600">
                        Ошибка при загрузке объекта
                    </div>
                </div>
            </FormLayout>
        );
    }

    if (!user || !convertedPropertyData) {
        return (
            <FormLayout title="Загрузка..." description="Проверяем права доступа">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-lg">Загрузка...</div>
                </div>
            </FormLayout>
        );
    }

    return (
        <FormLayout
            title="Редактировать объявление"
            description="Измените информацию о вашем объекте недвижимости"
        >
            <ProgressIndicator
                currentStep={currentStep}
                totalSteps={2}
                steps={STEPS}
                className="mb-8"
            />

            {currentStep === 1 && (
                <PropertySelectionStep
                    isAgent={(user?.role?.slug === 'agent')}
                    isEdit={true}
                    selectedModerationStatus={formData.selectedModerationStatus}
                    setSelectedModerationStatus={formData.setSelectedModerationStatus}
                    selectedOfferType={formData.selectedOfferType}
                    setSelectedOfferType={formData.setSelectedOfferType}
                    selectedListingType={formData.selectedListingType}
                    setSelectedListingType={formData.setSelectedListingType}
                    selectedPropertyType={formData.selectedPropertyType}
                    setSelectedPropertyType={formData.setSelectedPropertyType}
                    selectedBuildingType={formData.selectedBuildingType}
                    setSelectedBuildingType={formData.setSelectedBuildingType}
                    selectedRooms={formData.selectedRooms}
                    setSelectedRooms={formData.setSelectedRooms}
                    propertyTypes={formData.propertyTypes}
                    buildingTypes={formData.buildingTypes}
                    onNext={nextStep}
                />
            )}

            {currentStep === 2 && (
                <PropertyDetailsStep
                    form={formData.form}
                    locations={formData.locations}
                    repairTypes={formData.repairTypes}
                    developers={formData.developers}
                    heatingTypes={formData.heatingTypes}
                    parkingTypes={formData.parkingTypes}
                    contractTypes={formData.contractTypes}
                    onSubmit={handleFormSubmit}
                    onChange={formData.handleChange}
                    onPhotoChange={formData.handleFileChange}
                    onPhotoRemove={formData.removePhoto}
                    onReorder={formData.handleReorder}
                    isSubmitting={formData.isSubmitting}
                    onBack={prevStep}
                    selectedPropertyType={formData.selectedPropertyType}
                    propertyTypes={formData.propertyTypes}
                    isAdmin={(user?.role?.slug === 'admin')}
                    agents={agents}
                    agentsLoading={agentsLoading}
                />
            )}


                <Button
                    className="w-10 h-10 fixed z-[999] p-4 bottom-26 sm:top-1/2 sm:-translate-y-1/2 left-4"
                    type="button"
                    variant="circle"
                    disabled={currentStep == 1}
                    onClick={() => {
                        prevStep();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    size="sm"
                >
                    <ArrowLeft className='w-4'/>
                </Button>



                <Button
                    className="w-10 h-10 fixed z-[999] p-4 bottom-26 sm:top-1/2 sm:-translate-y-1/2 left-15"
                    type="button"
                    variant="circle"
                    disabled={currentStep == 2}
                    onClick={() => {
                        nextStep();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    size="sm"
                >
                    <ArrowRight className='w-4'/>
                </Button>

        </FormLayout>
    );
}