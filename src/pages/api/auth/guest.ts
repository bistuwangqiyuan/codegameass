import type { APIRoute } from 'astro';
import { randomUUID } from 'node:crypto';
import { getSql } from '../../../lib/db';
import { jsonResponse, signToken } from '../../../lib/api-utils';
import { getProfileById, hashPassword } from '../../../lib/auth-server';

export const POST: APIRoute = async () => {
  try {
    const sql = getSql();
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const guestEmail = `${guestId}@guest.bistu.edu.cn`;
    const userId = randomUUID();
    const passwordHash = await hashPassword(randomUUID());

    const trialStart = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 30);

    await sql`
      INSERT INTO user_profiles (
        id, username, display_name, user_type, is_guest,
        guest_trial_start, guest_trial_end
      ) VALUES (
        ${userId}::uuid, ${guestId}, '游客', 'guest', TRUE,
        ${trialStart.toISOString()}::timestamptz,
        ${trialEnd.toISOString()}::timestamptz
      )
    `;

    await sql`
      INSERT INTO auth_credentials (user_id, email, password_hash)
      VALUES (${userId}::uuid, ${guestEmail}, ${passwordHash})
    `;

    await sql`
      INSERT INTO user_settings (user_id) VALUES (${userId}::uuid)
    `;

    const profile = await getProfileById(userId);
    if (!profile) {
      return jsonResponse({ success: false, error: '创建游客失败' }, 500);
    }

    const token = await signToken(userId);
    return jsonResponse({
      success: true,
      token,
      user: profile,
      guestCredentials: { email: guestEmail },
    });
  } catch (error) {
    console.error('Guest error:', error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : '创建游客失败' },
      500
    );
  }
};
