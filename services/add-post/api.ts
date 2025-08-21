import { axios } from "@/utils/axios";
import {
  BuildingType,
  CreatePropertyRequest,
  CreatePropertyResponse,
  HeatingType,
  Location,
  ParkingType,
  PropertyType,
  RepairType,
} from "./types";

const ADD_POST_ENDPOINTS = {
  GET_PROPERTY_TYPES: "/property-types",
  GET_BUILDING_TYPES: "/building-types",
  GET_LOCATIONS: "/locations",
  GET_REPAIR_TYPES: "/repair-types",
  GET_HEATING_TYPES: "/heating-types",
  GET_PARKING_TYPES: "/parking-types",
  CREATE_PROPERTY: "/properties",
} as const;

export const addPostApi = {
  getPropertyTypes: async (): Promise<PropertyType[]> => {
    const { data } = await axios.get<PropertyType[]>(
      ADD_POST_ENDPOINTS.GET_PROPERTY_TYPES
    );
    return data;
  },

  getBuildingTypes: async (): Promise<BuildingType[]> => {
    const { data } = await axios.get<BuildingType[]>(
      ADD_POST_ENDPOINTS.GET_BUILDING_TYPES
    );
    return data;
  },

  getLocations: async (): Promise<Location[]> => {
    const { data } = await axios.get<Location[]>(
      ADD_POST_ENDPOINTS.GET_LOCATIONS
    );
    return data;
  },

  getRepairTypes: async (): Promise<RepairType[]> => {
    const { data } = await axios.get<RepairType[]>(
      ADD_POST_ENDPOINTS.GET_REPAIR_TYPES
    );
    return data;
  },

  getHeatingTypes: async (): Promise<HeatingType[]> => {
    const { data } = await axios.get<HeatingType[]>(
      ADD_POST_ENDPOINTS.GET_HEATING_TYPES
    );
    return data;
  },

  getParkingTypes: async (): Promise<ParkingType[]> => {
    const { data } = await axios.get<ParkingType[]>(
      ADD_POST_ENDPOINTS.GET_PARKING_TYPES
    );
    return data;
  },

  createProperty: async (
    propertyData: CreatePropertyRequest
  ): Promise<CreatePropertyResponse> => {
    const formData = new FormData();

    // Helper function to append if value exists
    const appendIfFilled = (key: string, value: unknown) => {
      if (typeof value === "string" && value !== "") {
        formData.append(key, value);
      } else if (typeof value === "number") {
        formData.append(key, value.toString());
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "1" : "0");
      }
    };

    // Required fields
    formData.append("description", propertyData.description);
    formData.append("type_id", propertyData.type_id.toString());
    formData.append("status_id", propertyData.status_id.toString());
    formData.append("location_id", propertyData.location_id);

    formData.append("repair_type_id", propertyData.repair_type_id);
    formData.append("district", propertyData.district);
    formData.append("address", propertyData.address);
    formData.append("heating_type_id", propertyData.heating_type_id);
    formData.append("parking_type_id", propertyData.parking_type_id);
    formData.append("price", propertyData.price);
    formData.append("currency", propertyData.currency);
    formData.append("offer_type", propertyData.offer_type);
    formData.append("listing_type", propertyData.listing_type);
    formData.append("rooms", propertyData.rooms.toString());
    formData.append("total_area", propertyData.total_area);
    formData.append("living_area", propertyData.living_area);
    formData.append("floor", propertyData.floor);
    formData.append("total_floors", propertyData.total_floors);
    formData.append("year_built", propertyData.year_built);
    formData.append("condition", propertyData.condition);
    formData.append("apartment_type", propertyData.apartment_type);
    formData.append("has_garden", propertyData.has_garden ? "1" : "0");
    formData.append("has_parking", propertyData.has_parking ? "1" : "0");
    formData.append(
      "is_mortgage_available",
      propertyData.is_mortgage_available ? "1" : "0"
    );
    formData.append(
      "is_from_developer",
      propertyData.is_from_developer ? "1" : "0"
    );
    formData.append("landmark", propertyData.landmark);

    // Optional fields
    appendIfFilled("owner_phone", propertyData.owner_phone);
    appendIfFilled("youtube_link", propertyData.youtube_link);
    appendIfFilled("latitude", propertyData.latitude);
    appendIfFilled("longitude", propertyData.longitude);
    appendIfFilled("agent_id", propertyData.agent_id);

    // Append photos
    propertyData.photos.forEach((file) => {
      formData.append("photos[]", file);
    });

    const { data } = await axios.post<CreatePropertyResponse>(
      ADD_POST_ENDPOINTS.CREATE_PROPERTY,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  },

  updateProperty: async (
      id: string,
      propertyData: CreatePropertyRequest
  ): Promise<CreatePropertyResponse> => {
    const formData = new FormData();

    const appendIfFilled = (key: string, value: unknown) => {
      if (typeof value === "string" && value !== "") formData.append(key, value);
      else if (typeof value === "number") formData.append(key, String(value));
      else if (typeof value === "boolean") formData.append(key, value ? "1" : "0");
    };

    // метод перегрузки для Laravel (если используешь Route::resource)
    formData.append("_method", "PUT");

    // обязательные/обычные поля
    formData.append("description", propertyData.description);
    formData.append("type_id", String(propertyData.type_id));
    formData.append("status_id", String(propertyData.status_id));
    formData.append("address", propertyData.address);
    formData.append("district", propertyData.district);
    formData.append("location_id", propertyData.location_id);
    formData.append("repair_type_id", propertyData.repair_type_id);
    formData.append("heating_type_id", propertyData.heating_type_id);
    formData.append("parking_type_id", propertyData.parking_type_id);
    formData.append("price", propertyData.price);
    formData.append("currency", propertyData.currency);
    formData.append("offer_type", propertyData.offer_type);
    formData.append("listing_type", propertyData.listing_type);
    formData.append("rooms", String(propertyData.rooms));
    formData.append("total_area", propertyData.total_area);
    formData.append("living_area", propertyData.living_area);
    formData.append("floor", propertyData.floor);
    formData.append("total_floors", propertyData.total_floors);
    formData.append("year_built", propertyData.year_built);
    formData.append("condition", propertyData.condition);
    formData.append("apartment_type", propertyData.apartment_type);
    formData.append("has_garden", propertyData.has_garden ? "1" : "0");
    formData.append("has_parking", propertyData.has_parking ? "1" : "0");
    formData.append("is_mortgage_available", propertyData.is_mortgage_available ? "1" : "0");
    formData.append("is_from_developer", propertyData.is_from_developer ? "1" : "0");
    formData.append("landmark", propertyData.landmark);

    // опциональные
    appendIfFilled("owner_phone", propertyData.owner_phone);
    appendIfFilled("youtube_link", propertyData.youtube_link);
    appendIfFilled("latitude", propertyData.latitude);
    appendIfFilled("longitude", propertyData.longitude);
    appendIfFilled("agent_id", propertyData.agent_id);

    // НОВОЕ: порядок существующих фото
    (propertyData.photos_keep ?? []).forEach(id => {
      formData.append("photos_keep[]", String(id));
    });

    // НОВОЕ: удалить существующие
    (propertyData.remove_ids ?? []).forEach(id => {
      formData.append("remove_ids[]", String(id));
    });

    // НОВОЕ: обложка (опц.)
    if (propertyData.cover_id) {
      formData.append("cover_id", String(propertyData.cover_id));
    }

    // НОВОЕ: только НОВЫЕ файлы (в текущем порядке)
    (propertyData.photos ?? []).forEach(file => {
      formData.append("photos[]", file);
    });

    const { data } = await axios.post<CreatePropertyResponse>(
        `${ADD_POST_ENDPOINTS.CREATE_PROPERTY}/${id}`, // убедись, что URL верный
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return data;
  },
};
