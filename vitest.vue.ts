// Shared vitest settings for the Vue frontend apps (board, console, launcher): a real DOM
// (happy-dom) so components can mount, plus the standard *.test.ts glob. Each app's own
// vitest.config.ts adds @vitejs/plugin-vue (already a devDep there) to transform .vue files.
export function vueTestConfig(name: string) {
  return { name, environment: 'happy-dom' as const, include: ['src/**/*.test.ts'] }
}
