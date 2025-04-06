export interface ListingAgent {
  avatarUrl?: string;
  name: string;
  role: string;
}

export interface Listing {
  id: string | number;
  imageUrl: string;
  imageAlt?: string;
  isTop: boolean;
  price: number;
  currency: string;
  title: string;
  locationName: string;
  description: string;
  roomCountLabel: string;
  area: number;
  floorInfo: string;
  agent?: ListingAgent;
  date?: string;
}
