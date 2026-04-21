varying vec2 vUv;

uniform float uTime;
uniform float uDistortion;

void main() {
  vec2 uv = vUv - 0.5;
  float dist = dot(uv, uv);
  uv *= 1.0 + dist * uDistortion;
  uv += 0.5;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}