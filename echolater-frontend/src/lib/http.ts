import axios from 'axios';
import { clearAuthSession, readAuthSession } from '@/lib/auth-storage';

const baseURL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const session = readAuthSession();
  if (session?.token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthSession();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export function extractApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (typeof error !== 'object' || !error) return fallback;
  const maybeResponse = error as {
    response?: { data?: { error?: { message?: string | string[] } } };
    message?: string;
  };
  const msg = maybeResponse.response?.data?.error?.message;
  if (Array.isArray(msg)) return msg.join(', ');
  if (typeof msg === 'string' && msg.trim()) return msg;
  if (typeof maybeResponse.message === 'string' && maybeResponse.message.trim()) {
    return maybeResponse.message;
  }
  return fallback;
}
