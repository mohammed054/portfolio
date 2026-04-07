// grid.frag — Grid substrate fragment shader
// Renders a subtle computational grid that reacts to system progress.

uniform float uProgress;   // global system progress [0,1]
uniform float uTime;       // elapsed seconds
uniform vec3  uGridColor;  // COLORS.bgGrid
uniform vec3  uBgColor;    // COLORS.bg

varying vec2 vUv;
varying vec3 vWorldPosition;

// Returns grid line intensity at a given UV scale
float grid(vec2 uv, float scale) {
  vec2 lines = abs(fract(uv * scale) - 0.5);
  float d = min(lines.x, lines.y);
  return 1.0 - smoothstep(0.0, 0.02, d);
}

// Radial distance fade — grid fades toward edges
float radialFade(vec2 uv) {
  float d = length(uv - 0.5) * 2.0;
  return 1.0 - smoothstep(0.5, 1.0, d);
}

void main() {
  // Major grid: every 1 unit (scale 10.0 on a 200x200 plane mapped 0→1)
  float major = grid(vUv, 10.0) * 0.035;

  // Minor grid: every 0.25 unit — fades in as system activates
  float minor = grid(vUv, 40.0) * 0.015 * uProgress;

  float gridStrength = major + minor;

  // Subtle outward pulse from center based on time
  float dist  = length(vUv - 0.5);
  float pulse = sin(dist * 20.0 - uTime * 1.5) * 0.008 * uProgress;

  // Radial fade — grid is brighter at center
  float fade = radialFade(vUv);

  vec3 col = mix(uBgColor, uGridColor, (gridStrength + pulse) * fade);

  // Vignette toward edges
  float vignette = 1.0 - smoothstep(0.3, 0.9, length(vUv - 0.5));
  col *= (0.6 + vignette * 0.4);

  gl_FragColor = vec4(col, 1.0);
}
