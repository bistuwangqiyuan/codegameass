import type { APIRoute } from 'astro';
import { randomUUID } from 'node:crypto';
import { getSql } from '../../../lib/db';
import { jsonResponse, parseJsonBody, signToken } from '../../../lib/api-utils';
import { getProfileById, hashPassword } from '../../../lib/auth-server';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password, username, displayName } = await parseJsonBody<{
      email: string;
      password: string;
      username: string;
      displayName: string;
    }>(request);

    if (!email || !password || !username) {
      return jsonResponse({ success: false, error: '请填写完整注册信息' }, 400);
    }

    const sql = getSql();

    const existing = await sql`
      SELECT id FROM user_profiles WHERE username = ${username} LIMIT 1
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

    const userId = randomUUID();
    const passwordHash = await hashPassword(password);

    await sql`
      INSERT INTO user_profiles (id, username, display_name, user_type, is_guest)
      VALUES (${userId}::uuid, ${username}, ${displayName || username}, 'student', FALSE)
    `;

    await sql`
      INSERT INTO auth_credentials (user_id, email, password_hash)
      VALUES (${userId}::uuid, ${email}, ${passwordHash})
    `;

    await sql`
      INSERT INTO user_settings (user_id) VALUES (${userId}::uuid)
    `;

    const profile = await getProfileById(userId);
    if (!profile) {
      return jsonResponse({ success: false, error: '创建用户失败' }, 500);
    }

    const token = await signToken(userId);
    return jsonResponse({ success: true, token, user: profile });
  } catch (error) {
    console.error('Register error:', error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : '注册失败' },
      500
    );
  }
};
