import type { APIRoute } from 'astro';
import { getSql } from '../../../lib/db';
import { jsonResponse } from '../../../lib/api-utils';

export const GET: APIRoute = async ({ params, url }) => {
  try {
    const sql = getSql();
    const id = params.id || url.pathname.split('/').pop();

    if (!id) {
      return jsonResponse({ success: false, error: '缺少挑战 ID' }, 400);
    }

    const rows = await sql`
      SELECT * FROM challenges WHERE id = ${id}::uuid AND is_published = TRUE LIMIT 1
    `;

    if (!rows.length) {
      return jsonResponse({ success: false, error: '挑战不存在' }, 404);
    }

    return jsonResponse({ success: true, challenge: rows[0] });
  } catch (error) {
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : '加载挑战失败' },
      500
    );
  }
};
