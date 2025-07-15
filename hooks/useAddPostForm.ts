"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
  useGetPropertyTypesQuery,
  useGetBuildingTypesQuery,
  useGetLocationsQuery,
  useGetRepairTypesQuery,
  useGetHeatingTypesQuery,
  useGetParkingTypesQuery,
  useCreatePropertyMutation,
  FormState,
} from "@/services/add-post";
import { showToast } from "@/ui-components/Toast";

const initialFormState: FormState = {
  title: "",
  description: "",
  location_id: "",
  repair_type_id: "",
  heating_type_id: "",
  parking_type_id: "",
  price: "",
  currency: "TJS",
  total_area: "",
  living_area: "",
  floor: "",
  total_floors: "",
  year_built: "",
  youtube_link: "",
  condition: "",
  apartment_type: "",
  has_garden: false,
  has_parking: false,
  is_mortgage_available: false,
  is_from_developer: false,
  landmark: "",
  latitude: "",
  longitude: "",
  agent_id: "",
  photos: [],
  owner_phone: "",
};

export function useAddPostForm() {
  // API hooks
  const { data: propertyTypes = [] } = useGetPropertyTypesQuery();
  const { data: buildingTypes = [] } = useGetBuildingTypesQuery();
  const { data: locations = [] } = useGetLocationsQuery();
  const { data: repairTypes = [] } = useGetRepairTypesQuery();
  const { data: heatingTypes = [] } = useGetHeatingTypesQuery();
  const { data: parkingTypes = [] } = useGetParkingTypesQuery();

  const createPropertyMutation = useCreatePropertyMutation();

  // Form state
  const [form, setForm] = useState<FormState>(initialFormState);
  const [selectedOfferType, setSelectedOfferType] = useState<string>("sale");
  const [selectedPropertyType, setSelectedPropertyType] = useState<
    number | null
  >(null);
  const [selectedBuildingType, setSelectedBuildingType] = useState<
    number | null
  >(null);
  const [selectedRooms, setSelectedRooms] = useState<number | null>(null);

  // Handlers
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    const target = e.target as HTMLInputElement;
    const newValue = type === "checkbox" ? target.checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  const removePhoto = (index: number) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setSelectedOfferType("sale");
    setSelectedPropertyType(null);
    setSelectedBuildingType(null);
    setSelectedRooms(null);
  };

  const validateForm = () => {
    if (!selectedPropertyType || !selectedBuildingType || !selectedRooms) {
      showToast("error", "Пожалуйста, заполните все обязательные поля");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const propertyData = {
      description: form.description,
      type_id: selectedPropertyType!,
      status_id: selectedBuildingType!,
      location_id: form.location_id,
      repair_type_id: form.repair_type_id,
      heating_type_id: form.heating_type_id,
      parking_type_id: form.parking_type_id,
      price: form.price,
      currency: form.currency,
      offer_type: selectedOfferType,
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
      photos: form.photos,
    };

    try {
      await createPropertyMutation.mutateAsync(propertyData);
      showToast("success", "Объявление успешно добавлено!");
      resetForm();
    } catch (err) {
      console.error(err);
      showToast("error", "Ошибка при добавлении объявления");
    }
  };

  return {
    // Data
    propertyTypes,
    buildingTypes,
    locations,
    repairTypes,
    heatingTypes,
    parkingTypes,

    // Form state
    form,
    selectedOfferType,
    selectedPropertyType,
    selectedBuildingType,
    selectedRooms,

    // Setters
    setSelectedOfferType,
    setSelectedPropertyType,
    setSelectedBuildingType,
    setSelectedRooms,

    // Handlers
    handleChange,
    handleFileChange,
    removePhoto,
    handleSubmit,
    resetForm,

    // Status
    isSubmitting: createPropertyMutation.isPending,
  };
}
