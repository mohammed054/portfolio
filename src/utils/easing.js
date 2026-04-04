export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export function easeInCubic(t) {
  return t * t * t
}

export function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4)
}

export function lenisEasing(t) {
  return Math.min(1, 1.001 - Math.pow(2, -10 * t))
}
