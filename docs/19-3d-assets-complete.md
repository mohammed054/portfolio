# 19 — 3D ASSETS: COMPLETE GUIDE
## Sourcing → AI Generation → Free Downloads → Blender Cleanup → Import → Materials in Code

**Written for someone with zero 3D modeling experience.**

---

## CRITICAL NOTE UPFRONT

The 3D assets are what make shader.se memorable. The golden tie, the retro computer, the phone monument — these are not decoration, they ARE the product. A bad 3D model will make the entire $50k site look cheap. This document covers every path to getting high-quality assets:

1. **Free download** from public libraries (fastest, highest quality)
2. **AI generation** with exact prompts (good for custom branded items)
3. **Blender cleanup** step-by-step (required before any asset goes into the browser)
4. **Three.js/R3F import** with full code
5. **Material assignment** in code for each asset

Do NOT skip the cleanup steps. A raw AI-generated or downloaded model WILL be broken without them.

---

## TOOLS YOU NEED (ALL FREE)

Install all of these before starting:

| Tool | Purpose | Download |
|------|---------|---------|
| **Blender 4.x** | Open, clean, and export 3D models | blender.org |
| **gltf-transform CLI** | Compress models for web (DRACO) | see Section 7 |
| **gltf.report** | Validate models in browser | gltf.report |
| **Three.js Editor** | Test models in the browser | threejs.org/editor |
| **Meshy.ai** | AI text-to-3D generation | meshy.ai |
| **Tripo3D** | AI text-to-3D (alternative) | tripo3d.ai |
| **Luma Genie** | AI text-to-3D (alternative) | lumalabs.ai/genie |

---

## ASSET OVERVIEW TABLE

| # | Asset | File | Section | Priority | Best Source |
|---|-------|------|---------|----------|-------------|
| 1 | Commodore SuperPET Computer | `superpet-computer.glb` | Hero | 🔴 CRITICAL | Free download (Sketchfab) |
| 2 | Golden Necktie | `golden-tie.glb` | Golden Tie | 🔴 CRITICAL | AI generate |
| 3 | Office Phone Array | `phones-array.glb` | Good Buy | 🟡 HIGH | Free download + AI |
| 4 | Paper Shredder | `shredder-machine.glb` | Shredder | 🟢 MEDIUM | AI generate |

---
---

# ASSET 1: COMMODORE SUPERPET COMPUTER
## Hero Section — The Star of the Show

This is the most important asset. It is on screen during the first thing users see, it is animated, and its screen plays video content. It must be photo-realistic.

---

## PATH A: FREE DOWNLOAD (RECOMMENDED — DO THIS FIRST)

This is almost certainly available for free. Vintage computers are extremely popular in the 3D community.

### Sketchfab Search (Best Source)

Go to: **https://sketchfab.com/search?q=commodore+pet&type=models&features=downloadable**

Search terms to try IN ORDER (try each until you find one that works):

```
1. "commodore pet"
2. "commodore superpet"
3. "commodore 8032"
4. "apple II computer"         ← visually almost identical, acceptable substitute
5. "retro computer 1980"
6. "vintage computer terminal"
7. "PET 2001"
```

**What to look for in the results**:
- ✅ Downloadable (look for the download arrow icon)
- ✅ License: CC Attribution or CC0 (free for commercial use)
- ✅ Polygon count: 50,000–200,000 (anything in this range is fine)
- ✅ Has a CRT screen mesh (the screen must be a separate face you can put video on)
- ✅ Has textures included in the download
- ❌ Avoid: "Low poly" models (they look like Minecraft)
- ❌ Avoid: Models without a separate screen mesh

**Best confirmed free asset** (verify it's still up):
- Search: `"CBM 8032"` on Sketchfab — there are several faithful recreations
- Search: `"BBC Micro"` — similar era, similar form factor, works as a substitute

### Other Free Sources

```
Poly Haven:
  URL: polyhaven.com/models
  Search: "computer" — limited but highest quality

CGTrader Free:
  URL: cgtrader.com/free-3d-models/electronics
  Search: "vintage computer" → filter: Free

Free3D:
  URL: free3d.com
  Search: "old computer" or "retro computer"
  Best for: lower quality but functional base meshes
```

### If You Find a Close Match (Not Exactly a SuperPET)

That's FINE. The live site uses a model that is LABELED "SuperPET SP9000" but it doesn't need to be an exact hardware match. Any retro 1980s computer with:
- A keyboard base unit
- A separate elevated CRT monitor on top
- Boxy beige/cream plastic form factor

...will work. The SHADER branding gets applied as a texture label in Blender.

---

## PATH B: AI GENERATION (IF NO FREE DOWNLOAD FOUND)

Use **Meshy.ai** (free tier available, best quality for objects).

### Meshy.ai — Text to 3D Prompt

Go to: **https://meshy.ai** → "Text to 3D" → paste this prompt:

```
A Commodore SuperPET SP9000 vintage personal computer from 1982.
The computer has two parts: a flat horizontal keyboard unit at the 
bottom with a full QWERTY keyboard on top, and a separate large CRT 
monitor sitting elevated above the keyboard. The monitor has thick 
plastic bezels on all four sides. The entire machine is made of cream 
white or warm beige plastic with subtle surface texture. The front of 
the keyboard unit has a slanted nameplate panel. The monitor screen 
is a flat dark rectangle, slightly recessed into the bezel. Style: 
photorealistic product render, clean studio lighting, no background.
```

**Meshy Settings**:
- Art Style: `Realistic`
- Quality: `High` (use free credits on this, it's worth it)
- Topology: `Quad` (not triangle — easier to work with in Blender)

**After generation**: Download the `.glb` or `.fbx` version.

### Tripo3D Alternative Prompt
```
1982 vintage personal computer, Commodore CBM style, cream beige plastic body,
full mechanical keyboard on flat base unit, large CRT monitor on top with thick 
plastic bezel, dark monitor screen, retro technology aesthetic, clean product 
photography style, photorealistic, studio lighting
```

### Luma Genie Alternative Prompt
```
Retro 1980s home computer terminal. Beige cream plastic. Flat keyboard base 
with keys. Large boxy CRT monitor elevated above keyboard. Vintage technology.
Photorealistic. Clean white studio background.
```

---

## BLENDER CLEANUP — STEP BY STEP (SuperPET)

**Open Blender. File → Import → glTF 2.0 (.glb)** and select your downloaded file.

### Step 1: Remove Junk
1. Press `A` to select everything
2. In top menu: `Object → Clean Up → Remove Doubles` (removes duplicate vertices)
3. Look in the Scene Collection (top right) for objects named things like "Empty", "Armature", "Light", "Camera" — select each and press `X` → Delete
4. Keep ONLY the actual computer geometry objects

### Step 2: Create the Screen as a Separate Object (CRITICAL)
The monitor screen MUST be its own separate mesh so Three.js can assign a video texture to it.

1. Click on the monitor object in the viewport
2. Press `Tab` to enter Edit Mode
3. Use `Alt+Click` to select the face(s) that make the screen (the dark flat rectangle in the bezel)
4. Press `P` → "Selection" — this separates it into its own object
5. Press `Tab` to exit Edit Mode
6. Double-click the new object in the Scene Collection and rename it exactly: **`monitor_screen`**
7. The rest of the monitor housing can be named: **`monitor_housing`**

### Step 3: Name All Objects (Required for Three.js)
Rename objects in the Scene Collection (top right panel):
```
monitor_screen      ← the flat screen face
monitor_housing     ← the bezel/body of the monitor
keyboard_base       ← the keyboard unit
keys_group          ← if keys are separate objects, group them
```

### Step 4: Add the SHADER Label
1. In the Scene Collection, click `keyboard_base`
2. Select the front-facing nameplate panel face
3. Apply a new material named `mat_label_shader`
4. Set the Base Color to a light gray (`#c8c0a8`) for now — the SHADER logo texture will be applied in Three.js code, not in Blender

### Step 5: Apply Materials (in Blender)
For each mesh, assign a material with these settings:

**Computer Body** (keyboard_base + monitor_housing):
```
Material name: mat_computer_body
Base Color: #c8c0a8  (warm off-white)
  → In Blender: click the color swatch, enter Hex: c8c0a8
Metallic: 0.05
Roughness: 0.65
```

**Monitor Screen**:
```
Material name: mat_screen
Base Color: #000000  (pure black — video replaces this at runtime)
Emission Color: #000000
Emission Strength: 0
Roughness: 0.05
Metallic: 0.0
```

**Keys** (if separate):
```
Material name: mat_keys
Base Color: #2a2820  (very dark brown-black)
Roughness: 0.75
Metallic: 0.0
```

### Step 6: Scale Check
1. Press `N` to open the Properties Panel
2. Check the Dimensions of the full computer assembly
3. The total height (monitor + keyboard) should be approximately `0.8 to 1.2 units` in Blender units
   - If it's 800 or 0.008, it's the wrong scale
   - Select all (`A`) → `Object → Apply → Scale` to bake in correct scale
4. Rotate if needed: the computer should face +Y direction (the front of the keyboard faces you)

### Step 7: Export as GLB
`File → Export → glTF 2.0 (.glb/.gltf)` with these settings:
```
Format: glTF Binary (.glb)
Include:
  ✅ Selected Objects: OFF (export everything)
  ✅ Apply Modifiers: ON
  ✅ Punctual Lights: OFF
  ✅ Cameras: OFF
Geometry:
  ✅ UV: ON
  ✅ Normals: ON
  ✅ Vertex Colors: OFF (unless needed)
  ✅ Materials: ON
  ✅ Images: ON
  ✅ Compression: OFF (we'll do this separately with gltf-transform)
```

Save as: `superpet-computer-raw.glb`

---

## THREE.JS/R3F IMPORT CODE (SuperPET)

```typescript
// src/sections/01-Hero/SuperPETModel.tsx
import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Preload the model (call this outside the component, once)
useGLTF.preload('/models/superpet-computer.glb');

interface SuperPETModelProps {
  screenVideoSrc: string;  // path to the video texture
}

export function SuperPETModel({ screenVideoSrc }: SuperPETModelProps) {
  const { scene, nodes } = useGLTF('/models/superpet-computer.glb');
  const screenMeshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    // ── VIDEO TEXTURE FOR MONITOR SCREEN ──
    const video = document.createElement('video');
    video.src = screenVideoSrc;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.play();

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    // Find the screen mesh by name (MUST match Blender name exactly)
    const screenMesh = scene.getObjectByName('monitor_screen') as THREE.Mesh;
    if (screenMesh) {
      screenMesh.material = new THREE.MeshBasicMaterial({
        map: videoTexture,
        toneMapped: false,
      });

      // CRT screen mesh overlay — adds the dot-matrix feel
      const crtOverlay = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('/textures/crt-shadow-mask.webp'),
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
      });
      // Add as a second layer (clone the screen mesh slightly forward)
      const overlayMesh = screenMesh.clone();
      overlayMesh.material = crtOverlay;
      overlayMesh.position.z += 0.001; // just in front
      screenMesh.parent?.add(overlayMesh);
    }

    // ── BODY MATERIAL OVERRIDE ──
    // Walk all meshes and ensure PBR materials are correct
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name !== 'monitor_screen') {
          (child.material as THREE.MeshStandardMaterial).envMapIntensity = 0.8;
        }
      }
    });

    return () => {
      video.pause();
      video.src = '';
      videoTexture.dispose();
    };
  }, [scene, screenVideoSrc]);

  return (
    <group
      position={[2.2, -1.0, 0]}    // right side, slightly down
      rotation={[0, -0.3, 0]}       // slight angle toward camera
      scale={1.8}
    >
      <primitive object={scene} />
    </group>
  );
}
```

---
---

# ASSET 2: GOLDEN NECKTIE
## Golden Tie Section — The Comedic Centerpiece

This is the most visually striking asset. It must look like liquid gold and move like silk. Do not accept a cheap-looking tie.

---

## PATH A: FREE DOWNLOAD

Ties are less common in 3D libraries but searchable:

### Sketchfab Search
```
URL: sketchfab.com/search?q=necktie&type=models&features=downloadable

Search terms:
1. "necktie"
2. "business tie"
3. "tie knot 3d"
4. "suit tie"
```

**What to look for**:
- ✅ High poly count (a tie needs many vertical segments to deform convincingly)
- ✅ Clean quad topology along the length axis
- ✅ Knot and blade are recognizable shapes
- ❌ Avoid anything "stylized" or "cartoon" — needs to be realistic

### Free 3D Sites
```
CGTrader:  cgtrader.com/free-3d-models/clothing → search "tie" or "necktie"
TurboSquid: turbosquid.com/Search/3D-Models/free/tie
Free3D:     free3d.com/3d-models/clothes → search "necktie"
```

**Likely outcome**: You may not find a perfect tie for free. The AI generation path below produces excellent results for this asset. Use it.

---

## PATH B: AI GENERATION (RECOMMENDED FOR THIS ASSET)

### Meshy.ai Prompt (use this)

```
A classic men's business necktie, hanging vertically from its Windsor knot 
at the top. The tie is made of smooth, highly reflective gold metallic satin 
fabric. The blade of the tie is wide at the bottom and tapers upward to the 
knot. The surface catches light with strong specular highlights. No wrinkles 
in the fabric. The tie hangs straight down with a subtle natural drape at 
the bottom blade. Clean neutral background. Photorealistic product render.
Style: luxury fashion product photography.
```

**Meshy Settings**:
- Art Style: `Realistic`
- Seed: try multiple generations (3-5) and pick the best one
- The tie shape is simple so quality should be consistently good

### What Makes a Good vs Bad AI Tie

**✅ Good result**:
- Clear knot at top (Windsor or four-in-hand shape)
- Smooth tapered blade — wide at bottom, narrow at top
- Clean geometry with no holes or artifacts
- Looks like a real cloth object

**❌ Bad result** (regenerate if you see this):
- Twisted or tangled shape
- Missing knot
- Looks like a ribbon or band, not a tie
- Holes in the mesh visible
- Too thin/flat throughout

### If AI Generation Produces Bad Geometry

Use **Tripo3D** as an alternative:
```
URL: tripo3d.ai

Prompt:
Realistic men's business necktie, hanging vertically. Shiny gold satin 
material. Classic Windsor knot at the top. Wide blade at bottom tapering 
to narrow at the neck. Side panels visible. Smooth fabric texture.
Photorealistic. Front view, centered.
```

---

## BLENDER CLEANUP — STEP BY STEP (Tie)

### Step 1: Check the Topology
1. Import the GLB into Blender
2. Click the tie mesh → press `Tab` (Edit Mode) → press `2` (Edge select mode)
3. Look at the edge loops running along the length of the tie
4. You need **at minimum 20 horizontal loops** running from knot to bottom tip
   - If there are fewer than 20 loops, the deformation in Three.js will look blocky
   - Add more: `Right-Click` on an edge loop → `Loop Cut` (Ctrl+R) → scroll wheel to add more cuts

### Step 2: Separate the Knot
1. In Edit Mode, select all the faces of the knot area (the tied part at top)
2. Press `P` → "Selection" to make it a separate object
3. Rename: `tie_knot`
4. Rename the remaining blade: `tie_blade`

### Step 3: Set the Pivot Point (CRITICAL for deformation)
The top edge of `tie_blade` must be at Y=0 (world origin) because those vertices get PINNED in the Three.js animation — they don't move.

1. In Edit Mode on `tie_blade`, select the top edge loop (closest to the knot)
2. Press `Shift+S` → "Cursor to Selected"
3. Press `Tab` to exit Edit Mode
4. Go to: `Object → Set Origin → Origin to 3D Cursor`
5. Now press `G`, `Y`, type `0`, `Enter` — this moves the tie so the knot is at the world origin

### Step 4: Apply the Gold Material
```
In Blender Material Properties:

Material name: mat_golden_tie

Base Color: #c9a84c  (deep gold)
  → Metallic: 0.88
  → Roughness: 0.12

Advanced (Shader Editor):
  → Add "Sheen" node: Color #c9a84c, Roughness 0.2, Tint 0.3
  → This gives the fabric micro-sheen that makes it look like woven satin
```

If you want to use the Principled BSDF (simpler approach in Blender):
```
Principled BSDF settings:
  Base Color:      HEX c9a84c
  Metallic:        0.88
  Roughness:       0.12
  Anisotropic:     0.4          ← gives directional sheen to the metallic
  Anisotropic Rotation: 0.0
  Clearcoat:       0.3
  Clearcoat Roughness: 0.1
```

### Step 5: Export
Save as: `golden-tie-raw.glb`

---

## THREE.JS/R3F IMPORT CODE (Golden Tie)

```typescript
// src/sections/08-GoldenTie/TieScene.tsx
import { useRef } from 'react';
import { useGLTF, Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

useGLTF.preload('/models/golden-tie.glb');

export function TieScene({ scrollProgress }: { scrollProgress: number }) {
  const { scene, nodes } = useGLTF('/models/golden-tie.glb');
  const bladeRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;

    // ── CLOTH SIMULATION via vertex deformation ──
    const blade = nodes['tie_blade'] as THREE.Mesh;
    if (!blade) return;

    const geometry = blade.geometry;
    const positions = geometry.attributes.position;
    const count = positions.count;

    for (let i = 0; i < count; i++) {
      const y = positions.getY(i);
      // normalizedDepth: 0 at knot (top), 1 at blade bottom tip
      const normalizedDepth = Math.max(0, -y) / 1.8;

      // More sway further from knot — squared for realistic cloth behavior
      const swayInfluence = normalizedDepth * normalizedDepth;

      // Primary sway: slow, wide sine wave
      const primarySway = Math.sin(timeRef.current * 0.8 + normalizedDepth * 1.5)
        * swayInfluence * 0.12;

      // Secondary flutter: faster, smaller — adds life to the lower blade
      const flutter = Math.sin(timeRef.current * 2.2 + normalizedDepth * 3.0)
        * swayInfluence * 0.025;

      positions.setX(i, primarySway + flutter);
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals(); // recalculate lighting after deformation
  });

  return (
    <group position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
      {/* Environment map — gives the gold its reflections */}
      <Environment preset="studio" />

      {/* Dramatic spotlight from above */}
      <spotLight
        position={[0, 6, 0]}
        intensity={80}
        angle={0.3}
        penumbra={0.5}
        color="#fff5d0"
        castShadow
      />

      {/* Subtle fill from below */}
      <pointLight position={[0, -2, 1]} intensity={3} color="#c9a84c" />

      <primitive object={scene} />
    </group>
  );
}
```

### Gold Material Override in Three.js (if Blender material doesn't export correctly)

```typescript
// Apply this after loading the GLB if the material looks wrong
useEffect(() => {
  const goldMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#c9a84c'),
    metalness: 0.88,
    roughness: 0.12,
    reflectivity: 1.0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.1,
    envMapIntensity: 2.0,  // stronger reflections = more luxurious
  });

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = goldMaterial;
      child.castShadow = true;
    }
  });
}, [scene]);
```

---
---

# ASSET 3: OFFICE PHONE ARRAY
## Good Buy Section — The Shrine of Phones

Multiple retro office phones arranged as a product display. The good news: retro phones are extremely common in 3D libraries.

---

## PATH A: FREE DOWNLOAD (STRONGLY RECOMMENDED)

You can almost certainly find all the phones you need for free and they will look better than AI-generated ones.

### Sketchfab — Search Each Phone Type Separately

**Phone 1 — Cordless Phone with Handset + Base:**
```
URL: sketchfab.com/search?q=cordless+phone&features=downloadable

Best search terms:
1. "cordless phone 90s"
2. "office cordless telephone"
3. "uniden cordless"
4. "AT&T cordless phone"
```

**Phone 2 — Desk Phone (classic boxy):**
```
1. "desk phone"
2. "office telephone"
3. "telephone desk 90s"
4. "AT&T spirit phone"
5. "business telephone"
```

**Phone 3 — Answering Machine / Base Unit:**
```
1. "answering machine"
2. "telephone answering machine"
3. "office phone base"
```

**The Goal**: Find 3–4 different phone models that all feel like they're from the same era (late 1990s). They don't need to be the same brand. Mix and match.

### Other Free Sources for Phones

```
Poly Haven:
  polyhaven.com/models → "telephone" — may have 1–2 options

CGTrader Free:
  cgtrader.com/free-3d-models/electronics → "telephone" → Free filter

TurboSquid Free:
  turbosquid.com/Search/3D-Models/free/telephone

BlendSwap (Blender files — open directly in Blender):
  blendswap.com → search "telephone" or "phone"
  These are already in Blender format — easiest to work with
```

---

## PATH B: AI GENERATION (For individual phones if download fails)

Use a separate prompt for each phone type:

### Phone 1 — Cordless Desk Phone + Base Station
```
Meshy.ai prompt:

A late 1990s cordless office telephone handset standing upright in its 
charging base station. The handset is slim, cream white or light gray 
plastic with a numerical keypad on the front face. The handset has a 
small LCD display area at the top and a speaker grille at the bottom. 
The base station is a compact flat rectangular unit. A small label on 
the front reads "SHADER". Photorealistic product render. Clean white 
background. Professional studio lighting from above.
```

### Phone 2 — Classic Boxy Office Desk Phone
```
Meshy.ai prompt:

A classic 1990s office desk telephone. Rectangular boxy body in warm 
light gray or cream beige plastic. The telephone handset sits in a 
cradle on top. A numerical keypad is on the angled front face. Small 
speaker grilles on the side. The front panel has a label area. 
Photorealistic. Product photography style. Clean background.
```

### Phone 3 — Flat Answering Machine Base
```
Meshy.ai prompt:

A 1990s office telephone answering machine base unit. Flat horizontal 
rectangular shape. Cream white plastic. Circular speaker grille on 
the top surface. Several buttons on the top face. A small display 
panel. This is the base/station that a cordless phone sits in. 
Photorealistic. Clean white background. Top-angled view.
```

---

## BLENDER CLEANUP — STEP BY STEP (Phones)

### Step 1: Import and Organize All Phones
1. Import your first phone GLB into Blender
2. Rename the object: `phone_01`
3. Go to `File → Append` (not Import) to bring in additional phone files into the same scene
4. Rename each: `phone_02`, `phone_03`, `phone_04`

### Step 2: Arrange the Phones as a Shrine/Monument
1. Select `phone_01` (the flat base unit)
2. Move it to the center: `G`, `X`, `0`, `Enter` — then `G`, `Y`, `0`, `Enter`
3. The flat base unit goes at Y=0 (ground level)
4. Position `phone_02` (upright handset) at the CENTER-BACK: `G`, `Y`, `-0.15`, `Enter`; also raise it: `G`, `Z`, `0.05`, `Enter`
5. Position `phone_03` (desk phone) to the LEFT: `G`, `X`, `-0.35`, `Enter`
6. Position `phone_04` to the RIGHT: `G`, `X`, `0.35`, `Enter`
7. Adjust heights and rotations so they look like a deliberate, slightly absurd display

### Step 3: Apply SHADER Label Materials
For each phone, select the front face panel:
1. Tab into Edit Mode
2. Select the front face (where the branding label would go)
3. Create new material: `mat_shader_label`
4. Set Base Color to `#c8c0a8` for now — label texture assigned in Three.js

### Step 4: Unify the Materials
All phones should share the same body material to look like they're from the same product line:

```
Material: mat_phone_body
Base Color: #d4cfc4  (warm light gray-cream)
Metallic: 0.05
Roughness: 0.75
```

### Step 5: Join All Phones Into One Object (Optional but Recommended)
1. Select all phone objects (`A`)
2. Press `Ctrl+J` to join them into one object
3. Rename: `phones_array`

This makes the GLB simpler and the Three.js import cleaner.

### Step 6: Export
`File → Export → glTF 2.0` → Save as `phones-array-raw.glb`

---

## THREE.JS/R3F IMPORT CODE (Phone Array)

```typescript
// src/sections/10-GoodBuy/PhonesScene.tsx
import { useRef } from 'react';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

useGLTF.preload('/models/phones-array.glb');

export function PhonesScene({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF('/models/phones-array.glb');
  const groupRef = useRef<THREE.Group>(null);

  // Apply SHADER label decal texture to label meshes
  useEffect(() => {
    const labelTexture = new THREE.TextureLoader().load('/textures/shader-label.png');

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Improve all materials
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMapIntensity = 0.5;
          child.material.roughness = Math.max(child.material.roughness, 0.6);
        }

        // Apply label texture to label meshes
        if (child.name.includes('label') || child.name.includes('Label')) {
          child.material = new THREE.MeshStandardMaterial({
            map: labelTexture,
            roughness: 0.85,
          });
        }
      }
    });
  }, [scene]);

  // Camera orbit driven by scroll progress
  useFrame(({ camera }) => {
    const angle = scrollProgress * Math.PI * 0.3 - Math.PI * 0.1;
    camera.position.x = Math.sin(angle) * 4;
    camera.position.z = Math.cos(angle) * 4;
    camera.position.y = 1.8;
    camera.lookAt(0, 0.5, 0);
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <Environment preset="night" />

      {/* Dramatic overhead spotlight */}
      <spotLight
        position={[0, 8, 1]}
        intensity={100}
        angle={0.25}
        penumbra={0.4}
        color="#fff8e8"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Soft fill */}
      <ambientLight intensity={0.05} color="#1a1a2e" />

      {/* Floor shadow */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.6}
        blur={2}
        far={4}
        color="#000000"
      />

      <primitive object={scene} />
    </group>
  );
}
```

---
---

# ASSET 4: PAPER SHREDDER
## Shredder Section — The Corporate Machine

This asset can be a 3D model OR a very detailed SVG/CSS illustration. The 3D model is preferred. Since paper shredders are common office equipment, there's a reasonable chance of finding a free one.

---

## PATH A: FREE DOWNLOAD

### Sketchfab Search
```
URL: sketchfab.com/search?q=paper+shredder&features=downloadable

Search terms:
1. "paper shredder"
2. "office shredder"
3. "document shredder"
4. "fellowes shredder"
```

### CGTrader / TurboSquid
```
CGTrader: cgtrader.com/free-3d-models/electronics → "shredder"
TurboSquid: turbosquid.com → search "paper shredder" → Free
```

---

## PATH B: AI GENERATION

If no free asset found, this is a good candidate for AI generation since the form is simple and recognizable.

### Meshy.ai Prompt
```
A desktop office paper shredder machine. Classic cross-cut office shredder 
style. The main body is a tall rectangular unit in warm light gray or cream 
beige plastic with rounded corners at the top. The paper input slot is a 
horizontal opening across the top of the machine. The lower waste bin section 
is slightly wider than the top unit and made of the same plastic. The front 
face of the machine has a label that reads "SHREDDER". The machine sits on 
a flat surface. Photorealistic product render, studio lighting, clean 
white background. Brand style similar to Fellowes or Staples shredder.
```

### Alternative: CSS/SVG Illustration

If both free download AND AI generation fail to produce a convincing shredder, this section can use a **very detailed CSS illustration** instead of a 3D model. The shredder illustration would be:

- Created in Figma or Illustrator
- Exported as an SVG
- Animated via CSS/GSAP for the jiggle effect
- The shred warp effect still works (it's a canvas shader, not tied to the 3D model)

This is an acceptable fallback — the shredder machine is supporting cast to the GLSL shred effect, which is the real star.

---

## BLENDER CLEANUP — STEP BY STEP (Shredder)

### Step 1: Separate the Parts
The shredder must have these as separate named objects:
```
shredder_head      ← top unit with input slot
shredder_bin       ← bottom waste basket
shredder_slot      ← the dark interior of the input slot
```

1. Import → Tab into Edit Mode
2. Select all faces of the top unit → `P` → Selection → rename `shredder_head`
3. Select bottom bin faces → `P` → Selection → rename `shredder_bin`

### Step 2: The Input Slot
The slot opening at the top needs to be DARK inside (it's a hole):
1. Select the interior faces of the slot
2. Assign a material: `mat_slot_interior`
   - Base Color: `#111111` (near black)
   - Roughness: 0.9

### Step 3: The SHADER Label
1. Select the front-face panel of `shredder_head`
2. Assign material: `mat_shredder_label`
3. Base Color placeholder: `#c0bdb5` — the SHADER logo SVG gets applied in Three.js

### Step 4: Apply Materials
```
mat_shredder_body:
  Base Color: #c0bdb5  (warm gray)
  Metallic: 0.08
  Roughness: 0.70

mat_slot_interior:
  Base Color: #111111
  Roughness: 0.9

mat_shredder_label:
  Base Color: #c0bdb5 (placeholder, see above)
```

### Step 5: Export
`File → Export → glTF 2.0` → `shredder-machine-raw.glb`

---

## THREE.JS/R3F IMPORT CODE (Shredder)

```typescript
// src/sections/06-Shredder/ShredderModel.tsx
import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

useGLTF.preload('/models/shredder-machine.glb');

export function ShredderModel({ isActive }: { isActive: boolean }) {
  const { scene } = useGLTF('/models/shredder-machine.glb');
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // Apply SHADER label
  useEffect(() => {
    const labelTex = new THREE.TextureLoader().load('/textures/shader-label.png');
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name.includes('label')) {
        child.material = new THREE.MeshStandardMaterial({
          map: labelTex,
          roughness: 0.85,
        });
      }
    });
  }, [scene]);

  // Vibration animation
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;

    if (isActive) {
      // Active: fast vibration like a running motor
      groupRef.current.position.x = Math.sin(timeRef.current * 60) * 0.003;
      groupRef.current.position.y = Math.sin(timeRef.current * 80) * 0.002;
    } else {
      // Idle: very slow subtle wobble
      groupRef.current.position.y = Math.sin(timeRef.current * 1.5) * 0.002;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.0}>
      <primitive object={scene} />
    </group>
  );
}
```

---
---

# STEP 7: DRACO COMPRESSION PIPELINE (ALL MODELS)

After exporting raw GLBs from Blender, compress ALL of them before putting them in `/public/models/`.

### Install the Tool
```bash
npm install -g @gltf-transform/cli
```

### Compress Each Model
```bash
# SuperPET Computer
npx gltf-transform optimize \
  superpet-computer-raw.glb \
  public/models/superpet-computer.glb \
  --compress draco \
  --texture-compress webp \
  --texture-size 1024 \
  --simplify false

# Golden Tie (don't simplify — needs all vertices for deformation)
npx gltf-transform optimize \
  golden-tie-raw.glb \
  public/models/golden-tie.glb \
  --compress draco \
  --texture-compress webp \
  --texture-size 512 \
  --simplify false

# Phone Array
npx gltf-transform optimize \
  phones-array-raw.glb \
  public/models/phones-array.glb \
  --compress draco \
  --texture-compress webp \
  --texture-size 1024 \
  --simplify false

# Paper Shredder
npx gltf-transform optimize \
  shredder-machine-raw.glb \
  public/models/shredder-machine.glb \
  --compress draco \
  --texture-compress webp \
  --texture-size 512 \
  --simplify false
```

### Verify File Sizes
```bash
ls -lah public/models/
# Expected output:
# superpet-computer.glb   ~2.1MB  ✅ (limit: 3MB)
# golden-tie.glb          ~0.6MB  ✅ (limit: 1MB)
# phones-array.glb        ~1.4MB  ✅ (limit: 2MB)
# shredder-machine.glb    ~0.9MB  ✅ (limit: 1.5MB)
# TOTAL                   ~5.0MB  ✅ (limit: 7.5MB)
```

If a model is OVER the limit after compression, go back to Blender and:
- Reduce polygon count using `Decimate` modifier (Modifier Properties → Add Modifier → Decimate)
- Set Ratio to 0.5 first, check if it still looks acceptable
- Reduce texture sizes if present

---

# STEP 8: VALIDATE MODELS BEFORE CODING

After compressing, validate EACH model before touching code.

### Browser Validator
1. Go to: **https://gltf.report**
2. Drag and drop your `.glb` file
3. Check for any ERROR messages in red → fix them in Blender before proceeding
4. Warnings (yellow) are usually fine

### Three.js Editor Test
1. Go to: **https://threejs.org/editor**
2. Drag and drop your `.glb` file
3. The model should appear in the viewport
4. Click on it — check the Object panel on the right for material and mesh names
5. Rotate around it to check all angles look correct
6. Verify material names match what your Three.js code expects

### Common Issues and Fixes

| Problem | What You See | Fix in Blender |
|---------|-------------|----------------|
| Model is invisible | Nothing shows up | Normals are flipped: Edit Mode → Mesh → Normals → Flip |
| Model is 1000x too big | Fills entire view | Object → Apply → Scale |
| Model is 1000x too small | Can't see it | Same as above |
| Wrong colors | Gray plastic looks black | In Blender: check material Base Color is NOT pure black |
| Mesh names wrong | Three.js `getObjectByName('monitor_screen')` returns null | Rename in Blender exactly as specified in the code |
| No textures | Model is gray blobs | Re-export with "Images: ON" in glTF export settings |

---

# STEP 9: PRELOADING ALL MODELS (Prevents Pop-In)

All models must be preloaded BEFORE the preloader exits. This is why the preloader exists — it masks the loading of all assets.

```typescript
// src/utils/preload.ts
// Call this ONCE at app startup (in main.tsx)

import { useGLTF } from '@react-three/drei';

export function preloadAllModels() {
  useGLTF.preload('/models/superpet-computer.glb');
  useGLTF.preload('/models/golden-tie.glb');
  useGLTF.preload('/models/phones-array.glb');
  useGLTF.preload('/models/shredder-machine.glb');
}
```

```typescript
// src/main.tsx — add this before ReactDOM.createRoot
import { preloadAllModels } from './utils/preload';
preloadAllModels();
```

The `useProgress()` hook from `@react-three/drei` reports the loading progress of all preloaded models. The Preloader component reads this to fill its progress bar.

```typescript
// Inside Preloader.tsx
import { useProgress } from '@react-three/drei';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const { progress, active } = useProgress();

  // progress: 0–100
  // active: true while loading, false when done

  useEffect(() => {
    if (!active && progress === 100) {
      // Wait 400ms, then run the CRT exit animation
      setTimeout(() => {
        runCRTExitAnimation().then(onComplete);
      }, 400);
    }
  }, [active, progress]);

  // Number of filled segments (out of 20)
  const filledSegments = Math.floor((progress / 100) * 20);

  return (
    <div className={styles.preloader}>
      {/* ... preloader content ... */}
      <div className={styles.progressBar}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`${styles.segment} ${i < filledSegments ? styles.filled : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
```

---

# STEP 10: ENVIRONMENT MAPS (Make Models Look Beautiful)

This is the single most impactful thing you can do to make 3D models look cinematic. An environment map (HDRI) provides realistic reflections and ambient lighting.

### Free HDRIs from Poly Haven
```
URL: polyhaven.com/hdris

Best HDRIs for each section:

Hero (dark, atmospheric):
  → "Rainforest Trail" or "Abandoned Slaughterhouse" → Dramatic, moody
  → Download: 1K resolution (enough for background reflections)
  → Filename: hero-env.hdr

Golden Tie (dark stage, spotlight):
  → "Studio Small 07" or "Studio Small 09" → Studio lighting HDRIs
  → Download: 2K resolution (tie is reflective, needs quality)
  → Filename: tie-env.hdr

Good Buy Phones (dark product shot):
  → "Studio Small 03" → Clean product lighting
  → Filename: phones-env.hdr
```

### Using HDRIs in R3F
```typescript
import { Environment } from '@react-three/drei';

// Option A: Use Drei's preset environments (easiest, no file needed)
<Environment preset="studio" />     // clean studio lighting
<Environment preset="night" />      // dark moody
<Environment preset="sunset" />     // warm atmospheric

// Option B: Use your downloaded HDRI file (best quality)
<Environment files="/textures/studio-small-07.hdr" />

// Option C: Environment as background (shows in scene)
<Environment preset="night" background backgroundBlurriness={0.8} />
```

---

# STEP 11: QUICK REFERENCE — AI TOOL COMPARISON

| Tool | Best For | Quality | Free Tier | URL |
|------|---------|---------|-----------|-----|
| **Meshy.ai** | Objects, products, props | ⭐⭐⭐⭐⭐ | 3 free credits/day | meshy.ai |
| **Tripo3D** | Characters, organic shapes | ⭐⭐⭐⭐ | Limited free | tripo3d.ai |
| **Luma Genie** | Scan-like organic assets | ⭐⭐⭐ | Some free | lumalabs.ai/genie |
| **Spline AI** | Simple decorative 3D | ⭐⭐⭐ | Free tier | spline.design |
| **Point-E** | Very rough shapes, fast | ⭐⭐ | Open source | github.com/openai/point-e |

**Recommendation**: Start with Meshy.ai for every AI-generated asset. It is the best text-to-3D tool for product/object generation as of 2026. Use Tripo3D as a backup.

---

# FINAL ASSET CHECKLIST

Before any model goes into the codebase, verify ALL of the following:

**In Blender:**
- [ ] All meshes are named correctly (exact match to code references)
- [ ] All transforms applied (Object → Apply → All Transforms)
- [ ] Materials assigned with correct PBR values
- [ ] Scale is appropriate (not 0.001 or 1000)
- [ ] Screen mesh is SEPARATE object (for SuperPET)
- [ ] Knot is SEPARATE from blade (for tie)

**After Export:**
- [ ] GLB opens in gltf.report with no errors
- [ ] GLB renders correctly in threejs.org/editor
- [ ] Mesh names visible in editor match code

**After Compression:**
- [ ] File is within size budget
- [ ] Compressed model still looks correct (no visual degradation)

**In the Browser:**
- [ ] Model loads without console errors
- [ ] Material looks correct (not flat gray)
- [ ] Video texture plays on SuperPET screen
- [ ] Tie deformation animates smoothly (no jitter)
- [ ] Phones orbit correctly on scroll
- [ ] Shredder vibration works
