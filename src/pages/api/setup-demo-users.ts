import type { APIRoute } from 'astro';
import { runMigrations } from '../../lib/db/migrate';
import { seedDemoAccounts } from '../../lib/db/seed-demo';
import { seedSampleData } from '../../lib/utils/seed-data';
import { hasDatabase } from '../../lib/db';
import { jsonResponse } from '../../lib/api-utils';

/** @deprecated 使用 POST /api/db/init */
export const POST: APIRoute = async () => {
  try {
    if (!hasDatabase()) {
      return jsonResponse({ success: false, error: 'Database not configured' }, 503);
    }

    await runMigrations();
    await seedDemoAccounts();
    await seedSampleData();

    return jsonResponse({ success: true, message: 'Demo users and data initialized via Neon' });
  } catch (error) {
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : 'Setup failed' },
      500
    );
  }
};
