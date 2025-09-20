import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { PROPERTY_QUERY_KEYS } from "./constants";
import {
  getMyProperties,
  getProperties,
  getPropertyById,
  getPropertiesInfinite,
  getMyPropertiesInfinite,
  getPropertiesMapData,
} from "./api";
import { MapBounds, PropertyFilters } from "./types";

export const useGetPropertiesQuery = (
  filters?: PropertyFilters,
  withAuth: boolean = false
) => {
  return useQuery({
    queryKey: [PROPERTY_QUERY_KEYS.PROPERTY, filters, withAuth],
    queryFn: () => getProperties(filters, withAuth),
  });
};

export const useGetPropertiesInfiniteQuery = (
  filters?: PropertyFilters,
  withAuth: boolean = false
) => {
  return useInfiniteQuery({
    queryKey: [PROPERTY_QUERY_KEYS.PROPERTY, "infinite", filters, withAuth],
    queryFn: ({ pageParam }) =>
      getPropertiesInfinite({ pageParam, filters, withAuth }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (
        !lastPage.next_page_url ||
        lastPage.current_page >= lastPage.last_page
      ) {
        return undefined;
      }
      return lastPage.current_page + 1;
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.current_page <= 1) {
        return undefined;
      }
      return firstPage.current_page - 1;
    },
  });
};

export const useGetMyPropertiesQuery = (
  filters?: PropertyFilters,
  withAuth: boolean = false
) => {
  return useQuery({
    queryKey: [PROPERTY_QUERY_KEYS.PROPERTY, "my", filters, withAuth],
    queryFn: () => getMyProperties(filters, withAuth),
  });
};

export const useGetAllPropertiesQuery = (
  filters?: PropertyFilters,
  withAuth: boolean = false
) => {
  return useQuery({
    queryKey: [PROPERTY_QUERY_KEYS.PROPERTY, "my", filters, withAuth],
    queryFn: () => getMyProperties(filters, withAuth),
  });
};

export const useGetMyPropertiesInfiniteQuery = (
  filters?: PropertyFilters,
  withAuth: boolean = false
) => {
  return useInfiniteQuery({
    queryKey: [PROPERTY_QUERY_KEYS.PROPERTY, "my-infinite", filters, withAuth],
    queryFn: ({ pageParam }) =>
      getMyPropertiesInfinite({ pageParam, filters, withAuth }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (
        !lastPage.next_page_url ||
        lastPage.current_page >= lastPage.last_page
      ) {
        return undefined;
      }
      return lastPage.current_page + 1;
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.current_page <= 1) {
        return undefined;
      }
      return firstPage.current_page - 1;
    },
  });
};

export const useGetPropertyByIdQuery = (
  id: string,
  withAuth: boolean = false
) => {
  return useQuery({
    queryKey: [PROPERTY_QUERY_KEYS.PROPERTY_DETAIL, id, withAuth],
    queryFn: () => getPropertyById(id, withAuth),
    enabled: !!id,
  });
};

/**
 * Получить данные для карты недвижимости (кластеры или точки)
 * GET /api/properties/map
 */
export const useGetPropertiesMapQuery = (
  bounds: MapBounds | null,
  zoom: number,
  filters?: PropertyFilters,
  withAuth: boolean = false,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [
      PROPERTY_QUERY_KEYS.PROPERTY_MAP,
      bounds,
      zoom,
      filters,
      withAuth,
    ],
    queryFn: () => {
      if (!bounds) {
        throw new Error("Map bounds are required");
      }
      return getPropertiesMapData(bounds, zoom, filters, withAuth);
    },
    enabled: !!bounds && enabled,
    staleTime: 20 * 1000, // 20 seconds as mentioned in API docs
  });
};
