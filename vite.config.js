import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
  envPrefix: ['VITE_', 'API_'],
  plugins: [
    vue(),
    tailwindcss(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5180, // ปรับให้ตรงกับ Port ที่กำลังใช้งาน
    proxy: {
      // Forward API requests to the configured backend.
      '/api': {
        target: env.API_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  }
})