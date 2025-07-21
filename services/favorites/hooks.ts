import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToFavorites, removeFromFavorites, getFavorites } from "./api";

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export const useFavorites = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled,
  });
};

export const useToggleFavorite = () => {
  const addMutation = useAddToFavorites();
  const removeMutation = useRemoveFromFavorites();

  return useMutation({
    mutationFn: async ({
      propertyId,
      isFavorite,
    }: {
      propertyId: number;
      isFavorite: boolean;
    }) => {
      if (isFavorite) {
        return removeMutation.mutateAsync(propertyId);
      } else {
        return addMutation.mutateAsync(propertyId);
      }
    },
  });
};
