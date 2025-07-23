import { useMutation, useQuery } from "@tanstack/react-query";
import { addProfilePhoto, getAgents } from "./api";
import { AGENT_QUERY_KEYS } from "./constants";

export const useGetAgentsQuery = () => {
  return useQuery({
    queryKey: [AGENT_QUERY_KEYS.AGENTS],
    queryFn: getAgents,
  });
};

export const useAddProfilePhotoMutation = () => {
  return useMutation({
    mutationFn: ({ userId, photo }: { userId: string; photo: File }) =>
      addProfilePhoto(userId, photo),
  });
};
