// ============================================================
// SHADER REBUILD — Film Grain Overlay
// src/components/shared/GrainOverlay.tsx
// ============================================================

import { useEffect, useRef } from 'react';

/**
 * A fixed full-viewport canvas that renders animated film grain over
 * the entire site at all times. z-index: 9000 (above content, below navbar).
 *
 * The grain is regenerated every frame — static grain looks wrong.
 * Performance trade-off is acceptable at this intensity (alpha 18/255 ≈ 7%).
 *
 * If perf becomes a concern:
 *   Option A — render at 50% resolution and CSS scale-up.
 *   Option B — pre-generate 10 frames and cycle at 12fps.
 */
export function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function drawGrain() {
      if (!canvas || !ctx) return;

      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 30; // grain intensity 0–30
        data[i]     = v; // R
        data[i + 1] = v; // G
        data[i + 2] = v; // B
        data[i + 3] = 18; // A ≈ 7% opacity
      }

      ctx.putImageData(imageData, 0, 0);
      animFrame = requestAnimationFrame(drawGrain);
    }

    resize();
    window.addEventListener('resize', resize);
    drawGrain();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-grain)' as unknown as number,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
