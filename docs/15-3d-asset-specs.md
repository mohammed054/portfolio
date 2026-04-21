# 15 — 3D ASSET PRODUCTION SPECS
## For the 3D Artists / Asset Pipeline Team

---

## OVERVIEW

This document is written for the **3D artists and asset pipeline engineers** responsible for creating, processing, and delivering the 3D models used on the Shader rebuild. Every model spec is derived from frame-by-frame analysis of the live shader.se website.

Every model must:
1. Export cleanly as `.glb` (GLTF Binary)
2. Be DRACO compressed via `gltfpack` or `@gltf-transform/cli`
3. Have materials assigned using standard PBR (Physically Based Rendering) properties
4. Pass a visual parity check against the live site

---

## MODEL 1: SuperPET SP9000 Computer (Hero Section)

**Filename**: `superpet-computer.glb`
**Budget**: < 3.0 MB compressed
**Polygon target**: ~120,000 triangles (medium-res, close camera)

### Physical Reference
The Commodore SuperPET SP9000 (also related to CBM 8032 / PET series). Visual reference: the machine has a flat keyboard base unit and a separate elevated CRT monitor on top. The keyboard has a distinct angled front panel.

### Mesh Requirements

| Part | Detail | Notes |
|------|--------|-------|
| Keyboard base | Full body, keycap detail on top | Each key as a separate slight extrusion (not just a texture) |
| Monitor housing | CRT bezel with thick bezels, curved front | Monitor face must be a clean flat quad mesh (receives video texture) |
| Monitor screen | **Separate named mesh: `monitor_screen`** | Assigned transparent/emissive material, receives VideoTexture |
| CRT tube neck | Visible behind monitor housing if at any angle | Low poly fine |
| Power cable | Subtle, drapes off back of keyboard base | Optional — only if visible in render |
| Front label area | Flat face panel on keyboard front | Must accommodate "SHADER" branding decal |
| Side vents | Subtle grille pattern on side faces | Can be normal-mapped rather than modeled |

### Naming Convention (exact)
```
superpet_keyboard_base
superpet_monitor_housing
superpet_monitor_screen      ← CRITICAL: must be named exactly this
superpet_keys_group
superpet_label_shader        ← front face label
superpet_label_superpet      ← original "SuperPET SP9000" label on monitor side
```

### Materials

```
mat_computer_body:
  Base Color: #c8c0a8  (warm off-white / cream-beige)
  Metalness: 0.05
  Roughness: 0.65
  Normal Map: subtle plastic surface micro-bumps (1024×1024)

mat_monitor_screen:
  Base Color: #000000
  Emissive: #ffffff (driven by VideoTexture at runtime)
  Emissive Intensity: 1.2
  Roughness: 0.1
  Metalness: 0.0
  NOTE: This material is replaced at runtime with a Three.js MeshBasicMaterial
        using a VideoTexture. Just export with a solid black placeholder.

mat_key_caps:
  Base Color: #2a2820  (very dark brown-black)
  Roughness: 0.75
  Metalness: 0.0

mat_label_shader:
  Base Color: SHADER logo texture (see section 5: Textures)
  Roughness: 0.85

mat_label_original:
  Base Color: #c8c0a8 (same as body, with "SuperPET SP9000" text baked in)
```

### Pivot / Origin
- Model origin at **bottom-center of the keyboard base**
- +Y is up
- The model faces **+Z** direction (camera looks at -Z initially)

### Lighting Test
Render with a three-point light setup:
- Key: warm orange-white (5500K), top-right
- Fill: cool blue-purple (7000K), left
- Back/rim: cool blue (8000K), behind-right
This is the lighting the Three.js scene will approximate.

---

## MODEL 2: Golden Necktie (Golden Tie Section)

**Filename**: `golden-tie.glb`
**Budget**: < 1.0 MB compressed
**Polygon target**: ~8,000 triangles (simple shape but many vertical segments for deformation)

### Physical Reference
A standard men's business necktie: wide blade at bottom, narrowing to the knot, then a thin tail behind. Standard tie length ~150cm virtual.

### Mesh Requirements

The tie mesh must be built for **procedural vertex deformation** (soft-body simulation at runtime). This requires:

| Requirement | Spec |
|-------------|------|
| Topology | Clean, all-quad grid topology along the tie length |
| Vertical segments | Minimum **40 edge loops** along the length axis |
| Horizontal segments | Minimum **8 edge loops** across the width |
| Knot geometry | Included as a separate non-deforming mesh part |
| No sharp edges | All edges should be smooth for deformation |

### Naming Convention
```
tie_blade          ← the main tie body (deforming part)
tie_knot           ← the knot at the top (non-deforming, stays fixed)
tie_tail           ← the thin tail behind the knot (static or minimal deform)
```

The **top edge loop** of `tie_blade` (where it meets the knot) must have its vertices marked or positioned at Y=0 (world origin). These vertices will be **pinned** in the deformation simulation.

### Materials
```
mat_golden_tie:
  Base Color: #c9a84c
  Metalness: 0.88
  Roughness: 0.12
  Clearcoat: 0.3
  Clearcoat Roughness: 0.1
  NOTE: This should look like polished gold — highly specular, 
        clear reflections, slight warmth
```

### Shape Reference
At rest:
- Full length: ~1.8 units (arbitrary units; scene scale as needed)
- Blade width (bottom): ~0.3 units
- Blade width (at narrowest before knot): ~0.12 units
- Knot width: ~0.22 units
- Tail: ~0.1 units wide, ~0.4 units long

---

## MODEL 3: Office Phone Array (Good Buy Section)

**Filename**: `phones-array.glb`
**Budget**: < 2.0 MB compressed
**Polygon target**: ~60,000 triangles total across all phone units

### Physical Reference
Late 1990s / early 2000s office telephone equipment. Reference models:
- AT&T Spirit 1225 or similar desk phone
- Uniden DCX200 or similar cordless handset with base
- Answering machine base unit (flat, with speaker grille)

### Phone Units Required

**Unit 1 — Cordless Handset (standing upright)**
- The handset stands in its cradle vertically
- Antenna visible at top
- Keypad on front face
- "SHADER" label on face

**Unit 2 — Cordless Phone Base / Answering Machine**
- Flat horizontal unit, the widest piece in the arrangement
- Speaker grille visible
- "SHADER" label on front face

**Unit 3 — Desk Phone (left)**
- Boxy form, handset resting in cradle on top
- Number buttons on angled face
- "SHADER" label

**Unit 4 — Additional handset or device (right edge)**

### Arrangement
All phones are arranged as a **tight cluster**, like a product display or shrine:
- The flat answering machine base is at the bottom-center
- The upright handset is positioned center-back, standing in its cradle
- The desk phone is to the left
- An additional unit is to the right

The arrangement should look deliberate and slightly absurd — like someone artfully stacked their entire phone collection.

### Naming Convention
```
phone_base_unit          ← flat answering machine
phone_cordless_handset   ← upright handset
phone_desk_left          ← boxy desk phone
phone_unit_right         ← fourth unit
phones_floor_plane       ← optional invisible plane for reflection
```

### Materials
```
mat_phone_body:
  Base Color: #d4cfc4  (warm light gray-cream — classic 90s office equipment)
  Roughness: 0.75
  Metalness: 0.05
  Normal Map: subtle plastic texture (800×800)

mat_phone_screen:        ← LCD display if visible
  Base Color: #1a2010  (very dark green)
  Emissive: #4a6030 (faint green glow)
  Emissive Intensity: 0.3

mat_phone_keys:
  Base Color: #2a2820  (dark keys)
  Roughness: 0.8
```

---

## MODEL 4: Paper Shredder (Shredder Section)

**Filename**: `shredder-machine.glb`  
**Budget**: < 1.5 MB compressed  
**Polygon target**: ~25,000 triangles

**Note**: The shredder may alternatively be a high-quality SVG illustration. A 3D model is preferred for the light responsiveness.

### Physical Reference
Desktop office paper shredder, cross-cut style. Reference: Fellowes or Staples branded desktop shredders circa 2000–2010.

### Parts Required

| Part | Description |
|------|-------------|
| Main body | Tall rectangular unit, the "head" of the shredder containing the blades |
| Paper input slot | A horizontal slot at the top of the main body |
| Waste basket | The lower container/bin that collects shredded paper |
| Front panel label | Face of the main body, must say "SHADER" with the rainbow icon |
| Side vents | Decorative grille on the sides |

### Materials
```
mat_shredder_body:
  Base Color: #c0bdb5  (warm gray — typical office equipment)
  Roughness: 0.7
  Metalness: 0.08
  Subtle normal map: plastic texture

mat_shredder_label:
  Base Color: uses SHADER label texture (see Textures section)

mat_shredder_slot:
  Base Color: #111111  (the dark interior of the input slot)
  Roughness: 0.9
```

---

## 5. TEXTURES & DECALS

### SHADER Logo Decal Texture

Every 3D model uses a version of the SHADER logo as a label/sticker on its surface. This decal must be:

- **Format**: PNG, 512×256px (2:1 ratio), transparent background
- **Contents**: Rainbow-striped icon (left) + "SHADER" wordmark (right)
- **Color**: The logo colors on a white rectangle background, like a real product label
- The label rectangle has a very slight bevel/raised appearance in the normal map

### Grain Texture
- **File**: `grain.webp` (or PNG)
- **Size**: 512×512px
- **Content**: Pure noise / film grain, no pattern
- **Usage**: Used as an emissive/overlay texture in the postprocessing pass
- **Tileable**: Yes — seamless in both directions

### CRT Screen Mesh Texture (for hero computer screen)
- **File**: `crt-shadow-mask.webp`
- **Size**: 256×256px, tileable
- **Content**: A repeating slot-mask or aperture-grille pattern (vertical stripes of very slight darkness, ~2px period)
- **Usage**: Blended over the VideoTexture on the monitor screen at ~15% opacity

---

## 6. DRACO COMPRESSION GUIDE

After modeling, compress every GLB:

```bash
# Install gltf-transform CLI
npm install -g @gltf-transform/cli

# Compress with Draco
npx gltf-transform optimize superpet-computer.glb superpet-computer-opt.glb \
  --compress draco \
  --texture-compress webp \
  --texture-size 1024

# Verify output size
ls -lah superpet-computer-opt.glb
```

**Target sizes (compressed)**:
```
superpet-computer.glb    < 3.0 MB
golden-tie.glb           < 1.0 MB
phones-array.glb         < 2.0 MB
shredder-machine.glb     < 1.5 MB
TOTAL                    < 7.5 MB
```

---

## 7. THREE.JS DRACO DECODER SETUP

The web app must include the Draco decoder to read compressed GLBs:

```typescript
// src/utils/loaders.ts
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');  // served from /public/draco/

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

export { gltfLoader };
```

Copy the Draco decoder files from `three/examples/jsm/libs/draco/` into `/public/draco/`.

In R3F, configure via `<Canvas>`:
```tsx
import { extend } from '@react-three/fiber';
// Use useGLTF from @react-three/drei which handles this automatically:
useGLTF.preload('/models/superpet-computer.glb');
```

---

## 8. QUALITY CHECKLIST (per model, before delivery)

For each GLB, the 3D artist must confirm:

- [ ] No n-gons (all faces are triangles or quads)
- [ ] No overlapping UVs (except intentional mirrored UVs)
- [ ] All meshes have correct world transforms applied (`Object → Apply → All Transforms` in Blender)
- [ ] Origin is set as specified per model
- [ ] All materials use PBR (no legacy Blinn-Phong or unlit materials — except `monitor_screen` which is intentionally emissive)
- [ ] No stray loose vertices or edges
- [ ] Normals are correct direction (no inverted normals)
- [ ] File opens correctly in `gltf.report` online validator (zero errors)
- [ ] DRACO compressed version loads in Three.js sandbox (test via threejs.org/editor)
- [ ] Compressed file size is within budget
- [ ] Visual parity check: side-by-side with original shader.se confirmed by art director
