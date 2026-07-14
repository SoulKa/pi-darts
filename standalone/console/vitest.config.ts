import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import { vueTestConfig } from '../../vitest.vue'

// Framework-light modules (api client, tournament feed) plus .vue component tests, run under
// happy-dom via the shared config.
export default defineConfig({
  plugins: [vue()],
  test: vueTestConfig('console'),
})
