// 客户端 API 请求工具
import { useUserStore } from './store/userStore';

export function getAuthToken(): string | null {
  return useUserStore.getState().authToken;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, { ...options, headers });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
