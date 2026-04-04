export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function lerp(a, b, t) {
  return a + (b - a) * t
}

export function inverseLerp(a, b, value) {
  if (Math.abs(b - a) < Number.EPSILON) return 0
  return (value - a) / (b - a)
}

export function remap(value, inMin, inMax, outMin, outMax) {
  return lerp(outMin, outMax, clamp(inverseLerp(inMin, inMax, value), 0, 1))
}

export function progressRange(progress, start, end) {
  return clamp((progress - start) / (end - start), 0, 1)
}

export const range = progressRange

export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

export function normalizePointer(value, size) {
  return (value / size) * 2 - 1
}

export { resolveState } from './ranges.js'
