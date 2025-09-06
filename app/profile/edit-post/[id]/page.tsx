'use client';

import {useEffect} from 'react';
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

const STEPS = ['Основная информация', 'Детали и фото'];

export default function EditPost() {
    const {id} = useParams();
    const router = useRouter();
    const {data: user} = useProfile();

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
            contract_type_id: propertyData.contract_type_id,
            heating_type_id: propertyData.heating_type_id,
            parking_type_id: propertyData.parking_type_id,
            total_area: propertyData.total_area,
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
            landmark: propertyData.landmark,
            latitude: propertyData.latitude,
            longitude: propertyData.longitude,
            owner_phone: propertyData.owner_phone,
            offer_type: propertyData.offer_type,
            photos: propertyData.photos,
            moderation_status: propertyData.moderation_status,
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
                />
            )}
        </FormLayout>
    );
}
