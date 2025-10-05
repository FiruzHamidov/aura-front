import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { axios } from "@/utils/axios";
import type {
  Feature,
  NewBuilding,
  NewBuildingPayload,
  Paginated,
  Developer,
  ConstructionStage,
  Material,
  LocationOption,
  NewBuildingsFilters,
  NewBuildingPhoto,
} from "./types";

// ===== Справочники =====
// Если хочешь — можешь держать page/per_page в параметрах
const defaultParams = { page: 1, per_page: 100 };

export const useDevelopers = (params = defaultParams) =>
  useQuery({
    queryKey: ["developers", params],
    queryFn: async () => {
      const { data } = await axios.get<Paginated<Developer>>("/developers", {
        params,
      });
      return data; // ВАЖНО: возвращаем целиком пагинированный объект
    },
    staleTime: 5 * 60 * 1000,
  });

export const useConstructionStages = (params = defaultParams) =>
  useQuery({
    queryKey: ["construction-stages", params],
    queryFn: async () => {
      const { data } = await axios.get<Paginated<ConstructionStage>>(
        "/construction-stages",
        { params }
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

export const useMaterials = (params = defaultParams) =>
  useQuery({
    queryKey: ["materials", params],
    queryFn: async () => {
      const { data } = await axios.get<Paginated<Material>>("/materials", {
        params,
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

export const useFeatures = (params = defaultParams) =>
  useQuery({
    queryKey: ["features", params],
    queryFn: async () => {
      const { data } = await axios.get<Paginated<Feature>>("/features", {
        params,
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

export const useLocations = (params = defaultParams) =>
  useQuery({
    queryKey: ["locations", params],
    queryFn: async () => {
      const { data } = await axios.get<Paginated<LocationOption>>(
        "/locations",
        { params }
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

export const useNewBuildings = (params: NewBuildingsFilters = {}) =>
  useQuery<Paginated<NewBuilding>>({
    queryKey: ["new-buildings", params],
    queryFn: async () => {
      const { data } = await axios.get<Paginated<NewBuilding>>(
        "/new-buildings",
        { params }
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });

export const useNewBuilding = (id?: number) =>
  useQuery({
    queryKey: ["new-buildings", id],
    queryFn: async () => {
      const { data } = await axios.get<NewBuilding>(`/new-buildings/${id}`);
      return data;
    },
    enabled: !!id,
  });

export const useCreateNewBuilding = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: NewBuildingPayload) => {
      const { data } = await axios.post<NewBuilding>("/new-buildings", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["new-buildings"] });
    },
  });
};

export const useUpdateNewBuilding = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: NewBuildingPayload) => {
      const { data } = await axios.put<NewBuilding>(
        `/new-buildings/${id}`,
        payload
      );
      return data;
    },
    // eslint-disable-next-line
    onSuccess: (_data, _vars) => {
      qc.invalidateQueries({ queryKey: ["new-buildings"] });
      qc.invalidateQueries({ queryKey: ["new-buildings", id] });
    },
  });
};

export const useDeleteNewBuilding = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/new-buildings/${id}`);
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["new-buildings"] });
    },
  });
};

// Фичи к новостройке
export const useAttachFeature = () =>
  useMutation({
    mutationFn: async (vars: { newBuildingId: number; featureId: number }) => {
      const { newBuildingId, featureId } = vars;
      await axios.post(`/new-buildings/${newBuildingId}/features/${featureId}`);
      return true;
    },
  });

export const useDetachFeature = () =>
  useMutation({
    mutationFn: async (vars: { newBuildingId: number; featureId: number }) => {
      const { newBuildingId, featureId } = vars;
      await axios.delete(
        `/new-buildings/${newBuildingId}/features/${featureId}`
      );
      return true;
    },
  });

export const useNewBuildingPhotos = (newBuildingId?: number) =>
  useQuery({
    queryKey: ["new-buildings", newBuildingId, "photos"],
    queryFn: async () => {
      const { data } = await axios.get<NewBuildingPhoto[]>(
        `/new-buildings/${newBuildingId}/photos`
      );
      return data;
    },
    enabled: !!newBuildingId,
    staleTime: 5 * 60 * 1000,
  });
