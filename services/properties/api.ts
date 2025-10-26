import { axios, getAuthToken } from "@/utils/axios";
import { PROPERTY_ENDPOINTS } from "./constants";
import {
  MapBounds,
  MapResponse,
  PropertiesResponse,
  Property,
  PropertyFilters,
} from "./types";

// Helper function to get location ID from localStorage
const getSelectedLocationId = (): string => {
  if (typeof window === "undefined") return "1"; // Default for SSR
  return localStorage.getItem("selectedLocationId") || "1";
};

export const getProperties = async (
  filters?: PropertyFilters,
  withAuth: boolean = false
): Promise<PropertiesResponse> => {
  let url: string = PROPERTY_ENDPOINTS.PROPERTIES;

  const queryParams = new URLSearchParams();

  // Always add location_id
  queryParams.append("location_id", getSelectedLocationId());

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        queryParams.append(key, String(value));
      }
    });
  }

  if (queryParams.toString()) {
    url = `${url}?${queryParams.toString()}`;
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

export const getPropertiesInfinite = async ({
  pageParam = 1,
  filters,
  withAuth = false,
}: {
  pageParam: number;
  filters?: PropertyFilters;
  withAuth?: boolean;
}): Promise<PropertiesResponse> => {
  let url: string = PROPERTY_ENDPOINTS.PROPERTIES;

  const queryParams = new URLSearchParams();
  queryParams.append("page", String(pageParam));
  queryParams.append("per_page", "10");

  // Always add location_id
  queryParams.append("location_id", getSelectedLocationId());

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && key !== "page") {
        queryParams.append(key, String(value));
      }
    });
  }

  url = `${url}?${queryParams.toString()}`;

  const { data } = await axios.get<PropertiesResponse>(url, {
    ...(withAuth && {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }),
  });
  return data;
};

export const getMyProperties = async (
  filters?: PropertyFilters,
  withAuth: boolean = false
): Promise<PropertiesResponse> => {
  let url: string = PROPERTY_ENDPOINTS.MY_PROPERTIES;

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

export const getMyPropertiesInfinite = async ({
  pageParam = 1,
  filters,
  withAuth = false,
}: {
  pageParam: number;
  filters?: PropertyFilters;
  withAuth?: boolean;
}): Promise<PropertiesResponse> => {
  let url: string = PROPERTY_ENDPOINTS.MY_PROPERTIES;

  const queryParams = new URLSearchParams();
  queryParams.append("page", String(pageParam));
  queryParams.append("per_page", "10");

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && key !== "page") {
        queryParams.append(key, String(value));
      }
    });
  }

  url = `${url}?${queryParams.toString()}`;

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

export const getPropertiesMapData = async (
  bounds: MapBounds,
  zoom: number,
  filters?: PropertyFilters,
  withAuth: boolean = false
): Promise<MapResponse> => {
  const bbox = `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;

  const queryParams = new URLSearchParams();
  queryParams.append("bbox", bbox);
  queryParams.append("zoom", zoom.toString());

  // Always add location_id
  queryParams.append("location_id", getSelectedLocationId());

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });
  }

  const { data } = await axios.get<MapResponse>(
    `${PROPERTY_ENDPOINTS.PROPERTIES}/map?${queryParams.toString()}`,
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
