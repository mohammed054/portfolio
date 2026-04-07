'use client';

import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { MOTION } from '@/lib/motionConfig';
import { useSystemStore } from '@/store/systemStore';

export const Effects = () => {
  const progress = useSystemStore((state) => state.progress);
  const reducedMotion = useSystemStore((state) => state.reducedMotion);

  if (reducedMotion) {
    return null;
  }

  return (
    <EffectComposer multisampling={0} depthBuffer={false} enableNormalPass={false}>
      <Bloom
        intensity={MOTION.bloomIntensityBase + progress * MOTION.bloomIntensityScale}
        luminanceThreshold={MOTION.bloomThreshold}
        luminanceSmoothing={MOTION.bloomSmoothing}
        mipmapBlur
      />
      <Vignette
        blendFunction={BlendFunction.NORMAL}
        offset={MOTION.vignetteOffset}
        darkness={MOTION.vignetteDarkness}
      />
    </EffectComposer>
  );
};
