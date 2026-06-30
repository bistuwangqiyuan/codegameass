import type { APIRoute } from 'astro';
import { jsonResponse, getUserIdFromRequest } from '../../../lib/api-utils';
import { getProfileById } from '../../../lib/auth-server';

export const GET: APIRoute = async ({ request }) => {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return jsonResponse({ success: false, user: null }, 401);
    }

    const profile = await getProfileById(userId);
    if (!profile) {
      return jsonResponse({ success: false, user: null }, 404);
    }

    return jsonResponse({ success: true, user: profile });
  } catch (error) {
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : '获取用户失败' },
      500
    );
  }
};
