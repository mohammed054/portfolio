# 16 — DEV ENVIRONMENT & PROJECT SETUP
## From Zero to Running in 15 Minutes

---

## OVERVIEW

This document covers everything needed to get the Shader rebuild running locally, configured correctly, and ready for development. Follow this exactly before touching any code.

---

## 1. PREREQUISITES

```
Node.js:  v20.x LTS or higher (use nvm)
npm:      v10.x or higher (comes with Node 20)
Git:      any recent version
VSCode:   recommended (extensions below)
```

**Install Node via nvm** (recommended):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
nvm use 20
node --version  # should print v20.x.x
```

---

## 2. PROJECT INITIALIZATION

```bash
# Clone the repo
git clone https://github.com/[org]/shader-rebuild.git
cd shader-rebuild

# Install dependencies
npm install

# Copy Draco decoder files (needed for compressed 3D models)
cp -r node_modules/three/examples/jsm/libs/draco public/draco

# Start dev server
npm run dev
```

Open `http://localhost:5173` — Vite's default port.

---

## 3. VITE CONFIG

**File**: `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    glsl(),      // enables importing .glsl files as strings
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@sections': path.resolve(__dirname, './src/sections'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.glsl'],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 3000,  // GLB chunks are large
    rollupOptions: {
      output: {
        manualChunks: {
          'three':    ['three'],
          'r3f':      ['@react-three/fiber', '@react-three/drei'],
          'gsap':     ['gsap'],
          'vendor':   ['react', 'react-dom', 'framer-motion'],
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['@react-three/fiber', '@react-three/drei'], // avoid pre-bundling issues
  },
  server: {
    host: true,           // expose on local network (for device testing)
    port: 5173,
  }
});
```

---

## 4. TSCONFIG

**File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*":            ["./src/*"],
      "@components/*":  ["./src/components/*"],
      "@sections/*":    ["./src/sections/*"],
      "@hooks/*":       ["./src/hooks/*"],
      "@utils/*":       ["./src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 5. PACKAGE.JSON SCRIPTS

```json
{
  "scripts": {
    "dev":      "vite",
    "build":    "tsc && vite build",
    "preview":  "vite preview",
    "lint":     "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit",
    "analyze":  "ANALYZE=true vite build"
  }
}
```

---

## 6. PROJECT INIT SEQUENCE (index.html + main.tsx)

**File**: `index.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Shader Development Studio — A Creative Development Studio, Plugged into the Future" />
  <title>Shader Development Studio</title>

  <!-- Fonts — self-hosted -->
  <style>
    @font-face {
      font-family: 'Playfair Display';
      src: url('/fonts/playfair-display-900.woff2') format('woff2');
      font-weight: 900;
      font-display: block;
    }
    @font-face {
      font-family: 'Playfair Display';
      src: url('/fonts/playfair-display-700.woff2') format('woff2');
      font-weight: 700;
      font-display: block;
    }
    @font-face {
      font-family: 'EB Garamond';
      src: url('/fonts/eb-garamond-400.woff2') format('woff2');
      font-weight: 400;
      font-display: block;
    }
    @font-face {
      font-family: 'Courier Prime';
      src: url('/fonts/courier-prime-400.woff2') format('woff2');
      font-weight: 400;
      font-display: block;
    }
  </style>

  <!-- Preload critical fonts -->
  <link rel="preload" href="/fonts/playfair-display-900.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/eb-garamond-400.woff2" as="font" type="font/woff2" crossorigin />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

  <!-- OG / Social meta -->
  <meta property="og:title" content="Shader Development Studio" />
  <meta property="og:description" content="A Creative Development Studio, Plugged into the Future" />
  <meta property="og:image" content="/og-image.jpg" />
  <meta property="og:url" content="https://shader.se" />
  <meta name="twitter:card" content="summary_large_image" />
</head>
<body>
  <a href="#main-content" class="skip-to-content">Skip to content</a>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

**File**: `src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import App from './App';
import './index.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**File**: `src/App.tsx`

```tsx
import { useState } from 'react';
import { SmoothScroll } from '@components/shared/SmoothScroll';
import { GrainOverlay } from '@components/shared/GrainOverlay';
import { Navbar } from '@components/Navbar/Navbar';
import { Preloader } from '@components/Preloader/Preloader';

// Section imports
import { Hero } from '@sections/01-Hero/Hero';
import { SelectedWork } from '@sections/02-SelectedWork/SelectedWork';
import { AboutHero } from '@sections/03-AboutHero/AboutHero';
import { AboutCopy } from '@sections/04-AboutCopy/AboutCopy';
import { AboutVintage } from '@sections/05-AboutVintage/AboutVintage';
import { Shredder } from '@sections/06-Shredder/Shredder';
import { ContactTease } from '@sections/07-ContactTease/ContactTease';
import { GoldenTie } from '@sections/08-GoldenTie/GoldenTie';
import { Handshake } from '@sections/09-Handshake/Handshake';
import { GoodBuy } from '@sections/10-GoodBuy/GoodBuy';
import { Footer } from '@sections/11-Footer/Footer';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SmoothScroll paused={isLoading}>
      <Preloader onComplete={() => setIsLoading(false)} />

      {!isLoading && (
        <>
          <GrainOverlay />
          <Navbar />

          <main id="main-content">
            <Hero />
            <SelectedWork />
            <AboutHero />
            <AboutCopy />
            <AboutVintage />
            <Shredder />
            <ContactTease />
            <GoldenTie />
            <Handshake />
            <GoodBuy />
            <Footer />
          </main>
        </>
      )}
    </SmoothScroll>
  );
}
```

---

## 7. RECOMMENDED VSCODE EXTENSIONS

```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",        // formatting
    "dbaeumer.vscode-eslint",         // linting
    "bradlc.vscode-tailwindcss",      // n/a for this project but useful anyway
    "ms-vscode.vscode-typescript-next", // latest TS features
    "antfu.unocss",                   // n/a
    "slevesque.vscode-glsl",          // GLSL syntax highlighting
    "unifiedjs.vscode-mdx",           // markdown
    "eamodio.gitlens",                // git history
    "yoavbls.pretty-ts-errors",       // better TS error display
    "naumovs.color-highlight"         // see color values inline
  ]
}
```

---

## 8. ESLINT CONFIG

**File**: `.eslintrc.cjs`

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
```

---

## 9. ENVIRONMENT VARIABLES

**File**: `.env.local` (never commit this)

```bash
# Cal.com integration
VITE_CALCOM_URL=https://cal.com/simon-hedlund-kglzne

# Analytics (if used)
VITE_ANALYTICS_ID=

# Feature flags
VITE_ENABLE_3D=true       # set false to disable all Three.js for fast iteration
VITE_ENABLE_GRAIN=true    # set false to disable grain overlay
VITE_ENABLE_PRELOADER=true # set false during development to skip preloader
```

Usage in code:
```typescript
const cal = import.meta.env.VITE_CALCOM_URL;
const skip = import.meta.env.VITE_ENABLE_PRELOADER === 'false';
```

**Note on `VITE_ENABLE_PRELOADER`**: During development, the preloader blocks the page on every save/reload — extremely annoying. Set this to `false` locally. Set to `true` for staging and production.

---

## 10. DEPLOYMENT

### Build
```bash
npm run build
# Output: /dist directory (static files)
```

### Cloudflare Pages
1. Connect GitHub repo to Cloudflare Pages
2. Build command: `npm run build`
3. Output directory: `dist`
4. Node version: `20`

**Important**: Add `_headers` file to `/public/`:
```
# /public/_headers
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cache-Control: public, max-age=0, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/models/*
  Cache-Control: public, max-age=604800
  Content-Type: model/gltf-binary

/fonts/*
  Cache-Control: public, max-age=31536000, immutable
```

And `_redirects` for SPA routing:
```
# /public/_redirects
/* /index.html 200
```

---

## 11. BRANCH STRATEGY

```
main          ← production branch (auto-deploys to shader.se)
staging       ← staging branch (auto-deploys to staging.shader.se)
develop       ← integration branch (all features merge here)
feature/*     ← individual feature branches
section/*     ← section-specific branches (section/hero, section/work, etc.)
fix/*         ← bug fix branches
```

**PR rules**:
- All PRs target `develop`
- `develop` → `staging` requires 1 review
- `staging` → `main` requires 2 reviews + QA sign-off (see doc 17)
- No direct pushes to `main` or `staging`

---

## 12. TASK ALLOCATION SUGGESTION (for $50-60k budget)

| Role | Responsibility | Est. Allocation |
|------|---------------|-----------------|
| Lead Frontend Dev | Core architecture, Lenis/GSAP system, Preloader, Hero, Film Strip | 35% |
| 3D / WebGL Dev | Three.js scenes (Hero, Tie, Phones), R3F components, postprocessing | 30% |
| Frontend Dev | About sections, Footer, Shredder DOM, Contact sections | 20% |
| 3D Artist | All GLB models (SuperPET, Tie, Phones, Shredder) | 10% |
| QA / Polish | Cross-browser, mobile, performance, accessibility | 5% |

**Timeline suggestion**: 10–12 weeks for full delivery
- Week 1–2: Environment, shared components, Preloader
- Week 3–4: Hero + 3D computer
- Week 5–6: Film Strip carousel
- Week 7–8: About sections + Shredder
- Week 9–10: Contact sections + Golden Tie + Good Buy
- Week 11: Footer + all integrations
- Week 12: QA, polish, accessibility, performance
