import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Remove HMR completely
      fastRefresh: false,
    })
  ],
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
        // Remove any HMR-related code
        manualChunks: undefined,
      },
      // Exclude HMR client from build
      external: [],
    },
    // Ensure no dev code is included
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  esbuild: {
    legalComments: 'none',
    // Drop console and debugger in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  define: {
    // Completely disable HMR and dev mode
    'import.meta.hot': 'undefined',
    'import.meta.env.DEV': 'false',
    'import.meta.env.PROD': 'true',
    'process.env.NODE_ENV': '"production"',
    // Prevent WebSocket connections
    'global': 'globalThis',
  },
  // Ensure HMR is completely disabled
  optimizeDeps: {
    exclude: ['@vitejs/plugin-react'],
  },
});
