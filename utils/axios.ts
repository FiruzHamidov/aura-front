import Axios from "axios";
import type { InternalAxiosRequestConfig, AxiosInstance } from "axios";
// import { BASE_URL } from "@/constants/base-url";
import { PUBLIC_API_ROUTES } from "@/constants/routes";

export const axios: AxiosInstance = Axios.create({
  baseURL: 'https://back.aura.bapew.tj/api',
});

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("auth_token=")
    );

    if (tokenCookie) {
      return tokenCookie.split("=")[1];
    }
  }
  return null;
};

const isPublicRoute = (url: string): boolean => {
  return PUBLIC_API_ROUTES.some((route) => url.includes(route));
};

axios.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig<unknown>
  ): InternalAxiosRequestConfig<unknown> => {
    const newConfig: InternalAxiosRequestConfig<unknown> = config;

    if (!isPublicRoute(config.url || "")) {
      const localToken: string | null = getAuthToken();
      if (localToken) {
        newConfig.headers = newConfig.headers || {};
        newConfig.headers.Authorization = `Bearer ${localToken}`;
      }
    }

    return newConfig;
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie =
        "user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
