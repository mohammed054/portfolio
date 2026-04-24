/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.glb' {
  const src: string;
  export default src;
}
