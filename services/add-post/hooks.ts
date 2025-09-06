// services/add-post/hooks.ts
// Хуки на react-query, типизированные под union payload’ы,
// чтобы вызывать mutate без `as any`.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addPostApi } from './api';
import type {
  CreatePropertyPayload,
  CreatePropertyResponse,
  UpdatePropertyPayload,
} from './types';

// ---- READ QUERIES (без изменений) ----
export const useGetPropertyTypesQuery = () =>
    useQuery({ queryKey: ['get-property-types'], queryFn: addPostApi.getPropertyTypes });

export const useGetBuildingTypesQuery = () =>
    useQuery({ queryKey: ['get-building-types'], queryFn: addPostApi.getBuildingTypes });

export const useGetLocationsQuery = () =>
    useQuery({ queryKey: ['get-locations'], queryFn: addPostApi.getLocations });

export const useGetRepairTypesQuery = () =>
    useQuery({ queryKey: ['get-repair-types'], queryFn: addPostApi.getRepairTypes });

export const useGetHeatingTypesQuery = () =>
    useQuery({ queryKey: ['get-heating-types'], queryFn: addPostApi.getHeatingTypes });

export const useGetParkingTypesQuery = () =>
    useQuery({ queryKey: ['get-parking-types'], queryFn: addPostApi.getParkingTypes });

export const useGetContractTypesQuery = () =>
    useQuery({ queryKey: ['get-contract-types'], queryFn: addPostApi.getContractTypes });

// ---- CREATE (union: FormData | JSON) ----
export const useCreatePropertyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatePropertyResponse, Error, CreatePropertyPayload>({
    // ✅ теперь можно передавать либо FormData, либо JSON
    mutationFn: (payload) => addPostApi.createProperty(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-properties'] });
    },
  });
};

// ---- UPDATE (union: { id, formData } | { id, json }) ----
export const useUpdatePropertyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatePropertyResponse, Error, UpdatePropertyPayload>({
    // ✅ теперь можно передавать либо multipart, либо JSON-патч
    mutationFn: (payload) => addPostApi.updateProperty(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-properties'] });
      queryClient.invalidateQueries({ queryKey: ['get-property-by-id'] });
    },
  });
};

export const useReorderPropertyPhotosMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, order }: { id: number | string; order: number[] }) =>
        addPostApi.reorderPhotos(id, order),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['get-properties'] });
      qc.invalidateQueries({ queryKey: ['get-property-by-id'] });
    },
  });
};