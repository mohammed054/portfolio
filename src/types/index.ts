import * as THREE from 'three';

export interface CameraConfig {
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  duration: number;
}

export interface SectionScrollConfig {
  id: string;
  start: string;
  end: string;
  pin: boolean;
  scrub: number;
  camera?: CameraConfig;
}

export interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  year: string;
  description: string;
  color: string;
}

export interface SkillNode {
  id: string;
  label: string;
  domain: 'frontend' | 'backend' | 'devops' | 'design';
  level: number; // 0–1
  position: [number, number, number];
}

export interface TimelineMilestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
}
