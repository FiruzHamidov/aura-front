import { NewBuildingPhoto } from "@/services/new-buildings/types";

export interface ApartmentOption {
  rooms: number;
  area: number;
  price: number;
  currency?: string;
}

export interface NewBuildingCardProps {
  id: string | number;
  slug?: string;
  title: string;
  subtitle: string;
  image: {
    src: string;
    alt: string;
  };
  apartmentOptions: ApartmentOption[];
  location: string;
  developer: {
    id: number | string;
    name: string;
    logo_path: string;
  };
  photos: NewBuildingPhoto[];
  hasInstallmentOption?: boolean;
  className?: string;
  onClick?: () => void;
}
