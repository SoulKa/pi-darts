import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import { vueTestConfig } from '../../vitest.vue'

// Game engine (pure logic) plus .vue component tests, run under happy-dom via the shared config.
export default defineConfig({
  plugins: [vue()],
  test: vueTestConfig('board'),
})
