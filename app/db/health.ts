import { sql } from 'drizzle-orm';
import { createDatabase } from './client';

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await createDatabase().execute(sql`select 1 as healthy`);
    return true;
  } catch {
    return false;
  }
}
