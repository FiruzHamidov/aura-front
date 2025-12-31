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

    // === Deal / Sale fields ===
    actual_sale_price?: number;
    actual_sale_currency?: 'TJS' | 'USD';

    company_commission_amount?: number;
    company_commission_currency?: 'TJS' | 'USD';

    money_holder?: 'company' | 'agent' | 'owner' | 'developer' | 'client';

    money_received_at?: string;
    contract_signed_at?: string;

    // Deposit
    deposit_amount?: number;
    deposit_currency?: 'TJS' | 'USD';
    deposit_received_at?: string;
    deposit_taken_at?: string;

    // Sold info
    sold_at?: string;

    // Agents (for sold listings)
    sale_agents?: Array<{
        id: number;
        name?: string;
        role?: 'main' | 'assistant' | 'partner';
    }>;
}
