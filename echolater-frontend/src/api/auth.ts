import { apiClient } from '@/lib/http';
import type { AuthUser } from '@/types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface AuthData {
  user: AuthUser;
  token: string;
}

export async function login(payload: { email: string; password: string }): Promise<AuthData> {
  const res = await apiClient.post<ApiEnvelope<AuthData>>('/auth/login', payload);
  return res.data.data;
}

export async function register(payload: {
  email: string;
  password: string;
  nickname?: string;
}): Promise<AuthData> {
  const res = await apiClient.post<ApiEnvelope<AuthData>>('/auth/register', payload);
  return res.data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function getProfile(): Promise<AuthUser> {
  const res = await apiClient.get<ApiEnvelope<{ user: AuthUser }>>('/user/profile');
  return res.data.data.user;
}

export async function updateProfile(payload: {
  nickname?: string;
  avatar?: string;
}): Promise<AuthUser> {
  const res = await apiClient.put<ApiEnvelope<{ user: AuthUser }>>('/user/profile', payload);
  return res.data.data.user;
}
