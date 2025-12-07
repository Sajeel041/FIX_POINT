import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    hmr: {
      // Disable HMR in production to prevent WebSocket errors
      protocol: process.env.NODE_ENV === 'production' ? undefined : 'ws',
    },
  },
  build: {
    // Disable source maps in production for smaller builds
    sourcemap: false,
  },
});
