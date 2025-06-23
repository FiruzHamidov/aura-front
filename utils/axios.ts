import Axios from "axios";
import type { InternalAxiosRequestConfig, AxiosInstance } from "axios";
import { BASE_URL } from "@/constants/base-url";

export const axios: AxiosInstance = Axios.create({
  baseURL: BASE_URL,
});

axios.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig<unknown>
  ): InternalAxiosRequestConfig<unknown> => {
    // const localToken: string | undefined = getAuthToken();

    const newConfig: InternalAxiosRequestConfig<unknown> = config;

    // newConfig.headers.Authorization = `Bearer ${localToken}`;

    return newConfig;
  }
);
