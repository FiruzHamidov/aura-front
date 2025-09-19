import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { authApi } from "./api";
import { ProfileUpdateRequest } from "./types";

// Cookie expiration time (7 days in seconds)
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

function getCookieConfig() {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || ".aura.tj";

  const secure = isProduction;

  return {
    domain: cookieDomain !== "localhost" ? `; domain=${cookieDomain}` : "",
    secure: secure ? "; Secure" : "",
    sameSite: secure ? "; SameSite=None" : "; SameSite=Lax",
    path: "; path=/",
    maxAge: `; max-age=${COOKIE_MAX_AGE}`,
  };
}

// eslint-disable-next-line
function setAuthCookies(token: string, user: any) {
  if (typeof window !== "undefined") {
    const config = getCookieConfig();

    const authCookieString = `auth_token=${token}${config.path}${config.maxAge}${config.sameSite}${config.domain}${config.secure}`;
    const userDataString = encodeURIComponent(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.slug || "user",
      })
    );
    const userCookieString = `user_data=${userDataString}${config.path}${config.maxAge}${config.sameSite}${config.domain}${config.secure}`;

    document.cookie = authCookieString;
    document.cookie = userCookieString;
  }
}

function clearAuthCookies() {
  if (typeof window !== "undefined") {
    const config = getCookieConfig();
    const expiry = "; expires=Thu, 01 Jan 1970 00:00:01 GMT";

    document.cookie = `auth_token=${expiry}${config.path}${config.domain}`;
    document.cookie = `user_data=${expiry}${config.path}${config.domain}`;

    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.log("🗑️ Auth cookies cleared");
    }
  }
}

// eslint-disable-next-line
function getUserFromCookie(): any | null {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";");
    const userCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("user_data=")
    );

    if (userCookie) {
      try {
        const userData = userCookie.split("=")[1];
        return JSON.parse(decodeURIComponent(userData));
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        // Clear corrupted cookie
        clearAuthCookies();
        return null;
      }
    }
  }
  return null;
}

export const useSendSmsMutation = () => {
  return useMutation({
    mutationFn: authApi.sendSms,
  });
};

export const useVerifySmsMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.verifySms,
    onSuccess: (data) => {
      if (data.token && data.user) {
        setAuthCookies(data.token, data.user);
        queryClient.setQueryData(["user"], data.user);
        router.push("/");
        router.refresh();
      }
    },
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.token && data.user) {
        setAuthCookies(data.token, data.user);
        queryClient.setQueryData(["user"], data.user);
        router.replace("/");
        router.refresh();
      }
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuthCookies();
      queryClient.clear();
      router.push("/");
      router.refresh();
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => {
      const user = getUserFromCookie();
      if (user?.id) {
        return authApi.getProfile(user.id);
      }
      throw new Error("No user ID found");
    },
    enabled: !!getUserFromCookie()?.id,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      profileData,
    }: {
      userId: number;
      profileData: ProfileUpdateRequest;
    }) => authApi.updateProfile(userId, profileData),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      if (data) {
        // Update user cookie with new data
        setAuthCookies(
          document.cookie
            .split(";")
            .find((c) => c.includes("auth_token"))
            ?.split("=")[1] || "",
          data
        );
      }
    },
  });
};

export const useMe = useProfile;
