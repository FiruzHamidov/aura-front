"use client";

import { ChangeEvent, FormEvent, useEffect, useState, useRef } from "react";
import {
  FormState,
  useCreatePropertyMutation,
  useGetBuildingTypesQuery,
  useGetHeatingTypesQuery,
  useGetLocationsQuery,
  useGetParkingTypesQuery,
  useGetPropertyTypesQuery,
  useGetRepairTypesQuery,
  useUpdatePropertyMutation,
} from "@/services/add-post";
import { showToast } from "@/ui-components/Toast";
import { Property } from "@/services/properties/types";

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
  district: "",
  address: "",
};

interface UseAddPostFormProps {
  editMode?: boolean;
  propertyData?: Property;
}

export function useAddPostForm({
  editMode = false,
  propertyData,
}: UseAddPostFormProps = {}) {
  // API hooks
  const { data: propertyTypes = [] } = useGetPropertyTypesQuery();
  const { data: buildingTypes = [] } = useGetBuildingTypesQuery();
  const { data: locations = [] } = useGetLocationsQuery();
  const { data: repairTypes = [] } = useGetRepairTypesQuery();
  const { data: heatingTypes = [] } = useGetHeatingTypesQuery();
  const { data: parkingTypes = [] } = useGetParkingTypesQuery();

  const createPropertyMutation = useCreatePropertyMutation();
  const updatePropertyMutation = useUpdatePropertyMutation();

  // Form state
  const [form, setForm] = useState<FormState>(initialFormState);
  const [selectedOfferType, setSelectedOfferType] = useState<string>("sale");
  const [selectedPropertyType, setSelectedPropertyType] = useState<
    number | null
  >(null);
  const [selectedBuildingType, setSelectedBuildingType] = useState<
    number | null
  >(null);
  const [selectedListingType, setSelectedListingType] = useState("regular");
  const [selectedRooms, setSelectedRooms] = useState<number | null>(null);

  // Use ref to track if form has been initialized
  const isInitialized = useRef(false);

  // Initialize form with existing data in edit mode
  useEffect(() => {
    if (editMode && propertyData && !isInitialized.current) {
      setForm({
        title: propertyData.title || "",
        description: propertyData.description || "",
        location_id: propertyData.location_id?.toString() || "",
        repair_type_id: propertyData.repair_type_id?.toString() || "",
        heating_type_id: propertyData.heating_type_id?.toString() || "",
        parking_type_id: propertyData.parking_type_id?.toString() || "",
        price: propertyData.price || "",
        currency: propertyData.currency || "TJS",
        total_area: propertyData.total_area || "",
        living_area: propertyData.living_area || "",
        floor: propertyData.floor || "",
        total_floors: propertyData.total_floors || "",
        year_built: propertyData.year_built || "",
        youtube_link: propertyData.youtube_link || "",
        condition: propertyData.condition || "",
        apartment_type: propertyData.apartment_type || "",
        has_garden: propertyData.has_garden || false,
        has_parking: propertyData.has_parking || false,
        is_mortgage_available: propertyData.is_mortgage_available || false,
        is_from_developer: propertyData.is_from_developer || false,
        landmark: propertyData.landmark || "",
        latitude: propertyData.latitude || "",
        longitude: propertyData.longitude || "",
        agent_id: propertyData.agent_id?.toString() || "",
        photos: propertyData.photos || [], // Keep existing photos
        owner_phone: propertyData.owner_phone || "",
        district: propertyData.district || "",
        address: propertyData.address || "",
      });

      setSelectedOfferType(propertyData.offer_type || "sale");
      setSelectedPropertyType(propertyData.type_id || null);
      setSelectedBuildingType(propertyData.status_id || null);
      setSelectedRooms(propertyData.rooms || null);

      isInitialized.current = true;
    }
  }, [editMode, propertyData?.id]);

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
    setSelectedListingType("regular");
    isInitialized.current = false;
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

    // Only send File objects to the API, not existing photos
    const newPhotos = form.photos.filter(
      (photo): photo is File => photo instanceof File
    );

    const propertyDataToSubmit = {
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
      photos: newPhotos, // Only send new File objects
    };

    try {
      if (editMode && propertyData?.id) {
        await updatePropertyMutation.mutateAsync({
          id: propertyData.id.toString(),
          propertyData: propertyDataToSubmit,
        });
        showToast("success", "Объявление успешно обновлено!");
      } else {
        await createPropertyMutation.mutateAsync(propertyDataToSubmit);
        showToast("success", "Объявление успешно добавлено!");
        resetForm();
      }
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        editMode
          ? "Ошибка при обновлении объявления"
          : "Ошибка при добавлении объявления"
      );
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
    selectedListingType,
    selectedRooms,

    // Setters
    setSelectedOfferType,
    setSelectedListingType,
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
    isSubmitting: editMode
      ? updatePropertyMutation.isPending
      : createPropertyMutation.isPending,
    editMode,
  };
}
