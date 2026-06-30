import type { APIRoute } from 'astro';
import { jsonResponse } from '../../../lib/api-utils';

export const POST: APIRoute = async () => {
  return jsonResponse({ success: true });
};
