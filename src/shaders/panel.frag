// panel.frag — System panel edge-lighting fragment shader
// Panel surface is dark. Edges glow with the current state accent color.

uniform vec3  uSurfaceColor;  // COLORS.panel (#0D0F1A)
uniform vec3  uEdgeColor;     // state accent color (blue/amber/green)
uniform float uEdgeIntensity; // 0–1, how bright the edge glow is
uniform float uActive;        // 0.0 → 1.0 (lerped when panel activates)
uniform float uTime;          // elapsed seconds (for subtle edge pulse)

varying vec2  vUv;
varying vec3  vNormal;

// Distance from the nearest UV edge [0, 0.5]
float edgeDistance(vec2 uv) {
  vec2 fromEdge = min(uv, 1.0 - uv);
  return min(fromEdge.x, fromEdge.y);
}

void main() {
  // Panel surface: flat dark fill
  vec3 surface = uSurfaceColor;

  // Edge glow: brightest at UV boundary, falls off inward
  float edgeDist  = edgeDistance(vUv);
  float edgeWidth = 0.04; // relative to UV [0,1]
  float edgeMask  = 1.0 - smoothstep(0.0, edgeWidth, edgeDist);

  // Subtle pulse on active panels
  float pulse = 1.0 + sin(uTime * 2.0) * 0.08 * uActive;
  float glow  = edgeMask * uEdgeIntensity * uActive * pulse;

  vec3 col = surface + uEdgeColor * glow;

  // Corner brightening — intersection of both edge axes
  vec2  fromEdge2 = min(vUv, 1.0 - vUv);
  float corner    = (1.0 - smoothstep(0.0, edgeWidth * 1.5, fromEdge2.x))
                  * (1.0 - smoothstep(0.0, edgeWidth * 1.5, fromEdge2.y));
  col += uEdgeColor * corner * uActive * 0.5;

  // Panel face alpha — fully opaque surface, slight transparency at edges
  float alpha = mix(0.92, 1.0, 1.0 - edgeMask * 0.5);

  gl_FragColor = vec4(col, alpha * uActive);
}
