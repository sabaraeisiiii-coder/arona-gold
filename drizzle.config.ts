import { defineConfig } from 'drizzle-kit';
import { getDatabaseUrl } from './app/config/env';

export default defineConfig({
  dialect: 'postgresql',
  schema: './app/db/schema.ts',
  out: './drizzle',
  dbCredentials: { url: getDatabaseUrl() },
  strict: true,
  verbose: true,
});
