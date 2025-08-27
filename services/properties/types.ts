export interface PropertiesResponse {
  current_page: number;
  data: Property[];
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

export interface Property {
  id: number;
  title?: string;
  description: string;
  moderation_status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  price: string;
  currency: string;
  rooms: number;
  floor: string;
  creator?: {
    id: number;
    name: string;
    phone: string;
    photo?: string;
    email?: string;
    role_id: number;
  };
  agent_id?: number;
  type_id?: number;
  status_id?: number;
  location_id?: number;
  repair_type_id?: number;
  heating_type_id?: number;
  parking_type_id?: number;
  total_area?: string;
  living_area?: string;
  total_floors?: string;
  year_built?: string;
  youtube_link?: string;
  condition?: string;
  apartment_type?: string;
  has_garden?: boolean;
  has_parking?: boolean;
  is_mortgage_available?: boolean;
  is_from_developer?: boolean;
  landmark?: string;
  latitude?: string;
  longitude?: string;
  owner_phone?: string;
  listing_type: string;
  district?: string;
  address?: string;
  offer_type?: string;
  type: PropertyType;
  status: PropertyStatus;
  location: PropertyLocation | null;
  photos: PropertyPhoto[];
  // details table in /slug
  bathroom_count?: string | number;
  elevator_count?: string | number;
  building_type?: string;
  repair_type?: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  heating_type?: {
    id: number;
    name: string;
  };
  parking_type?: {
    id: number;
    name: string;
  };
}

export interface PropertyLocation {
  id: number;
  city: string;
  district: string | null;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyPhoto {
  id: number;
  property_id: number;
  file_path: string;
  type: "photo" | "video";
  created_at: string;
  updated_at: string;
}

export interface PropertyType {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyStatus {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyFilters {
  priceFrom?: string;
  priceTo?: string;
  city?: string;
  repairType?: string;
  propertyType?: string;
  rooms?: string;
  offer_type?: string;
  roomsFrom?: string;
  roomsTo?: string;
  district?: string;
  areaFrom?: string;
  areaTo?: string;
  created_by?: string;
  agent_id?: string;
  floorFrom?: string;
  floorTo?: string;
  moderation_status?: string;
  listing_type: string;
  page?: number;
  per_page?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role_id: number;
  status: string;
  auth_method: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationLink {
  url?: string;
  label: string;
  active: boolean;
}

export const LISTING_TYPE_META: Record<
  string,
  { label: string; classes: string }
> = {
  regular: {
    label: "Продаётся",
    classes: "bg-[#0036A5] text-white",
  },
  vip: {
    label: "VIP",
    classes: "bg-amber-400 text-[#020617]",
  },
  urgent: {
    label: "Срочная",
    classes: "bg-red-500 text-white",
  },
};
