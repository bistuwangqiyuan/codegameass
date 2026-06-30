import type { APIRoute } from 'astro';
import { jsonResponse } from '../../../../lib/api-utils';

/** Starter 模板遗留端点 — 框架点赞功能未迁移至 Neon */
export const POST: APIRoute = async () => {
  return jsonResponse({ success: false, error: 'Framework likes not available in Neon mode' }, 501);
};
