import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { authApi } from "./api";
import { ProfileUpdateRequest } from "./types";

// Cookie expiration time (7 days in seconds)
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

function getCookieConfig() {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;

  return {
    path: "; path=/",
    maxAge: `; max-age=${COOKIE_MAX_AGE}`,
    sameSite: "; SameSite=Lax",
    domain: isProduction && cookieDomain ? `; domain=${cookieDomain}` : "",
    secure: isProduction ? "; Secure" : "",
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

    console.log("✅ Cookies set:", {
      hasToken: document.cookie.includes("auth_token"),
      hasUserData: document.cookie.includes("user_data"),
    });
  }
}

function clearAuthCookies() {
  if (typeof window !== "undefined") {
    const config = getCookieConfig();
    const expiry = "; expires=Thu, 01 Jan 1970 00:00:01 GMT";

    document.cookie = `auth_token=${expiry}${config.path}${config.domain}`;
    document.cookie = `user_data=${expiry}${config.path}${config.domain}`;

    document.cookie = `auth_token=${expiry}; path=/`;
    document.cookie = `user_data=${expiry}; path=/`;

    console.log("🗑️ Auth cookies cleared");
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
      console.log("✅ SMS verified:", data);
      if (data.token && data.user) {
        setAuthCookies(data.token, data.user);
        queryClient.setQueryData(["user"], data.user);

        // Wait for cookies to be set before navigation
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 100);
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
      console.log("✅ Login successful:", data);
      if (data.token && data.user) {
        setAuthCookies(data.token, data.user);
        queryClient.setQueryData(["user"], data.user);

        // Wait for cookies to be set before navigation
        setTimeout(() => {
          router.replace("/");
          router.refresh();
        }, 100);
      }
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      try {
        // Call the logout API endpoint
        await authApi.logout();
      } catch (error) {
        console.error("Logout API error:", error);
        // Continue with local logout even if API fails
      }
    },
    onSuccess: () => {
      console.log("🚪 Logging out...");
      // Clear cookies
      clearAuthCookies();
      // Clear all query cache
      queryClient.clear();
      // Navigate to home
      router.push("/");
      // Force refresh to clear any cached auth state
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Still clear local state even on error
      clearAuthCookies();
      queryClient.clear();
      router.push("/");
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => {
      const user = getUserFromCookie();
      console.log('userHook', user)
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
