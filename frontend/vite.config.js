import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';

export default defineConfig({
  plugins: [
    react(),
    // Pre-compress assets — servers can serve .gz/.br directly without on-the-fly compression
    compression({ algorithm: 'gzip', threshold: 1024 }),
    compression({ algorithm: 'brotliCompress', threshold: 1024 }),
  ],
  build: {
    // Target modern browsers for smaller output
    target: 'es2020',
    // Enable CSS code splitting so each lazy chunk has its own CSS
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query', 'axios'],
          // Separate framer-motion from other UI libs so pages not using it skip the download
          motion: ['framer-motion'],
          ui: ['react-icons', 'react-hot-toast'],
          // tsparticles in its own chunk (lazy-loaded via Layout)
          particles: ['@tsparticles/react', '@tsparticles/slim'],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
