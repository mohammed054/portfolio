import * as THREE from 'three';

// Generate random points on sphere surface
export const randomSpherePoints = (count: number, radius: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random());
    positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
};

// Generate star positions in a large sphere
export const generateStarPositions = (count: number, spread: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }
  return positions;
};

// Generate star sizes with variation
export const generateStarSizes = (count: number): Float32Array => {
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    sizes[i] = Math.random() * 2 + 0.5;
  }
  return sizes;
};

// Compute skill node positions on a hemisphere
export const computeNodePositions = (
  count: number,
  radius: number
): THREE.Vector3[] => {
  const positions: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    positions.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      )
    );
  }
  return positions;
};

// Lerp between two Vector3
export const lerpV3 = (
  out: THREE.Vector3,
  a: THREE.Vector3,
  b: THREE.Vector3,
  t: number
) => {
  out.x = a.x + (b.x - a.x) * t;
  out.y = a.y + (b.y - a.y) * t;
  out.z = a.z + (b.z - a.z) * t;
  return out;
};

// Dispose Three.js object and its children
export const disposeObject = (obj: THREE.Object3D) => {
  obj.traverse((child) => {
    if ((child as THREE.Mesh).geometry) {
      (child as THREE.Mesh).geometry.dispose();
    }
    if ((child as THREE.Mesh).material) {
      const mat = (child as THREE.Mesh).material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => m.dispose());
      } else {
        (mat as THREE.Material).dispose();
      }
    }
  });
};

// Color constants (matching design tokens)
export const COLORS = {
  accentPrimary: new THREE.Color('#7A3CFF'),
  accentSecondary: new THREE.Color('#00D0FF'),
  textPrimary: new THREE.Color('#F4F7FF'),
  textSecondary: new THREE.Color('#7A89A8'),
  bgDeep: new THREE.Color('#000010'),
};
