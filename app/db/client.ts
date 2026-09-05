import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { getDatabaseUrl } from '@/app/config/env';
import * as schema from './schema';

export function createDatabase(databaseUrl = getDatabaseUrl()) {
  return drizzle(neon(databaseUrl), { schema });
}
