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
    // Disable HMR in production and development builds
    'import.meta.hot': 'undefined',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  // Explicitly disable HMR for production builds
  ...(process.env.NODE_ENV === 'production' && {
    server: {
      hmr: false,
    },
  }),
});
