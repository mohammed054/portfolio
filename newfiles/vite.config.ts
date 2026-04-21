import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    glsl(), // enables importing .glsl files as strings
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@sections': path.resolve(__dirname, './src/sections'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.glsl'],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          gsap: ['gsap'],
          vendor: ['react', 'react-dom', 'framer-motion'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['@react-three/fiber', '@react-three/drei'],
  },
  server: {
    host: true,
    port: 5173,
  },
});
