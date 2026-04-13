import { DragonSpine } from './DragonSpine';

// ─────────────────────────────────────────────────────────────────────────────
// DRAGON RENDERER
// Pure canvas 2D draw calls. No React. No DOM.
// Takes a DragonSpine instance and renders it each frame.
// ─────────────────────────────────────────────────────────────────────────────

export class DragonRenderer {
  drawDragon(ctx: CanvasRenderingContext2D, spine: DragonSpine): void {
    const segments = spine.getSegments();
    const speed    = spine.getHeadVelocity();

    // ── Body segments — draw tail→head so head renders on top ──
    for (let i = segments.length - 1; i >= 0; i--) {
      // Body width: widest at segment 6 (shoulders), tapers toward head & tail
      const shoulderCurve = Math.exp(-Math.pow((i - 6) / 8, 2));
      const w = 4 + shoulderCurve * 14;

      const prev  = segments[i > 0 ? i - 1 : 0];
      const angle = Math.atan2(
        segments[i].y - prev.y,
        segments[i].x - prev.x
      );

      ctx.save();
      ctx.translate(segments[i].x, segments[i].y);
      ctx.rotate(angle + Math.PI / 2);

      // Segment body fill
      ctx.beginPath();
      ctx.ellipse(0, 0, w * 0.5, w, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(26, 16, 64, ${0.6 + shoulderCurve * 0.3})`; // --dragon-body
      ctx.fill();

      // Bioluminescent rim light — intensity scales with movement speed
      const glowAlpha = Math.min(0.6, 0.1 + speed * 0.025);
      ctx.strokeStyle = `rgba(0, 255, 148, ${glowAlpha})`; // --dragon-accent
      ctx.lineWidth   = 0.8;
      ctx.stroke();

      ctx.restore();
    }

    // ── Spine inner glow — subtle line connecting all segments ──
    if (segments.length > 1) {
      ctx.beginPath();
      ctx.moveTo(segments[0].x, segments[0].y);
      for (let i = 1; i < segments.length; i++) {
        const midX = (segments[i - 1].x + segments[i].x) / 2;
        const midY = (segments[i - 1].y + segments[i].y) / 2;
        ctx.quadraticCurveTo(segments[i - 1].x, segments[i - 1].y, midX, midY);
      }
      const spineAlpha = Math.min(0.4, 0.05 + speed * 0.02);
      ctx.strokeStyle = `rgba(0, 255, 148, ${spineAlpha})`;
      ctx.lineWidth   = 1.2;
      ctx.stroke();
    }

    // ── Eyes ──
    const head  = segments[0];
    const neck  = segments[1] ?? head;
    const angle = Math.atan2(head.y - neck.y, head.x - neck.x);
    const eyeOffset = 5;

    for (const side of [-1, 1]) {
      const ex = head.x + Math.cos(angle + side * 1.4) * eyeOffset;
      const ey = head.y + Math.sin(angle + side * 1.4) * eyeOffset;

      // Sclera
      ctx.beginPath();
      ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fill();

      // Pupil — looks toward cursor (ahead of head direction)
      ctx.beginPath();
      ctx.arc(
        ex + Math.cos(angle) * 0.8,
        ey + Math.sin(angle) * 0.8,
        1.2,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = '#04040A';
      ctx.fill();

      // Bioluminescent eye glow
      const eyeGlow = Math.min(0.8, 0.2 + speed * 0.04);
      ctx.beginPath();
      ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 148, ${eyeGlow})`;
      ctx.lineWidth   = 0.5;
      ctx.stroke();
    }

    // ── Wing fins — at segments 4 and 6 ──
    for (const wingIdx of [4, 6]) {
      if (wingIdx >= segments.length) continue;
      const s = segments[wingIdx];
      const p = segments[wingIdx - 1] ?? s;
      const bodyAngle = Math.atan2(s.y - p.y, s.x - p.x);

      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(bodyAngle + side * 1.1);

        // Fin as bezier curve
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          side * 20, -15,
          side * 35, -5,
          side * 28,  10
        );
        ctx.bezierCurveTo(side * 20, 20, side * 8, 8, 0, 0);

        ctx.fillStyle   = 'rgba(26, 16, 64, 0.5)';
        ctx.fill();
        const finGlow = Math.min(0.25, 0.05 + speed * 0.015);
        ctx.strokeStyle = `rgba(0, 255, 148, ${finGlow})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();

        ctx.restore();
      }
    }

    // ── Tail spikes — last 3 segments ──
    const tailStart = Math.max(0, segments.length - 4);
    for (let i = tailStart; i < segments.length - 1; i++) {
      const s     = segments[i];
      const next  = segments[i + 1];
      const ta    = Math.atan2(next.y - s.y, next.x - s.x);
      const taper = 1 - (i - tailStart) / 4;

      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(ta + side * 1.3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(side * 8 * taper, -12 * taper);
        ctx.lineTo(side * 3 * taper, 0);
        ctx.closePath();
        ctx.fillStyle   = 'rgba(26, 16, 64, 0.6)';
        ctx.fill();
        ctx.strokeStyle = `rgba(0, 255, 148, 0.08)`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}
