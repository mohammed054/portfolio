varying vec2 vUv;
uniform float uTime;
uniform float uIntensity;

float random(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453;
}

void main() {
  vec2 uv = vUv;
  float noise = random(uv + uTime) * uIntensity;
  
  gl_FragColor = vec4(noise, noise, noise, 1.0);
}