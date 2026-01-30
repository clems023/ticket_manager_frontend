import { apiClient } from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface User {
  id: number;
  email: string;
  roles: string[];
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("api/login", payload);
  return data;
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(
    "api/register",
    payload,
  );
  return data;
}
