import type { AuthUser } from '@/types';

export const AUTH_SESSION_KEY = 'echolater-auth-session';
export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface AuthSession {
  token: string;
  user: AuthUser;
  sessionStartedAt: string;
}

export function readAuthSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (!parsed.token || !parsed.user || !parsed.sessionStartedAt) return null;
    return {
      token: parsed.token,
      user: parsed.user as AuthUser,
      sessionStartedAt: parsed.sessionStartedAt,
    };
  } catch {
    return null;
  }
}

export function writeAuthSession(session: AuthSession): void {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

export function isSessionExpired(sessionStartedAt: string): boolean {
  const startedAt = new Date(sessionStartedAt).getTime();
  if (!Number.isFinite(startedAt)) return true;
  return Date.now() - startedAt > SESSION_MAX_AGE_MS;
}
