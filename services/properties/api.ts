import { axios, getAuthToken } from "@/utils/axios";
import { PROPERTY_ENDPOINTS } from "./constants";
import { PropertiesResponse, Property, PropertyFilters } from "./types";

export const getProperties = async (
  filters?: PropertyFilters,
  withAuth: boolean = false
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

  const { data } = await axios.get<PropertiesResponse>(url, {
    ...(withAuth && {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }),
  });
  return data;
};

export const getPropertyById = async (
  id: string,
  withAuth: boolean = false
): Promise<Property> => {
  const { data } = await axios.get<Property>(
    `${PROPERTY_ENDPOINTS.PROPERTIES}/${id}`,
    {
      ...(withAuth && {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
    }
  );
  return data;
};
