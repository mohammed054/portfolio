# 04 — VARIABLES

**Role:** Central control system for motion, timing, interaction, and feel
**Priority:** High (defines perceived quality)

---

# 1. CORE PRINCIPLE

All “magic numbers” must be centralized.

Nothing is hardcoded inside components.

Everything flows from:

> a single, tunable control layer

---

# 2. GLOBAL STATE STRUCTURE

```js id="v1f8mx"
export const CONFIG = {
  timeline: {},
  camera: {},
  motion: {},
  interaction: {},
  scenes: {},
  rendering: {},
  audio: {}
}
```

---

# 3. TIMELINE VARIABLES

---

## Global Progress Ranges

```js id="k9q2rz"
timeline: {
  entry:      [0.00, 0.15],
  authority:  [0.15, 0.30],
  capability: [0.30, 0.50],
  proof:      [0.50, 0.75],
  climax:     [0.75, 0.90],
  outro:      [0.90, 1.00],
}
```

---

## Utility

```js id="m3z8tx"
function range(progress, start, end) {
  return clamp((progress - start) / (end - start), 0, 1)
}
```

---

# 4. CAMERA VARIABLES

---

## Base Settings

```js id="h2l9pw"
camera: {
  fov: 50,
  near: 0.1,
  far: 1000,
}
```

---

## Damping

```js id="p8x4sd"
camera: {
  positionLerp: 0.08,
  targetLerp: 0.1,
}
```

---

## Mouse Influence

```js id="u7c3jn"
camera: {
  mouseInfluence: {
    x: 0.5,
    y: 0.3,
  }
}
```

---

## FOV Range

```js id="n5k2ev"
camera: {
  fovRange: {
    min: 40,
    max: 75,
  }
}
```

---

# 5. MOTION VARIABLES

---

## Global Motion Feel

```js id="r4v9yt"
motion: {
  lerpAlpha: 0.08,
  inertia: 0.9,
  damping: 0.85,
}
```

---

## Speed Multipliers

```js id="a2j6qx"
motion: {
  speed: {
    slow: 0.3,
    normal: 1,
    fast: 2,
  }
}
```

---

## Magnetic Behavior

```js id="d9s7fb"
motion: {
  magnetic: {
    strength: 0.15,
    radius: 2,
  }
}
```

---

# 6. INTERACTION VARIABLES

---

## Mouse Sensitivity

```js id="w6e2kp"
interaction: {
  mouse: {
    sensitivity: 0.002,
    clamp: 0.5,
  }
}
```

---

## Hover Feedback

```js id="t3n8zf"
interaction: {
  hover: {
    scale: 1.05,
    glow: 0.3,
  }
}
```

---

## Response Time

```js id="q8m1ld"
interaction: {
  response: {
    quick: 0.1,
    smooth: 0.3,
  }
}
```

---

# 7. SCENE VARIABLES

Each scene has its own tuning layer.

---

## Entry Scene

```js id="x7b2vr"
scenes: {
  entry: {
    particleCount: 50,
    movementSpeed: 0.2,
    opacity: 0.3,
  }
}
```

---

## Authority Scene

```js id="f1z9hk"
scenes: {
  authority: {
    textScale: 12,
    spacing: 5,
    opacity: 1,
  }
}
```

---

## Capability Scene

```js id="g6r4nm"
scenes: {
  capability: {
    nodeCount: 8,
    connectionStrength: 0.6,
    pulseSpeed: 0.4,
  }
}
```

---

## Proof Scene

```js id="k4x8sj"
scenes: {
  proof: {
    projectSpacing: 20,
    focusZoom: 0.7,
  }
}
```

---

## Climax Scene

```js id="y9p2cw"
scenes: {
  climax: {
    intensity: 1.2,
    motionSync: 0.9,
  }
}
```

---

## Outro Scene

```js id="n3d7vx"
scenes: {
  outro: {
    chaosLevel: 0.6,
    dragStrength: 0.4,
  }
}
```

---

# 8. RENDERING VARIABLES

---

## Lighting

```js id="z5h1tr"
rendering: {
  lighting: {
    intensity: 1,
    contrast: 1.2,
  }
}
```

---

## Postprocessing

```js id="p2m6fk"
rendering: {
  post: {
    bloom: 0.4,
    dof: 0.3,
    vignette: 0.2,
  }
}
```

---

## Color System

```js id="c7v9aq"
rendering: {
  colors: {
    background: "#050505",
    primary: "#ffffff",
    accent: "#4f8cff",
  }
}
```

---

# 9. AUDIO VARIABLES

---

```js id="j8k2wp"
audio: {
  ambient: {
    volume: 0.2,
    intensity: 0.5,
  },
  interaction: {
    click: 0.3,
    hover: 0.1,
  }
}
```

---

# 10. GLOBAL CURVES (VERY IMPORTANT)

---

## Easing Curves

```js id="s4l8dn"
curves: {
  smooth: (t) => t * t * (3 - 2 * t),
  easeOut: (t) => 1 - Math.pow(1 - t, 2),
}
```

---

## Usage

All transitions must use:

* smooth curves
* no linear motion

---

# 11. TUNING STRATEGY

---

## Rule 1

Change ONE variable at a time.

---

## Rule 2

Test in motion, not static.

---

## Rule 3

Tune in this order:

1. camera damping
2. motion lerp
3. interaction strength
4. scene density

---

# 12. FAILURE CONDITIONS

---

### ❌ Too sensitive

→ feels cheap

### ❌ Too slow

→ feels heavy / unresponsive

### ❌ Inconsistent values

→ breaks immersion

### ❌ Random numbers in code

→ impossible to refine

---

# 13. FINAL DEFINITION

This file is:

> the control surface of the experience

It defines:

* weight
* speed
* responsiveness
* emotional feel

Without this:

The experience becomes random.

With this:

> the experience becomes precise, intentional, and premium.
