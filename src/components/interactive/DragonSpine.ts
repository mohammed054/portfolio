// ─────────────────────────────────────────────────────────────────────────────
// DRAGON SPINE
// Pure JS class — no React, no DOM.
// Simulates a chain of segments following a spring-physics head.
// Segment[0] = head, chases cursor. Each subsequent segment is constrained
// to be exactly SEGMENT_LENGTH away from the one before it.
// ─────────────────────────────────────────────────────────────────────────────

interface Segment {
  x: number;
  y: number;
}

interface Velocity {
  vx: number;
  vy: number;
}

export class DragonSpine {
  private readonly SEGMENTS       = 30;
  private readonly SEGMENT_LENGTH = 16;   // px
  private readonly HEAD_STIFFNESS = 0.10; // how fast head chases cursor
  private readonly HEAD_DAMPING   = 0.80; // velocity retention per frame

  private segments:   Segment[]  = [];
  private velocities: Velocity[] = [];
  private targetX = 0;
  private targetY = 0;

  constructor(startX: number, startY: number) {
    for (let i = 0; i < this.SEGMENTS; i++) {
      this.segments.push({ x: startX, y: startY + i * this.SEGMENT_LENGTH });
      this.velocities.push({ vx: 0, vy: 0 });
    }
  }

  setTarget(x: number, y: number): void {
    this.targetX = x;
    this.targetY = y;
  }

  update(): void {
    // Step 1: Move head toward cursor with spring physics
    const head = this.segments[0];
    const vel  = this.velocities[0];

    vel.vx += (this.targetX - head.x) * this.HEAD_STIFFNESS;
    vel.vy += (this.targetY - head.y) * this.HEAD_STIFFNESS;
    vel.vx *= this.HEAD_DAMPING;
    vel.vy *= this.HEAD_DAMPING;
    head.x += vel.vx;
    head.y += vel.vy;

    // Step 2: Constrain each segment to follow the one before it
    // Each segment must be exactly SEGMENT_LENGTH away from its parent
    for (let i = 1; i < this.SEGMENTS; i++) {
      const prev = this.segments[i - 1];
      const curr = this.segments[i];

      const dx   = curr.x - prev.x;
      const dy   = curr.y - prev.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

      // Push curr to be exactly SEGMENT_LENGTH away from prev
      const ratio = (dist - this.SEGMENT_LENGTH) / dist;
      curr.x -= dx * ratio * 0.5;
      curr.y -= dy * ratio * 0.5;

      // Also push prev (bi-directional constraint for more stable chain)
      prev.x += dx * ratio * 0.5;
      prev.y += dy * ratio * 0.5;
    }
  }

  getSegments(): readonly Segment[] {
    return this.segments;
  }

  getHeadVelocity(): number {
    const v = this.velocities[0];
    return Math.sqrt(v.vx * v.vx + v.vy * v.vy);
  }

  getSegmentCount(): number {
    return this.SEGMENTS;
  }

  getSegmentLength(): number {
    return this.SEGMENT_LENGTH;
  }
}
