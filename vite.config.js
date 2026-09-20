import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5174,
    // SPA fallback: all routes (e.g. /pdp, /atelier, /orders) serve index.html
    // so that client-side routing in App.jsx handles the view
    historyApiFallback: true,
  },
})