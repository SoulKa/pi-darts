import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import { vueTestConfig } from '../../vitest.vue'

// Weather/transit composables plus .vue component tests, run under happy-dom via the shared
// config so `yarn test` picks them up alongside the other frontend apps. Keeps the `@` alias
// the composables/tests import through.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  test: vueTestConfig('dashboard'),
})
