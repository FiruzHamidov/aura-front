import { useQuery } from "@tanstack/react-query";
import { getAgents } from "./api";
import { AGENT_QUERY_KEYS } from "./constants";

export const useGetAgentsQuery = () => {
  return useQuery({
    queryKey: [AGENT_QUERY_KEYS.AGENTS],
    queryFn: getAgents,
  });
};
