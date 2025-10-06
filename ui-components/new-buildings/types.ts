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
    name: string;
    logo_path: string;
  };
  hasInstallmentOption?: boolean;
  className?: string;
  onClick?: () => void;
}
