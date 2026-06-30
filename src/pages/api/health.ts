import type { APIRoute } from 'astro';
import { getSql, hasDatabase, getConnectionString } from '../../lib/db';
import { jsonResponse } from '../../lib/api-utils';

export const GET: APIRoute = async () => {
  try {
    const conn = getConnectionString();
    const authSecretSet = !!import.meta.env.AUTH_SECRET;

    if (!hasDatabase()) {
      return jsonResponse({
        status: 'error',
        database: 'not_configured',
        connectionSource: null,
        authSecretSet,
        courseCount: 0,
        projectCount: 0,
        databaseError: {
          message: 'NETLIFY_DATABASE_URL or NETLIFY_DB_URL not set',
        },
        timestamp: new Date().toISOString(),
      }, 503);
    }

    const sql = getSql();

    let courseCount = 0;
    let projectCount = 0;
    let challengeCount = 0;
    let tablesExist = false;

    try {
      const courses = await sql`
        SELECT COUNT(*)::int AS count FROM course_modules WHERE is_published = TRUE
      `;
      courseCount = Number((courses[0] as { count: number }).count);

      const projects = await sql`
        SELECT COUNT(*)::int AS count FROM user_projects WHERE is_public = TRUE
      `;
      projectCount = Number((projects[0] as { count: number }).count);

      const challenges = await sql`
        SELECT COUNT(*)::int AS count FROM challenges WHERE is_published = TRUE
      `;
      challengeCount = Number((challenges[0] as { count: number }).count);

      tablesExist = true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return jsonResponse({
        status: 'error',
        database: 'neon',
        connectionSource: conn?.includes('neon') ? 'neon' : 'postgres',
        authSecretSet,
        courseCount: 0,
        projectCount: 0,
        tablesExist: false,
        databaseError: {
          code: message.includes('does not exist') ? '42P01' : 'DB_ERROR',
          message,
        },
        hint: message.includes('does not exist')
          ? 'Run POST /api/db/init to create tables and seed data'
          : undefined,
        timestamp: new Date().toISOString(),
      }, 500);
    }

    return jsonResponse({
      status: courseCount > 0 ? 'ok' : 'needs_init',
      database: 'neon',
      connectionSource: conn?.includes('neon') ? 'neon' : 'postgres',
      authSecretSet,
      courseCount,
      projectCount,
      challengeCount,
      tablesExist,
      databaseError: null,
      hint: courseCount === 0 ? 'Run POST /api/db/init to seed courses' : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return jsonResponse({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, 500);
  }
};
