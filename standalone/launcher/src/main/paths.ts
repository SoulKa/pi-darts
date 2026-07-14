import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'

// Installed app bundles live under userData so they survive shell upgrades and are user-writable:
//   <userData>/apps/<id>/            <- active unpacked bundle (served via piapp://<id>/)
//   <userData>/apps/<id>.json        <- InstalledApp metadata
//   <userData>/apps/<id>.bak/        <- previous bundle, kept for rollback
//   <userData>/apps/<id>.next/       <- staging dir during an install (renamed into place)

export function appsRoot(): string {
  return join(app.getPath('userData'), 'apps')
}

export function appDir(id: string): string {
  return join(appsRoot(), id)
}

export function appMetaPath(id: string): string {
  return join(appsRoot(), `${id}.json`)
}

/**
 * Bundled offline seed (tarballs + manifest.json, same format as a release). Populated at
 * package time via extraResources; in dev it's read straight from the repo's resources dir
 * (run `yarn prepare-seed` to fill it). Absent seed simply means "install from remote only".
 */
export function seedDir(): string {
  return is.dev ? join(app.getAppPath(), 'resources', 'seed') : join(process.resourcesPath, 'seed')
}
