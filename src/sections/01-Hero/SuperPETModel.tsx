import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei/core/Gltf.js';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MODEL_PATHS } from '../../utils/constants';

const MODEL_PATH = MODEL_PATHS.heroComputer;

const MONITOR_SCENES = [
  '/images/carousel/project-10-main.jpg',
  '/images/carousel/project-09-main.jpg',
  '/images/carousel/project-01-main.jpg',
  '/images/carousel/project-11-main.jpg',
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

  let drawWidth: number;
  let drawHeight: number;
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

function drawMonitorScene(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement | undefined,
  width: number,
  height: number,
  time: number,
  alpha: number,
) {
  context.save();
  context.globalAlpha = alpha;
  roundRect(context, 0, 0, width, height, 28);
  context.clip();

  const background = context.createRadialGradient(
    width * 0.5,
    height * 0.38,
    width * 0.05,
    width * 0.5,
    height * 0.5,
    width * 0.86,
  );
  background.addColorStop(0, '#24433d');
  background.addColorStop(0.3, '#152c27');
  background.addColorStop(0.72, '#050608');
  background.addColorStop(1, '#020203');
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  if (image && image.complete && image.naturalWidth > 0) {
    const driftX = Math.sin(time * 0.12) * width * 0.018;
    const driftY = Math.cos(time * 0.1) * height * 0.014;
    context.save();
    context.translate(driftX, driftY);
    context.filter = 'brightness(0.74) saturate(0.95) contrast(1.06)';
    drawCoverImage(context, image, -width * 0.03, -height * 0.03, width * 1.06, height * 1.06);
    context.filter = 'none';
    context.restore();
  } else {
    const fallbackGradient = context.createRadialGradient(
      width * 0.5,
      height * 0.45,
      width * 0.08,
      width * 0.5,
      height * 0.5,
      width * 0.8,
    );
    fallbackGradient.addColorStop(0, '#7caf81');
    fallbackGradient.addColorStop(0.48, '#375648');
    fallbackGradient.addColorStop(1, '#0a1012');
    context.fillStyle = fallbackGradient;
    context.fillRect(0, 0, width, height);
  }

  const glow = context.createRadialGradient(
    width * 0.52,
    height * 0.46,
    width * 0.04,
    width * 0.52,
    height * 0.46,
    width * 0.5,
  );
  glow.addColorStop(0, 'rgba(236, 255, 229, 0.045)');
  glow.addColorStop(1, 'rgba(232, 255, 236, 0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  const vignette = context.createRadialGradient(
    width * 0.52,
    height * 0.48,
    width * 0.16,
    width * 0.5,
    height * 0.5,
    width * 0.74,
  );
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.58)');
  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);

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
  texture.flipY = false;
  texture.center.set(0.5, 0.5);
  texture.rotation = Math.PI;

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

  MONITOR_SCENES.forEach((source) => {
    if (monitorImages.has(source)) {
      return;
    }

    const image = new Image();
    image.src = source;
    monitorImages.set(source, image);
  });

  const drawSceneByIndex = (sceneIndex: number, time: number, alpha: number) => {
    const sceneSource = MONITOR_SCENES[sceneIndex] ?? MONITOR_SCENES[0];
    drawMonitorScene(
      context,
      monitorImages.get(sceneSource),
      canvas.width,
      canvas.height,
      time,
      alpha,
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
    sweep.addColorStop(0.48 + Math.sin(time * 0.45) * 0.05, 'rgba(160, 255, 244, 0.045)');
    sweep.addColorStop(1, 'rgba(160, 255, 244, 0)');
    context.fillStyle = sweep;
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = 'source-over';

    context.strokeStyle = 'rgba(215, 255, 245, 0.08)';
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

function createFrontPanelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;

  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const panel = context.createLinearGradient(0, 154, 0, 402);
    panel.addColorStop(0, '#191919');
    panel.addColorStop(0.54, '#0f0f10');
    panel.addColorStop(1, '#050506');
    context.fillStyle = panel;
    roundRect(context, 2, 154, 508, 246, 8);
    context.fill();

    context.fillStyle = '#f1ead7';
    context.font = '900 54px Georgia, serif';
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText('HASSOUN', 54, 264);

    context.font = '900 78px Georgia, serif';
    context.textAlign = 'center';
    context.fillText('SuperPET', 284, 278);

    context.font = '700 22px Courier New, monospace';
    context.fillText('SP9000', 284, 220);

    context.font = '700 18px Courier New, monospace';
    context.textAlign = 'right';
    context.fillText('mohamed', 474, 246);
    context.fillText('portfolio', 474, 314);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.flipY = false;

  return texture;
}

function createKeyboardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;

  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const drawKey = (x: number, y: number, width: number, height: number, label = '') => {
      const gradient = context.createLinearGradient(x, y, x, y + height);
      gradient.addColorStop(0, '#191714');
      gradient.addColorStop(1, '#030303');
      context.fillStyle = gradient;
      roundRect(context, x, y, width, height, Math.min(width, height) * 0.28);
      context.fill();
      context.strokeStyle = 'rgba(244, 233, 205, 0.18)';
      context.lineWidth = 1.4;
      context.stroke();

      if (label) {
        context.fillStyle = '#d4c8a8';
        context.font = '700 18px Courier New, monospace';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(label, x + width * 0.5, y + height * 0.55);
      }
    };

    const labels = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
    let labelIndex = 0;

    for (let row = 0; row < 4; row += 1) {
      const keysInRow = row === 0 ? 12 : row === 1 ? 11 : row === 2 ? 10 : 9;
      const y = 182 + row * 54;
      const xOffset = 6 + row * 12;

      for (let column = 0; column < keysInRow; column += 1) {
        const isSpace = row === 3 && column === 4;
        const width = isSpace ? 74 : 38;
        const x = xOffset + column * 42 + (isSpace ? 0 : 0);
        drawKey(x, y, width, 42, isSpace ? '' : labels[labelIndex] ?? '');
        labelIndex += isSpace ? 0 : 1;
      }
    }

    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        drawKey(356 + column * 38, 180 + row * 54, 31, 42);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  return texture;
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
        materialNames.includes('screen');

      const tuneMaterial = (material: THREE.MeshStandardMaterial) => {
        material.envMapIntensity = 1.18;
        material.roughness = Math.min(material.roughness ?? 0.62, 0.6);

        if (material.name.toLowerCase().includes('front_texture')) {
          material.map = createFrontPanelTexture();
          material.color = new THREE.Color('#ffffff');
          material.roughness = 0.74;
          material.metalness = 0.02;
        }

        if (material.name.toLowerCase() === 'material') {
          material.map = createKeyboardTexture();
          material.color = new THREE.Color('#ffffff');
          material.roughness = 0.78;
          material.metalness = 0.02;
        }
      };

      if (isScreen) {
        const screenMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#eef8f4'),
          map: screenTexture,
          emissive: new THREE.Color('#7de0d7'),
          emissiveMap: screenTexture,
          emissiveIntensity: 0.72,
          metalness: 0.06,
          roughness: 0.14,
          toneMapped: false,
        });

        disposableMaterials.push(screenMaterial);
        mesh.material = screenMaterial;
      } else if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((material) => {
          const clonedMaterial = (material as THREE.MeshStandardMaterial).clone();
          tuneMaterial(clonedMaterial);
          disposableMaterials.push(clonedMaterial);
          return clonedMaterial;
        });
      } else if (mesh.material) {
        const clonedMaterial = (mesh.material as THREE.MeshStandardMaterial).clone();
        tuneMaterial(clonedMaterial);
        disposableMaterials.push(clonedMaterial);
        mesh.material = clonedMaterial;
      }

      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });

    const group = groupRef.current;
    if (group) {
      while (group.children.length > 0) {
        group.remove(group.children[0]);
      }
      group.add(clone);
    }

    invalidate();

    return () => {
      cleanup();
      disposableMaterials.forEach((material) => {
        const mappedMaterial = material as THREE.Material & { map?: THREE.Texture | null };
        mappedMaterial.map?.dispose();
        material.dispose();
      });

      if (group) {
        group.clear();
      }
    };
  }, [animated, invalidate, scene]);

  useFrame((state) => {
    if (!animated || !groupRef.current) {
      return;
    }

    const time = state.clock.elapsedTime;
    groupRef.current.position.y = -1.18 + Math.sin(time * 0.42) * 0.026;
    groupRef.current.rotation.y = -0.62 + Math.sin(time * 0.24) * 0.026;
    groupRef.current.rotation.x = 0.012 + Math.sin(time * 0.18) * 0.007;
  });

  return (
    <group
      ref={groupRef}
      position={[3.3, -1.18, -1.5]}
      rotation={[0.02, -0.62, 0]}
      scale={[0.9, 0.9, 0.9]}
    />
  );
}

useGLTF.preload(MODEL_PATH);

export default SuperPETModel;
