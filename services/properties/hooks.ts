import { useQuery } from "@tanstack/react-query";
import { PROPERTY_QUERY_KEYS } from "./constants";
import {getMyProperties, getProperties, getPropertyById} from "./api";
import { PropertyFilters } from "./types";

export const useGetPropertiesQuery = (
  filters?: PropertyFilters,
  withAuth: boolean = false
) => {
  return useQuery({
    queryKey: [PROPERTY_QUERY_KEYS.PROPERTY, filters, withAuth],
    queryFn: () => getProperties(filters, withAuth),
  });
};

export const useGetMyPropertiesQuery = (
    filters?: PropertyFilters,
    withAuth: boolean = false
) => {
  return useQuery({
    queryKey: [PROPERTY_QUERY_KEYS.PROPERTY, filters, withAuth],
    queryFn: () => getMyProperties(filters, withAuth),
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
