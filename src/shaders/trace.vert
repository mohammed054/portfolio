// trace.vert — Data trace line vertex shader
// Passes UV coordinates for the fragment shader to animate the trace.

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
