import type { APIRoute } from 'astro';
import { getSql } from '../../../lib/db';
import { jsonResponse } from '../../../lib/api-utils';

export const GET: APIRoute = async () => {
  try {
    const sql = getSql();
    const modules = await sql`
      SELECT * FROM course_modules
      WHERE is_published = TRUE
      ORDER BY order_index ASC
    `;

    return jsonResponse({ success: true, modules });
  } catch (error) {
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : '加载课程失败', modules: [] },
      500
    );
  }
};
