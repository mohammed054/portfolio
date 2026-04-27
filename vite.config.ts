import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@sections': path.resolve(__dirname, './src/sections'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      'use-sync-external-store/shim/with-selector': path.resolve(
        __dirname,
        './src/shims/useSyncExternalStoreWithSelector.ts',
      ),
      'use-sync-external-store/shim/with-selector.js': path.resolve(
        __dirname,
        './src/shims/useSyncExternalStoreWithSelector.ts',
      ),
      scheduler: path.resolve(__dirname, './src/shims/scheduler.ts'),
      'scheduler/index.js': path.resolve(__dirname, './src/shims/scheduler.ts'),
    },
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 3000,
  },
  optimizeDeps: {
    exclude: ['@react-three/fiber', '@react-three/drei'],
    needsInterop: [
      'use-sync-external-store/shim/with-selector',
      'use-sync-external-store/shim/with-selector.js',
    ],
  },
  server: {
    host: true,
    port: 5173,
  },
});
