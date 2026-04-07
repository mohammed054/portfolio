import * as THREE from 'three';
import { SystemState } from '@/types/system';

export const COLORS = {
  bg: 0x050507,
  bgGrid: 0x0a0c12,
  panel: 0x0d0f1a,
  panelEdge: 0x1a1d2e,
  panelActive: 0x141826,
  white: 0xffffff,
  blue: 0x0066ff,
  amber: 0xff6b00,
  green: 0x00e676,
  dragonBg: 0x04040a,
  dragonAccent: 0x00ff94,
  dragonBody: 0x1a1040,
} as const;

export const CSS_COLORS = {
  bg: '#050507',
  bgGrid: '#0A0C12',
  panel: '#0D0F1A',
  panelEdge: '#1A1D2E',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.55)',
  whiteGhost: 'rgba(255,255,255,0.08)',
  monoLabel: 'rgba(255,255,255,0.35)',
  blue: '#0066FF',
  blueGlow: 'rgba(0,102,255,0.25)',
  blueDim: 'rgba(0,102,255,0.12)',
  amber: '#FF6B00',
  amberGlow: 'rgba(255,107,0,0.20)',
  green: '#00E676',
  greenGlow: 'rgba(0,230,118,0.15)',
  dragonBg: '#04040A',
  dragonAccent: '#00FF94',
  dragonBody: '#1A1040',
} as const;

export const THREE_COLORS = {
  bg: new THREE.Color(COLORS.bg),
  bgGrid: new THREE.Color(COLORS.bgGrid),
  panel: new THREE.Color(COLORS.panel),
  panelEdge: new THREE.Color(COLORS.panelEdge),
  white: new THREE.Color(COLORS.white),
  blue: new THREE.Color(COLORS.blue),
  amber: new THREE.Color(COLORS.amber),
  green: new THREE.Color(COLORS.green),
} as const;

const STATE_THREE_COLORS: Record<SystemState, THREE.Color> = {
  [SystemState.Idle]: THREE_COLORS.white,
  [SystemState.Activating]: THREE_COLORS.blue,
  [SystemState.Identifying]: THREE_COLORS.amber,
  [SystemState.Routing]: THREE_COLORS.blue,
  [SystemState.Executing]: THREE_COLORS.blue,
  [SystemState.Processing]: THREE_COLORS.amber,
  [SystemState.Resolved]: THREE_COLORS.green,
};

const STATE_CSS_COLORS: Record<SystemState, string> = {
  [SystemState.Idle]: CSS_COLORS.white,
  [SystemState.Activating]: CSS_COLORS.blue,
  [SystemState.Identifying]: CSS_COLORS.amber,
  [SystemState.Routing]: CSS_COLORS.blue,
  [SystemState.Executing]: CSS_COLORS.blue,
  [SystemState.Processing]: CSS_COLORS.amber,
  [SystemState.Resolved]: CSS_COLORS.green,
};

const STATE_GLOW_CSS_COLORS: Record<SystemState, string> = {
  [SystemState.Idle]: CSS_COLORS.whiteGhost,
  [SystemState.Activating]: CSS_COLORS.blueGlow,
  [SystemState.Identifying]: CSS_COLORS.amberGlow,
  [SystemState.Routing]: CSS_COLORS.blueGlow,
  [SystemState.Executing]: CSS_COLORS.blueGlow,
  [SystemState.Processing]: CSS_COLORS.amberGlow,
  [SystemState.Resolved]: CSS_COLORS.greenGlow,
};

export const toThreeColor = (hex: number) => new THREE.Color(hex);

export const getStateColor = (state: SystemState): number => STATE_THREE_COLORS[state].getHex();

export const getStateColorCSS = (state: SystemState): string => STATE_CSS_COLORS[state];

export const getStateGlowCSS = (state: SystemState): string => STATE_GLOW_CSS_COLORS[state];

export const getStateThreeColor = (state: SystemState): THREE.Color =>
  STATE_THREE_COLORS[state];
