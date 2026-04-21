varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uProgress;
uniform float uShredderY;

float random(float x) {
  return fract(sin(x * 127.1) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  
  float stripWidth = 0.0075;
  float stripIndex = floor(uv.x / stripWidth);
  
  float belowShredder = max(0.0, uShredderY - uv.y);
  float shredZone = smoothstep(0.0, 0.4, belowShredder);
  
  float dispX = (random(stripIndex) - 0.5) * 0.02 * uProgress * shredZone;
  float dispY = (random(stripIndex + 100.0) - 0.5) * 0.005 * uProgress * shredZone;
  
  uv.x += dispX;
  uv.y += dispY;
  
  float inGap = step(0.85, fract(uv.x / stripWidth));
  
  vec4 color = texture2D(uTexture, uv);
  color.a *= (1.0 - inGap * uProgress * shredZone);
  
  gl_FragColor = color;
}