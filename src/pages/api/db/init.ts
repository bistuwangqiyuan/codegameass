import type { APIRoute } from 'astro';
import { runMigrations } from '../../../lib/db/migrate';
import { seedDemoAccounts } from '../../../lib/db/seed-demo';
import { seedSampleData } from '../../../lib/utils/seed-data';
import { hasDatabase } from '../../../lib/db';
import { jsonResponse } from '../../../lib/api-utils';

export const POST: APIRoute = async () => {
  try {
    if (!hasDatabase()) {
      return jsonResponse(
        { success: false, error: 'Database not configured (NETLIFY_DATABASE_URL / NETLIFY_DB_URL)' },
        503
      );
    }

    const migration = await runMigrations();
    await seedDemoAccounts();
    await seedSampleData();

    return jsonResponse({
      success: true,
      message: 'Database initialized successfully',
      migration,
    });
  } catch (error) {
    console.error('DB init error:', error);
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Initialization failed',
      },
      500
    );
  }
};
