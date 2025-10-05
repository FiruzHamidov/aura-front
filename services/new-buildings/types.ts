export interface Developer {
  id: number;
  name: string;
}
export interface ConstructionStage {
  id: number;
  name: string;
}
export interface Material {
  id: number;
  name: string;
}
export interface Feature {
  id: number;
  name: string;
}
export interface LocationOption {
  id: number;
  city: string;
}

export type ModerationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "draft"
  | "deleted";

export interface NewBuildingPhoto {
  id?: number;
  url: string;
  order?: number;
}

export interface NewBuilding {
  id: number;
  title: string;
  description?: string | null;
  developer_id?: number | null;
  developer?: {
    name: string;
    logo_path: string;
  };
  construction_stage_id?: number | null;
  material_id?: number | null;

  location_id?: number | null;

  installment_available: boolean;
  heating: boolean;
  has_terrace: boolean;

  floors_range?: string | null; // "3-14"
  completion_at?: string | null; // ISO

  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;

  moderation_status: ModerationStatus;

  features?: Feature[];
  photos?: NewBuildingPhoto[];
}

export interface NewBuildingPayload {
  title: string;
  description?: string | null;

  developer_id?: number | null;
  construction_stage_id?: number | null;
  material_id?: number | null;

  location_id?: number | null;

  installment_available?: boolean;
  heating?: boolean;
  has_terrace?: boolean;

  floors_range?: string | null;
  completion_at?: string | null;

  address?: string | null;
  latitude?: number | null | string; // позволим строку из инпута
  longitude?: number | null | string;

  moderation_status?: ModerationStatus;

  // бэкенд ждёт features: number[] (pivot)
  features?: number[];
  // фото как FormData файлы — отправим отдельным эндпоинтом, если нужно
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page?: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
}

export interface NewBuildingsFilters {
  page?: number;
  per_page?: number;
  developer_id?: number | string;
  stage_id?: number | string;
  material_id?: number | string;
  search?: string;
}

export interface NewBuildingsResponse {
  current_page: number;
  data: NewBuilding[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PaginationLink {
  url?: string;
  label: string;
  active: boolean;
}
