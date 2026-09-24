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
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.method !== 'GET' || !req.url?.startsWith('/api/booking/detail')) {
              return
            }

            const requestUrl = new URL(req.url, 'http://localhost')
            const bookingId = requestUrl.searchParams.get('booking_id')
            if (!bookingId) return

            const body = JSON.stringify({ booking_id: Number(bookingId) })
            proxyReq.setHeader('Content-Type', 'application/json')
            proxyReq.setHeader('Content-Length', Buffer.byteLength(body))
            proxyReq.write(body)
          })
        },
      },
    },
  },
  }
})