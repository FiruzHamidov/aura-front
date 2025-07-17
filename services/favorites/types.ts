import { Property } from "../properties/types";

export interface FavoriteResponse {
  id: number;
  user_id: number;
  property_id: number;
  created_at: string;
  updated_at: string;
  property: Property;
}
