/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable StrictMode — double-invoke in dev creates two WebGL contexts → crash
  reactStrictMode: false,
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
    'postprocessing',
  ],
};

module.exports = nextConfig;
