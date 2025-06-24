import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { authApi } from "./api";
import { ProfileUpdateRequest } from "./types";

// Cookie expiration time (7 days in seconds)
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

// eslint-disable-next-line
function setAuthCookies(token: string, user: any) {
  if (typeof window !== "undefined") {
    document.cookie = `auth_token=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=strict`;

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.slug || "user",
    };
    document.cookie = `user_data=${encodeURIComponent(
      JSON.stringify(userData)
    )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=strict`;
  }
}

function clearAuthCookies() {
  if (typeof window !== "undefined") {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
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
        router.push("/");
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
        const userData = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role?.slug || "user",
        };
        document.cookie = `user_data=${encodeURIComponent(
          JSON.stringify(userData)
        )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=strict`;
      }
    },
  });
};

export const useMe = useProfile;
