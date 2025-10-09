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
  DeveloperPayload,
  NewBuildingDetailResponse,
} from "./types";

const defaultParams = { page: 1, per_page: 100 };

export const useDevelopers = (params = defaultParams) =>
  useQuery({
    queryKey: ["developers", params],
    queryFn: async () => {
      const { data } = await axios.get<Developer[] | Paginated<Developer>>(
        "/developers",
        {
          params,
        }
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

export const useDeveloper = (id?: number) =>
  useQuery({
    queryKey: ["developers", id],
    queryFn: async () => {
      const { data } = await axios.get<Developer>(`/developers/${id}`);
      return data;
    },
    enabled: !!id,
  });

export const useCreateDeveloper = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: DeveloperPayload) => {
      const formData = new FormData();

      formData.append("name", payload.name);

      if (payload.description) {
        formData.append("description", payload.description);
      }

      if (payload.phone) {
        formData.append("phone", payload.phone);
      }

      if (
        payload.under_construction_count !== undefined &&
        payload.under_construction_count !== null
      ) {
        formData.append(
          "under_construction_count",
          payload.under_construction_count.toString()
        );
      }

      if (payload.built_count !== undefined && payload.built_count !== null) {
        formData.append("built_count", payload.built_count.toString());
      }

      if (payload.founded_year) {
        formData.append("founded_year", payload.founded_year);
      }

      if (
        payload.total_projects !== undefined &&
        payload.total_projects !== null
      ) {
        formData.append("total_projects", payload.total_projects.toString());
      }

      if (payload.moderation_status) {
        formData.append("moderation_status", payload.moderation_status);
      }

      if (payload.website) {
        formData.append("website", payload.website);
      }

      if (payload.facebook) {
        formData.append("facebook", payload.facebook);
      }

      if (payload.instagram) {
        formData.append("instagram", payload.instagram);
      }

      if (payload.telegram) {
        formData.append("telegram", payload.telegram);
      }

      if (payload.logo) {
        formData.append("logo", payload.logo);
      }

      const { data } = await axios.post<Developer>("/developers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["developers"] });
    },
  });
};

export const useUpdateDeveloper = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: DeveloperPayload) => {
      const formData = new FormData();

      formData.append("name", payload.name);

      if (payload.description) {
        formData.append("description", payload.description);
      }

      if (payload.phone) {
        formData.append("phone", payload.phone);
      }

      if (
        payload.under_construction_count !== undefined &&
        payload.under_construction_count !== null
      ) {
        formData.append(
          "under_construction_count",
          payload.under_construction_count.toString()
        );
      }

      if (payload.built_count !== undefined && payload.built_count !== null) {
        formData.append("built_count", payload.built_count.toString());
      }

      if (payload.founded_year) {
        formData.append("founded_year", payload.founded_year);
      }

      if (
        payload.total_projects !== undefined &&
        payload.total_projects !== null
      ) {
        formData.append("total_projects", payload.total_projects.toString());
      }

      if (payload.moderation_status) {
        formData.append("moderation_status", payload.moderation_status);
      }

      if (payload.website) {
        formData.append("website", payload.website);
      }

      if (payload.facebook) {
        formData.append("facebook", payload.facebook);
      }

      if (payload.instagram) {
        formData.append("instagram", payload.instagram);
      }

      if (payload.telegram) {
        formData.append("telegram", payload.telegram);
      }

      if (payload.logo) {
        formData.append("logo", payload.logo);
      }

      const { data } = await axios.post<Developer>(
        `/developers/${id}?_method=PUT`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["developers"] });
      qc.invalidateQueries({ queryKey: ["developers", id] });
    },
  });
};

export const useDeleteDeveloper = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/developers/${id}`);
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["developers"] });
    },
  });
};

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

export const useConstructionStage = (id?: number) =>
  useQuery({
    queryKey: ["construction-stages", id],
    queryFn: async () => {
      const { data } = await axios.get<ConstructionStage>(
        `/construction-stages/${id}`
      );
      return data;
    },
    enabled: !!id,
  });

export const useCreateConstructionStage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; slug?: string }) => {
      const { data } = await axios.post<ConstructionStage>(
        "/construction-stages",
        payload
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["construction-stages"] });
    },
  });
};

export const useUpdateConstructionStage = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; slug?: string }) => {
      const { data } = await axios.put<ConstructionStage>(
        `/construction-stages/${id}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["construction-stages"] });
      qc.invalidateQueries({ queryKey: ["construction-stages", id] });
    },
  });
};

export const useDeleteConstructionStage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/construction-stages/${id}`);
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["construction-stages"] });
    },
  });
};

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

export const useMaterial = (id?: number) =>
  useQuery({
    queryKey: ["materials", id],
    queryFn: async () => {
      const { data } = await axios.get<Material>(`/materials/${id}`);
      return data;
    },
    enabled: !!id,
  });

export const useCreateMaterial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; slug?: string }) => {
      const { data } = await axios.post<Material>("/materials", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["materials"] });
    },
  });
};

export const useUpdateMaterial = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; slug?: string }) => {
      const { data } = await axios.put<Material>(`/materials/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["materials"] });
      qc.invalidateQueries({ queryKey: ["materials", id] });
    },
  });
};

export const useDeleteMaterial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/materials/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["materials"] });
    },
  });
};

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

export const useFeature = (id?: number) =>
  useQuery({
    queryKey: ["features", id],
    queryFn: async () => {
      const { data } = await axios.get<Feature>(`/features/${id}`);
      return data;
    },
    enabled: !!id,
  });

export const useCreateFeature = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; slug?: string }) => {
      const { data } = await axios.post<Feature>("/features", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["features"] });
    },
  });
};

export const useUpdateFeature = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; slug?: string }) => {
      const { data } = await axios.put<Feature>(`/features/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["features"] });
      qc.invalidateQueries({ queryKey: ["features", id] });
    },
  });
};

export const useDeleteFeature = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/features/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["features"] });
    },
  });
};

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
      const { data } = await axios.get<NewBuildingDetailResponse>(
        `/new-buildings/${id}`
      );
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
