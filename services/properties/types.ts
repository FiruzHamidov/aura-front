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

export interface ContractType {
    created_at: string;
    id: number;
    name: string;
    slug: string;
    updated_at: string;
}

export interface Property {
    contract_type: ContractType;
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
    developer_id?: number;
    developer?: {
        id: number;
        name: string;
    }
    contract_type_id?: number;
    heating_type_id?: number;
    parking_type_id?: number;
    total_area?: string;
    land_size?: string;
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
    is_business_owner: boolean,
    is_full_apartment: boolean,
    is_for_aura: boolean,
    landmark?: string;
    latitude?: string;
    longitude?: string;
    owner_phone?: string;
    object_key?: string;
    owner_name?: string;
    listing_type: string;
    district?: string;
    address?: string;
    offer_type?: string;
    sold_at?: string;
    rejection_comment?: string;
    status_comment?: string;
    type: PropertyType;
    status: PropertyStatus;
    location: PropertyLocation | null;
    photos: PropertyPhoto[];
    bathroom_count?: string | number;
    elevator_count?: string | number;
    building_type?: {
        id: number;
        name: string
    };
    parking?: {
        id: number;
        name: string
    };
    heating?: {
        id: number;
        name: string
    };
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
    views_count?: number;

// === Deal / Sale fields ===
    actual_sale_price?: string | number;
    actual_sale_currency?: 'TJS' | 'USD';

    company_commission_amount?: string | number;
    company_commission_currency?: 'TJS' | 'USD';

    money_holder?: 'company' | 'agent' | 'owner' | 'developer' | 'client';

    money_received_at?: string;
    contract_signed_at?: string;

    // Deposit
    deposit_amount?: string | number;
    deposit_currency?: 'TJS' | 'USD';
    deposit_received_at?: string;
    deposit_taken_at?: string;

    // Agents involved in deal
    sale_agents?: Array<{
        id: number;
        name?: string;
        phone?: string;
        role: 'main' | 'assistant' | 'partner';
        agent_commission_amount?: string | number;
        agent_commission_currency?: 'TJS' | 'USD';
        agent_paid_at?: string;
    }>;
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
}

export interface PropertyStatus {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

export interface MapBounds {
    south: number;
    west: number;
    north: number;
    east: number;
}

export interface MapPointProperties {
    id: number;
    title: string;
}

export interface MapClusterProperties {
    cluster: true;
    point_count: number;
}

export interface MapFeature {
    type: "Feature";
    geometry: {
        type: "Point";
        coordinates: [number, number];
    };
    properties?: MapPointProperties | MapClusterProperties;
    property?: MapPointProperties | MapClusterProperties;
}

export interface MapResponse {
    type: "FeatureCollection";
    features: MapFeature[];
}

export interface PropertyFilters {
    priceFrom?: string;
    priceTo?: string;
    city?: string;
    repair_type_id?: string;
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
    location_id?: string;
    page?: number;
    per_page?: number;
    bbox?: string;
    zoom?: number | string;
    districts?: string;
    type_id?: string;
    landmark?: string;
    sort?: string;
    date_from?: string;
    date_to?: string;
    is_full_apartment?: string;
}

export type DuplicateCandidate = {
    id: number;
    title?: string | null;
    address?: string | null;
    owner_name?: string | null;
    owner_phone?: string | null;
    total_area?: number | null;
    floor?: number | null;
    price?: number | null;
    currency?: string | null;
    moderation_status?: string | null;
    created_at?: string;
    score?: number; // 0..100
    links?: { view?: string };
    signals?: {
        phone_match?: boolean;
        address_similarity?: number;
        geo_near?: boolean;
        floor_match?: boolean;
        area_delta?: number | null;
    };
};

export type CreatePropertyResult =
    | { ok: true; data: Property }
    | { ok: false; code: 409; duplicates: DuplicateCandidate[]; message: string }
    | { ok: false; code: number; message: string };

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
