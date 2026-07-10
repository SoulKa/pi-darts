import { mkdirSync } from 'node:fs'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { dbPath, env } from '../env'
import { INIT_SQL } from './schema'
import * as schema from './schema'

/**
 * Open the SQLite database, ensure the data directory exists, create tables on
 * first boot, and return a typed Drizzle client. WAL mode keeps reads (overview
 * screens) from blocking writes (live throws).
 */
function createDb() {
  mkdirSync(env.dataDir, { recursive: true })
  const sqlite = new Database(dbPath)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')
  sqlite.exec(INIT_SQL)
  return drizzle(sqlite, { schema })
}

export const db = createDb()
export type Db = typeof db
