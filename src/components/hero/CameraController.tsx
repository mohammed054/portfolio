'use client';
import { useFrame, useThree } from '@react-three/fiber';
import { MutableRefObject, useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function CameraController({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const { camera } = useThree();

  const posCurve = useMemo(()=>new THREE.CatmullRomCurve3([
    new THREE.Vector3( 0.0,  7.5, 30.0),
    new THREE.Vector3( 2.4,  5.8, 24.0),
    new THREE.Vector3(-1.8,  4.0, 17.5),
    new THREE.Vector3( 1.2,  2.4, 12.0),
    new THREE.Vector3(-0.5,  1.2,  8.0),
    new THREE.Vector3( 0.3,  0.5,  5.5),
    new THREE.Vector3( 0.0,  0.1,  3.2),
    new THREE.Vector3( 0.0, -0.4,  0.5),
  ],false,'catmullrom',0.5),[]);

  const lookCurve = useMemo(()=>new THREE.CatmullRomCurve3([
    new THREE.Vector3( 0.0,-0.6, 0.0),
    new THREE.Vector3( 0.1,-0.5,-1.0),
    new THREE.Vector3(-0.1,-0.3,-1.5),
    new THREE.Vector3( 0.0,-0.1,-2.0),
    new THREE.Vector3( 0.0, 0.0,-3.0),
    new THREE.Vector3( 0.0, 0.0,-4.0),
    new THREE.Vector3( 0.0, 0.0,-4.5),
    new THREE.Vector3( 0.0, 0.0,-5.0),
  ],false,'catmullrom',0.5),[]);

  const posS  = useRef(new THREE.Vector3(0,7.5,30));
  const lookS = useRef(new THREE.Vector3(0,-0.6,0));
  const posT  = useRef(new THREE.Vector3());
  const lookT = useRef(new THREE.Vector3());

  useFrame(()=>{
    const raw = THREE.MathUtils.clamp(scrollRef.current,0,1);
    const s = THREE.MathUtils.smootherstep(raw,0,1);
    const t = s*s*(3-2*s); // double-smootherstep

    posCurve.getPointAt(t,  posT.current);
    lookCurve.getPointAt(t, lookT.current);

    const mhF = THREE.MathUtils.smootherstep(raw,0.80,0.94);
    if(mhF>0) lookT.current.lerp(new THREE.Vector3(0,0,-5),mhF);

    posS.current.lerp(posT.current,   0.052);
    lookS.current.lerp(lookT.current, 0.052);

    camera.position.copy(posS.current);
    camera.lookAt(lookS.current);

    const dive = THREE.MathUtils.smootherstep(raw,0.68,1.0);
    camera.rotation.z = dive*0.025;
  });

  return null;
}
