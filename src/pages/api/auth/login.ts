import type { APIRoute } from 'astro';
import { jsonResponse, parseJsonBody, signToken } from '../../../lib/api-utils';
import {
  getPasswordHash,
  getProfileByEmail,
  verifyPassword,
} from '../../../lib/auth-server';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await parseJsonBody<{ email: string; password: string }>(request);

    if (!email || !password) {
      return jsonResponse({ success: false, error: '邮箱和密码不能为空' }, 400);
    }

    const hash = await getPasswordHash(email);
    if (!hash || !(await verifyPassword(password, hash))) {
      return jsonResponse({ success: false, error: '邮箱或密码错误' }, 401);
    }

    const profile = await getProfileByEmail(email);
    if (!profile) {
      return jsonResponse({ success: false, error: '用户资料不存在' }, 404);
    }

    const token = await signToken(profile.id);
    return jsonResponse({ success: true, token, user: profile });
  } catch (error) {
    console.error('Login error:', error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : '登录失败' },
      500
    );
  }
};
