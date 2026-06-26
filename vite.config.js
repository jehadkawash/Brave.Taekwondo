// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    // FIX: Add Tailwind v4 Vite plugin — this compiles Tailwind CSS directly
    // from index.css into the bundle. Without this, all @tailwind directives
    // are ignored and the project was relying entirely on the CDN script.
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'أكاديمية الشجاع للتايكواندو',
        short_name: 'Brave TKD',
        description: 'تطبيق إدارة أكاديمية الشجاع للتايكوندو',
        theme_color: '#ffffff',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 6000000,
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const pkg = id.toString().split('node_modules/')[1].split('/')[0];
            // Keep React + the React Three Fiber ecosystem in one chunk.
            // Splitting these into separate chunks breaks load order — its-fine
            // reads React.useLayoutEffect at module-eval time and crashes if its
            // chunk loads before react's chunk has finished initializing.
            const reactCore = [
              'react', 'react-dom', 'scheduler', 'react-reconciler',
              'use-sync-external-store', 'react-is', 'its-fine',
              '@react-three', 'three', 'react-use-measure',
            ];
            if (reactCore.includes(pkg)) return 'react-vendor';
            return pkg;
          }
        },
      },
    },
  },
})
