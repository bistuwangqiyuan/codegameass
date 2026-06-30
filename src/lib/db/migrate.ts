import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPool, hasDatabase } from '../db';

const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../../db/neon');

function splitSqlStatements(content: string): string[] {
  const statements: string[] = [];
  let current = '';
  let inDollarQuote = false;

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--') && !inDollarQuote && !current.trim()) {
      continue;
    }

    const dollarMatches = (line.match(/\$\$/g) || []).length;
    if (dollarMatches % 2 === 1) {
      inDollarQuote = !inDollarQuote;
    }

    current += `${line}\n`;

    if (!inDollarQuote && trimmed.endsWith(';')) {
      const stmt = current.trim();
      if (stmt && !stmt.startsWith('--')) {
        statements.push(stmt);
      }
      current = '';
    }
  }

  const remainder = current.trim();
  if (remainder && !remainder.startsWith('--')) {
    statements.push(remainder);
  }

  return statements;
}

export async function runMigrations(): Promise<{ files: string[]; statementsRun: number }> {
  if (!hasDatabase()) {
    throw new Error('Database not configured');
  }

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const pool = getPool();
  let statementsRun = 0;

  try {
    for (const file of files) {
      const content = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');
      const statements = splitSqlStatements(content);

      for (const statement of statements) {
        try {
          await pool.query(statement);
          statementsRun += 1;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          if (message.includes('already exists') || message.includes('duplicate key')) {
            continue;
          }
          throw new Error(`Migration ${file} failed: ${message}`);
        }
      }
    }
  } finally {
    await pool.end();
  }

  return { files, statementsRun };
}
