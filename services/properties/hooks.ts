import { useQuery } from "@tanstack/react-query";
import { PROPERTY_QUERY_KEYS } from "./constants";
import { getProperties } from "./api";

export const useGetPropertiesQuery = () => {
  return useQuery({
    queryKey: [PROPERTY_QUERY_KEYS.PROPERTY],
    queryFn: () => getProperties(),
  });
};
