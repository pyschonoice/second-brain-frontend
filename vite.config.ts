import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: '0.0.0.0',
    watch: {
      usePolling: true, // Force polling instead of native events
      interval: 1000, // Poll every 1000ms (1 second)
    },
  }
})
