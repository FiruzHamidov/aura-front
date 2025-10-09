export type BuildingApiError = {
  response?: {
    data?: {
      message?: string;
      [k: string]: unknown;
    };
  };
};

export interface Developer {
  id: number;
  name: string;
  logo_path?: string | null;
  description?: string | null;
  website?: string | null;
  created_at: string;
  updated_at: string;
  built_count?: number;
  founded_year?: string;
  phone?: string;
  instagram?: string | null;
  facebook?: string | null;
  telegram?: string | null;
  total_projects?: number;
  under_construction_count?: number;
  moderation_status?: ModerationStatus;
}

export interface DeveloperPayload {
  name: string;
  description?: string | null;
  phone?: string | null;
  under_construction_count?: number | null;
  built_count?: number | null;
  founded_year?: string | null;
  total_projects?: number | null;
  moderation_status?: ModerationStatus;
  website?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  telegram?: string | null;
  logo?: File | null;
}

export interface ConstructionStage {
  id: number;
  name: string;
  slug: string;
  sort_order?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Feature {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  pivot?: {
    new_building_id: number;
    feature_id: number;
    created_at: string;
    updated_at: string;
  };
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
  new_building_id?: number;
  path?: string;
  url?: string;
  is_cover?: boolean;
  sort_order?: number;
  order?: number; // alias for sort_order
  created_at?: string;
  updated_at?: string;
}

export interface BuildingBlock {
  id: number;
  new_building_id: number;
  name: string;
  floors_from: number;
  floors_to: number;
  completion_at: string;
  created_at: string;
  updated_at: string;
}

export interface BuildingUnit {
  id: number;
  new_building_id: number;
  block_id: number;
  name: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  floor: number;
  price_per_sqm: string;
  total_price: string;
  description?: string | null;
  is_available: boolean;
  moderation_status: ModerationStatus;
  created_at: string;
  updated_at: string;
}

export interface NewBuildingStats {
  total_price: {
    min: number | null;
    max: number | null;
    formatted: string | null;
  };
  price_per_sqm: {
    min: number | null;
    max: number | null;
    formatted: string | null;
  };
}

export interface NearbyPlace {
  id: number;
  new_building_id: number;
  type:
    | "mosque"
    | "bus_stop"
    | "downtown"
    | "hospital"
    | "gym"
    | "park"
    | "school"
    | "kindergarten"
    | "supermarket";
  name?: string | null;
  distance: number; // in meters
  created_at: string;
  updated_at: string;
}

export interface NewBuilding {
  id: number;
  title: string;
  description?: string | null;
  developer_id?: number | null;
  developer?: Developer;
  construction_stage_id?: number | null;
  stage?: ConstructionStage;
  material_id?: number | null;
  material?: Material;
  location_id?: number | null;

  installment_available: boolean;
  heating: boolean;
  has_terrace: boolean;

  floors_range?: string | null;
  completion_at?: string | null;

  address?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;

  moderation_status: ModerationStatus;
  created_by?: number | null;
  created_at: string;
  updated_at: string;

  features?: Feature[];
  photos?: NewBuildingPhoto[];
  blocks?: BuildingBlock[];
  units?: BuildingUnit[];
  nearby_places?: NearbyPlace[];
}

export interface NewBuildingDetailResponse {
  data: NewBuilding;
  stats: NewBuildingStats;
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
  latitude?: number | null | string;
  longitude?: number | null | string;

  moderation_status?: ModerationStatus;

  features?: number[];
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
