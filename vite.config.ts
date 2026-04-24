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
    },
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 3000,
  },
  optimizeDeps: {
    exclude: ['@react-three/fiber', '@react-three/drei'],
  },
  server: {
    host: true,
    port: 5173,
  },
});
