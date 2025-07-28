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
  title: string;
  description: string;
  type_id: number;
  status_id: number;
  location_id: string | null;
  price: string;
  currency: string;
  total_area: number;
  living_area: number;
  floor: number;
  total_floors: number;
  year_built: string;
  condition: string;
  has_garden: number;
  has_parking: number;
  apartment_type: string;
  repair_type: string;
  is_mortgage_available: number;
  is_from_developer: number;
  moderation_status: string;
  landmark: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  rooms: number | null;
  offer_type: string | null;
  type: PropertyType;
  status: PropertyStatus;
  location: PropertyLocation | null;
  photos: PropertyPhoto[];
  creator: User;
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
  district?: string;
  areaFrom?: string;
  areaTo?: string;
  floorFrom?: string;
  floorTo?: string;
  listing_type: string;
  page?: number;
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
