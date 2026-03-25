import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const companies = sqliteTable('companies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  sector: text('sector').notNull(),
  createdAt: integer('created_at').notNull() // Unix timestamp
});

export const signals = sqliteTable('signals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  companyName: text('company_name').notNull(),
  type: text('type').notNull(), // Funding, Deal, Layoff, etc
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  url: text('url').notNull(),
  timestamp: integer('timestamp').notNull() // Unix timestamp
});
