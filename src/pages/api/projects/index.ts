import type { APIRoute } from 'astro';
import { getSql } from '../../../lib/db';
import { jsonResponse } from '../../../lib/api-utils';

export const GET: APIRoute = async ({ url }) => {
  try {
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
    const pageSize = Math.min(50, Number(url.searchParams.get('pageSize') || '12'));
    const sortBy = url.searchParams.get('sortBy') || 'latest';
    const offset = (page - 1) * pageSize;

    const sql = getSql();

    const projects = await sql`
      SELECT * FROM user_projects
      WHERE is_public = TRUE
      ORDER BY created_at DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    // Re-sort in memory for non-latest sorts (safe for small datasets)
    const sorted = [...projects].sort((a, b) => {
      const ra = a as Record<string, number | string | null>;
      const rb = b as Record<string, number | string | null>;
      switch (sortBy) {
        case 'popular':
          return Number(rb.likes_count) - Number(ra.likes_count);
        case 'views':
          return Number(rb.views_count) - Number(ra.views_count);
        case 'ai_score':
          return Number(rb.ai_score ?? 0) - Number(ra.ai_score ?? 0);
        default:
          return new Date(String(rb.created_at)).getTime() - new Date(String(ra.created_at)).getTime();
      }
    });

    return jsonResponse({ success: true, projects: sorted, page, pageSize });
  } catch (error) {
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : '加载作品失败', projects: [] },
      500
    );
  }
};
