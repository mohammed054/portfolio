/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_3D: string;
  readonly VITE_ENABLE_GRAIN: string;
  readonly VITE_ENABLE_PRELOADER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}