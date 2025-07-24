'use client';

import { FormLayout } from '@/ui-components/FormLayout';
import { ProgressIndicator } from '@/ui-components/ProgressIndicator';
import { PropertySelectionStep } from './_components/PropertySelectionStep';
import { PropertyDetailsStep } from './_components/PropertyDetailsStep';
import { useAddPostForm } from '@/hooks/useAddPostForm';
import { useMultiStepForm } from '@/hooks/useMultiStepForm';

const STEPS = ['Основная информация', 'Детали и фото'];

export default function AddPost() {
  const formData = useAddPostForm();
  const { currentStep, nextStep, prevStep, resetSteps } = useMultiStepForm({
    totalSteps: 2,
    initialStep: 1,
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    await formData.handleSubmit(e);
    resetSteps();
  };

  return (
    <FormLayout
      title="Добавить объявление"
      description="Заполните информацию о вашем объекте недвижимости"
    >
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={2}
        steps={STEPS}
        className="mb-8"
      />

      {currentStep === 1 && (
        <PropertySelectionStep
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
          onSubmit={handleFormSubmit}
          onChange={formData.handleChange}
          onPhotoChange={formData.handleFileChange}
          onPhotoRemove={formData.removePhoto}
          isSubmitting={formData.isSubmitting}
          onBack={prevStep}
        />
      )}
    </FormLayout>
  );
}
