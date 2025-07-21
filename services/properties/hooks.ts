import { useQuery } from "@tanstack/react-query";
import { PROPERTY_QUERY_KEYS } from "./constants";
import { getProperties } from "./api";
import { PropertyFilters } from "./types";

export const useGetPropertiesQuery = (filters?: PropertyFilters) => {
  return useQuery({
    queryKey: [PROPERTY_QUERY_KEYS.PROPERTY, filters],
    queryFn: () => getProperties(filters),
  });
};
