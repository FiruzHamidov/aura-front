import { axios } from "@/utils/axios";
import {
  LoginRequest,
  SmsRequest,
  SmsVerifyRequest,
  LoginResponse,
  User,
} from "./types";

export const authApi = {
  sendSms: async (data: SmsRequest): Promise<{ message: string }> => {
    const { data: response } = await axios.post<{ message: string }>(
      "/sms/request",
      data
    );
    return response;
  },

  verifySms: async (data: SmsVerifyRequest): Promise<LoginResponse> => {
    const { data: response } = await axios.post<LoginResponse>(
      "/sms/verify",
      data
    );
    return response;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const { data: response } = await axios.post<LoginResponse>("/login", data);
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
