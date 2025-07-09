import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ADD_POST_QUERY_KEYS } from "./constants";
import { addPostApi } from "./api";
import { CreatePropertyRequest } from "./types";

export const useGetPropertyTypesQuery = () => {
  return useQuery({
    queryKey: [ADD_POST_QUERY_KEYS.PROPERTY_TYPES],
    queryFn: () => addPostApi.getPropertyTypes(),
  });
};

export const useGetBuildingTypesQuery = () => {
  return useQuery({
    queryKey: [ADD_POST_QUERY_KEYS.BUILDING_TYPES],
    queryFn: () => addPostApi.getBuildingTypes(),
  });
};

export const useGetLocationsQuery = () => {
  return useQuery({
    queryKey: [ADD_POST_QUERY_KEYS.LOCATIONS],
    queryFn: () => addPostApi.getLocations(),
  });
};

export const useGetRepairTypesQuery = () => {
  return useQuery({
    queryKey: [ADD_POST_QUERY_KEYS.REPAIR_TYPES],
    queryFn: () => addPostApi.getRepairTypes(),
  });
};

export const useGetHeatingTypesQuery = () => {
  return useQuery({
    queryKey: [ADD_POST_QUERY_KEYS.HEATING_TYPES],
    queryFn: () => addPostApi.getHeatingTypes(),
  });
};

export const useGetParkingTypesQuery = () => {
  return useQuery({
    queryKey: [ADD_POST_QUERY_KEYS.PARKING_TYPES],
    queryFn: () => addPostApi.getParkingTypes(),
  });
};

export const useCreatePropertyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyData: CreatePropertyRequest) =>
      addPostApi.createProperty(propertyData),
    onSuccess: () => {
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({
        queryKey: ["get-properties"],
      });
    },
  });
};
