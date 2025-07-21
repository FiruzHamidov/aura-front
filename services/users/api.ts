import { Agent } from "./types";
import { AGENT_ENDPOINTS } from "./constants";
import { axios } from "@/utils/axios";

export const getAgents = async (): Promise<Agent[]> => {
  const response = await axios.get(AGENT_ENDPOINTS.AGENTS);
  return response.data;
};
