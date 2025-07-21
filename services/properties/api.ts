import { axios } from "@/utils/axios";
import { PROPERTY_ENDPOINTS } from "./constants";
import { PropertiesResponse, PropertyFilters } from "./types";

export const getProperties = async (
  filters?: PropertyFilters
): Promise<PropertiesResponse> => {
  let url: string = PROPERTY_ENDPOINTS.PROPERTIES;

  if (filters) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    if (queryParams.toString()) {
      url = `${url}?${queryParams.toString()}`;
    }
  }

  const { data } = await axios.get<PropertiesResponse>(url);
  return data;
};
