import { axios } from "@/utils/axios";
import { PROPERTY_ENDPOINTS } from "./constants";
import { PropertiesResponse } from "./types";

export const getProperties = async (): Promise<PropertiesResponse> => {
  const { data } = await axios.get<PropertiesResponse>(
    `${PROPERTY_ENDPOINTS.PROPERTIES}`
  );

  return data;
};
