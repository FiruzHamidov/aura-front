import Axios from "axios";
import type { InternalAxiosRequestConfig, AxiosInstance } from "axios";
import { PUBLIC_API_ROUTES } from "@/constants/routes";

export const axios: AxiosInstance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://backend.aura.tj/api",
});

function getCookieConfig() {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;

  const domain = cookieDomain || (isProduction ? "aura.tj" : "localhost");

  return {
    domain: domain !== "localhost" ? `; domain=${domain}` : "",
    isProduction,
  };
}

export const getAuthToken = (): string | null => {
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

const isPublicRoute = (url: string, method: string = "GET"): boolean => {
  // Special case for /properties - GET is public, POST requires auth
  if (url.includes("/properties")) {
    return method.toLowerCase() === "get";
  }

  // Other routes check against PUBLIC_API_ROUTES
  return PUBLIC_API_ROUTES.some((route) => url.includes(route));
};

axios.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig<unknown>
  ): InternalAxiosRequestConfig<unknown> => {
    const newConfig: InternalAxiosRequestConfig<unknown> = config;

    if (!isPublicRoute(config.url || "", config.method || "GET")) {
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
      const config = getCookieConfig();
      const expiry = "; expires=Thu, 01 Jan 1970 00:00:01 GMT";

      // document.cookie = `auth_token=${expiry}; path=/; ${config.domain}`;
      // document.cookie = `user_data=${expiry}; path=/; ${config.domain}`;
      //
      // if (typeof window !== "undefined") {
      //   window.location.href = "/login";
      // }
    }
    return Promise.reject(error);
  }
);
