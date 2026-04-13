// Allow importing GLSL shader files as module strings
// These are handled by the webpack 'asset/source' loader in next.config.ts

declare module '*.vert' {
  const src: string;
  export default src;
}

declare module '*.frag' {
  const src: string;
  export default src;
}

declare module '*.glsl' {
  const src: string;
  export default src;
}

// Augment Window for Three.js WebGL context loss handling
interface Window {
  __hassoun_audio_started?: boolean;
}
