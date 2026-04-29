import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei/core/Gltf.js';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MODEL_PATHS } from '../../utils/constants';

const MODEL_PATH = MODEL_PATHS.heroComputer;

const MONITOR_SCENES = [
  [
    '/images/carousel/project-11-main.jpg',
    '/images/carousel/project-01-main.jpg',
    '/images/carousel/project-03-main.jpg',
  ],
  [
    '/images/carousel/project-02-main.jpg',
    '/images/carousel/project-06-main.jpg',
    '/images/carousel/project-07-main.jpg',
  ],
  [
    '/images/carousel/project-09-main.jpg',
    '/images/carousel/project-10-main.jpg',
    '/images/carousel/project-08-main.jpg',
  ],
] as const;

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const nextRadius = Math.min(radius, width * 0.5, height * 0.5);
  context.beginPath();
  context.moveTo(x + nextRadius, y);
  context.arcTo(x + width, y, x + width, y + height, nextRadius);
  context.arcTo(x + width, y + height, x, y + height, nextRadius);
  context.arcTo(x, y + height, x, y, nextRadius);
  context.arcTo(x, y, x + width, y, nextRadius);
  context.closePath();
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const boxRatio = width / height;

  let drawWidth = width;
  let drawHeight = height;
  let offsetX = x;
  let offsetY = y;

  if (imageRatio > boxRatio) {
    drawHeight = height;
    drawWidth = height * imageRatio;
    offsetX = x - (drawWidth - width) * 0.5;
  } else {
    drawWidth = width;
    drawHeight = width / imageRatio;
    offsetY = y - (drawHeight - height) * 0.5;
  }

  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

function drawMonitorPanel(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement | undefined,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number,
  brightness: number,
  glow: string,
) {
  context.save();
  context.translate(x + width * 0.5, y + height * 0.5);
  context.rotate(rotation);

  context.shadowColor = glow;
  context.shadowBlur = 22;
  context.shadowOffsetY = 10;

  context.fillStyle = '#040404';
  roundRect(context, -width * 0.5, -height * 0.5, width, height, 18);
  context.fill();

  context.clip();
  context.fillStyle = '#0b0d0f';
  context.fillRect(-width * 0.5, -height * 0.5, width, height);

  if (image && image.complete && image.naturalWidth > 0) {
    context.filter = `brightness(${brightness}) saturate(0.92) contrast(1.08)`;
    drawCoverImage(context, image, -width * 0.5, -height * 0.5, width, height);
    context.filter = 'none';
  } else {
    const fallbackGradient = context.createLinearGradient(
      -width * 0.5,
      -height * 0.5,
      width * 0.5,
      height * 0.5,
    );
    fallbackGradient.addColorStop(0, '#1d2c38');
    fallbackGradient.addColorStop(1, '#0d1218');
    context.fillStyle = fallbackGradient;
    context.fillRect(-width * 0.5, -height * 0.5, width, height);
  }

  context.fillStyle = 'rgba(5, 8, 12, 0.22)';
  context.fillRect(-width * 0.5, -height * 0.5, width, height);

  context.strokeStyle = 'rgba(255, 246, 227, 0.3)';
  context.lineWidth = 2;
  roundRect(context, -width * 0.5 + 1, -height * 0.5 + 1, width - 2, height - 2, 16);
  context.stroke();
  context.restore();
}

function drawWorkShowcaseScene(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  alpha: number,
  images: Array<HTMLImageElement | undefined>,
) {
  context.save();
  context.globalAlpha = alpha;

  const background = context.createRadialGradient(
    width * 0.58,
    height * 0.22,
    width * 0.04,
    width * 0.54,
    height * 0.56,
    width * 0.9,
  );
  background.addColorStop(0, '#203c36');
  background.addColorStop(0.24, '#152925');
  background.addColorStop(0.55, '#060709');
  background.addColorStop(1, '#010102');
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  const glow = context.createRadialGradient(
    width * 0.54,
    height * 0.56,
    width * 0.08,
    width * 0.5,
    height * 0.64,
    width * 0.55,
  );
  glow.addColorStop(0, 'rgba(133, 243, 228, 0.18)');
  glow.addColorStop(1, 'rgba(133, 243, 228, 0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  const horizonY = height * 0.44 + Math.sin(time * 0.18) * 4;
  context.strokeStyle = 'rgba(250, 238, 213, 0.78)';
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(width * 0.04, horizonY);
  context.lineTo(width * 0.96, horizonY);
  context.stroke();

  const floorGlow = context.createLinearGradient(0, horizonY, 0, height);
  floorGlow.addColorStop(0, 'rgba(255, 246, 223, 0.02)');
  floorGlow.addColorStop(1, 'rgba(0, 0, 0, 0.82)');
  context.fillStyle = floorGlow;
  context.fillRect(0, horizonY, width, height - horizonY);

  const drift = Math.sin(time * 0.22) * 6;
  drawMonitorPanel(
    context,
    images[0],
    width * 0.1 + drift * 0.35,
    height * 0.3,
    width * 0.21,
    height * 0.38,
    -0.17,
    0.92,
    'rgba(121, 214, 255, 0.18)',
  );
  drawMonitorPanel(
    context,
    images[1],
    width * 0.39,
    height * 0.16 + drift * 0.1,
    width * 0.24,
    height * 0.52,
    -0.02,
    1.08,
    'rgba(255, 255, 255, 0.22)',
  );
  drawMonitorPanel(
    context,
    images[2],
    width * 0.71 - drift * 0.25,
    height * 0.27,
    width * 0.17,
    height * 0.33,
    0.13,
    0.98,
    'rgba(140, 94, 255, 0.18)',
  );

  context.fillStyle = 'rgba(255, 248, 226, 0.8)';
  context.fillRect(width * 0.49, horizonY - height * 0.16, width * 0.022, height * 0.32);
  context.fillStyle = 'rgba(255, 248, 226, 0.08)';
  context.fillRect(width * 0.02, height * 0.06, width * 0.96, height * 0.88);

  context.restore();
}

function createMonitorTexture(animated: boolean, onUpdate?: () => void) {
  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 720;

  const context = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  if (!context) {
    return {
      texture,
      cleanup: () => {
        texture.dispose();
      },
    };
  }

  const monitorImages = new Map<string, HTMLImageElement>();
  const cleanupCallbacks: Array<() => void> = [];
  let rafId = 0;
  let lastRenderTime = -Infinity;

  MONITOR_SCENES.flat().forEach((source) => {
    if (monitorImages.has(source)) {
      return;
    }

    const image = new Image();
    image.src = source;
    monitorImages.set(source, image);
  });

  const drawSceneByIndex = (sceneIndex: number, time: number, alpha: number) => {
    const sceneSources = MONITOR_SCENES[sceneIndex] ?? MONITOR_SCENES[0];
    drawWorkShowcaseScene(
      context,
      canvas.width,
      canvas.height,
      time,
      alpha,
      sceneSources.map((source) => monitorImages.get(source)),
    );
  };

  const drawFrame = (time: number) => {
    const width = canvas.width;
    const height = canvas.height;

    context.clearRect(0, 0, width, height);
    context.save();
    roundRect(context, 0, 0, width, height, 34);
    context.clip();

    context.fillStyle = '#010102';
    context.fillRect(0, 0, width, height);

    const cycleDuration = 5.5;
    const cyclePosition = time / cycleDuration;
    const currentIndex = Math.floor(cyclePosition) % MONITOR_SCENES.length;
    const nextIndex = (currentIndex + 1) % MONITOR_SCENES.length;
    const mix = THREE.MathUtils.smootherstep(
      cyclePosition - Math.floor(cyclePosition),
      0,
      1,
    );

    drawSceneByIndex(currentIndex, time, 1 - mix * 0.92);
    drawSceneByIndex(nextIndex, time + 0.6, mix);

    context.globalCompositeOperation = 'screen';
    const sweep = context.createLinearGradient(0, 0, width, height);
    sweep.addColorStop(0, 'rgba(160, 255, 244, 0)');
    sweep.addColorStop(0.48 + Math.sin(time * 0.45) * 0.05, 'rgba(160, 255, 244, 0.14)');
    sweep.addColorStop(1, 'rgba(160, 255, 244, 0)');
    context.fillStyle = sweep;
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = 'source-over';

    context.strokeStyle = 'rgba(215, 255, 245, 0.12)';
    context.lineWidth = 1;
    for (let scanline = 0; scanline < height; scanline += 4) {
      context.beginPath();
      context.moveTo(0, scanline);
      context.lineTo(width, scanline);
      context.stroke();
    }

    const vignette = context.createRadialGradient(
      width * 0.52,
      height * 0.48,
      width * 0.12,
      width * 0.5,
      height * 0.5,
      width * 0.74,
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.54)');
    context.fillStyle = vignette;
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'rgba(255, 255, 255, 0.06)';
    context.fillRect(0, 0, width, height * 0.04);
    context.restore();

    texture.needsUpdate = true;
    onUpdate?.();
  };

  const renderOnce = () => {
    drawFrame(1.6);
  };

  monitorImages.forEach((image) => {
    if (image.complete && image.naturalWidth > 0) {
      return;
    }

    const handleLoad = () => {
      if (!animated) {
        renderOnce();
      }
    };

    image.addEventListener('load', handleLoad);
    cleanupCallbacks.push(() => image.removeEventListener('load', handleLoad));
  });

  if (animated) {
    const render = (timestamp: number) => {
      if (
        document.visibilityState === 'visible' &&
        timestamp - lastRenderTime >= 1000 / 10
      ) {
        drawFrame(timestamp * 0.001);
        lastRenderTime = timestamp;
      }

      rafId = window.requestAnimationFrame(render);
    };

    drawFrame(1.6);
    rafId = window.requestAnimationFrame(render);
  } else {
    renderOnce();
  }

  return {
    texture,
    cleanup: () => {
      window.cancelAnimationFrame(rafId);
      cleanupCallbacks.forEach((callback) => callback());
      texture.dispose();
    },
  };
}

function SuperPETModel({ animated = true }: { animated?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const clone = scene.clone(true);
    const { texture: screenTexture, cleanup } = createMonitorTexture(
      animated,
      animated ? undefined : invalidate,
    );
    const disposableMaterials: THREE.Material[] = [];

    clone.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) {
        return;
      }

      const mesh = child as THREE.Mesh;
      const name = mesh.name.toLowerCase();
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const materialNames = materials
        .map((material) => material?.name?.toLowerCase?.() ?? '')
        .join(' ');

      const isScreen =
        name.includes('screen') ||
        name.includes('monitor') ||
        name.includes('display') ||
        name.includes('crt') ||
        materialNames.includes('screen');

      if (isScreen) {
        const screenMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#f2fffb'),
          map: screenTexture,
          emissive: new THREE.Color('#97fff1'),
          emissiveMap: screenTexture,
          emissiveIntensity: 1.68,
          metalness: 0.1,
          roughness: 0.12,
          toneMapped: false,
        });

        disposableMaterials.push(screenMaterial);
        mesh.material = screenMaterial;
      } else if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((material) => {
          const clonedMaterial = (material as THREE.MeshStandardMaterial).clone();
          clonedMaterial.envMapIntensity = 1.18;
          clonedMaterial.roughness = Math.min(clonedMaterial.roughness ?? 0.62, 0.6);
          disposableMaterials.push(clonedMaterial);
          return clonedMaterial;
        });
      } else if (mesh.material) {
        const clonedMaterial = (mesh.material as THREE.MeshStandardMaterial).clone();
        clonedMaterial.envMapIntensity = 1.18;
        clonedMaterial.roughness = Math.min(clonedMaterial.roughness ?? 0.62, 0.6);
        disposableMaterials.push(clonedMaterial);
        mesh.material = clonedMaterial;
      }

      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });

    if (groupRef.current) {
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
      groupRef.current.add(clone);
    }

    invalidate();

    return () => {
      cleanup();
      disposableMaterials.forEach((material) => material.dispose());

      if (groupRef.current) {
        groupRef.current.clear();
      }
    };
  }, [animated, invalidate, scene]);

  useFrame((state) => {
    if (!animated || !groupRef.current) {
      return;
    }

    const time = state.clock.elapsedTime;
    groupRef.current.position.y = -0.98 + Math.sin(time * 0.42) * 0.026;
    groupRef.current.rotation.y = -0.62 + Math.sin(time * 0.24) * 0.026;
    groupRef.current.rotation.x = 0.012 + Math.sin(time * 0.18) * 0.008;
  });

  return (
    <group
      ref={groupRef}
      position={[2.52, -0.98, -0.14]}
      rotation={[0.02, -0.62, 0]}
      scale={[1.06, 1.06, 1.06]}
    />
  );
}

useGLTF.preload(MODEL_PATH);

export default SuperPETModel;
