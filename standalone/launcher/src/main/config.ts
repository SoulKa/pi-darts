// Where the launcher looks for its app store and how bundles are addressed.

/** Custom scheme that serves installed app bundles from the Pi's local disk. */
export const PIAPP_SCHEME = 'piapp'

/** GitHub repo whose Releases host manifest.json + the per-app .tar.gz bundles. */
export const GITHUB_OWNER = 'SoulKa'
export const GITHUB_REPO = 'piPod'

/** App shown/launched first on a fresh install. */
export const DEFAULT_APP_ID = 'board'
