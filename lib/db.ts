import { mkdirSync } from 'node:fs'
// One tiny query helper for both environments:
//  - DATABASE_URL set  -> real Postgres (Neon, Supabase, Render Postgres, Vercel Postgres...)
//  - DATABASE_URL unset -> embedded Postgres (PGlite) stored in ./.data, for local dev only
type Row = Record<string, any>
type Runner = (sql: string, params: unknown[]) => Promise<Row[]>

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'none',
  pay_note      TEXT,
  requested_at  TIMESTAMPTZ,
  decided_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
)`

const g = globalThis as unknown as { __db?: Promise<Runner> }

async function init(): Promise<Runner> {
  let run: Runner
  const url = process.env.DATABASE_URL
  if (url) {
    const { Pool } = await import('pg')
    const local = /localhost|127\.0\.0\.1/.test(url)
    const pool = new Pool({ connectionString: url, max: 5, ssl: local ? undefined : { rejectUnauthorized: false } })
    run = async (sql, params) => (await pool.query(sql, params as any[])).rows
  } else {
    if (process.env.NODE_ENV === 'production') throw new Error('DATABASE_URL is required in production')
    const { PGlite } = await import('@electric-sql/pglite')
    const dir = process.env.PGLITE_DIR || './.data/pglite'
    mkdirSync(dir, { recursive: true })
    const db = new PGlite(dir)
    run = async (sql, params) => (await db.query(sql, params as any[])).rows as Row[]
  }
  await run(SCHEMA, [])
  return run
}

export async function query<T = Row>(sql: string, params: unknown[] = []): Promise<T[]> {
  g.__db ??= init().catch((e) => { g.__db = undefined; throw e })
  const run = await g.__db
  return (await run(sql, params)) as T[]
}
