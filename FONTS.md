# Font Setup

The shipped implementation uses DM Sans for display/UI typography and
JetBrains Mono for system readouts.

## Current Runtime Assets

```text
public/fonts/
|- DM-Sans-Regular.ttf
|- DM-Sans-Medium.ttf
|- DM-Sans-Bold.ttf
`- JetBrainsMono-Regular.ttf
```

## How Fonts Are Used

- HTML typography is loaded through `next/font/google` in `src/app/layout.tsx`.
- 3D scene text loads `/fonts/DM-Sans-Bold.ttf` directly in
  `src/components/primitives/SystemText.tsx`.
- Dragon text particles use the `System Display` `@font-face` declared in
  `src/app/globals.css`, which points to the same bold DM Sans file.

## Legacy Blueprint Files

The original blueprint referenced local `.woff2` files named after Suisse Intl.
Those placeholder files may still exist in `public/fonts/`, but the runtime does
not read from them anymore.

If you later license Suisse Intl and want to swap it in:

1. Replace the legacy placeholder files with real webfont files.
2. Update `src/app/layout.tsx` to load them.
3. Update `src/components/primitives/SystemText.tsx` and
   `src/app/globals.css` to point the scene/canvas text at the new asset.

## Verification

Run:

```bash
npm run build
npm run lint
npm run type-check
```

Then open the site and scroll into the identifying and dragon ranges to confirm
the console stays clean while 3D text and text particles render.
