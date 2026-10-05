# Attribution — canvas-ui components

All 35 files in this directory are vendored from **[DavidHDev/canvas-ui](https://github.com/DavidHDev/canvas-ui)** (`main` branch), which is MIT licensed. Upstream copyright notice:

> Copyright (c) David Healey
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## What changed in the port

Only three things, and nothing else:

1. **Every export is renamed with a `Cx` prefix** (`Blaze` -> `CxBlaze`, `Bend` -> `CxBend`) so nothing in this
   directory can collide with the host project's own component names. Prop names, defaults, behaviour and JSDoc are
   byte-for-byte upstream.
2. **The React wrapper and its engine were consolidated into one file.** Upstream ships `src/lib/<Name>/<Name>.tsx`
   (a thin React wrapper) plus `src/lib/<Name>/<Name>Vanilla.ts` (the actual canvas/WebGL engine). Both are now in
   `<kebab-name>.tsx`: the engine first under an `Engine` banner, the component second under a `React component`
   banner. Upstream's full export surface is preserved — including `Cxcreate<Name>` for the vanilla factory — so
   engine-only consumers keep working. Engine-internal helpers that were never exported upstream stay module-local.
3. **The three shared helpers were hoisted to `./canvas-runtime`.** Upstream `src/lib/canvas-viewport.ts`,
   `src/lib/html-in-canvas.ts` and `src/lib/rect-cache.ts` are imported by all 35 engines; copying them 35 times would
   be ~4k lines of duplicated code, so they live in `canvas-runtime.ts` (not a component, no `use client`).

### CSS

Upstream ships **no CSS files** for any of these components. Every one of them styles itself with inline `style={{...}}`
objects and accepts a pass-through `className` prop — no component in the repo emits a single literal CSS class name.
There was therefore no stylesheet to inline and no `cx-`-prefixed class to emit. Nothing in this directory can collide
with the host project's `ax-` design tokens, and no `<style>` tag is injected. (`canvas-runtime.ts` also emits no CSS.)

The `layoutsubtree` / `content` attributes and the `drawElementImage` call used by 29 of these components depend on
the **experimental HTML-in-canvas** API. Every affected component feature-detects it with `useSyncExternalStore` and
falls back to plain DOM rendering when it is unavailable, so all 35 are safe to render in any browser and on the server.

## Mapping: original -> renamed export -> upstream path

| Original name | Vendored file | Component export | All exports in that file |
| --- | --- | --- | --- |
| `AsciiObject` | `ascii-object.tsx` | `CxAsciiObject`<br>(default export) | `CxAsciiObject`<br>`CxAsciiObjectElements`<br>`CxAsciiObjectInstance`<br>`CxAsciiObjectOptions`<br>`CxAsciiObjectProps`<br>`CxcreateAsciiObject` |
| `AsciiSweep` | `ascii-sweep.tsx` | `CxAsciiSweep`<br>(default export) | `CxAsciiSweep`<br>`CxAsciiSweepBlend`<br>`CxAsciiSweepCharset`<br>`CxAsciiSweepElements`<br>`CxAsciiSweepInstance`<br>`CxAsciiSweepOptions`<br>`CxAsciiSweepProps`<br>`CxAsciiSweepSlot`<br>`CxcreateAsciiSweep`<br>`CxsupportsHtmlInCanvas` |
| `Asciify` | `asciify.tsx` | `CxAsciify`<br>(default export) | `CxAsciify`<br>`CxAsciifyCharset`<br>`CxAsciifyElements`<br>`CxAsciifyInstance`<br>`CxAsciifyOptions`<br>`CxAsciifyProps`<br>`CxcreateAsciify`<br>`CxsupportsHtmlInCanvas` |
| `Bend` | `bend.tsx` | `CxBend`<br>(default export) | `CxBend`<br>`CxBendElements`<br>`CxBendInstance`<br>`CxBendOptions`<br>`CxBendProps`<br>`CxcreateBend`<br>`CxsupportsHtmlInCanvas` |
| `Blaze` | `blaze.tsx` | `CxBlaze`<br>(default export) | `CxBlaze`<br>`CxBlazeElements`<br>`CxBlazeInstance`<br>`CxBlazeOptions`<br>`CxBlazeProps`<br>`CxcreateBlaze`<br>`CxsupportsHtmlInCanvas` |
| `Bubble` | `bubble.tsx` | `CxBubble`<br>(default export) | `CxBubble`<br>`CxBubbleElements`<br>`CxBubbleInstance`<br>`CxBubbleOptions`<br>`CxBubbleProps`<br>`CxcreateBubble`<br>`CxsupportsHtmlInCanvas` |
| `Canvas` | `canvas.tsx` | `CxCanvas`<br>(default export) | `CxCanvas`<br>`CxCanvasElements`<br>`CxCanvasInstance`<br>`CxCanvasOptions`<br>`CxCanvasProps`<br>`CxcreateCanvas`<br>`CxsupportsHtmlInCanvas` |
| `Cloth` | `cloth.tsx` | `CxCloth`<br>(default export) | `CxCloth`<br>`CxClothElements`<br>`CxClothInstance`<br>`CxClothOptions`<br>`CxClothPin`<br>`CxClothProps`<br>`CxcreateCloth`<br>`CxsupportsHtmlInCanvas` |
| `Clouds` | `clouds.tsx` | `CxClouds`<br>(default export) | `CxClouds`<br>`CxCloudsElements`<br>`CxCloudsInstance`<br>`CxCloudsOptions`<br>`CxCloudsProps`<br>`CxcreateClouds`<br>`CxsupportsHtmlInCanvas` |
| `DecryptReveal` | `decrypt-reveal.tsx` | `CxDecryptReveal`<br>(default export) | `CxDecryptReveal`<br>`CxDecryptRevealElements`<br>`CxDecryptRevealInstance`<br>`CxDecryptRevealOptions`<br>`CxDecryptRevealProps`<br>`CxcreateDecryptReveal`<br>`CxsupportsHtmlInCanvas` |
| `Displacement` | `displacement.tsx` | `CxDisplacement`<br>(default export) | `CxDisplacement`<br>`CxDisplacementElements`<br>`CxDisplacementInstance`<br>`CxDisplacementOptions`<br>`CxDisplacementProps`<br>`CxcreateDisplacement`<br>`CxsupportsHtmlInCanvas` |
| `DitheredObject` | `dithered-object.tsx` | `CxDitheredObject`<br>(default export) | `CxDitherMethod`<br>`CxDitheredObject`<br>`CxDitheredObjectElements`<br>`CxDitheredObjectInstance`<br>`CxDitheredObjectOptions`<br>`CxDitheredObjectProps`<br>`CxcreateDitheredObject` |
| `Droplets` | `droplets.tsx` | `CxDroplets`<br>(default export) | `CxDroplets`<br>`CxDropletsElements`<br>`CxDropletsInstance`<br>`CxDropletsOptions`<br>`CxDropletsProps`<br>`CxcreateDroplets`<br>`CxsupportsHtmlInCanvas` |
| `FlameWrap` | `flame-wrap.tsx` | `CxFlameWrap`<br>(default export) | `CxFlameWrap`<br>`CxFlameWrapElements`<br>`CxFlameWrapInstance`<br>`CxFlameWrapOptions`<br>`CxFlameWrapProps`<br>`CxcreateFlameWrap`<br>`CxsupportsHtmlInCanvas` |
| `ForceField` | `force-field.tsx` | `CxForceField`<br>(default export) | `CxForceField`<br>`CxForceFieldElements`<br>`CxForceFieldGridReveal`<br>`CxForceFieldInstance`<br>`CxForceFieldOptions`<br>`CxForceFieldProps`<br>`CxForceFieldShape`<br>`CxcreateForceField`<br>`CxsupportsHtmlInCanvas` |
| `Frost` | `frost.tsx` | `CxFrost`<br>(default export) | `CxFrost`<br>`CxFrostElements`<br>`CxFrostInstance`<br>`CxFrostOptions`<br>`CxFrostProps`<br>`CxcreateFrost`<br>`CxsupportsHtmlInCanvas` |
| `Glass` | `glass.tsx` | `CxGlass`<br>(default export) | `CxGlass`<br>`CxGlassElements`<br>`CxGlassInstance`<br>`CxGlassOptions`<br>`CxGlassProps`<br>`CxcreateGlass`<br>`CxsupportsHtmlInCanvas` |
| `GlassObject` | `glass-object.tsx` | `CxGlassObject`<br>(default export) | `CxGlassObject`<br>`CxGlassObjectElements`<br>`CxGlassObjectInstance`<br>`CxGlassObjectOptions`<br>`CxGlassObjectProps`<br>`CxcreateGlassObject` |
| `Glitch` | `glitch.tsx` | `CxGlitch`<br>(default export) | `CxGlitch`<br>`CxGlitchElements`<br>`CxGlitchInstance`<br>`CxGlitchOptions`<br>`CxGlitchProps`<br>`CxcreateGlitch`<br>`CxsupportsHtmlInCanvas` |
| `GlyphRain` | `glyph-rain.tsx` | `CxGlyphRain`<br>(default export) | `CxGlyphRain`<br>`CxGlyphRainElements`<br>`CxGlyphRainInstance`<br>`CxGlyphRainOptions`<br>`CxGlyphRainProps`<br>`CxcreateGlyphRain`<br>`CxsupportsHtmlInCanvas` |
| `Grid` | `grid.tsx` | `CxGrid`<br>(default export) | `CxGrid`<br>`CxGridElements`<br>`CxGridInstance`<br>`CxGridOptions`<br>`CxGridProps`<br>`CxcreateGrid`<br>`CxsupportsHtmlInCanvas` |
| `HexFloat` | `hex-float.tsx` | `CxHexFloat`<br>(default export) | `CxHexFloat`<br>`CxHexFloatElements`<br>`CxHexFloatInstance`<br>`CxHexFloatOptions`<br>`CxHexFloatProps`<br>`CxcreateHexFloat`<br>`CxsupportsHtmlInCanvas` |
| `InkObject` | `ink-object.tsx` | `CxInkObject`<br>(default export) | `CxInkObject`<br>`CxInkObjectElements`<br>`CxInkObjectInstance`<br>`CxInkObjectOptions`<br>`CxInkObjectProps`<br>`CxcreateInkObject` |
| `Laser` | `laser.tsx` | `CxLaser`<br>(default export) | `CxLaser`<br>`CxLaserElements`<br>`CxLaserInstance`<br>`CxLaserOptions`<br>`CxLaserProps`<br>`CxcreateLaser`<br>`CxsupportsHtmlInCanvas` |
| `Liquid` | `liquid.tsx` | `CxLiquid`<br>(default export) | `CxLiquid`<br>`CxLiquidElements`<br>`CxLiquidInstance`<br>`CxLiquidOptions`<br>`CxLiquidProps`<br>`CxcreateLiquid`<br>`CxsupportsHtmlInCanvas` |
| `LiquidObject` | `liquid-object.tsx` | `CxLiquidObject`<br>(default export) | `CxLiquidObject`<br>`CxLiquidObjectElements`<br>`CxLiquidObjectInstance`<br>`CxLiquidObjectOptions`<br>`CxLiquidObjectProps`<br>`CxcreateLiquidObject` |
| `Magnify` | `magnify.tsx` | `CxMagnify`<br>(default export) | `CxMagnify`<br>`CxMagnifyElements`<br>`CxMagnifyInstance`<br>`CxMagnifyOptions`<br>`CxMagnifyProps`<br>`CxZoomModifier`<br>`CxcreateMagnify`<br>`CxsupportsHtmlInCanvas` |
| `ParticleObject` | `particle-object.tsx` | `CxParticleObject`<br>(default export) | `CxParticleObject`<br>`CxParticleObjectElements`<br>`CxParticleObjectInstance`<br>`CxParticleObjectOptions`<br>`CxParticleObjectProps`<br>`CxcreateParticleObject` |
| `ParticleReveal` | `particle-reveal.tsx` | `CxParticleReveal`<br>(default export) | `CxParticleReveal`<br>`CxParticleRevealElements`<br>`CxParticleRevealInstance`<br>`CxParticleRevealOptions`<br>`CxParticleRevealProps`<br>`CxcreateParticleReveal`<br>`CxsupportsHtmlInCanvas` |
| `ParticleScroll` | `particle-scroll.tsx` | `CxParticleScroll`<br>(default export) | `CxParticleScroll`<br>`CxParticleScrollElements`<br>`CxParticleScrollInstance`<br>`CxParticleScrollOptions`<br>`CxParticleScrollProps`<br>`CxcreateParticleScroll`<br>`CxsupportsHtmlInCanvas` |
| `Peel` | `peel.tsx` | `CxPeel`<br>(default export) | `CxPeel`<br>`CxPeelElements`<br>`CxPeelInstance`<br>`CxPeelMode`<br>`CxPeelOptions`<br>`CxPeelProps`<br>`CxPeelSide`<br>`CxcreatePeel`<br>`CxsupportsHtmlInCanvas` |
| `RetroDither` | `retro-dither.tsx` | `CxRetroDither`<br>(default export) | `CxRetroDither`<br>`CxRetroDitherElements`<br>`CxRetroDitherInstance`<br>`CxRetroDitherOptions`<br>`CxRetroDitherProps`<br>`CxcreateRetroDither`<br>`CxsupportsHtmlInCanvas` |
| `Ripple` | `ripple.tsx` | `CxRipple`<br>(default export) | `CxRipple`<br>`CxRippleElements`<br>`CxRippleInstance`<br>`CxRippleOptions`<br>`CxRippleProps`<br>`CxRippleTrigger`<br>`CxcreateRipple`<br>`CxsupportsHtmlInCanvas` |
| `Shatter` | `shatter.tsx` | `CxShatter`<br>(default export) | `CxShatter`<br>`CxShatterElements`<br>`CxShatterInstance`<br>`CxShatterOptions`<br>`CxShatterProps`<br>`CxcreateShatter`<br>`CxsupportsHtmlInCanvas` |
| `VHS` | `vhs.tsx` | `CxVHS`<br>(default export) | `CxVHS`<br>`CxVHSElements`<br>`CxVHSInstance`<br>`CxVHSOptions`<br>`CxVHSProps`<br>`CxcreateVHS`<br>`CxsupportsHtmlInCanvas` |

The `Cx<Name>` entry in the *all exports* column is the component itself and is also the default export. Every other
entry is a type (or, for `Cxcreate<Name>` / `CxsupportsHtmlInCanvas`, an engine factory / feature-detection helper)
that upstream exported from `<Name>Vanilla.ts`; it is exported from the consolidated file under the renamed
identifier, at its declaration site in the `Engine` section rather than in a trailing re-export list.

Upstream source paths follow the pattern `src/lib/<Name>/<Name>.tsx` + `src/lib/<Name>/<Name>Vanilla.ts`.
Upstream's per-component `Demo.tsx`, the `.vue` / `.svelte` / `.preact.tsx` / `.solid.tsx` framework ports and the
`<Name>WebGPU.ts` alternative renderers were **not** vendored — this directory is the React/Next.js port only.

## Shared runtime helper

| Vendored file | Upstream source |
| --- | --- |
| `canvas-runtime.ts` | `src/lib/canvas-viewport.ts`, `src/lib/html-in-canvas.ts`, `src/lib/rect-cache.ts` |

## Non-relative imports used by this directory

| Specifier | Needed by |
| --- | --- |
| `react` | all 35 |
| `three` | `ascii-object`, `dithered-object`, `glass-object`, `ink-object`, `liquid-object`, `particle-object` |
| `three/addons/controls/OrbitControls.js` | same six |
| `three/addons/loaders/DRACOLoader.js` | same six |
| `three/addons/loaders/GLTFLoader.js` | same six |
| `three/addons/loaders/SVGLoader.js` | `glass-object`, `liquid-object` |
| `three/addons/utils/BufferGeometryUtils.js` | `glass-object`, `liquid-object` |
| `./canvas-runtime` (relative, local) | 35 |

Nothing else. No `@/lib/utils` `cn`, no `@/components/ui/*`, no `framer-motion`, no WebGPU renderer.
