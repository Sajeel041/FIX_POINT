import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    rollupOptions: {
      output: {
        format: 'es',
        // Prevent eval usage
        generatedCode: {
          constBindings: true,
        },
      },
    },
  },
  esbuild: {
    // Avoid eval in esbuild
    legalComments: 'none',
  },
});
