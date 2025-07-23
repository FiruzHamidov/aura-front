import { Agent } from "./types";
import { AGENT_ENDPOINTS } from "./constants";
import { axios } from "@/utils/axios";

export const getAgents = async (): Promise<Agent[]> => {
  const response = await axios.get(AGENT_ENDPOINTS.AGENTS);
  return response.data;
};

export const addProfilePhoto = async (
  userId: string,
  photo: File
): Promise<void> => {
  const formData = new FormData();
  formData.append("photo", photo);

  await axios.post(
    `${AGENT_ENDPOINTS.PROFILE_PHOTO}/${userId}/photo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
