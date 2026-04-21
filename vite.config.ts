import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [react(), glsl()],
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.glsl'],
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2020',
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: {
          three:  ['three'],
          r3f:    ['@react-three/fiber', '@react-three/drei'],
          gsap:   ['gsap'],
          vendor: ['react', 'react-dom', 'framer-motion'],
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  optimizeDeps: {
    exclude: ['@react-three/fiber', '@react-three/drei'],
  },
});