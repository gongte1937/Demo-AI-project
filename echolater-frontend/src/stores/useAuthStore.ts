import { create } from 'zustand';
import * as authApi from '@/api/auth';
import { extractApiErrorMessage } from '@/lib/http';
import {
  clearAuthSession,
  isSessionExpired,
  readAuthSession,
  writeAuthSession,
} from '@/lib/auth-storage';
import type { AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  sessionStartedAt: string | null;
  isAuthenticated: boolean;
  bootstrapped: boolean;
  loading: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { email: string; password: string; nickname?: string }) => Promise<void>;
  updateProfile: (payload: { nickname?: string; avatar?: string }) => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

function persistSession(token: string, user: AuthUser, sessionStartedAt: string): void {
  writeAuthSession({ token, user, sessionStartedAt });
}

const initialSession = (() => {
  const session = readAuthSession();
  if (!session || isSessionExpired(session.sessionStartedAt)) {
    clearAuthSession();
    return null;
  }
  return session;
})();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialSession?.user ?? null,
  token: initialSession?.token ?? null,
  sessionStartedAt: initialSession?.sessionStartedAt ?? null,
  isAuthenticated: Boolean(initialSession?.token),
  bootstrapped: false,
  loading: false,
  error: null,

  initialize: async () => {
    if (get().bootstrapped) return;
    const { token, sessionStartedAt } = get();

    if (!token || !sessionStartedAt || isSessionExpired(sessionStartedAt)) {
      get().clearAuth();
      set({ bootstrapped: true });
      return;
    }

    try {
      const user = await authApi.getProfile();
      set({ user, isAuthenticated: true, bootstrapped: true, error: null });
      persistSession(token, user, sessionStartedAt);
    } catch (error) {
      get().clearAuth();
      set({ bootstrapped: true, error: extractApiErrorMessage(error, 'Session expired') });
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.login({ email, password });
      const sessionStartedAt = new Date().toISOString();
      persistSession(data.token, data.user, sessionStartedAt);
      set({
        user: data.user,
        token: data.token,
        sessionStartedAt,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      const message = extractApiErrorMessage(error, 'Login failed');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  register: async ({ email, password, nickname }) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.register({ email, password, nickname });
      const sessionStartedAt = new Date().toISOString();
      persistSession(data.token, data.user, sessionStartedAt);
      set({
        user: data.user,
        token: data.token,
        sessionStartedAt,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      const message = extractApiErrorMessage(error, 'Register failed');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  updateProfile: async ({ nickname, avatar }) => {
    set({ loading: true, error: null });
    try {
      const user = await authApi.updateProfile({ nickname, avatar });
      const { token, sessionStartedAt } = get();
      if (token && sessionStartedAt) {
        persistSession(token, user, sessionStartedAt);
      }
      set({ user, loading: false, error: null });
    } catch (error) {
      const message = extractApiErrorMessage(error, 'Profile update failed');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  logout: async () => {
    const { token } = get();
    try {
      if (token) await authApi.logout();
    } catch {
      // ignore logout API failures; local session still needs to be cleared
    } finally {
      get().clearAuth();
      set({ bootstrapped: true });
    }
  },

  clearAuth: () => {
    clearAuthSession();
    set({
      user: null,
      token: null,
      sessionStartedAt: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  },
}));
