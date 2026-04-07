// -----------------------------------------------------------------------------
// TEXT PARTICLES
// Rasterizes text onto an offscreen canvas, samples non-transparent pixels
// as particle origins. Each particle springs back to origin and is repelled
// by the dragon's head position.
// -----------------------------------------------------------------------------

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
}

export class TextParticles {
  private particles: Particle[] = [];

  private readonly INFLUENCE_RADIUS = 100; // px - dragon repulsion radius
  private readonly PUSH_STRENGTH = 180; // repulsion force magnitude
  private readonly RETURN_SPRING = 0.07; // spring constant back to origin
  private readonly DAMPING = 0.86; // velocity damping per frame
  private readonly MAX_PARTICLES = 12000; // performance cap
  private readonly SAMPLE_STEP = 3; // sample every N px

  /**
   * Rasterizes text onto an offscreen canvas and collects particle positions
   * from non-transparent pixels. Call once on init.
   */
  init(text: string, fontSize: number, canvasW: number, canvasH: number): void {
    this.particles = [];

    const offscreen =
      typeof OffscreenCanvas !== 'undefined'
        ? new OffscreenCanvas(canvasW, canvasH)
        : (() => {
            const canvas = document.createElement('canvas');
            canvas.width = canvasW;
            canvas.height = canvasH;
            return canvas;
          })();
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `700 ${fontSize}px "System Display", "Helvetica Neue", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvasW / 2, canvasH / 2);

    const imageData = ctx.getImageData(0, 0, canvasW, canvasH);
    const data = imageData.data;

    for (let y = 0; y < canvasH; y += this.SAMPLE_STEP) {
      for (let x = 0; x < canvasW; x += this.SAMPLE_STEP) {
        const idx = (y * canvasW + x) * 4;
        if (data[idx + 3] > 128) {
          this.particles.push({
            x,
            y,
            originX: x,
            originY: y,
            vx: 0,
            vy: 0,
          });

          if (this.particles.length >= this.MAX_PARTICLES) {
            return;
          }
        }
      }
    }
  }

  /**
   * Physics update - call every frame before draw().
   * dragonHeadX/Y: current position of the dragon's head in canvas px coords.
   */
  update(dragonHeadX: number, dragonHeadY: number): void {
    const radiusSq = this.INFLUENCE_RADIUS * this.INFLUENCE_RADIUS;

    for (const particle of this.particles) {
      const dx = particle.x - dragonHeadX;
      const dy = particle.y - dragonHeadY;
      const distSq = dx * dx + dy * dy;

      if (distSq < radiusSq) {
        const dist = Math.sqrt(distSq) || 0.001;
        const t = 1 - dist / this.INFLUENCE_RADIUS;
        const force = t * t * this.PUSH_STRENGTH;
        particle.vx += (dx / dist) * force * 0.016;
        particle.vy += (dy / dist) * force * 0.016;
      }

      particle.vx += (particle.originX - particle.x) * this.RETURN_SPRING;
      particle.vy += (particle.originY - particle.y) * this.RETURN_SPRING;

      particle.vx *= this.DAMPING;
      particle.vy *= this.DAMPING;

      particle.x += particle.vx;
      particle.y += particle.vy;
    }
  }

  /**
   * Draw all particles to the canvas context.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (const particle of this.particles) {
      ctx.fillRect(particle.x, particle.y, 1.5, 1.5);
    }
  }

  getParticleCount(): number {
    return this.particles.length;
  }

  reset(): void {
    this.particles = [];
  }
}
