import { axios } from "@/utils/axios";
import { ADD_POST_ENDPOINTS } from "./constants";
import {
  SelectOption,
  CreatePropertyRequest,
  CreatePropertyResponse,
} from "./types";

export const addPostApi = {
  getPropertyTypes: async (): Promise<SelectOption[]> => {
    const { data } = await axios.get<SelectOption[]>(
      ADD_POST_ENDPOINTS.PROPERTY_TYPES
    );
    return data;
  },

  getBuildingTypes: async (): Promise<SelectOption[]> => {
    const { data } = await axios.get<SelectOption[]>(
      ADD_POST_ENDPOINTS.BUILDING_TYPES
    );
    return data;
  },

  getLocations: async (): Promise<SelectOption[]> => {
    const { data } = await axios.get<SelectOption[]>(
      ADD_POST_ENDPOINTS.LOCATIONS
    );
    return data;
  },

  getRepairTypes: async (): Promise<SelectOption[]> => {
    const { data } = await axios.get<SelectOption[]>(
      ADD_POST_ENDPOINTS.REPAIR_TYPES
    );
    return data;
  },

  getHeatingTypes: async (): Promise<SelectOption[]> => {
    const { data } = await axios.get<SelectOption[]>(
      ADD_POST_ENDPOINTS.HEATING_TYPES
    );
    return data;
  },

  getParkingTypes: async (): Promise<SelectOption[]> => {
    const { data } = await axios.get<SelectOption[]>(
      ADD_POST_ENDPOINTS.PARKING_TYPES
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

    // Append all property data
    formData.append("description", propertyData.description);
    formData.append("type_id", propertyData.type_id.toString());
    formData.append("status_id", propertyData.status_id.toString());
    formData.append("location_id", propertyData.location_id);
    formData.append("repair_type_id", propertyData.repair_type_id);
    formData.append("heating_type_id", propertyData.heating_type_id);
    formData.append("parking_type_id", propertyData.parking_type_id);
    formData.append("price", propertyData.price);
    formData.append("currency", propertyData.currency);
    formData.append("offer_type", propertyData.offer_type);
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
};
