import { useGLTF } from '@react-three/drei/core/Gltf.js';
import { MODEL_PATHS } from './constants';

export function preloadPhaseAssets(): void {
  useGLTF.preload(MODEL_PATHS.heroComputer);
  useGLTF.preload(MODEL_PATHS.shredderMachine);
}
