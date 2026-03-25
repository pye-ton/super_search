import type { APIRoute } from 'astro';
import { drizzle } from 'drizzle-orm/d1';
import { companies as companiesSchema } from '../../db/schema';
import { desc } from 'drizzle-orm';

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env || !env.DB) {
     return new Response(JSON.stringify({ error: "Cloudflare D1 binding failed." }), { status: 500 });
  }
  const db = drizzle(env.DB);
  
  try {
    const { sql } = await import('drizzle-orm');
    await db.run(sql`CREATE TABLE IF NOT EXISTS companies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, sector TEXT NOT NULL, created_at INTEGER NOT NULL);`);
  } catch(e) {}

  try {
    const allCompanies = await db.select()
      .from(companiesSchema)
      .orderBy(desc(companiesSchema.createdAt));
      
    return new Response(JSON.stringify(allCompanies), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
