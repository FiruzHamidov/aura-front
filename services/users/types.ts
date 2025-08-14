export interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  role_id: number;
  status: string;
  auth_method: string;
  photo: string;
  created_at: string;
  updated_at: string;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
}
