import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // 1. استيراد الإضافة

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // ✅ هذا السطر يحل مشكلة الشاشة البيضاء (التحديث الفوري)
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'], // الملفات الثابتة
      manifest: {
        name: 'أكاديمية الشجاع للتايكوندو',
        short_name: 'Brave TKD',
        description: 'تطبيق إدارة أكاديمية الشجاع للتايكوندو',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon-192.png', // تأكد أن هذه الصور موجودة في مجلد public
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