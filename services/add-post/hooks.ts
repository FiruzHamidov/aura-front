import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPostApi } from "./api";
import { CreatePropertyRequest } from "./types";

export const useGetPropertyTypesQuery = () => {
  return useQuery({
    queryKey: ["get-property-types"],
    queryFn: addPostApi.getPropertyTypes,
  });
};

export const useGetBuildingTypesQuery = () => {
  return useQuery({
    queryKey: ["get-building-types"],
    queryFn: addPostApi.getBuildingTypes,
  });
};

export const useGetLocationsQuery = () => {
  return useQuery({
    queryKey: ["get-locations"],
    queryFn: addPostApi.getLocations,
  });
};

export const useGetRepairTypesQuery = () => {
  return useQuery({
    queryKey: ["get-repair-types"],
    queryFn: addPostApi.getRepairTypes,
  });
};

export const useGetHeatingTypesQuery = () => {
  return useQuery({
    queryKey: ["get-heating-types"],
    queryFn: addPostApi.getHeatingTypes,
  });
};

export const useGetParkingTypesQuery = () => {
  return useQuery({
    queryKey: ["get-parking-types"],
    queryFn: addPostApi.getParkingTypes,
  });
};

export const useGetContractTypesQuery = () => {
  return useQuery({
    queryKey: ["get-contract-types"],
    queryFn: addPostApi.getContractTypes,
  });
};

export const useCreatePropertyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyData: CreatePropertyRequest) =>
      addPostApi.createProperty(propertyData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-properties"],
      });
    },
  });
};

export const useUpdatePropertyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, propertyData }: { id: string; propertyData: CreatePropertyRequest }) =>
        addPostApi.updateProperty(id, propertyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-properties"] });
      queryClient.invalidateQueries({ queryKey: ["get-property-by-id"] });
    },
  });
};
