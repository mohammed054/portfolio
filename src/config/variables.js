export const STATES = {
  IDLE:        { start: 0.00, end: 0.05 },
  ACTIVATING:  { start: 0.05, end: 0.15 },
  IDENTIFYING: { start: 0.15, end: 0.30 },
  ROUTING:     { start: 0.30, end: 0.50 },
  EXECUTING:   { start: 0.50, end: 0.75 },
  PROCESSING:  { start: 0.75, end: 0.90 },
  RESOLVED:    { start: 0.90, end: 1.00 },
}

export const CAMERA_PATH = {
  zStart: 100,
  zEnd:   0,
}

export const CAMERA_DAMPING = {
  position: 0.08,
  rotation: 0.06,
}

export const CAMERA_MOUSE = {
  strengthX: 0.5,
  strengthY: 0.3,
  damping:   0.05,
}

export const CAMERA_FOV = {
  default: 45,
  inspect: 38,
  wide:    55,
}

export const MOTION = {
  fast:   0.12,
  medium: 0.08,
  slow:   0.04,
}

export const SNAP = {
  strength:    0.18,
  threshold:   0.0008,
  returnSpeed: 0.12,
}

export const VARIANCE = {
  activationDelay:     0.06,
  packetSpeedVariance: 0.15,
}

export const GRID = {
  spacing: 40,
  opacity: 0.025,
  color:   '#0A0C12',
}

export const GRID_REACTIVITY = {
  pulseIntensity:   0.12,
  pulseDuration:    0.35,
  activationRadius: 80,
}

export const COLORS = {
  background: '#050507',
  panel:      '#0D0F1A',
  structure:  '#FFFFFF',
  data:       '#0066FF',
  activation: '#FF6B00',
  status:     '#00E676',
}

export const COLOR_STATE = {
  IDLE:        { data: 0.0,  activation: 0.0  },
  ACTIVATING:  { data: 0.2,  activation: 0.0  },
  IDENTIFYING: { data: 0.0,  activation: 0.85 },
  ROUTING:     { data: 1.0,  activation: 0.2  },
  EXECUTING:   { data: 0.75, activation: 0.3  },
  PROCESSING:  { data: 0.2,  activation: 0.95 },
  RESOLVED:    { data: 0.3,  activation: 0.0  },
}

export const COLOR_LIMITS = {
  maxData:       1.0,
  maxActivation: 0.95,
  idleMax:       0.05,
}

export const LIGHTING = {
  edgeBase:          0.4,
  edgeActiveBoost:   1.6,
  edgeIdleReduction: 0.25,
}

export const INTERACTION = {
  hoverStrength: 0.45,
  snapStrength:  0.35,
  clickImpulse:  0.6,
}

export const INTERACTION_STATE = {
  IDLE:        0.0,
  ACTIVATING:  0.2,
  IDENTIFYING: 0.05,
  ROUTING:     0.6,
  EXECUTING:   0.4,
  PROCESSING:  0.0,
  RESOLVED:    0.65,
}

export const DATA_FLOW = {
  speedBase:     0.65,
  speedVariance: 0.2,
  size:          0.045,
  spacing:       0.25,
}

export const PIPELINE = {
  flowSpeed:  0.85,
  stageDelay: 0.1,
}

export const TYPE = {
  nameScale:      12,
  roleScale:      5,
  depthOffset:    2.2,
  rotationOffset: 0.08,
}

export const DENSITY = {
  idle:        0.15,
  activating:  0.3,
  identifying: 0.35,
  routing:     0.7,
  executing:   0.9,
  processing:  0.5,
  resolved:    0.25,
}

export const SOUND = {
  humIdle:       0.08,
  humActive:     0.25,
  humProcessing: 0.45,
  click:         0.3,
  tick:          0.05,
}

export const SCROLL = {
  scrollHeight: 700,
  duration: 1.2,
}
