# Attribution — DavidHDev/react-bits

All files in `backgrounds/` and `animations/` are vendored from
**[DavidHDev/react-bits](https://github.com/DavidHDev/react-bits)**, `main` branch,
directory `src/ts-default/`.

## ⚠️ Licence — please read

The current `main` branch of react-bits is **not** plain MIT. Its `LICENSE.md` is
**"MIT + Commons Clause License Condition v1.0"** (© 2026 David Haz). The Commons Clause
adds a restriction that plain MIT does not have:

> You may use this Software, including for any commercial purpose, **so long as you do not
> sell, sublicense, or redistribute the components themselves — whether alone, in a bundle,
> or as a ported version.**

Embedding these components inside an application is the sanctioned use case, but
**re-publishing `src/components/ax/bits/backgrounds/` or `src/components/ax/bits/animations/`
as a standalone component package / template / shadcn registry is not permitted** under the
Commons Clause. Older tags of the repo were plain MIT; confirm the licence of the exact tag
you vendor from before redistributing these files.

The verbatim upstream `LICENSE.md` is reproduced at the bottom of this file.

## What was changed when vendoring

The components are byte-for-byte upstream apart from the following mechanical
transformations. Props, defaults and runtime behaviour are unchanged.

| Change | Detail |
| --- | --- |
| `"use client";` | Hoisted to the top of every file (all 132 upstream files already had it). |
| Export rename | Every exported **component** is prefixed with `Rb` (the only public-API change). Exported `interface`/`type`/`enum` declarations are prefixed with `Rb` too, so nothing can collide with the 113 Aceternity components already vendored in `src/components/ax/aceternity/` or with upstream names. |
| Filename | `<Name>.tsx` → `rb-<kebab-name>.tsx`. |
| CSS inlining | The companion `<Name>.css` is inlined as a module-level `String.raw` constant and rendered through a local `<RbInjectedStyle>` helper as the first child of the component's returned fragment. No global stylesheet was touched. |
| CSS namespacing | Every class selector, `#id`, `@keyframes` name and custom property from the companion stylesheet is rewritten to an `rb-<kebab>-*` namespace, in the CSS **and** in every string literal in the `.tsx` (`className`, `classList.*`, `querySelector*`, GSAP `charsClass`/`charsClass`, runtime-injected CSS strings, …). Nothing can leak into the host project's `ax-` prefixed design system. |
| `:root` blocks | `Cubes` and `StickerPeel` declared their custom properties on `:root`. Those blocks are re-scoped to `:where(.rb-<kebab>-<root-class>)` so the variables no longer land on `document.documentElement`. |
| Bare element selectors | `Hyperspeed` styled a bare `canvas { … }` rule; it is re-scoped to `#rb-hyperspeed-lights canvas { … }`. |
| Deviations | `GridMotion`, `PixelTransition` and `DotField` carry small SSR/hydration fixes, and `Antigravity`/`ScrollVelocity`/`Shuffle`/`SplitFlapText` carry small type fixes. All are listed under [Fixes applied](#fixes-applied) — everything else is untouched. |

A verbatim check was run over all 132 files: removing the injected `<RbInjectedStyle>`
fragment wrapper reproduces the un-wrapped transform byte-for-byte, proving the CSS
injection is purely additive.

## Fixes applied

| File | Upstream issue | Fix |
| --- | --- | --- |
| `backgrounds/rb-grid-motion.tsx` | `useRef<number>(window.innerWidth / 2)` reads `window` during render → `ReferenceError` during SSR. | Guarded with `typeof window !== 'undefined' ? … : 0`. |
| `animations/rb-pixel-transition.tsx` | `'ontouchstart' in window || navigator.maxTouchPoints …` reads `window`/`navigator` during render → `ReferenceError` during SSR. | Guarded with `typeof window !== 'undefined' && (…)`. |
| `backgrounds/rb-dot-field.tsx` | `useRef(`dot-field-glow-${Math.random()…}`)` — the random id is rendered as an SVG `id`/`url(#…)`, so server and client markup differ → hydration mismatch. | Replaced with React's `useId()` (sanitised to `[A-Za-z0-9]`). |
| `animations/rb-antigravity.tsx` | `const temp = []` infers `never[]` under `strict`. | `const temp: any[] = []`. |
| `animations/rb-scroll-velocity.tsx` | `const spans = []` infers `never[]` under `strict`. | `const spans: any[] = []`. |
| `animations/rb-shuffle.tsx` | `keyof JSX.IntrinsicElements` — the global `JSX` namespace was removed from React 19 types. | `keyof React.JSX.IntrinsicElements`. |
| `animations/rb-split-flap-text.tsx` | `useRef<ReturnType<typeof setTimeout>>` (Node `Timeout`) assigned from `window.setTimeout` (`number`) → type error. | Timer call made unqualified so both resolve to the same type. |

## Upstream issues reported but NOT changed

* `useRef(Math.random() …)` / `useRef(Date.now() …)` in `FaultyTerminal`, `LetterGlitch`,
  `Waves`, `GhostCursor`, `TextCursor` — the argument is re-evaluated on **every** render
  even though `useRef` ignores it, so a fresh `Random`-seeded `Noise` object is allocated
  each render in `Waves`. No hydration impact (the values never reach the DOM); left as-is
  because "fixing" it would mean changing the ref shape.
* `Antigravity` seeds its particle field with `Math.random()` inside `useMemo`, i.e. during
  render and during SSR. The values only feed an `InstancedMesh`, so React never compares
  them — no hydration warning, but server and client start from different particle layouts.
* `TextAnimations/ASCIIText.tsx` and `TextAnimations/StrokeText.tsx` both key off
  `:root[data-theme='light']`. The host app uses `next-themes`, which toggles a `class`, not a
  `data-theme` attribute, so `ASCIIText`'s light-mode colour-inversion rule never matches.
* `TextAnimations/VariableProximity.css` and `TextAnimations/TextPressure.tsx` `@import` a
  Google Font from inside a `<style>` tag, which is render-blocking and duplicates a request
  per component instance.
* `Animations/TargetCursor.tsx` — the `targetSelector` prop defaults to the **un-prefixed**
  string `'.cursor-target'`. That is intentional here: it is a consumer-supplied selector for
  *their* element, not one of the component's own classes, so it is left untouched.
* No invalid HTML nesting (block element inside `<p>`/`<span>`) and no missing React `key`
  props were found in any of the 132 components (checked with a TypeScript AST walk).

## External dependencies required

These are **not** installed. Everything else the vendored files import is already present in
the host project (`react`, `react-dom`, `three`, `@react-three/fiber`, `@react-three/drei`,
`motion/react`).

## Backgrounds — 59 components

| Vendored file | Upstream export | Renamed export | Upstream path |
| --- | --- | --- | --- |
| `backgrounds/rb-acid-squares.tsx` | `AcidSquares` | `RbAcidSquares` | `src/ts-default/Backgrounds/AcidSquares/AcidSquares.tsx` |
| `backgrounds/rb-aero-shards.tsx` | `AeroShards` | `RbAeroShards` | `src/ts-default/Backgrounds/AeroShards/AeroShards.tsx` |
| `backgrounds/rb-aurora.tsx` | `Aurora` | `RbAurora` | `src/ts-default/Backgrounds/Aurora/Aurora.tsx` |
| `backgrounds/rb-balatro.tsx` | `Balatro` | `RbBalatro` | `src/ts-default/Backgrounds/Balatro/Balatro.tsx` |
| `backgrounds/rb-ballpit.tsx` | `Ballpit` | `RbBallpit` | `src/ts-default/Backgrounds/Ballpit/Ballpit.tsx` |
| `backgrounds/rb-beams.tsx` | `Beams` | `RbBeams` | `src/ts-default/Backgrounds/Beams/Beams.tsx` |
| `backgrounds/rb-crt-warp.tsx` | `CRTWarp` | `RbCRTWarp` | `src/ts-default/Backgrounds/CRTWarp/CRTWarp.tsx` |
| `backgrounds/rb-color-bends.tsx` | `ColorBends` | `RbColorBends` | `src/ts-default/Backgrounds/ColorBends/ColorBends.tsx` |
| `backgrounds/rb-dark-veil.tsx` | `DarkVeil` | `RbDarkVeil` | `src/ts-default/Backgrounds/DarkVeil/DarkVeil.tsx` |
| `backgrounds/rb-dither.tsx` | `Dither` | `RbDither` | `src/ts-default/Backgrounds/Dither/Dither.tsx` |
| `backgrounds/rb-dot-field.tsx` | `DotField` | `RbDotField` | `src/ts-default/Backgrounds/DotField/DotField.tsx` |
| `backgrounds/rb-dot-grid.tsx` | `DotGrid` | `RbDotGrid` | `src/ts-default/Backgrounds/DotGrid/DotGrid.tsx` |
| `backgrounds/rb-evil-eye.tsx` | `EvilEye` | `RbEvilEye` | `src/ts-default/Backgrounds/EvilEye/EvilEye.tsx` |
| `backgrounds/rb-faulty-terminal.tsx` | `FaultyTerminal` | `RbFaultyTerminal` | `src/ts-default/Backgrounds/FaultyTerminal/FaultyTerminal.tsx` |
| `backgrounds/rb-ferrofluid.tsx` | `Ferrofluid` | `RbFerrofluid` | `src/ts-default/Backgrounds/Ferrofluid/Ferrofluid.tsx` |
| `backgrounds/rb-floating-lines.tsx` | `FloatingLines` | `RbFloatingLines` | `src/ts-default/Backgrounds/FloatingLines/FloatingLines.tsx` |
| `backgrounds/rb-galaxy.tsx` | `Galaxy` | `RbGalaxy` | `src/ts-default/Backgrounds/Galaxy/Galaxy.tsx` |
| `backgrounds/rb-ghost-fibers.tsx` | `GhostFibers` | `RbGhostFibers` | `src/ts-default/Backgrounds/GhostFibers/GhostFibers.tsx` |
| `backgrounds/rb-gradient-blinds.tsx` | `GradientBlinds` | `RbGradientBlinds` | `src/ts-default/Backgrounds/GradientBlinds/GradientBlinds.tsx` |
| `backgrounds/rb-gradient-waves.tsx` | `GradientWaves` | `RbGradientWaves` | `src/ts-default/Backgrounds/GradientWaves/GradientWaves.tsx` |
| `backgrounds/rb-grainient.tsx` | `Grainient` | `RbGrainient` | `src/ts-default/Backgrounds/Grainient/Grainient.tsx` |
| `backgrounds/rb-grid-distortion.tsx` | `GridDistortion` | `RbGridDistortion` | `src/ts-default/Backgrounds/GridDistortion/GridDistortion.tsx` |
| `backgrounds/rb-grid-motion.tsx` | `GridMotion` | `RbGridMotion` | `src/ts-default/Backgrounds/GridMotion/GridMotion.tsx` |
| `backgrounds/rb-grid-scan.tsx` | `GridScan` | `RbGridScan` | `src/ts-default/Backgrounds/GridScan/GridScan.tsx` |
| `backgrounds/rb-hyperspeed.tsx` | `Hyperspeed` | `RbHyperspeed` | `src/ts-default/Backgrounds/Hyperspeed/Hyperspeed.tsx` |
| `backgrounds/rb-iridescence.tsx` | `Iridescence` | `RbIridescence` | `src/ts-default/Backgrounds/Iridescence/Iridescence.tsx` |
| `backgrounds/rb-letter-glitch.tsx` | `LetterGlitch` | `RbLetterGlitch` | `src/ts-default/Backgrounds/LetterGlitch/LetterGlitch.tsx` |
| `backgrounds/rb-light-pillar.tsx` | `LightPillar` | `RbLightPillar` | `src/ts-default/Backgrounds/LightPillar/LightPillar.tsx` |
| `backgrounds/rb-light-rays.tsx` | `LightRays` | `RbLightRays` | `src/ts-default/Backgrounds/LightRays/LightRays.tsx` |
| `backgrounds/rb-light-tunnel.tsx` | `LightTunnel` | `RbLightTunnel` | `src/ts-default/Backgrounds/LightTunnel/LightTunnel.tsx` |
| `backgrounds/rb-lightfall.tsx` | `Lightfall` | `RbLightfall` | `src/ts-default/Backgrounds/Lightfall/Lightfall.tsx` |
| `backgrounds/rb-lightning.tsx` | `Lightning` | `RbLightning` | `src/ts-default/Backgrounds/Lightning/Lightning.tsx` |
| `backgrounds/rb-line-waves.tsx` | `LineWaves` | `RbLineWaves` | `src/ts-default/Backgrounds/LineWaves/LineWaves.tsx` |
| `backgrounds/rb-liquid-chrome.tsx` | `LiquidChrome` | `RbLiquidChrome` | `src/ts-default/Backgrounds/LiquidChrome/LiquidChrome.tsx` |
| `backgrounds/rb-liquid-ether.tsx` | `LiquidEther` | `RbLiquidEther` | `src/ts-default/Backgrounds/LiquidEther/LiquidEther.tsx` |
| `backgrounds/rb-micro-slats.tsx` | `MicroSlats` | `RbMicroSlats` | `src/ts-default/Backgrounds/MicroSlats/MicroSlats.tsx` |
| `backgrounds/rb-molten-metal.tsx` | `MoltenMetal` | `RbMoltenMetal` | `src/ts-default/Backgrounds/MoltenMetal/MoltenMetal.tsx` |
| `backgrounds/rb-orb.tsx` | `Orb` | `RbOrb` | `src/ts-default/Backgrounds/Orb/Orb.tsx` |
| `backgrounds/rb-particles.tsx` | `Particles` | `RbParticles` | `src/ts-default/Backgrounds/Particles/Particles.tsx` |
| `backgrounds/rb-pattern-waves.tsx` | `PatternWaves` | `RbPatternWaves` | `src/ts-default/Backgrounds/PatternWaves/PatternWaves.tsx` |
| `backgrounds/rb-pixel-blast.tsx` | `PixelBlast` | `RbPixelBlast` | `src/ts-default/Backgrounds/PixelBlast/PixelBlast.tsx` |
| `backgrounds/rb-pixel-snow.tsx` | `PixelSnow` | `RbPixelSnow` | `src/ts-default/Backgrounds/PixelSnow/PixelSnow.tsx` |
| `backgrounds/rb-plasma.tsx` | `Plasma` | `RbPlasma` | `src/ts-default/Backgrounds/Plasma/Plasma.tsx` |
| `backgrounds/rb-plasma-wave.tsx` | `PlasmaWave` | `RbPlasmaWave` | `src/ts-default/Backgrounds/PlasmaWave/PlasmaWave.tsx` |
| `backgrounds/rb-prism.tsx` | `Prism` | `RbPrism` | `src/ts-default/Backgrounds/Prism/Prism.tsx` |
| `backgrounds/rb-prismatic-burst.tsx` | `PrismaticBurst` | `RbPrismaticBurst` | `src/ts-default/Backgrounds/PrismaticBurst/PrismaticBurst.tsx` |
| `backgrounds/rb-radar.tsx` | `Radar` | `RbRadar` | `src/ts-default/Backgrounds/Radar/Radar.tsx` |
| `backgrounds/rb-ripple-grid.tsx` | `RippleGrid` | `RbRippleGrid` | `src/ts-default/Backgrounds/RippleGrid/RippleGrid.tsx` |
| `backgrounds/rb-scanner.tsx` | `Scanner` | `RbScanner` | `src/ts-default/Backgrounds/Scanner/Scanner.tsx` |
| `backgrounds/rb-shape-grid.tsx` | `ShapeGrid` | `RbShapeGrid` | `src/ts-default/Backgrounds/ShapeGrid/ShapeGrid.tsx` |
| `backgrounds/rb-shape-waves.tsx` | `ShapeWaves` | `RbShapeWaves` | `src/ts-default/Backgrounds/ShapeWaves/ShapeWaves.tsx` |
| `backgrounds/rb-side-rays.tsx` | `SideRays` | `RbSideRays` | `src/ts-default/Backgrounds/SideRays/SideRays.tsx` |
| `backgrounds/rb-silk.tsx` | `Silk` | `RbSilk` | `src/ts-default/Backgrounds/Silk/Silk.tsx` |
| `backgrounds/rb-sliced-waves.tsx` | `SlicedWaves` | `RbSlicedWaves` | `src/ts-default/Backgrounds/SlicedWaves/SlicedWaves.tsx` |
| `backgrounds/rb-soft-aurora.tsx` | `SoftAurora` | `RbSoftAurora` | `src/ts-default/Backgrounds/SoftAurora/SoftAurora.tsx` |
| `backgrounds/rb-threads.tsx` | `Threads` | `RbThreads` | `src/ts-default/Backgrounds/Threads/Threads.tsx` |
| `backgrounds/rb-topography.tsx` | `Topography` | `RbTopography` | `src/ts-default/Backgrounds/Topography/Topography.tsx` |
| `backgrounds/rb-waves.tsx` | `Waves` | `RbWaves` | `src/ts-default/Backgrounds/Waves/Waves.tsx` |
| `backgrounds/rb-web-threads.tsx` | `WebThreads` | `RbWebThreads` | `src/ts-default/Backgrounds/WebThreads/WebThreads.tsx` |

## Animations — 40 components

| Vendored file | Upstream export | Renamed export | Upstream path |
| --- | --- | --- | --- |
| `animations/rb-animated-content.tsx` | `AnimatedContent` | `RbAnimatedContent` | `src/ts-default/Animations/AnimatedContent/AnimatedContent.tsx` |
| `animations/rb-antigravity.tsx` | `Antigravity` | `RbAntigravity` | `src/ts-default/Animations/Antigravity/Antigravity.tsx` |
| `animations/rb-blob-cursor.tsx` | `BlobCursor` | `RbBlobCursor` | `src/ts-default/Animations/BlobCursor/BlobCursor.tsx` |
| `animations/rb-click-spark.tsx` | `ClickSpark` | `RbClickSpark` | `src/ts-default/Animations/ClickSpark/ClickSpark.tsx` |
| `animations/rb-crosshair.tsx` | `Crosshair` | `RbCrosshair` | `src/ts-default/Animations/Crosshair/Crosshair.tsx` |
| `animations/rb-cubes.tsx` | `Cubes` | `RbCubes` | `src/ts-default/Animations/Cubes/Cubes.tsx` |
| `animations/rb-cursor-grid.tsx` | `CursorGrid` | `RbCursorGrid` | `src/ts-default/Animations/CursorGrid/CursorGrid.tsx` |
| `animations/rb-dither-veil.tsx` | `DitherVeil` | `RbDitherVeil` | `src/ts-default/Animations/DitherVeil/DitherVeil.tsx` |
| `animations/rb-elastic-mesh.tsx` | `ElasticMesh` | `RbElasticMesh` | `src/ts-default/Animations/ElasticMesh/ElasticMesh.tsx` |
| `animations/rb-electric-border.tsx` | `ElectricBorder` | `RbElectricBorder` | `src/ts-default/Animations/ElectricBorder/ElectricBorder.tsx` |
| `animations/rb-electric-logo.tsx` | `ElectricLogo` | `RbElectricLogo` | `src/ts-default/Animations/ElectricLogo/ElectricLogo.tsx` |
| `animations/rb-fade-content.tsx` | `FadeContent` | `RbFadeContent` | `src/ts-default/Animations/FadeContent/FadeContent.tsx` |
| `animations/rb-ghost-cursor.tsx` | `GhostCursor` | `RbGhostCursor` | `src/ts-default/Animations/GhostCursor/GhostCursor.tsx` |
| `animations/rb-glare-hover.tsx` | `GlareHover` | `RbGlareHover` | `src/ts-default/Animations/GlareHover/GlareHover.tsx` |
| `animations/rb-glow-cursor.tsx` | `GlowCursor` | `RbGlowCursor` | `src/ts-default/Animations/GlowCursor/GlowCursor.tsx` |
| `animations/rb-gradual-blur.tsx` | `GradualBlur` | `RbGradualBlur` | `src/ts-default/Animations/GradualBlur/GradualBlur.tsx` |
| `animations/rb-halftone-reveal.tsx` | `HalftoneReveal` | `RbHalftoneReveal` | `src/ts-default/Animations/HalftoneReveal/HalftoneReveal.tsx` |
| `animations/rb-image-trail.tsx` | `ImageTrail` | `RbImageTrail` | `src/ts-default/Animations/ImageTrail/ImageTrail.tsx` |
| `animations/rb-laser-flow.tsx` | `LaserFlow` | `RbLaserFlow` | `src/ts-default/Animations/LaserFlow/LaserFlow.tsx` |
| `animations/rb-logo-loop.tsx` | `LogoLoop` | `RbLogoLoop` | `src/ts-default/Animations/LogoLoop/LogoLoop.tsx` |
| `animations/rb-magic-rings.tsx` | `MagicRings` | `RbMagicRings` | `src/ts-default/Animations/MagicRings/MagicRings.tsx` |
| `animations/rb-magnet.tsx` | `Magnet` | `RbMagnet` | `src/ts-default/Animations/Magnet/Magnet.tsx` |
| `animations/rb-magnet-lines.tsx` | `MagnetLines` | `RbMagnetLines` | `src/ts-default/Animations/MagnetLines/MagnetLines.tsx` |
| `animations/rb-meta-balls.tsx` | `MetaBalls` | `RbMetaBalls` | `src/ts-default/Animations/MetaBalls/MetaBalls.tsx` |
| `animations/rb-metallic-paint.tsx` | `MetallicPaint` | `RbMetallicPaint` | `src/ts-default/Animations/MetallicPaint/MetallicPaint.tsx` |
| `animations/rb-noise.tsx` | `Noise` | `RbNoise` | `src/ts-default/Animations/Noise/Noise.tsx` |
| `animations/rb-orbit-images.tsx` | `OrbitImages` | `RbOrbitImages` | `src/ts-default/Animations/OrbitImages/OrbitImages.tsx` |
| `animations/rb-pixel-swap.tsx` | `PixelSwap` | `RbPixelSwap` | `src/ts-default/Animations/PixelSwap/PixelSwap.tsx` |
| `animations/rb-pixel-trail.tsx` | `PixelTrail` | `RbPixelTrail` | `src/ts-default/Animations/PixelTrail/PixelTrail.tsx` |
| `animations/rb-pixel-transition.tsx` | `PixelTransition` | `RbPixelTransition` | `src/ts-default/Animations/PixelTransition/PixelTransition.tsx` |
| `animations/rb-ribbons.tsx` | `Ribbons` | `RbRibbons` | `src/ts-default/Animations/Ribbons/Ribbons.tsx` |
| `animations/rb-ripple-distortion.tsx` | `RippleDistortion` | `RbRippleDistortion` | `src/ts-default/Animations/RippleDistortion/RippleDistortion.tsx` |
| `animations/rb-scroll-expand.tsx` | `ScrollExpand` | `RbScrollExpand` | `src/ts-default/Animations/ScrollExpand/ScrollExpand.tsx` |
| `animations/rb-shape-blur.tsx` | `ShapeBlur` | `RbShapeBlur` | `src/ts-default/Animations/ShapeBlur/ShapeBlur.tsx` |
| `animations/rb-splash-cursor.tsx` | `SplashCursor` | `RbSplashCursor` | `src/ts-default/Animations/SplashCursor/SplashCursor.tsx` |
| `animations/rb-star-border.tsx` | `StarBorder` | `RbStarBorder` | `src/ts-default/Animations/StarBorder/StarBorder.tsx` |
| `animations/rb-sticker-peel.tsx` | `StickerPeel` | `RbStickerPeel` | `src/ts-default/Animations/StickerPeel/StickerPeel.tsx` |
| `animations/rb-strands.tsx` | `Strands` | `RbStrands` | `src/ts-default/Animations/Strands/Strands.tsx` |
| `animations/rb-swarm-cursor.tsx` | `SwarmCursor` | `RbSwarmCursor` | `src/ts-default/Animations/SwarmCursor/SwarmCursor.tsx` |
| `animations/rb-target-cursor.tsx` | `TargetCursor` | `RbTargetCursor` | `src/ts-default/Animations/TargetCursor/TargetCursor.tsx` |

## TextAnimations (vendored into animations/) — 33 components

| Vendored file | Upstream export | Renamed export | Upstream path |
| --- | --- | --- | --- |
| `animations/rb-ascii-text.tsx` | `ASCIIText` | `RbASCIIText` | `src/ts-default/TextAnimations/ASCIIText/ASCIIText.tsx` |
| `animations/rb-blur-text.tsx` | `BlurText` | `RbBlurText` | `src/ts-default/TextAnimations/BlurText/BlurText.tsx` |
| `animations/rb-circular-text.tsx` | `CircularText` | `RbCircularText` | `src/ts-default/TextAnimations/CircularText/CircularText.tsx` |
| `animations/rb-count-up.tsx` | `CountUp` | `RbCountUp` | `src/ts-default/TextAnimations/CountUp/CountUp.tsx` |
| `animations/rb-curved-loop.tsx` | `CurvedLoop` | `RbCurvedLoop` | `src/ts-default/TextAnimations/CurvedLoop/CurvedLoop.tsx` |
| `animations/rb-decrypted-text.tsx` | `DecryptedText` | `RbDecryptedText` | `src/ts-default/TextAnimations/DecryptedText/DecryptedText.tsx` |
| `animations/rb-depth-text.tsx` | `DepthText` | `RbDepthText` | `src/ts-default/TextAnimations/DepthText/DepthText.tsx` |
| `animations/rb-echo-text.tsx` | `EchoText` | `RbEchoText` | `src/ts-default/TextAnimations/EchoText/EchoText.tsx` |
| `animations/rb-falling-text.tsx` | `FallingText` | `RbFallingText` | `src/ts-default/TextAnimations/FallingText/FallingText.tsx` |
| `animations/rb-fold-text.tsx` | `FoldText` | `RbFoldText` | `src/ts-default/TextAnimations/FoldText/FoldText.tsx` |
| `animations/rb-fuzzy-text.tsx` | `FuzzyText` | `RbFuzzyText` | `src/ts-default/TextAnimations/FuzzyText/FuzzyText.tsx` |
| `animations/rb-glitch-text.tsx` | `GlitchText` | `RbGlitchText` | `src/ts-default/TextAnimations/GlitchText/GlitchText.tsx` |
| `animations/rb-gradient-text.tsx` | `GradientText` | `RbGradientText` | `src/ts-default/TextAnimations/GradientText/GradientText.tsx` |
| `animations/rb-masked-heading.tsx` | `MaskedHeading` | `RbMaskedHeading` | `src/ts-default/TextAnimations/MaskedHeading/MaskedHeading.tsx` |
| `animations/rb-particle-text.tsx` | `ParticleText` | `RbParticleText` | `src/ts-default/TextAnimations/ParticleText/ParticleText.tsx` |
| `animations/rb-rotating-text.tsx` | `RotatingText` | `RbRotatingText` | `src/ts-default/TextAnimations/RotatingText/RotatingText.tsx` |
| `animations/rb-scrambled-text.tsx` | `ScrambledText` | `RbScrambledText` | `src/ts-default/TextAnimations/ScrambledText/ScrambledText.tsx` |
| `animations/rb-scroll-float.tsx` | `ScrollFloat` | `RbScrollFloat` | `src/ts-default/TextAnimations/ScrollFloat/ScrollFloat.tsx` |
| `animations/rb-scroll-reveal.tsx` | `ScrollReveal` | `RbScrollReveal` | `src/ts-default/TextAnimations/ScrollReveal/ScrollReveal.tsx` |
| `animations/rb-scroll-velocity.tsx` | `ScrollVelocity` | `RbScrollVelocity` | `src/ts-default/TextAnimations/ScrollVelocity/ScrollVelocity.tsx` |
| `animations/rb-shiny-text.tsx` | `ShinyText` | `RbShinyText` | `src/ts-default/TextAnimations/ShinyText/ShinyText.tsx` |
| `animations/rb-shuffle.tsx` | `Shuffle` | `RbShuffle` | `src/ts-default/TextAnimations/Shuffle/Shuffle.tsx` |
| `animations/rb-split-flap-text.tsx` | `SplitFlapText` | `RbSplitFlapText` | `src/ts-default/TextAnimations/SplitFlapText/SplitFlapText.tsx` |
| `animations/rb-split-text.tsx` | `SplitText` | `RbSplitText` | `src/ts-default/TextAnimations/SplitText/SplitText.tsx` |
| `animations/rb-stroke-text.tsx` | `StrokeText` | `RbStrokeText` | `src/ts-default/TextAnimations/StrokeText/StrokeText.tsx` |
| `animations/rb-tech-text.tsx` | `TechText` | `RbTechText` | `src/ts-default/TextAnimations/TechText/TechText.tsx` |
| `animations/rb-text-cursor.tsx` | `TextCursor` | `RbTextCursor` | `src/ts-default/TextAnimations/TextCursor/TextCursor.tsx` |
| `animations/rb-text-loop.tsx` | `TextLoop` | `RbTextLoop` | `src/ts-default/TextAnimations/TextLoop/TextLoop.tsx` |
| `animations/rb-text-pressure.tsx` | `TextPressure` | `RbTextPressure` | `src/ts-default/TextAnimations/TextPressure/TextPressure.tsx` |
| `animations/rb-text-type.tsx` | `TextType` | `RbTextType` | `src/ts-default/TextAnimations/TextType/TextType.tsx` |
| `animations/rb-true-focus.tsx` | `TrueFocus` | `RbTrueFocus` | `src/ts-default/TextAnimations/TrueFocus/TrueFocus.tsx` |
| `animations/rb-variable-proximity.tsx` | `VariableProximity` | `RbVariableProximity` | `src/ts-default/TextAnimations/VariableProximity/VariableProximity.tsx` |
| `animations/rb-warp-text.tsx` | `WarpText` | `RbWarpText` | `src/ts-default/TextAnimations/WarpText/WarpText.tsx` |

## Exported types (also `Rb`-prefixed)

| Type | Renamed | Component | Upstream path |
| --- | --- | --- | --- |
| `AcidSquaresDetail` | `RbAcidSquaresDetail` | `RbAcidSquares` | `src/ts-default/Backgrounds/AcidSquares/AcidSquares.tsx` |
| `AcidSquaresProps` | `RbAcidSquaresProps` | `RbAcidSquares` | `src/ts-default/Backgrounds/AcidSquares/AcidSquares.tsx` |
| `AeroShardsProps` | `RbAeroShardsProps` | `RbAeroShards` | `src/ts-default/Backgrounds/AeroShards/AeroShards.tsx` |
| `DotGridProps` | `RbDotGridProps` | `RbDotGrid` | `src/ts-default/Backgrounds/DotGrid/DotGrid.tsx` |
| `FaultyTerminalProps` | `RbFaultyTerminalProps` | `RbFaultyTerminal` | `src/ts-default/Backgrounds/FaultyTerminal/FaultyTerminal.tsx` |
| `FerrofluidProps` | `RbFerrofluidProps` | `RbFerrofluid` | `src/ts-default/Backgrounds/Ferrofluid/Ferrofluid.tsx` |
| `GhostFibersProps` | `RbGhostFibersProps` | `RbGhostFibers` | `src/ts-default/Backgrounds/GhostFibers/GhostFibers.tsx` |
| `GradientBlindsProps` | `RbGradientBlindsProps` | `RbGradientBlinds` | `src/ts-default/Backgrounds/GradientBlinds/GradientBlinds.tsx` |
| `GradientWavesDetail` | `RbGradientWavesDetail` | `RbGradientWaves` | `src/ts-default/Backgrounds/GradientWaves/GradientWaves.tsx` |
| `GradientWavesProps` | `RbGradientWavesProps` | `RbGradientWaves` | `src/ts-default/Backgrounds/GradientWaves/GradientWaves.tsx` |
| `RaysOrigin` | `RbRaysOrigin` | `RbLightRays` | `src/ts-default/Backgrounds/LightRays/LightRays.tsx` |
| `FlowDirection` | `RbFlowDirection` | `RbLightTunnel` | `src/ts-default/Backgrounds/LightTunnel/LightTunnel.tsx` |
| `LightTunnelProps` | `RbLightTunnelProps` | `RbLightTunnel` | `src/ts-default/Backgrounds/LightTunnel/LightTunnel.tsx` |
| `LightfallProps` | `RbLightfallProps` | `RbLightfall` | `src/ts-default/Backgrounds/Lightfall/Lightfall.tsx` |
| `LiquidEtherProps` | `RbLiquidEtherProps` | `RbLiquidEther` | `src/ts-default/Backgrounds/LiquidEther/LiquidEther.tsx` |
| `MicroSlatsProps` | `RbMicroSlatsProps` | `RbMicroSlats` | `src/ts-default/Backgrounds/MicroSlats/MicroSlats.tsx` |
| `MoltenMetalColorMode` | `RbMoltenMetalColorMode` | `RbMoltenMetal` | `src/ts-default/Backgrounds/MoltenMetal/MoltenMetal.tsx` |
| `MoltenMetalProps` | `RbMoltenMetalProps` | `RbMoltenMetal` | `src/ts-default/Backgrounds/MoltenMetal/MoltenMetal.tsx` |
| `PatternWavesProps` | `RbPatternWavesProps` | `RbPatternWaves` | `src/ts-default/Backgrounds/PatternWaves/PatternWaves.tsx` |
| `PrismaticBurstProps` | `RbPrismaticBurstProps` | `RbPrismaticBurst` | `src/ts-default/Backgrounds/PrismaticBurst/PrismaticBurst.tsx` |
| `ScanDirection` | `RbScanDirection` | `RbScanner` | `src/ts-default/Backgrounds/Scanner/Scanner.tsx` |
| `ScannerProps` | `RbScannerProps` | `RbScanner` | `src/ts-default/Backgrounds/Scanner/Scanner.tsx` |
| `ShapeWavesShapes` | `RbShapeWavesShapes` | `RbShapeWaves` | `src/ts-default/Backgrounds/ShapeWaves/ShapeWaves.tsx` |
| `ShapeWavesProps` | `RbShapeWavesProps` | `RbShapeWaves` | `src/ts-default/Backgrounds/ShapeWaves/ShapeWaves.tsx` |
| `SilkProps` | `RbSilkProps` | `RbSilk` | `src/ts-default/Backgrounds/Silk/Silk.tsx` |
| `SlicedWavesOrientation` | `RbSlicedWavesOrientation` | `RbSlicedWaves` | `src/ts-default/Backgrounds/SlicedWaves/SlicedWaves.tsx` |
| `SlicedWavesProps` | `RbSlicedWavesProps` | `RbSlicedWaves` | `src/ts-default/Backgrounds/SlicedWaves/SlicedWaves.tsx` |
| `ColorMode` | `RbColorMode` | `RbTopography` | `src/ts-default/Backgrounds/Topography/Topography.tsx` |
| `TopographyProps` | `RbTopographyProps` | `RbTopography` | `src/ts-default/Backgrounds/Topography/Topography.tsx` |
| `FanMode` | `RbFanMode` | `RbWebThreads` | `src/ts-default/Backgrounds/WebThreads/WebThreads.tsx` |
| `WebThreadsProps` | `RbWebThreadsProps` | `RbWebThreads` | `src/ts-default/Backgrounds/WebThreads/WebThreads.tsx` |
| `BlobCursorProps` | `RbBlobCursorProps` | `RbBlobCursor` | `src/ts-default/Animations/BlobCursor/BlobCursor.tsx` |
| `CubesProps` | `RbCubesProps` | `RbCubes` | `src/ts-default/Animations/Cubes/Cubes.tsx` |
| `CursorGridProps` | `RbCursorGridProps` | `RbCursorGrid` | `src/ts-default/Animations/CursorGrid/CursorGrid.tsx` |
| `DitherVeilProps` | `RbDitherVeilProps` | `RbDitherVeil` | `src/ts-default/Animations/DitherVeil/DitherVeil.tsx` |
| `ElasticMeshProps` | `RbElasticMeshProps` | `RbElasticMesh` | `src/ts-default/Animations/ElasticMesh/ElasticMesh.tsx` |
| `ElectricLogoProps` | `RbElectricLogoProps` | `RbElectricLogo` | `src/ts-default/Animations/ElectricLogo/ElectricLogo.tsx` |
| `GlowCursorProps` | `RbGlowCursorProps` | `RbGlowCursor` | `src/ts-default/Animations/GlowCursor/GlowCursor.tsx` |
| `HalftoneRevealProps` | `RbHalftoneRevealProps` | `RbHalftoneReveal` | `src/ts-default/Animations/HalftoneReveal/HalftoneReveal.tsx` |
| `LogoItem` | `RbLogoItem` | `RbLogoLoop` | `src/ts-default/Animations/LogoLoop/LogoLoop.tsx` |
| `LogoLoopProps` | `RbLogoLoopProps` | `RbLogoLoop` | `src/ts-default/Animations/LogoLoop/LogoLoop.tsx` |
| `PixelSwapPattern` | `RbPixelSwapPattern` | `RbPixelSwap` | `src/ts-default/Animations/PixelSwap/PixelSwap.tsx` |
| `PixelSwapTrigger` | `RbPixelSwapTrigger` | `RbPixelSwap` | `src/ts-default/Animations/PixelSwap/PixelSwap.tsx` |
| `PixelSwapProps` | `RbPixelSwapProps` | `RbPixelSwap` | `src/ts-default/Animations/PixelSwap/PixelSwap.tsx` |
| `RippleDistortionProps` | `RbRippleDistortionProps` | `RbRippleDistortion` | `src/ts-default/Animations/RippleDistortion/RippleDistortion.tsx` |
| `ScrollExpandProps` | `RbScrollExpandProps` | `RbScrollExpand` | `src/ts-default/Animations/ScrollExpand/ScrollExpand.tsx` |
| `StrandsProps` | `RbStrandsProps` | `RbStrands` | `src/ts-default/Animations/Strands/Strands.tsx` |
| `SwarmCursorProps` | `RbSwarmCursorProps` | `RbSwarmCursor` | `src/ts-default/Animations/SwarmCursor/SwarmCursor.tsx` |
| `TargetCursorProps` | `RbTargetCursorProps` | `RbTargetCursor` | `src/ts-default/Animations/TargetCursor/TargetCursor.tsx` |
| `DepthTextProps` | `RbDepthTextProps` | `RbDepthText` | `src/ts-default/TextAnimations/DepthText/DepthText.tsx` |
| `EchoTextProps` | `RbEchoTextProps` | `RbEchoText` | `src/ts-default/TextAnimations/EchoText/EchoText.tsx` |
| `FoldTextProps` | `RbFoldTextProps` | `RbFoldText` | `src/ts-default/TextAnimations/FoldText/FoldText.tsx` |
| `MaskedHeadingProps` | `RbMaskedHeadingProps` | `RbMaskedHeading` | `src/ts-default/TextAnimations/MaskedHeading/MaskedHeading.tsx` |
| `ParticleTextProps` | `RbParticleTextProps` | `RbParticleText` | `src/ts-default/TextAnimations/ParticleText/ParticleText.tsx` |
| `RotatingTextRef` | `RbRotatingTextRef` | `RbRotatingText` | `src/ts-default/TextAnimations/RotatingText/RotatingText.tsx` |
| `RotatingTextProps` | `RbRotatingTextProps` | `RbRotatingText` | `src/ts-default/TextAnimations/RotatingText/RotatingText.tsx` |
| `ScrambledTextProps` | `RbScrambledTextProps` | `RbScrambledText` | `src/ts-default/TextAnimations/ScrambledText/ScrambledText.tsx` |
| `ShuffleProps` | `RbShuffleProps` | `RbShuffle` | `src/ts-default/TextAnimations/Shuffle/Shuffle.tsx` |
| `SplitFlapTextProps` | `RbSplitFlapTextProps` | `RbSplitFlapText` | `src/ts-default/TextAnimations/SplitFlapText/SplitFlapText.tsx` |
| `SplitTextProps` | `RbSplitTextProps` | `RbSplitText` | `src/ts-default/TextAnimations/SplitText/SplitText.tsx` |
| `StrokeTextTrigger` | `RbStrokeTextTrigger` | `RbStrokeText` | `src/ts-default/TextAnimations/StrokeText/StrokeText.tsx` |
| `StrokeTextFillMode` | `RbStrokeTextFillMode` | `RbStrokeText` | `src/ts-default/TextAnimations/StrokeText/StrokeText.tsx` |
| `StrokeTextProps` | `RbStrokeTextProps` | `RbStrokeText` | `src/ts-default/TextAnimations/StrokeText/StrokeText.tsx` |
| `TechTextProps` | `RbTechTextProps` | `RbTechText` | `src/ts-default/TextAnimations/TechText/TechText.tsx` |
| `TextLoopShape` | `RbTextLoopShape` | `RbTextLoop` | `src/ts-default/TextAnimations/TextLoop/TextLoop.tsx` |
| `TextLoopDirection` | `RbTextLoopDirection` | `RbTextLoop` | `src/ts-default/TextAnimations/TextLoop/TextLoop.tsx` |
| `TextLoopProps` | `RbTextLoopProps` | `RbTextLoop` | `src/ts-default/TextAnimations/TextLoop/TextLoop.tsx` |
| `Props` | `RbProps` | `RbWarpText` | `src/ts-default/TextAnimations/WarpText/WarpText.tsx` |

## Namespaced CSS

| Component | Companion CSS | CSS namespace | classes | keyframes | custom properties |
| --- | --- | --- | --- | --- | --- |
| `RbAcidSquares` | `src/ts-default/Backgrounds/AcidSquares/AcidSquares.css` | `rb-acid-squares-*` | 1 | — | — |
| `RbAeroShards` | `src/ts-default/Backgrounds/AeroShards/AeroShards.css` | `rb-aero-shards-*` | 2 | — | — |
| `RbAurora` | `src/ts-default/Backgrounds/Aurora/Aurora.css` | `rb-aurora-*` | 1 | — | — |
| `RbBalatro` | `src/ts-default/Backgrounds/Balatro/Balatro.css` | `rb-balatro-*` | 1 | — | — |
| `RbBeams` | `src/ts-default/Backgrounds/Beams/Beams.css` | `rb-beams-*` | 1 | — | — |
| `RbCRTWarp` | `src/ts-default/Backgrounds/CRTWarp/CRTWarp.css` | `rb-crt-warp-*` | 1 | — | — |
| `RbColorBends` | `src/ts-default/Backgrounds/ColorBends/ColorBends.css` | `rb-color-bends-*` | 1 | — | — |
| `RbDarkVeil` | `src/ts-default/Backgrounds/DarkVeil/DarkVeil.css` | `rb-dark-veil-*` | 1 | — | — |
| `RbDither` | `src/ts-default/Backgrounds/Dither/Dither.css` | `rb-dither-*` | 1 | — | — |
| `RbDotField` | `src/ts-default/Backgrounds/DotField/DotField.css` | `rb-dot-field-*` | 1 | — | — |
| `RbDotGrid` | `src/ts-default/Backgrounds/DotGrid/DotGrid.css` | `rb-dot-grid-*` | 3 | — | — |
| `RbEvilEye` | `src/ts-default/Backgrounds/EvilEye/EvilEye.css` | `rb-evil-eye-*` | 1 | — | — |
| `RbFaultyTerminal` | `src/ts-default/Backgrounds/FaultyTerminal/FaultyTerminal.css` | `rb-faulty-terminal-*` | 1 | — | — |
| `RbFerrofluid` | `src/ts-default/Backgrounds/Ferrofluid/Ferrofluid.css` | `rb-ferrofluid-*` | 1 | — | — |
| `RbFloatingLines` | `src/ts-default/Backgrounds/FloatingLines/FloatingLines.css` | `rb-floating-lines-*` | 1 | — | — |
| `RbGalaxy` | `src/ts-default/Backgrounds/Galaxy/Galaxy.css` | `rb-galaxy-*` | 1 | — | — |
| `RbGhostFibers` | `src/ts-default/Backgrounds/GhostFibers/GhostFibers.css` | `rb-ghost-fibers-*` | 1 | — | — |
| `RbGradientBlinds` | `src/ts-default/Backgrounds/GradientBlinds/GradientBlinds.css` | `rb-gradient-blinds-*` | 1 | — | — |
| `RbGradientWaves` | `src/ts-default/Backgrounds/GradientWaves/GradientWaves.css` | `rb-gradient-waves-*` | 1 | — | — |
| `RbGrainient` | `src/ts-default/Backgrounds/Grainient/Grainient.css` | `rb-grainient-*` | 1 | — | — |
| `RbGridDistortion` | `src/ts-default/Backgrounds/GridDistortion/GridDistortion.css` | `rb-grid-distortion-*` | 1 | — | — |
| `RbGridMotion` | `src/ts-default/Backgrounds/GridMotion/GridMotion.css` | `rb-grid-motion-*` | 9 | — | — |
| `RbGridScan` | `src/ts-default/Backgrounds/GridScan/GridScan.css` | `rb-grid-scan-*` | 4 | — | — |
| `RbHyperspeed` | `src/ts-default/Backgrounds/Hyperspeed/Hyperspeed.css` | `rb-hyperspeed-*` | 1 | — | — |
| `RbIridescence` | `src/ts-default/Backgrounds/Iridescence/Iridescence.css` | `rb-iridescence-*` | 1 | — | — |
| `RbLightPillar` | `src/ts-default/Backgrounds/LightPillar/LightPillar.css` | `rb-light-pillar-*` | 2 | — | — |
| `RbLightRays` | `src/ts-default/Backgrounds/LightRays/LightRays.css` | `rb-light-rays-*` | 1 | — | — |
| `RbLightTunnel` | `src/ts-default/Backgrounds/LightTunnel/LightTunnel.css` | `rb-light-tunnel-*` | 1 | — | — |
| `RbLightfall` | `src/ts-default/Backgrounds/Lightfall/Lightfall.css` | `rb-lightfall-*` | 1 | — | — |
| `RbLightning` | `src/ts-default/Backgrounds/Lightning/Lightning.css` | `rb-lightning-*` | 1 | — | — |
| `RbLineWaves` | `src/ts-default/Backgrounds/LineWaves/LineWaves.css` | `rb-line-waves-*` | 1 | — | — |
| `RbLiquidChrome` | `src/ts-default/Backgrounds/LiquidChrome/LiquidChrome.css` | `rb-liquid-chrome-*` | 1 | — | — |
| `RbLiquidEther` | `src/ts-default/Backgrounds/LiquidEther/LiquidEther.css` | `rb-liquid-ether-*` | 1 | — | — |
| `RbMicroSlats` | `src/ts-default/Backgrounds/MicroSlats/MicroSlats.css` | `rb-micro-slats-*` | 1 | — | — |
| `RbMoltenMetal` | `src/ts-default/Backgrounds/MoltenMetal/MoltenMetal.css` | `rb-molten-metal-*` | 1 | — | — |
| `RbOrb` | `src/ts-default/Backgrounds/Orb/Orb.css` | `rb-orb-*` | 1 | — | — |
| `RbParticles` | `src/ts-default/Backgrounds/Particles/Particles.css` | `rb-particles-*` | 1 | — | — |
| `RbPatternWaves` | `src/ts-default/Backgrounds/PatternWaves/PatternWaves.css` | `rb-pattern-waves-*` | 1 | — | — |
| `RbPixelBlast` | `src/ts-default/Backgrounds/PixelBlast/PixelBlast.css` | `rb-pixel-blast-*` | 1 | — | — |
| `RbPixelSnow` | `src/ts-default/Backgrounds/PixelSnow/PixelSnow.css` | `rb-pixel-snow-*` | 1 | — | — |
| `RbPlasma` | `src/ts-default/Backgrounds/Plasma/Plasma.css` | `rb-plasma-*` | 1 | — | — |
| `RbPlasmaWave` | `src/ts-default/Backgrounds/PlasmaWave/PlasmaWave.css` | `rb-plasma-wave-*` | 1 | — | — |
| `RbPrism` | `src/ts-default/Backgrounds/Prism/Prism.css` | `rb-prism-*` | 1 | — | — |
| `RbPrismaticBurst` | `src/ts-default/Backgrounds/PrismaticBurst/PrismaticBurst.css` | `rb-prismatic-burst-*` | 1 | — | — |
| `RbRadar` | `src/ts-default/Backgrounds/Radar/Radar.css` | `rb-radar-*` | 1 | — | — |
| `RbRippleGrid` | `src/ts-default/Backgrounds/RippleGrid/RippleGrid.css` | `rb-ripple-grid-*` | 1 | — | — |
| `RbScanner` | `src/ts-default/Backgrounds/Scanner/Scanner.css` | `rb-scanner-*` | 1 | — | — |
| `RbShapeGrid` | `src/ts-default/Backgrounds/ShapeGrid/ShapeGrid.css` | `rb-shape-grid-*` | 1 | — | — |
| `RbShapeWaves` | `src/ts-default/Backgrounds/ShapeWaves/ShapeWaves.css` | `rb-shape-waves-*` | 2 | — | — |
| `RbSideRays` | `src/ts-default/Backgrounds/SideRays/SideRays.css` | `rb-side-rays-*` | 1 | — | — |
| `RbSlicedWaves` | `src/ts-default/Backgrounds/SlicedWaves/SlicedWaves.css` | `rb-sliced-waves-*` | 1 | — | — |
| `RbSoftAurora` | `src/ts-default/Backgrounds/SoftAurora/SoftAurora.css` | `rb-soft-aurora-*` | 1 | — | — |
| `RbThreads` | `src/ts-default/Backgrounds/Threads/Threads.css` | `rb-threads-*` | 1 | — | — |
| `RbTopography` | `src/ts-default/Backgrounds/Topography/Topography.css` | `rb-topography-*` | 1 | — | — |
| `RbWaves` | `src/ts-default/Backgrounds/Waves/Waves.css` | `rb-waves-*` | 2 | — | — |
| `RbWebThreads` | `src/ts-default/Backgrounds/WebThreads/WebThreads.css` | `rb-web-threads-*` | 1 | — | — |
| `RbBlobCursor` | `src/ts-default/Animations/BlobCursor/BlobCursor.css` | `rb-blob-cursor-*` | 4 | — | — |
| `RbCubes` | `src/ts-default/Animations/Cubes/Cubes.css` | `rb-cubes-*` | 10 | — | `--cube-perspective` → `--rb-cubes-cube-perspective`, `--cube-face-border` → `--rb-cubes-cube-face-border`, `--cube-face-bg` → `--rb-cubes-cube-face-bg`, `--col-gap` → `--rb-cubes-col-gap`, `--row-gap` → `--rb-cubes-row-gap` |
| `RbCursorGrid` | `src/ts-default/Animations/CursorGrid/CursorGrid.css` | `rb-cursor-grid-*` | 2 | — | — |
| `RbDitherVeil` | `src/ts-default/Animations/DitherVeil/DitherVeil.css` | `rb-dither-veil-*` | 1 | — | — |
| `RbElasticMesh` | `src/ts-default/Animations/ElasticMesh/ElasticMesh.css` | `rb-elastic-mesh-*` | 1 | — | — |
| `RbElectricBorder` | `src/ts-default/Animations/ElectricBorder/ElectricBorder.css` | `rb-electric-border-*` | 8 | — | `--electric-border-color` → `--rb-electric-border-electric-border-color`, `--electric-light-color` → `--rb-electric-border-electric-light-color` |
| `RbElectricLogo` | `src/ts-default/Animations/ElectricLogo/ElectricLogo.css` | `rb-electric-logo-*` | 1 | — | — |
| `RbGhostCursor` | `src/ts-default/Animations/GhostCursor/GhostCursor.css` | `rb-ghost-cursor-*` | 1 | — | — |
| `RbGlareHover` | `src/ts-default/Animations/GlareHover/GlareHover.css` | `rb-glare-hover-*` | 2 | — | `--gh-duration` → `--rb-glare-hover-gh-duration`, `--gh-height` → `--rb-glare-hover-gh-height`, `--gh-border` → `--rb-glare-hover-gh-border`, `--gh-width` → `--rb-glare-hover-gh-width`, `--gh-angle` → `--rb-glare-hover-gh-angle`, `--gh-rgba` → `--rb-glare-hover-gh-rgba`, `--gh-size` → `--rb-glare-hover-gh-size`, `--gh-bg` → `--rb-glare-hover-gh-bg`, `--gh-br` → `--rb-glare-hover-gh-br` |
| `RbGlowCursor` | `src/ts-default/Animations/GlowCursor/GlowCursor.css` | `rb-glow-cursor-*` | 3 | — | — |
| `RbGradualBlur` | `src/ts-default/Animations/GradualBlur/GradualBlur.css` | `rb-gradual-blur-*` | 5 | — | — |
| `RbHalftoneReveal` | `src/ts-default/Animations/HalftoneReveal/HalftoneReveal.css` | `rb-halftone-reveal-*` | 1 | — | — |
| `RbImageTrail` | `src/ts-default/Animations/ImageTrail/ImageTrail.css` | `rb-image-trail-*` | 3 | — | — |
| `RbLaserFlow` | `src/ts-default/Animations/LaserFlow/LaserFlow.css` | `rb-laser-flow-*` | 1 | — | — |
| `RbLogoLoop` | `src/ts-default/Animations/LogoLoop/LogoLoop.css` | `rb-logo-loop-*` | 9 | — | `--logoloop-fadeColorAuto` → `--rb-logo-loop-logoloop-fadeColorAuto`, `--logoloop-logoHeight` → `--rb-logo-loop-logoloop-logoHeight`, `--logoloop-fadeColor` → `--rb-logo-loop-logoloop-fadeColor`, `--logoloop-gap` → `--rb-logo-loop-logoloop-gap` |
| `RbMagicRings` | `src/ts-default/Animations/MagicRings/MagicRings.css` | `rb-magic-rings-*` | 1 | — | — |
| `RbMagnetLines` | `src/ts-default/Animations/MagnetLines/MagnetLines.css` | `rb-magnet-lines-*` | 1 | — | `--columns` → `--rb-magnet-lines-columns`, `--rotate` → `--rb-magnet-lines-rotate`, `--rows` → `--rb-magnet-lines-rows` |
| `RbMetaBalls` | `src/ts-default/Animations/MetaBalls/MetaBalls.css` | `rb-meta-balls-*` | 1 | — | — |
| `RbMetallicPaint` | `src/ts-default/Animations/MetallicPaint/MetallicPaint.css` | `rb-metallic-paint-*` | 1 | — | — |
| `RbNoise` | `src/ts-default/Animations/Noise/Noise.css` | `rb-noise-*` | 1 | — | — |
| `RbOrbitImages` | `src/ts-default/Animations/OrbitImages/OrbitImages.css` | `rb-orbit-images-*` | 8 | — | — |
| `RbPixelSwap` | `src/ts-default/Animations/PixelSwap/PixelSwap.css` | `rb-pixel-swap-*` | 5 | — | — |
| `RbPixelTrail` | `src/ts-default/Animations/PixelTrail/PixelTrail.css` | `rb-pixel-trail-*` | 2 | — | — |
| `RbPixelTransition` | `src/ts-default/Animations/PixelTransition/PixelTransition.css` | `rb-pixel-transition-*` | 5 | — | — |
| `RbRibbons` | `src/ts-default/Animations/Ribbons/Ribbons.css` | `rb-ribbons-*` | 1 | — | — |
| `RbRippleDistortion` | `src/ts-default/Animations/RippleDistortion/RippleDistortion.css` | `rb-ripple-distortion-*` | 1 | — | — |
| `RbScrollExpand` | `src/ts-default/Animations/ScrollExpand/ScrollExpand.css` | `rb-scroll-expand-*` | 10 | — | `--se-title-size` → `--rb-scroll-expand-se-title-size` |
| `RbStarBorder` | `src/ts-default/Animations/StarBorder/StarBorder.css` | `rb-star-border-*` | 4 | `rb-star-border-star-movement-bottom`, `rb-star-border-star-movement-top` | — |
| `RbStickerPeel` | `src/ts-default/Animations/StickerPeel/StickerPeel.css` | `rb-sticker-peel-*` | 10 | — | `--sticker-peel-hover-easing` → `--rb-sticker-peel-sticker-peel-hover-easing`, `--sticker-lighting-constant` → `--rb-sticker-peel-sticker-lighting-constant`, `--sticker-peelback-active` → `--rb-sticker-peel-sticker-peelback-active`, `--sticker-peelback-hover` → `--rb-sticker-peel-sticker-peelback-hover`, `--sticker-shadow-opacity` → `--rb-sticker-peel-sticker-shadow-opacity`, `--sticker-peel-easing` → `--rb-sticker-peel-sticker-peel-easing`, `--sticker-rotate` → `--rb-sticker-peel-sticker-rotate`, `--peel-direction` → `--rb-sticker-peel-peel-direction`, `--sticker-start` → `--rb-sticker-peel-sticker-start`, `--sticker-width` → `--rb-sticker-peel-sticker-width`, `--sticker-end` → `--rb-sticker-peel-sticker-end`, `--sticker-p` → `--rb-sticker-peel-sticker-p` |
| `RbStrands` | `src/ts-default/Animations/Strands/Strands.css` | `rb-strands-*` | 1 | — | — |
| `RbSwarmCursor` | `src/ts-default/Animations/SwarmCursor/SwarmCursor.css` | `rb-swarm-cursor-*` | 3 | — | — |
| `RbTargetCursor` | `src/ts-default/Animations/TargetCursor/TargetCursor.css` | `rb-target-cursor-*` | 7 | — | — |
| `RbCircularText` | `src/ts-default/TextAnimations/CircularText/CircularText.css` | `rb-circular-text-*` | 1 | — | — |
| `RbCurvedLoop` | `src/ts-default/TextAnimations/CurvedLoop/CurvedLoop.css` | `rb-curved-loop-*` | 2 | — | — |
| `RbDepthText` | `src/ts-default/TextAnimations/DepthText/DepthText.css` | `rb-depth-text-*` | 4 | — | `--depth-text-perspective` → `--rb-depth-text-depth-text-perspective`, `--depth-text-font-weight` → `--rb-depth-text-depth-text-font-weight`, `--depth-text-face-color` → `--rb-depth-text-depth-text-face-color`, `--depth-text-font-size` → `--rb-depth-text-depth-text-font-size`, `--depth-text-shadow` → `--rb-depth-text-depth-text-shadow` |
| `RbEchoText` | `src/ts-default/TextAnimations/EchoText/EchoText.css` | `rb-echo-text-*` | 3 | — | — |
| `RbFallingText` | `src/ts-default/TextAnimations/FallingText/FallingText.css` | `rb-falling-text-*` | 5 | — | — |
| `RbFoldText` | `src/ts-default/TextAnimations/FoldText/FoldText.css` | `rb-fold-text-*` | 7 | — | `--fold-text-font-weight` → `--rb-fold-text-fold-text-font-weight`, `--fold-text-font-size` → `--rb-fold-text-fold-text-font-size`, `--fold-perspective` → `--rb-fold-text-fold-perspective`, `--fold-text-color` → `--rb-fold-text-fold-text-color`, `--fold-crease` → `--rb-fold-text-fold-crease` |
| `RbGlitchText` | `src/ts-default/TextAnimations/GlitchText/GlitchText.css` | `rb-glitch-text-*` | 2 | `rb-glitch-text-animate-glitch` | `--before-duration` → `--rb-glitch-text-before-duration`, `--after-duration` → `--rb-glitch-text-after-duration`, `--before-shadow` → `--rb-glitch-text-before-shadow`, `--after-shadow` → `--rb-glitch-text-after-shadow` |
| `RbGradientText` | `src/ts-default/TextAnimations/GradientText/GradientText.css` | `rb-gradient-text-*` | 4 | `rb-gradient-text-gradient` | — |
| `RbMaskedHeading` | `src/ts-default/TextAnimations/MaskedHeading/MaskedHeading.css` | `rb-masked-heading-*` | 9 | — | — |
| `RbParticleText` | `src/ts-default/TextAnimations/ParticleText/ParticleText.css` | `rb-particle-text-*` | 3 | — | — |
| `RbRotatingText` | `src/ts-default/TextAnimations/RotatingText/RotatingText.css` | `rb-rotating-text-*` | 6 | — | — |
| `RbScrambledText` | `src/ts-default/TextAnimations/ScrambledText/ScrambledText.css` | `rb-scrambled-text-*` | 2 | — | — |
| `RbScrollFloat` | `src/ts-default/TextAnimations/ScrollFloat/ScrollFloat.css` | `rb-scroll-float-*` | 3 | — | — |
| `RbScrollReveal` | `src/ts-default/TextAnimations/ScrollReveal/ScrollReveal.css` | `rb-scroll-reveal-*` | 3 | — | — |
| `RbScrollVelocity` | `src/ts-default/TextAnimations/ScrollVelocity/ScrollVelocity.css` | `rb-scroll-velocity-*` | 2 | — | — |
| `RbShinyText` | `src/ts-default/TextAnimations/ShinyText/ShinyText.css` | `rb-shiny-text-*` | 2 | `rb-shiny-text-shine` | — |
| `RbShuffle` | `src/ts-default/TextAnimations/Shuffle/Shuffle.css` | `rb-shuffle-*` | 4 | — | — |
| `RbSplitFlapText` | `src/ts-default/TextAnimations/SplitFlapText/SplitFlapText.css` | `rb-split-flap-text-*` | 9 | `rb-split-flap-text-split-flap-front`, `rb-split-flap-text-split-flap-back` | `--split-flap-flip-duration` → `--rb-split-flap-text-split-flap-flip-duration`, `--split-flap-text-color` → `--rb-split-flap-text-split-flap-text-color`, `--split-flap-tile-color` → `--rb-split-flap-text-split-flap-tile-color`, `--split-flap-font-size` → `--rb-split-flap-text-split-flap-font-size`, `--split-flap-radius` → `--rb-split-flap-text-split-flap-radius`, `--split-flap-gap` → `--rb-split-flap-text-split-flap-gap` |
| `RbStrokeText` | `src/ts-default/TextAnimations/StrokeText/StrokeText.css` | `rb-stroke-text-*` | 5 | — | `--stroke-text-height` → `--rb-stroke-text-stroke-text-height` |
| `RbTechText` | `src/ts-default/TextAnimations/TechText/TechText.css` | `rb-tech-text-*` | 2 | — | — |
| `RbTextCursor` | `src/ts-default/TextAnimations/TextCursor/TextCursor.css` | `rb-text-cursor-*` | 3 | — | — |
| `RbTextLoop` | `src/ts-default/TextAnimations/TextLoop/TextLoop.css` | `rb-text-loop-*` | 4 | — | — |
| `RbTextType` | `src/ts-default/TextAnimations/TextType/TextType.css` | `rb-text-type-*` | 4 | — | — |
| `RbTrueFocus` | `src/ts-default/TextAnimations/TrueFocus/TrueFocus.css` | `rb-true-focus-*` | 9 | — | `--border-color` → `--rb-true-focus-border-color` |
| `RbVariableProximity` | `src/ts-default/TextAnimations/VariableProximity/VariableProximity.css` | `rb-variable-proximity-*` | 2 | — | — |
| `RbWarpText` | `src/ts-default/TextAnimations/WarpText/WarpText.css` | `rb-warp-text-*` | 1 | — | — |

## Required npm packages (union of every non-relative import)

* `@gsap/react`
* `@react-three/drei`
* `@react-three/fiber`
* `@react-three/postprocessing`
* `face-api.js`
* `gsap`
* `gsap/Draggable`
* `gsap/InertiaPlugin`
* `gsap/Observer`
* `gsap/ScrambleTextPlugin`
* `gsap/ScrollTrigger`
* `gsap/SplitText`
* `matter-js`
* `motion/react`
* `ogl`
* `postprocessing`
* `react`
* `react-dom`
* `three`
* `three/examples/jsm/environments/RoomEnvironment.js`
* `three/examples/jsm/postprocessing/EffectComposer.js`
* `three/examples/jsm/postprocessing/RenderPass.js`
* `three/examples/jsm/postprocessing/ShaderPass.js`
* `three/examples/jsm/postprocessing/UnrealBloomPass.js`
* `three/src/math/MathUtils.js`
* `vgpu`

| Package | Used by |
| --- | --- |
| `@gsap/react` | `RbShuffle`, `RbSplitText` |
| `@react-three/drei` | `RbBeams`, `RbPixelTrail` |
| `@react-three/fiber` | `RbBeams`, `RbDither`, `RbSilk`, `RbAntigravity`, `RbPixelTrail` |
| `@react-three/postprocessing` | `RbDither` |
| `face-api.js` | `RbGridScan` |
| `gsap` | `RbBallpit`, `RbDotGrid`, `RbGridMotion`, `RbAnimatedContent`, `RbBlobCursor`, `RbCrosshair`, `RbCubes`, `RbFadeContent`, `RbImageTrail`, `RbPixelTransition`, `RbStickerPeel`, `RbTargetCursor`, `RbFoldText`, `RbMaskedHeading`, `RbScrambledText`, `RbScrollFloat`, `RbScrollReveal`, `RbShuffle`, `RbSplitText`, `RbStrokeText`, `RbTextLoop`, `RbTextType` |
| `gsap/Draggable` | `RbStickerPeel` |
| `gsap/InertiaPlugin` | `RbDotGrid` |
| `gsap/Observer` | `RbBallpit` |
| `gsap/ScrambleTextPlugin` | `RbScrambledText` |
| `gsap/ScrollTrigger` | `RbAnimatedContent`, `RbFadeContent`, `RbFoldText`, `RbScrollFloat`, `RbScrollReveal`, `RbShuffle`, `RbSplitText`, `RbStrokeText` |
| `gsap/SplitText` | `RbScrambledText`, `RbShuffle`, `RbSplitText` |
| `matter-js` | `RbFallingText` |
| `motion/react` | `RbOrbitImages`, `RbBlurText`, `RbCircularText`, `RbCountUp`, `RbDecryptedText`, `RbGradientText`, `RbRotatingText`, `RbScrollVelocity`, `RbShinyText`, `RbTextCursor`, `RbTrueFocus`, `RbVariableProximity` |
| `ogl` | `RbAcidSquares`, `RbAurora`, `RbBalatro`, `RbDarkVeil`, `RbEvilEye`, `RbFaultyTerminal`, `RbFerrofluid`, `RbGalaxy`, `RbGhostFibers`, `RbGradientBlinds`, `RbGradientWaves`, `RbGrainient`, `RbIridescence`, `RbLightRays`, `RbLightTunnel`, `RbLightfall`, `RbLineWaves`, `RbLiquidChrome`, `RbMicroSlats`, `RbMoltenMetal`, `RbOrb`, `RbParticles`, `RbPatternWaves`, `RbPlasma`, `RbPlasmaWave`, `RbPrism`, `RbPrismaticBurst`, `RbRadar`, `RbRippleGrid`, `RbScanner`, `RbSideRays`, `RbSlicedWaves`, `RbSoftAurora`, `RbThreads`, `RbTopography`, `RbWebThreads`, `RbDitherVeil`, `RbElasticMesh`, `RbElectricLogo`, `RbGlowCursor`, `RbHalftoneReveal`, `RbMetaBalls`, `RbRibbons`, `RbRippleDistortion`, `RbStrands`, `RbSwarmCursor`, `RbWarpText` |
| `postprocessing` | `RbDither`, `RbGridScan`, `RbHyperspeed`, `RbPixelBlast` |
| `react` | `RbAcidSquares`, `RbAeroShards`, `RbAurora`, `RbBalatro`, `RbBallpit`, `RbBeams`, `RbCRTWarp`, `RbColorBends`, `RbDarkVeil`, `RbDither`, `RbDotField`, `RbDotGrid`, `RbEvilEye`, `RbFaultyTerminal`, `RbFerrofluid`, `RbFloatingLines`, `RbGalaxy`, `RbGhostFibers`, `RbGradientBlinds`, `RbGradientWaves`, `RbGrainient`, `RbGridDistortion`, `RbGridMotion`, `RbGridScan`, `RbHyperspeed`, `RbIridescence`, `RbLetterGlitch`, `RbLightPillar`, `RbLightRays`, `RbLightTunnel`, `RbLightfall`, `RbLightning`, `RbLineWaves`, `RbLiquidChrome`, `RbLiquidEther`, `RbMicroSlats`, `RbMoltenMetal`, `RbOrb`, `RbParticles`, `RbPatternWaves`, `RbPixelBlast`, `RbPixelSnow`, `RbPlasma`, `RbPlasmaWave`, `RbPrism`, `RbPrismaticBurst`, `RbRadar`, `RbRippleGrid`, `RbScanner`, `RbShapeGrid`, `RbShapeWaves`, `RbSideRays`, `RbSilk`, `RbSlicedWaves`, `RbSoftAurora`, `RbThreads`, `RbTopography`, `RbWaves`, `RbWebThreads`, `RbAnimatedContent`, `RbAntigravity`, `RbBlobCursor`, `RbClickSpark`, `RbCrosshair`, `RbCubes`, `RbCursorGrid`, `RbDitherVeil`, `RbElasticMesh`, `RbElectricBorder`, `RbElectricLogo`, `RbFadeContent`, `RbGhostCursor`, `RbGlareHover`, `RbGlowCursor`, `RbGradualBlur`, `RbHalftoneReveal`, `RbImageTrail`, `RbLaserFlow`, `RbLogoLoop`, `RbMagicRings`, `RbMagnet`, `RbMagnetLines`, `RbMetaBalls`, `RbMetallicPaint`, `RbNoise`, `RbOrbitImages`, `RbPixelSwap`, `RbPixelTrail`, `RbPixelTransition`, `RbRibbons`, `RbRippleDistortion`, `RbScrollExpand`, `RbShapeBlur`, `RbSplashCursor`, `RbStarBorder`, `RbStickerPeel`, `RbStrands`, `RbSwarmCursor`, `RbTargetCursor`, `RbASCIIText`, `RbBlurText`, `RbCircularText`, `RbCountUp`, `RbCurvedLoop`, `RbDecryptedText`, `RbDepthText`, `RbEchoText`, `RbFallingText`, `RbFoldText`, `RbFuzzyText`, `RbGlitchText`, `RbGradientText`, `RbMaskedHeading`, `RbParticleText`, `RbRotatingText`, `RbScrambledText`, `RbScrollFloat`, `RbScrollReveal`, `RbScrollVelocity`, `RbShinyText`, `RbShuffle`, `RbSplitFlapText`, `RbSplitText`, `RbStrokeText`, `RbTechText`, `RbTextCursor`, `RbTextLoop`, `RbTextPressure`, `RbTextType`, `RbTrueFocus`, `RbVariableProximity`, `RbWarpText` |
| `react-dom` | `RbTargetCursor` |
| `three` | `RbBallpit`, `RbBeams`, `RbCRTWarp`, `RbColorBends`, `RbDither`, `RbFloatingLines`, `RbGridDistortion`, `RbGridScan`, `RbHyperspeed`, `RbLightPillar`, `RbLiquidEther`, `RbPixelBlast`, `RbPixelSnow`, `RbSilk`, `RbAntigravity`, `RbGhostCursor`, `RbLaserFlow`, `RbMagicRings`, `RbPixelTrail`, `RbShapeBlur`, `RbASCIIText` |
| `three/examples/jsm/environments/RoomEnvironment.js` | `RbBallpit` |
| `three/examples/jsm/postprocessing/EffectComposer.js` | `RbGhostCursor` |
| `three/examples/jsm/postprocessing/RenderPass.js` | `RbGhostCursor` |
| `three/examples/jsm/postprocessing/ShaderPass.js` | `RbGhostCursor` |
| `three/examples/jsm/postprocessing/UnrealBloomPass.js` | `RbGhostCursor` |
| `three/src/math/MathUtils.js` | `RbBeams` |
| `vgpu` | `RbAeroShards`, `RbShapeWaves` |

## Upstream licence

```
MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software **as part of an application, website, or product**, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, **so long as you do not sell, sublicense, or redistribute the components themselves-whether alone, in a bundle, or as a ported version.**

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
