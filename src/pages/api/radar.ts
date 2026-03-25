import type { APIRoute } from 'astro';
import { drizzle } from 'drizzle-orm/d1';
import { signals as signalsSchema, companies as companiesSchema } from '../../db/schema';
import { desc, gte } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env || !env.DB) {
     return new Response(JSON.stringify({ error: "Database mapping failed." }), { status: 500 });
  }
  const db = drizzle(env.DB);

  // Auto-initialize schema for Miniflare local dev proxy mismatch
  try {
    import('drizzle-orm').then(async ({ sql }) => {
      await db.run(sql`CREATE TABLE IF NOT EXISTS companies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, sector TEXT NOT NULL, created_at INTEGER NOT NULL);`);
      await db.run(sql`CREATE TABLE IF NOT EXISTS signals (id INTEGER PRIMARY KEY AUTOINCREMENT, company_name TEXT NOT NULL, type TEXT NOT NULL, title TEXT NOT NULL, summary TEXT NOT NULL, url TEXT NOT NULL, timestamp INTEGER NOT NULL);`);
    });
  } catch(e) {}

  try {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    const latestCompanies = await db.select()
      .from(companiesSchema)
      .where(gte(companiesSchema.createdAt, sevenDaysAgo))
      .orderBy(desc(companiesSchema.createdAt))
      .limit(30);

    const latestSignals = await db.select()
      .from(signalsSchema)
      .where(gte(signalsSchema.timestamp, sevenDaysAgo))
      .orderBy(desc(signalsSchema.timestamp))
      .limit(50);

    return new Response(JSON.stringify({
      companies: latestCompanies,
      signals: latestSignals
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
