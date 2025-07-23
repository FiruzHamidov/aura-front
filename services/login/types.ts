export interface LoginRequest {
  phone: string;
  password?: string;
}

export interface SmsRequest {
  phone: string;
}

export interface SmsVerifyRequest {
  phone: string;
  code: string;
}

export interface LoginResponse {
  message: string;
  user?: User;
  token?: string;
  requires_verification?: boolean;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  role_id: number;
  status: string;
  auth_method: string;
  created_at: string;
  updated_at: string;
  role?: Role;
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
}

export type AuthMode = "sms" | "password";
