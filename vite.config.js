import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'SICEFA · Medicamos tu Vida', short_name: 'SICEFA',
        description: 'Sistema integral para el control de farmacias',
        start_url: '/', scope: '/', display: 'standalone',
        background_color: '#f5f7f7', theme_color: '#13313a', lang: 'es-MX',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // No almacenar /api ni datos médicos o de clientes en cachés del navegador.
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: []
      },
      devOptions: { enabled: false }
    })
  ],
  server: {
    port: 5173, strictPort: true,
    proxy: { '/api': { target: 'http://localhost:5086', changeOrigin: true } }
  },
  preview: { port: 4173, proxy: { '/api': { target: 'http://localhost:5086', changeOrigin: true } } },
  build: { outDir: 'dist' }
})
