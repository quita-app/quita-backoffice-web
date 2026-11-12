/// <reference types='vitest' />
import { nxReadySignal } from '@nx/vite/plugins/nx-ready-signal.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/analytics',
  server: {
    port: 4202,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/actuator/, '/actuator'),
      },
    },
  },
  preview: { port: 4302, host: 'localhost' },
  // In library mode Vite does NOT replace process.env.NODE_ENV, and React reads it.
  // Without this, the browser throws "ReferenceError: process is not defined".
  define: { 'process.env.NODE_ENV': JSON.stringify(mode) },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [react(), nxReadySignal()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  build: {
    outDir: '../../dist/apps/analytics',
    emptyOutDir: true,
    lib: {
      entry: 'src/main.tsx', // o arquivo que registra o custom element
      formats: ['es'], // um módulo ES: <script type="module"> ou import()
      fileName: () => 'quita-analytics.js', // nome fixo, o que o manifesto aponta
    },
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    name: 'analytics',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/analytics',
      provider: 'v8' as const,
    },
  },
}));
