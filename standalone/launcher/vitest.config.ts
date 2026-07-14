import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import { vueTestConfig } from '../../vitest.vue'

// Renderer .vue component tests run under happy-dom via the shared config. The main/preload
// (Electron) code isn't unit-tested here.
export default defineConfig({
  plugins: [vue()],
  test: vueTestConfig('launcher')
})
