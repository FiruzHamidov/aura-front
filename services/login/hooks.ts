import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./api";
import { useRouter } from "next/navigation";

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
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
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
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
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
      queryClient.clear();
      router.push("/");
    },
  });
};
