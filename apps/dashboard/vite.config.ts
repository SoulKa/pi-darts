import path from 'node:path'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// The `/api/vvs` proxy only exists in dev (`yarn dev:dashboard`). In the packaged launcher the
// app is served over piapp:// with no proxy, so useTrains() calls the VVS host directly — see
// src/composables/useTrains.ts.
export default defineConfig({
  server: {
    proxy: {
      '/api/vvs': {
        target: 'https://www3.vvs.de/mngvvs',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/vvs/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [vue(), UnoCSS()],
})
