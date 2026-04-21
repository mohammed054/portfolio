import { Canvas } from '@react-three/fiber';
import { Environment, useProgress } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import SuperPETModel from './SuperPETModel';

function HeroScene() {
  const { progress } = useProgress();

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.2} />
      <spotLight
        position={[5, 5, 5]}
        intensity={1.5}
        angle={0.3}
        penumbra={1}
        color="#ffaa66"
      />
      <pointLight position={[-5, 2, 2]} intensity={0.8} color="#6666ff" />

      <SuperPETModel />

      <Environment preset="night" />

      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.6} />
        <ChromaticAberration offset={[0.001, 0.001]} />
      </EffectComposer>
    </Canvas>
  );
}

export default HeroScene;