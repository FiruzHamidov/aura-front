export interface Image {
    url: string;
    alt?: string;
}

export interface Agent {
    name: string;
    role: string;
    avatarUrl?: string;
}

export interface Listing {
    id: number;
    imageUrl?: string;
    imageAlt?: string;
    moderation_status: string;
    offer_type: string;
    images?: Image[];
    isTop?: boolean;
    price: number;
    currency: string;
    title: string;
    listing_type: string;
    locationName: string;
    description: string;
    roomCountLabel: string;
    area: number;
    floorInfo: string;
    agent?: Agent;
    date?: string;
    type?: string;
    typeName?: string;
    rejection_comment?: string;
}
