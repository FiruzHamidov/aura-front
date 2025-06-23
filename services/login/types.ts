export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user?: User;
  token?: string;
  requires_verification?: boolean;
}

export interface VerifyCodeRequest {
  phone: string;
  code: string;
}

export interface VerifyCodeResponse {
  message: string;
  user: User;
  token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role_id: number;
  status: string;
  auth_method: string;
  created_at: string;
  updated_at: string;
}
