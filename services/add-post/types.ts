import {Property} from "../properties/types";

export interface SelectOption {
    id: number;
    name: string;
    city?: string;
    slug?: string;
}

export interface PropertyType {
    id: number;
    name: string;
    slug?: string;
}

export interface BuildingType {
    id: number;
    name: string;
    slug?: string;
}

export interface Location {
    id: number;
    name: string;
    city: string;
    slug?: string;
}

export interface RepairType {
    id: number;
    name: string;
    slug?: string;
}

export interface HeatingType {
    id: number;
    name: string;
    slug?: string;
}

export interface ParkingType {
    id: number;
    name: string;
    slug?: string;
}

export interface ContractType {
    id: number;
    name: string;
    slug?: string;
}

export interface FormState {
    title: string;
    description: string;
    location_id: string;
    repair_type_id: string;
    heating_type_id: string;
    parking_type_id: string;
    contract_type_id: string;
    owner_phone: string;
    price: string;
    currency: string;
    total_area: string;
    living_area: string;
    floor: string;
    total_floors: string;
    year_built: string;
    youtube_link: string;
    condition: string;
    apartment_type: string;
    has_garden: boolean;
    has_parking: boolean;
    is_mortgage_available: boolean;
    is_from_developer: boolean;
    landmark: string;
    latitude: string;
    longitude: string;
    agent_id: string;
    district: string;
    address: string;
    photos: (File | { id: number; file_path: string; type: string })[];
}

export interface CreatePropertyRequest {
    description: string;
    type_id: number;
    status_id: number;
    location_id: string;
    address: string;
    district: string;
    repair_type_id: string;
    heating_type_id: string;
    parking_type_id: string;
    contract_type_id: string;
    price: string;
    currency: string;
    offer_type: string;
    listing_type: string;
    rooms: number;
    total_area: string;
    living_area: string;
    floor: string;
    total_floors: string;
    year_built: string;
    condition: string;
    apartment_type: string;
    has_garden: boolean;
    has_parking: boolean;
    is_mortgage_available: boolean;
    is_from_developer: boolean;
    landmark: string;
    owner_phone?: string;
    youtube_link?: string;
    latitude?: string;
    longitude?: string;
    agent_id?: string;
    photos: File[];
    photos_keep?: number[];
    remove_ids?: number[];
    cover_id?: number;
}

export interface CreatePropertyResponse {
    id: number;
    message: string;
    property?: Property;
}
