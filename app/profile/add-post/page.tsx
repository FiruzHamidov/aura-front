'use client';

import {FormLayout} from '@/ui-components/FormLayout';
import {ProgressIndicator} from '@/ui-components/ProgressIndicator';
import {PropertySelectionStep} from './_components/PropertySelectionStep';
import {PropertyDetailsStep} from './_components/PropertyDetailsStep';
import {useAddPostForm} from '@/hooks/useAddPostForm';
import {useMultiStepForm} from '@/hooks/useMultiStepForm';
import {DuplicateDialog} from "@/app/profile/_components/DuplicateDialog";
import {useProfile} from "@/services/login/hooks";
import {useUnsavedChanges} from '@/hooks/useUnsavedChanges';
import { useState } from 'react';

const STEPS = ['Основная информация', 'Детали и фото'];

export default function AddPost() {
    const formData = useAddPostForm();
    const {currentStep, nextStep, prevStep, resetSteps} = useMultiStepForm({
        totalSteps: 2,
        initialStep: 1,
    });

    const {data: user} = useProfile();

    // show warning card before user can proceed with adding a post
    const [showWarningCard, setShowWarningCard] = useState(true);

    const isDirty = (formData.isDirty || formData.hasNewFiles) && !formData.isSubmitting;
    useUnsavedChanges(isDirty, 'Все несохранённые изменения будут потеряны. Выйти?');

    const handleFormSubmit = async (e: React.FormEvent) => {
        console.log('formData', formData)
        await formData.handleSubmit(e);
        resetSteps();
    };

    return (
        <FormLayout
            title="Добавить объявление"
            description="Заполните информацию о вашем объекте недвижимости"
        >
            {showWarningCard && (
                <div className="mb-6 relative">
                    {/* Контент карточки — статичный (не анимируем текст/фон) */}
                    <div className="relative bg-red-50 rounded-2xl p-4 shadow-lg z-10">
                        <h3 className="font-semibold text-lg mb-2 text-red-800">Внимание — ответственность агента</h3>
                        <p className="text-sm mb-3 text-red-800/95">
                            Агент несет ответственность за достоверность представленной информации. Пожалуйста,
                            проверяйте данные внимательно: любые намеренные или грубые ошибки, введённые с целью
                            введения в заблуждение клиентов, могут привести к блокировке объявления или другим
                            дисциплинарным мерам. При публикации вы подтверждаете, что указанные данные корректны
                            и у вас есть право размещать это объявление.
                        </p>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowWarningCard(false)}
                                className="px-4 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600"
                            >
                                Понял и продолжить
                            </button>

                            <button
                                type="button"
                                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                                className="px-4 py-2 rounded-full border border-red-400 text-red-700 bg-transparent hover:bg-red-100"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>

                    {/* Анимированная рамка/тень — отдельный элемент под контентом,
        поэтому текст и фон карточки не мигают */}
                    <div aria-hidden className="absolute inset-0 rounded-2xl pointer-events-none z-0">
                        <div className="w-full h-full rounded-2xl ring-2 ring-red-300/70 animate-pulse" />
                    </div>
                </div>
            )}
            <ProgressIndicator
                currentStep={currentStep}
                totalSteps={2}
                steps={STEPS}
                className="mb-8"
            />

            {currentStep === 1 && (
                <PropertySelectionStep
                    isAgent={(user?.role?.slug === 'agent')}
                    isEdit={false}
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
                />
            )}

            <DuplicateDialog
                open={formData.dupDialogOpen}
                onClose={() => formData.setDupDialogOpen(false)}
                items={formData.duplicates}
                onForce={formData.forceCreate}
            />
        </FormLayout>
    );
}
