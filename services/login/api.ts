import { axios } from "@/utils/axios";
import {
  LoginRequest,
  SmsRequest,
  SmsVerifyRequest,
  LoginResponse,
  User,
  ProfileUpdateRequest,
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
    try {
      await axios.post("/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
      throw error;
    }
  },

  getMe: async (): Promise<User> => {
    const { data } = await axios.get<User>("/me");
    return data;
  },

  getProfile: async (userId: number): Promise<User> => {
    const { data } = await axios.get<User>(`/user/${userId}`);
    return data;
  },

  updateProfile: async (
    userId: number,
    profileData: ProfileUpdateRequest
  ): Promise<User> => {
    const { data } = await axios.put<User>(`/user/${userId}`, profileData);
    return data;
  },
};
