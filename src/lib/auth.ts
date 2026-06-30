// 用户认证工具函数 — Neon API 版
import type { UserProfile } from './supabase';
import { getDemoAccount, type DemoRole } from './demo-accounts';
import { apiFetch } from './api-client';
import { useUserStore } from './store/userStore';

function persistSession(token: string, user: UserProfile) {
  const { setUser, setAuthToken } = useUserStore.getState();
  setAuthToken(token);
  setUser(user);
}

export async function createGuestAccount(): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const data = await apiFetch<{
      success: boolean;
      token: string;
      user: UserProfile;
      guestCredentials?: { email: string };
    }>('/api/auth/guest', { method: 'POST' });

    if (!data.success || !data.user) {
      return { success: false, error: '创建游客失败' };
    }

    persistSession(data.token, data.user);

    if (typeof window !== 'undefined' && data.guestCredentials) {
      localStorage.setItem('guest_credentials', JSON.stringify(data.guestCredentials));
    }

    return { success: true, user: data.user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function isDemoAccount(profile: UserProfile): boolean {
  return profile.is_demo === true;
}

export function isGuestTrialExpired(profile: UserProfile): boolean {
  if (isDemoAccount(profile)) return false;
  if (!profile.is_guest || !profile.guest_trial_end) return false;
  return new Date() > new Date(profile.guest_trial_end);
}

export function getTrialDaysRemaining(profile: UserProfile): number {
  if (!profile.is_guest || !profile.guest_trial_end) return 0;
  const diffTime = new Date(profile.guest_trial_end).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

export async function signInWithDemoAccount(
  role: DemoRole
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const account = getDemoAccount(role);
  return signInWithEmail(account.email, account.password);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  username: string,
  displayName: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const data = await apiFetch<{ success: boolean; token: string; user: UserProfile; error?: string }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, username, displayName }),
      }
    );

    if (!data.success || !data.user) {
      return { success: false, error: data.error || '注册失败' };
    }

    persistSession(data.token, data.user);
    return { success: true, user: data.user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const data = await apiFetch<{ success: boolean; token: string; user: UserProfile; error?: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    if (!data.success || !data.user) {
      return { success: false, error: data.error || '登录失败' };
    }

    persistSession(data.token, data.user);
    return { success: true, user: data.user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { logout } = useUserStore.getState();
    logout();

    if (typeof window !== 'undefined') {
      localStorage.removeItem('guest_credentials');
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const token = useUserStore.getState().authToken;
    if (!token) return null;

    const data = await apiFetch<{ success: boolean; user: UserProfile | null }>('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.success && data.user) {
      useUserStore.getState().setUser(data.user);
      return data.user;
    }

    useUserStore.getState().logout();
    return null;
  } catch {
    return null;
  }
}

export async function convertGuestToUser(
  email: string,
  password: string,
  username: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = useUserStore.getState().user;
    if (!user) return { success: false, error: 'No user logged in' };

    const data = await apiFetch<{ success: boolean; error?: string }>('/api/auth/convert-guest', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });

    if (!data.success) {
      return { success: false, error: data.error || '转换失败' };
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('guest_credentials');
    }

    await getCurrentUserProfile();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
