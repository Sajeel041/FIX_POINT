import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    hmr: false, // Disable HMR completely
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    rollupOptions: {
      output: {
        format: 'es',
        generatedCode: {
          constBindings: true,
        },
      },
    },
  },
  esbuild: {
    legalComments: 'none',
  },
  define: {
    // Disable HMR in production
    'import.meta.hot': 'undefined',
  },
});
