import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// An isolated browser fixture: no Firebase configuration, network reads or writes.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: { entries: ['tests/performance/index.html'] },
  resolve: { alias: [
    { find: /.*\/hooks\/useCollection(?:\.js)?$/, replacement: fileURLToPath(new URL('./mockCollection.js', import.meta.url)) },
    { find: /.*\/lib\/firebase(?:\.js)?$/, replacement: fileURLToPath(new URL('./mockFirebase.js', import.meta.url)) },
  ] },
});
