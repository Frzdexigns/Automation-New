import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',  // Change from 'es2020' to 'esnext'
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});