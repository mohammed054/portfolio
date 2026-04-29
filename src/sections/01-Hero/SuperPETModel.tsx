import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei/core/Gltf.js';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MODEL_PATHS } from '../../utils/constants';

const MODEL_PATH = MODEL_PATHS.heroComputer;

type MonitorScenePainter = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  alpha: number,
) => void;

const MONITOR_IMAGE_SOURCES = [
  '/images/carousel/project-01-main.jpg',
  '/images/carousel/project-02-main.jpg',
  '/images/carousel/project-11-main.jpg',
];

function createMonitorTexture(animated: boolean, onUpdate?: () => void) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 576;

  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  if (!ctx) {
    return {
      texture,
      cleanup: () => {
        texture.dispose();
      },
    };
  }

  const drawDesignScene: MonitorScenePainter = (context, width, height, _time, alpha) => {
    context.save();
    context.globalAlpha = alpha;

    context.fillStyle = '#efe7d9';
    context.fillRect(0, 0, width, height);

    const mapGradient = context.createLinearGradient(0, 0, width * 0.22, height);
    mapGradient.addColorStop(0, '#5aa39d');
    mapGradient.addColorStop(1, '#2f6f68');
    context.fillStyle = mapGradient;
    context.fillRect(0, 0, width * 0.22, height);

    context.fillStyle = 'rgba(255, 255, 255, 0.55)';
    for (let dot = 0; dot < 24; dot += 1) {
      const px = width * 0.03 + (dot % 5) * width * 0.035;
      const py = height * 0.12 + Math.floor(dot / 5) * height * 0.11;
      context.beginPath();
      context.arc(px, py, 3, 0, Math.PI * 2);
      context.fill();
    }

    context.lineWidth = 28;
    context.strokeStyle = '#d85ca8';
    context.beginPath();
    context.arc(width * 0.34, height * 0.38, width * 0.16, 0.2, Math.PI * 1.72);
    context.stroke();

    context.lineWidth = 30;
    context.strokeStyle = '#f3efe6';
    context.beginPath();
    context.arc(
      width * 0.6,
      height * 0.34,
      width * 0.14,
      Math.PI * 0.15,
      Math.PI * 1.82,
    );
    context.stroke();

    context.fillStyle = '#161616';
    context.font = `900 ${Math.round(width * 0.09)}px "Arial Black", serif`;
    context.fillText('Design', width * 0.06, height * 0.8);
    context.fillText('is Funny', width * 0.08, height * 0.9);

    context.restore();
  };

  const drawShowroomScene: MonitorScenePainter = (context, width, height, _time, alpha) => {
    context.save();
    context.globalAlpha = alpha;

    const wallGradient = context.createLinearGradient(0, 0, 0, height);
    wallGradient.addColorStop(0, '#1f252d');
    wallGradient.addColorStop(1, '#0d0f13');
    context.fillStyle = wallGradient;
    context.fillRect(0, 0, width, height);

    context.fillStyle = '#13151b';
    context.beginPath();
    context.ellipse(width * 0.5, height * 0.92, width * 0.34, height * 0.08, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = '#bcae9c';
    context.beginPath();
    context.moveTo(width * 0.16, height * 0.82);
    context.quadraticCurveTo(width * 0.48, height * 0.56, width * 0.82, height * 0.82);
    context.lineTo(width * 0.82, height * 0.92);
    context.lineTo(width * 0.16, height * 0.92);
    context.closePath();
    context.fill();

    context.fillStyle = '#ded6cb';
    context.beginPath();
    context.moveTo(width * 0.18, height * 0.24);
    context.quadraticCurveTo(width * 0.5, height * 0.06, width * 0.82, height * 0.24);
    context.lineTo(width * 0.82, height * 0.8);
    context.quadraticCurveTo(width * 0.5, height * 0.54, width * 0.18, height * 0.8);
    context.closePath();
    context.fill();

    context.fillStyle = '#2a2d35';
    context.fillRect(width * 0.22, height * 0.46, width * 0.18, height * 0.06);
    context.fillRect(width * 0.46, height * 0.42, width * 0.2, height * 0.09);
    context.fillRect(width * 0.52, height * 0.62, width * 0.12, height * 0.04);

    context.fillStyle = '#7b8d7d';
    context.beginPath();
    context.ellipse(width * 0.52, height * 0.74, width * 0.18, height * 0.06, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = '#c5a26a';
    context.fillRect(width * 0.64, height * 0.3, width * 0.026, height * 0.18);
    context.fillRect(width * 0.67, height * 0.32, width * 0.018, height * 0.18);

    context.fillStyle = '#0a0b0d';
    context.beginPath();
    context.arc(width * 0.66, height * 0.26, width * 0.04, 0, Math.PI * 2);
    context.fill();

    context.restore();
  };

  const drawOrbitScene: MonitorScenePainter = (context, width, height, time, alpha) => {
    context.save();
    context.globalAlpha = alpha;

    const baseGradient = context.createRadialGradient(
      width * 0.48,
      height * 0.44,
      width * 0.08,
      width * 0.48,
      height * 0.44,
      width * 0.62,
    );
    baseGradient.addColorStop(0, '#f5ff92');
    baseGradient.addColorStop(0.35, '#a8ce6f');
    baseGradient.addColorStop(0.7, '#2d5a42');
    baseGradient.addColorStop(1, '#1c2d33');
    context.fillStyle = baseGradient;
    context.fillRect(0, 0, width, height);

    context.fillStyle = '#dfe7a3';
    context.beginPath();
    context.moveTo(width * 0.12, height * 0.18);
    context.lineTo(width * 0.34, height * 0.08);
    context.lineTo(width * 0.62, height * 0.12);
    context.lineTo(width * 0.84, height * 0.32);
    context.lineTo(width * 0.76, height * 0.56);
    context.lineTo(width * 0.58, height * 0.72);
    context.lineTo(width * 0.3, height * 0.68);
    context.lineTo(width * 0.12, height * 0.48);
    context.closePath();
    context.fill();

    context.strokeStyle = '#c7924b';
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(width * 0.16, height * 0.62);
    context.lineTo(width * 0.64, height * 0.24);
    context.lineTo(width * 0.86, height * 0.44);
    context.stroke();

    const pulse = 0.92 + Math.sin(time * 2.4) * 0.08;
    for (let index = 0; index < 8; index += 1) {
      const px = width * (0.24 + (index % 4) * 0.16);
      const py = height * (0.28 + Math.floor(index / 4) * 0.18);
      context.fillStyle = '#1c2d33';
      context.fillRect(px - 18, py - 12, 36, 24);
      context.fillStyle = '#f7f0c6';
      context.fillRect(px - 16, py - 10, 32, 20);
      context.fillStyle = '#21323b';
      context.font = `600 ${Math.round(width * 0.018)}px Arial`;
      context.fillText(`NODE ${index + 1}`, px - 12, py + 4);

      context.strokeStyle = `rgba(255, 255, 255, ${0.18 * pulse})`;
      context.strokeRect(px - 21, py - 15, 42, 30);
    }

    context.restore();
  };

  const painters = [drawDesignScene, drawShowroomScene, drawOrbitScene];
  const monitorImages = MONITOR_IMAGE_SOURCES.map((source) => {
    const image = new Image();
    image.src = source;
    return image;
  });
  const cleanupCallbacks: Array<() => void> = [];
  let rafId = 0;
  let lastRenderTime = -Infinity;

  const drawFrame = (time: number) => {
    const { width, height } = canvas;
    const cycleDuration = 4.8;
    const cyclePosition = time / cycleDuration;
    const currentIndex = Math.floor(cyclePosition) % painters.length;
    const nextIndex = (currentIndex + 1) % painters.length;
    const mix = cyclePosition - Math.floor(cyclePosition);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#06090d';
    ctx.fillRect(0, 0, width, height);

    const currentImage = monitorImages[currentIndex];
    const nextImage = monitorImages[nextIndex];
    const currentLoaded = currentImage?.complete && currentImage.naturalWidth > 0;
    const nextLoaded = nextImage?.complete && nextImage.naturalWidth > 0;

    if (currentLoaded || nextLoaded) {
      const drawImageFrame = (image: HTMLImageElement, alpha: number) => {
        if (!(image.complete && image.naturalWidth > 0)) {
          return;
        }

        ctx.save();
        ctx.globalAlpha = alpha;

        const imageRatio = image.naturalWidth / image.naturalHeight;
        const canvasRatio = width / height;

        let drawWidth = width;
        let drawHeight = height;
        let offsetX = 0;
        let offsetY = 0;

        if (imageRatio > canvasRatio) {
          drawHeight = height;
          drawWidth = height * imageRatio;
          offsetX = (width - drawWidth) * 0.5;
        } else {
          drawWidth = width;
          drawHeight = width / imageRatio;
          offsetY = (height - drawHeight) * 0.5;
        }

        ctx.filter = 'saturate(0.92) contrast(1.08) brightness(0.94)';
        ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
        ctx.restore();
      };

      drawImageFrame(currentImage, 1 - mix);
      drawImageFrame(nextImage, mix);

      ctx.save();
      const vignetteOverlay = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        width * 0.12,
        width * 0.5,
        height * 0.52,
        width * 0.74,
      );
      vignetteOverlay.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignetteOverlay.addColorStop(1, 'rgba(0, 0, 0, 0.34)');
      ctx.fillStyle = vignetteOverlay;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    } else {
      painters[currentIndex](ctx, width, height, time, 1 - mix);
      painters[nextIndex](ctx, width, height, time, mix);
    }

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const sweepGradient = ctx.createLinearGradient(0, 0, width, height);
    sweepGradient.addColorStop(0, 'rgba(132, 255, 245, 0)');
    sweepGradient.addColorStop(
      0.52 + Math.sin(time * 0.6) * 0.06,
      'rgba(132, 255, 245, 0.18)',
    );
    sweepGradient.addColorStop(1, 'rgba(132, 255, 245, 0)');
    ctx.fillStyle = sweepGradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(202, 255, 239, 0.16)';
    for (let scanline = 0; scanline < height; scanline += 4) {
      ctx.beginPath();
      ctx.moveTo(0, scanline);
      ctx.lineTo(width, scanline);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    const vignette = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      width * 0.1,
      width * 0.5,
      height * 0.5,
      width * 0.72,
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.52)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    texture.needsUpdate = true;
    onUpdate?.();
  };

  const renderOnce = () => {
    drawFrame(0);
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
      if (document.visibilityState === 'visible' && timestamp - lastRenderTime >= 1000 / 12) {
        drawFrame(timestamp * 0.001);
        lastRenderTime = timestamp;
      }

      rafId = window.requestAnimationFrame(render);
    };

    drawFrame(0);
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
          color: new THREE.Color('#e9fff8'),
          map: screenTexture,
          emissive: new THREE.Color('#8affef'),
          emissiveMap: screenTexture,
          emissiveIntensity: 1.2,
          metalness: 0.12,
          roughness: 0.18,
          toneMapped: false,
        });

        disposableMaterials.push(screenMaterial);
        mesh.material = screenMaterial;
      } else if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((material) => {
          const clonedMaterial = (material as THREE.MeshStandardMaterial).clone();
          clonedMaterial.envMapIntensity = 1.05;
          clonedMaterial.roughness = Math.min(clonedMaterial.roughness ?? 0.72, 0.74);
          disposableMaterials.push(clonedMaterial);
          return clonedMaterial;
        });
      } else if (mesh.material) {
        const clonedMaterial = (mesh.material as THREE.MeshStandardMaterial).clone();
        clonedMaterial.envMapIntensity = 1.05;
        clonedMaterial.roughness = Math.min(clonedMaterial.roughness ?? 0.72, 0.74);
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
  }, [animated, scene]);

  useFrame((state) => {
    if (!animated || !groupRef.current) {
      return;
    }

    const time = state.clock.elapsedTime;
    groupRef.current.position.y = -0.9 + Math.sin(time * 0.45) * 0.028;
    groupRef.current.rotation.y = -0.68 + Math.sin(time * 0.28) * 0.03;
    groupRef.current.rotation.x = 0.01 + Math.sin(time * 0.2) * 0.01;
  });

  return (
    <group
      ref={groupRef}
      position={[2.28, -0.94, -0.24]}
      rotation={[0.02, -0.68, 0]}
      scale={[1.01, 1.01, 1.01]}
    />
  );
}

useGLTF.preload(MODEL_PATH);

export default SuperPETModel;
