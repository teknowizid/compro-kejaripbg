import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Selama development, request /api diteruskan ke backend Express (lihat folder server/).
      // Untuk production, jalankan backend di port 3001 atau sesuaikan reverse proxy.
      '/api': 'http://localhost:3001',
    },
  },
})
