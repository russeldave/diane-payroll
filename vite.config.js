import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE,
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: process.env.VITE_SYSTEM_DOMAIN || '0.0.0.0', // Use '0.0.0.0' to bind to all network interfaces
    port: process.env.VITE_PORT || 8992,              // Default port is 3000
    https: false,                                     // Set to true if you need HTTPS
  }
})
