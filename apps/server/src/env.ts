import { resolve } from 'node:path'

/** Runtime configuration, read from the environment with LAN-friendly defaults. */
export const env = {
  /** Bind on all interfaces so boards on the LAN can reach the server. */
  host: process.env.HOST ?? '0.0.0.0',
  port: Number(process.env.PORT ?? 3000),
  /** Directory for the SQLite file — mounted as a Docker volume in production. */
  dataDir: resolve(process.env.DATA_DIR ?? './data'),
  /** Absolute path to the built console bundle to serve (empty = don't serve). */
  consoleDir: process.env.CONSOLE_DIR ?? '',
}

export const dbPath = resolve(env.dataDir, 'pi-darts.db')
