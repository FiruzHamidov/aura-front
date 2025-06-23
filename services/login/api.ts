import { axios } from "@/utils/axios";
import {
  LoginRequest,
  LoginResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  User,
} from "./types";

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const { data: response } = await axios.post<LoginResponse>("/login", data);
    return response;
  },

  verifyCode: async (data: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
    const { data: response } = await axios.post<VerifyCodeResponse>(
      "/verify-code",
      data
    );
    return response;
  },

  logout: async (): Promise<void> => {
    await axios.post("/logout");
    localStorage.removeItem("auth_token");
  },

  getMe: async (): Promise<User> => {
    const { data } = await axios.get<User>("/me");
    return data;
  },
};
