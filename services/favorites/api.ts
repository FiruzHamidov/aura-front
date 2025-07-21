import axios from "axios";
import { FavoriteResponse } from "./types";

export const addToFavorites = async (
  propertyId: number
): Promise<FavoriteResponse> => {
  const response = await axios.post("/favorites", { property_id: propertyId });
  return response.data;
};

export const removeFromFavorites = async (
  propertyId: number
): Promise<FavoriteResponse> => {
  const response = await axios.delete(`/favorites/${propertyId}`);
  return response.data;
};

export const getFavorites = async (): Promise<FavoriteResponse[]> => {
  const response = await axios.get("/favorites");
  return response.data;
};
