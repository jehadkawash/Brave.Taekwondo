// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
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
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait'
      },
      // ✅✅ هنا المكان الصحيح لوضع إعدادات workbox (داخل VitePWA) ✅✅
      workbox: {
        // رفع الحد الأقصى للملفات المسموح بتخزينها إلى 6 ميجابايت (للسماح لمكتبة Spline 3D)
        maximumFileSizeToCacheInBytes: 6000000, 
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
})