import type { APIRoute } from 'astro';
import { getSql } from '../../../lib/db';
import { jsonResponse, parseJsonBody, getUserIdFromRequest } from '../../../lib/api-utils';
import { hashPassword } from '../../../lib/auth-server';

export const POST: APIRoute = async ({ request }) => {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return jsonResponse({ success: false, error: '请先登录' }, 401);
    }

    const { email, password, username } = await parseJsonBody<{
      email: string;
      password: string;
      username: string;
    }>(request);

    const sql = getSql();

    const existing = await sql`
      SELECT id FROM user_profiles WHERE username = ${username} AND id != ${userId}::uuid LIMIT 1
    `;
    if (existing.length) {
      return jsonResponse({ success: false, error: '用户名已被使用' }, 409);
    }

    const emailTaken = await sql`
      SELECT user_id FROM auth_credentials WHERE LOWER(email) = LOWER(${email}) LIMIT 1
    `;
    if (emailTaken.length) {
      return jsonResponse({ success: false, error: '邮箱已被注册' }, 409);
    }

    const passwordHash = await hashPassword(password);

    await sql`
      UPDATE user_profiles SET
        username = ${username},
        user_type = 'student',
        is_guest = FALSE,
        guest_trial_start = NULL,
        guest_trial_end = NULL
      WHERE id = ${userId}::uuid
    `;

    await sql`
      UPDATE auth_credentials SET email = ${email}, password_hash = ${passwordHash}
      WHERE user_id = ${userId}::uuid
    `;

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : '转换失败' },
      500
    );
  }
};
