import { neon } from '@netlify/neon';
import { Pool } from '@neondatabase/serverless';
import type { NeonQueryFunction } from '@neondatabase/serverless';

export function getConnectionString(): string | undefined {
  return (
    import.meta.env.NETLIFY_DATABASE_URL ||
    import.meta.env.NETLIFY_DB_URL ||
    import.meta.env.DATABASE_URL
  );
}

export function hasDatabase(): boolean {
  return !!getConnectionString();
}

export function getSql(): NeonQueryFunction<false, false> {
  const conn = getConnectionString();
  if (!conn) {
    throw new Error('No database connection string (NETLIFY_DATABASE_URL / NETLIFY_DB_URL)');
  }
  return neon(conn);
}

export function getPool(): Pool {
  const conn = getConnectionString();
  if (!conn) {
    throw new Error('No database connection string');
  }
  return new Pool({ connectionString: conn });
}
