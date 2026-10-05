"use client";

/* Facet / landing — ComponentGallery
 *
 * A curated wall of live primitives from the three vendored families.
 * Every tile is the real component, not a recording, which means the
 * naive build — mount all 33 and ship — walks straight into the
 * browser's WebGL context ceiling and takes the page down with it.
 *
 * The budget is therefore explicit and enforced in three layers:
 *
 *   1. Lazy mount   — a tile boots its component only once it scrolls
 *                     near the viewport, and tears it down once it is
 *                     well clear again. Two IntersectionObservers with
 *                     different root margins give hysteresis, so a tile
 *                     parked at the edge never thrashes.
 *   2. Context cap  — a module-level semaphore hands out at most
 *                     MAX_HEAVY_SLOTS GPU-bound tiles at a time. The
 *                     rest sit in a FIFO queue and boot as slots free.
 *                     Light tiles (pure DOM motion) bypass the queue.
 *   3. Per-tile boundary — one component that throws must not take the
 *                     gallery with it; TileBoundary swaps in a labelled
 *                     placeholder instead of blanking the grid.
 *
 * Everything here is deterministic: no Math.random, no Date.now, no
 * window/document read during render. The server and the first client
 * render emit identical markup — the intersection state starts false,
 * and the reduced-motion branch reads its flag through
 * useSyncExternalStore's server snapshot so it cannot answer before
 * hydration has finished. */

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

/* Every demo below is code-split.
 *
 * A tile only renders once it is near the viewport AND holds one of the six GPU
 * slots, so nothing here ever renders during SSR — `ssr: false` gives up
 * nothing. What it buys is that a tile's engine is fetched at the moment that
 * tile mounts instead of at route load: the landing page ships its shell and
 * the two or three demos actually on screen, not all thirty-three and the
 * three.js/react-three build sitting behind them.
 *
 * The three-layer budget below (lazy mount, semaphore, per-tile boundary) is
 * unchanged — code splitting reduces what has to be resident, it does not
 * replace the cap on what is allowed to run.
 *
 * The `{ ssr: false }` literal is repeated on every call on purpose:
 * next/dynamic validates its options at the call site and rejects anything
 * that is not an object literal, so a shared constant cannot be used here. */
/* ── canvas family · src/components/facet/canvas ───────────────── */
const CxBend = dynamic(() => import("@/components/facet/canvas/bend").then((mod) => mod.CxBend), { ssr: false });
const CxBlaze = dynamic(() => import("@/components/facet/canvas/blaze").then((mod) => mod.CxBlaze), { ssr: false });
const CxClouds = dynamic(() => import("@/components/facet/canvas/clouds").then((mod) => mod.CxClouds), { ssr: false });
const CxDroplets = dynamic(() => import("@/components/facet/canvas/droplets").then((mod) => mod.CxDroplets), { ssr: false });
const CxFrost = dynamic(() => import("@/components/facet/canvas/frost").then((mod) => mod.CxFrost), { ssr: false });
const CxGlitch = dynamic(() => import("@/components/facet/canvas/glitch").then((mod) => mod.CxGlitch), { ssr: false });
const CxLiquid = dynamic(() => import("@/components/facet/canvas/liquid").then((mod) => mod.CxLiquid), { ssr: false });
const CxRetroDither = dynamic(() => import("@/components/facet/canvas/retro-dither").then((mod) => mod.CxRetroDither), { ssr: false });
const CxShatter = dynamic(() => import("@/components/facet/canvas/shatter").then((mod) => mod.CxShatter), { ssr: false });
const CxVHS = dynamic(() => import("@/components/facet/canvas/vhs").then((mod) => mod.CxVHS), { ssr: false });

/* ── backgrounds family · src/components/facet/bits/backgrounds ─── */
const RbAcidSquares = dynamic(() => import("@/components/facet/bits/backgrounds/rb-acid-squares").then((mod) => mod.default), { ssr: false });
const RbAurora = dynamic(() => import("@/components/facet/bits/backgrounds/rb-aurora").then((mod) => mod.default), { ssr: false });
const RbBeams = dynamic(() => import("@/components/facet/bits/backgrounds/rb-beams").then((mod) => mod.default), { ssr: false });
const RbDarkVeil = dynamic(() => import("@/components/facet/bits/backgrounds/rb-dark-veil").then((mod) => mod.default), { ssr: false });
const RbDotField = dynamic(() => import("@/components/facet/bits/backgrounds/rb-dot-field").then((mod) => mod.default), { ssr: false });
const RbDotGrid = dynamic(() => import("@/components/facet/bits/backgrounds/rb-dot-grid").then((mod) => mod.default), { ssr: false });
const RbIridescence = dynamic(() => import("@/components/facet/bits/backgrounds/rb-iridescence").then((mod) => mod.default), { ssr: false });
const RbLightRays = dynamic(() => import("@/components/facet/bits/backgrounds/rb-light-rays").then((mod) => mod.default), { ssr: false });
const RbPlasma = dynamic(() => import("@/components/facet/bits/backgrounds/rb-plasma").then((mod) => mod.default), { ssr: false });
const RbSoftAurora = dynamic(() => import("@/components/facet/bits/backgrounds/rb-soft-aurora").then((mod) => mod.default), { ssr: false });
const RbThreads = dynamic(() => import("@/components/facet/bits/backgrounds/rb-threads").then((mod) => mod.default), { ssr: false });
const RbWaves = dynamic(() => import("@/components/facet/bits/backgrounds/rb-waves").then((mod) => mod.default), { ssr: false });

/* ── animations family · src/components/facet/bits/animations ───── */
const RbAnimatedContent = dynamic(() => import("@/components/facet/bits/animations/rb-animated-content").then((mod) => mod.default), { ssr: false });
const RbBlurText = dynamic(() => import("@/components/facet/bits/animations/rb-blur-text").then((mod) => mod.default), { ssr: false });
const RbCountUp = dynamic(() => import("@/components/facet/bits/animations/rb-count-up").then((mod) => mod.default), { ssr: false });
const RbDecryptedText = dynamic(() => import("@/components/facet/bits/animations/rb-decrypted-text").then((mod) => mod.default), { ssr: false });
const RbGlitchText = dynamic(() => import("@/components/facet/bits/animations/rb-glitch-text").then((mod) => mod.default), { ssr: false });
const RbGradientText = dynamic(() => import("@/components/facet/bits/animations/rb-gradient-text").then((mod) => mod.default), { ssr: false });
const RbScrambledText = dynamic(() => import("@/components/facet/bits/animations/rb-scrambled-text").then((mod) => mod.default), { ssr: false });
const RbShinyText = dynamic(() => import("@/components/facet/bits/animations/rb-shiny-text").then((mod) => mod.default), { ssr: false });
const RbSplitText = dynamic(() => import("@/components/facet/bits/animations/rb-split-text").then((mod) => mod.default), { ssr: false });
const RbTextType = dynamic(() => import("@/components/facet/bits/animations/rb-text-type").then((mod) => mod.default), { ssr: false });
const RbTrueFocus = dynamic(() => import("@/components/facet/bits/animations/rb-true-focus").then((mod) => mod.default), { ssr: false });
const EASE = [0.22, 1, 0.36, 1] as const;

/** how many GPU-bound tiles may hold a live context at once */
const MAX_HEAVY_SLOTS = 6;

/** mount once this close, unmount once this far — the gap is the hysteresis */
const MOUNT_MARGIN = "200px 0px";
const UNMOUNT_MARGIN = "440px 0px";

/** fills the dark stage; the Cx family pins itself with inline position */
const BLEED = { position: "absolute", inset: 0 } as const;

/* a store that never notifies — the three-argument useSyncExternalStore
   below needs a subscriber, and the only thing being observed is "has
   hydration finished", which changes exactly once and is read, not
   broadcast. Same shape the canvas family uses for its own probes. */
const neverChanges = () => () => {};
const alwaysTrue = () => true;
const alwaysFalse = () => false;

/* specimen tints cycle by tile index — derived, never random, so the
   server and the client agree on every tile's colour */
const TINTS = [
  "var(--facet-violet)",
  "var(--facet-fuchsia)",
  "var(--facet-teal)",
  "var(--facet-amber)",
  "var(--facet-iris)",
] as const;

/* ── tile data ───────────────────────────────────────────────── */

export type GalleryFamily = "canvas" | "backgrounds" | "animations";

/** a tile's demo is a plain render function so the table stays inspectable */
export type GalleryDemo = (props: { still: boolean }) => React.ReactNode;

export type GalleryTile = {
  id: string;
  name: string;
  family: GalleryFamily;
  caption: string;
  /** holds a WebGL context, a 2D canvas or a GSAP tween — counts against the cap */
  heavy: boolean;
  /** what the visitor has to do to see the effect, when something */
  hint?: string;
  Demo: GalleryDemo;
};

export const GALLERY_TILES: GalleryTile[] = [
  /* ── canvas · WebGL effects that re-render real DOM ─────────── */
  {
    id: "bend",
    name: "Bend",
    family: "canvas",
    heavy: true,
    hint: "scroll the pane",
    caption: "Folds a live DOM pane into a cube at each scroll end.",
    Demo: ({ still }) => (
      <CxBend
        style={BLEED}
        zone={120}
        angle={still ? 40 : 80}
        rounding={80}
        perspective={900}
        direction="in"
        tumble={0}
      >
        <Specimen index={0} title="Bend" />
      </CxBend>
    ),
  },
  {
    id: "blaze",
    name: "Blaze",
    family: "canvas",
    heavy: true,
    caption: "Heat haze, layered sparks and smoke rising off the floor.",
    Demo: () => (
      <CxBlaze
        style={BLEED}
        height={0.45}
        distortion={0.9}
        sparks={1}
        sparkDensity={1.6}
        sparkSize={2.4}
        layers={4}
        smoke={0.75}
        glow={1}
        sparkColor={[1, 0.72, 0.34]}
        smokeColor={[0.55, 0.42, 0.62]}
      >
        <Specimen index={1} title="Blaze" />
      </CxBlaze>
    ),
  },
  {
    id: "frost",
    name: "Frost",
    family: "canvas",
    heavy: true,
    hint: "hover to melt",
    caption: "Refractive ice that grows in, then melts under the pointer.",
    Demo: () => (
      <CxFrost
        style={BLEED}
        frost={0.62}
        strength={1.1}
        crispness={0.7}
        highlight={0.5}
        haze={0.35}
        refraction={0.7}
        meltRadius={0.16}
        meltStrength={0.85}
        refreeze={0.35}
        edgeFade={0.4}
        shimmer={0.6}
        quality={0.5}
        tintThick={[0.72, 0.85, 1]}
        tintThin={[0.86, 0.92, 1]}
      >
        <Specimen index={2} title="Frost" />
      </CxFrost>
    ),
  },
  {
    id: "shatter",
    name: "Shatter",
    family: "canvas",
    heavy: true,
    hint: "move to lift tiles",
    caption: "A cursor lens that lifts the pane into lit glass shards.",
    Demo: () => (
      <CxShatter
        style={BLEED}
        radius={0.34}
        tileSize={26}
        shards={0.65}
        corner={5}
        lift={26}
        tilt={0.5}
        scatter={14}
        perspective={1100}
        shadow={0.9}
        shading={1.1}
        refraction={0.8}
        dispersion={0.35}
        floatSpeed={0.5}
        strength={1}
        baseStrength={0.22}
        gapColor={[0.03, 0.03, 0.06]}
      >
        <Specimen index={3} title="Shatter" />
      </CxShatter>
    ),
  },
  {
    id: "vhs",
    name: "VHS",
    family: "canvas",
    heavy: true,
    caption: "Tape wave, head-switching noise, scanlines and barrel curve.",
    Demo: () => (
      <CxVHS
        style={BLEED}
        speed={1}
        wave={1.2}
        jitter={0.7}
        crease={0.9}
        switching={1.1}
        switchingHeight={0.14}
        bloom={0.35}
        aberration={1.6}
        acBeat={0.5}
        grain={0.55}
        scanlines={0.7}
        vignette={0.65}
        barrel={0.35}
        saturation={1.15}
      >
        <Specimen index={4} title="VHS" />
      </CxVHS>
    ),
  },
  {
    id: "liquid",
    name: "Liquid",
    family: "canvas",
    heavy: true,
    hint: "drag across it",
    caption: "A Navier–Stokes dye field painted by the pointer.",
    Demo: () => (
      <CxLiquid
        style={BLEED}
        simResolution={96}
        dyeResolution={512}
        densityDissipation={0.92}
        velocityDissipation={0.975}
        pressure={0.8}
        pressureIterations={14}
        curl={28}
        radius={0.14}
        force={4200}
        intensity={0.85}
        distortion={1.6}
        blend={0.9}
        color={[0.52, 0.34, 0.94]}
      >
        <Specimen index={5} title="Liquid" />
      </CxLiquid>
    ),
  },
  {
    id: "clouds",
    name: "Clouds",
    family: "canvas",
    heavy: true,
    caption: "Volumetric cloud banks drifting over a shadowed floor.",
    Demo: () => (
      <CxClouds
        style={BLEED}
        scale={1.6}
        speed={0.35}
        cover={0.42}
        density={0.9}
        shading={0.85}
        color="auto"
        opacity={0.72}
        shadow={0.35}
        wind={0.7}
        refraction={0.25}
        fogBlur={0.6}
        quality={0.55}
      >
        <Specimen index={6} title="Clouds" />
      </CxClouds>
    ),
  },
  {
    id: "glitch",
    name: "Glitch",
    family: "canvas",
    heavy: true,
    caption: "Slice tearing and block corruption on a burst timer.",
    Demo: () => (
      <CxGlitch
        style={BLEED}
        intensity={1.1}
        interval={2.4}
        duration={0.28}
        slices={22}
        shift={16}
        rgbShift={3}
        blocks={0.5}
        noise={0.6}
      >
        <Specimen index={7} title="Glitch" />
      </CxGlitch>
    ),
  },
  {
    id: "retro-dither",
    name: "Retro Dither",
    family: "canvas",
    heavy: true,
    hint: "move to burn phosphor",
    caption: "Ordered dithering under a lens that leaves a fading trail.",
    Demo: () => (
      <CxRetroDither
        style={BLEED}
        radius={0.3}
        softness={0.5}
        pixelSize={3}
        levels={4}
        pattern="bayer"
        darkColor={[0.05, 0.03, 0.1]}
        lightColor={[0.78, 0.72, 1]}
        colorize={0.6}
        contrast={1.15}
        brightness={0.05}
        strength={1}
        baseStrength={0.7}
        scanlines={0.55}
        trail={0.5}
        degauss={0.6}
        followSpeed={0.12}
      >
        <Specimen index={8} title="Retro Dither" />
      </CxRetroDither>
    ),
  },
  {
    id: "droplets",
    name: "Droplets",
    family: "canvas",
    heavy: true,
    hint: "wipe the glass",
    caption: "Rain on glass, refracting the pane and running in trails.",
    Demo: () => (
      <CxDroplets
        style={BLEED}
        intensity={0.7}
        speed={1}
        scale={1.4}
        dropWidth={1.6}
        dropLength={5}
        refraction={1.1}
        blur={0.4}
        vignette={0.55}
        fallSpeed={1.1}
        wiggle={0.35}
        staticDrops={1}
        interactive
        interactionRadius={0.2}
        interactionStrength={0.9}
        interactionDistortion={1.4}
        tint={[0.62, 0.7, 1]}
        tintStrength={0.12}
      >
        <Specimen index={9} title="Droplets" />
      </CxDroplets>
    ),
  },

  /* ── backgrounds · ogl / three / 2D fields ──────────────────── */
  {
    id: "aurora",
    name: "Aurora",
    family: "backgrounds",
    heavy: true,
    caption: "FBM light curtains folded along a scrolling domain.",
    Demo: () => (
      <RbAurora
        colorStops={["#7c3aed", "#2dd4bf", "#7c3aed"]}
        amplitude={1.1}
        speed={0.35}
        blend={0.55}
      />
    ),
  },
  {
    id: "beams",
    name: "Beams",
    family: "backgrounds",
    heavy: true,
    caption: "Volumetric shafts drifting on a noise field, lit in three.",
    Demo: () => (
      <RbBeams
        beamNumber={9}
        beamWidth={2.4}
        beamHeight={13}
        beamColor="#8b5cf6"
        lightColor="#e9d5ff"
        backgroundColor="#05050b"
        speed={1.4}
        noiseIntensity={1.6}
        scale={0.22}
        rotation={-14}
      />
    ),
  },
  {
    id: "dark-veil",
    name: "Dark Veil",
    family: "backgrounds",
    heavy: true,
    caption: "Domain-warped ink with drifting scanlines over black.",
    Demo: () => (
      <RbDarkVeil
        hueShift={0.6}
        noiseIntensity={0.55}
        scanlineIntensity={0.35}
        speed={0.4}
        scanlineFrequency={1.4}
        warpAmount={0.85}
        resolutionScale={0.6}
      />
    ),
  },
  {
    id: "acid-squares",
    name: "Acid Squares",
    family: "backgrounds",
    heavy: true,
    caption: "Raymarched square caustic, three-stop and heavily grained.",
    Demo: () => (
      <RbAcidSquares
        color1="#7c3aed"
        color2="#e879f9"
        color3="#2dd4bf"
        detail="low"
        speed={0.5}
        waveDepth={0.9}
        zoom={1.1}
        density={1.2}
        glow={0.6}
        exposure={1.05}
        mouseInteraction
        mouseStrength={0.7}
        mouseRadius={0.9}
        grain
        grainIntensity={0.5}
      />
    ),
  },
  {
    id: "light-rays",
    name: "Light Rays",
    family: "backgrounds",
    heavy: true,
    caption: "God rays from a moving origin, soft-edged and pulsating.",
    Demo: () => (
      <RbLightRays
        raysOrigin="top-center"
        raysColor="#a78bfa"
        raysSpeed={0.28}
        lightSpread={0.55}
        rayLength={2.2}
        pulsating
        fadeDistance={1.1}
        saturation={0.85}
        followMouse={false}
        noiseAmount={0.9}
        distortion={0.35}
      />
    ),
  },
  {
    id: "soft-aurora",
    name: "Soft Aurora",
    family: "backgrounds",
    heavy: true,
    caption: "Layered fbm bands, octave-decayed into one soft horizon.",
    Demo: () => (
      <RbSoftAurora
        speed={0.3}
        scale={1.4}
        brightness={0.85}
        color1="#7c3aed"
        color2="#38bdf8"
        noiseFrequency={1.6}
        noiseAmplitude={0.7}
        bandHeight={0.35}
        bandSpread={0.22}
      />
    ),
  },
  {
    id: "iridescence",
    name: "Iridescence",
    family: "backgrounds",
    heavy: true,
    caption: "A thin-film interference shimmer that answers the pointer.",
    Demo: () => (
      <RbIridescence
        color={[0.62, 0.48, 1]}
        speed={0.9}
        amplitude={0.22}
        mouseReact
      />
    ),
  },
  {
    id: "threads",
    name: "Threads",
    family: "backgrounds",
    heavy: true,
    caption: "Silk strands braided by a travelling sine wave.",
    Demo: () => (
      <RbThreads
        color={[0.55, 0.42, 0.98]}
        amplitude={1.1}
        distance={0.28}
        enableMouseInteraction
      />
    ),
  },
  {
    id: "plasma",
    name: "Plasma",
    family: "backgrounds",
    heavy: true,
    caption: "Raymarched plasma, frame-capped so it stays cheap in a grid.",
    Demo: () => (
      <RbPlasma
        color="#7c3aed"
        speed={0.7}
        direction="pingpong"
        scale={1.2}
        opacity={0.9}
        mouseInteractive
        renderScale={0.4}
        maxDpr={1}
        targetFps={30}
        iterations={34}
      />
    ),
  },
  {
    id: "dot-grid",
    name: "Dot Grid",
    family: "backgrounds",
    heavy: true,
    hint: "flick it",
    caption: "A dot lattice that shocks outward from the pointer.",
    Demo: () => (
      <RbDotGrid
        dotSize={2.1}
        gap={22}
        baseColor="#2a2440"
        activeColor="#a78bfa"
        proximity={140}
        speedTrigger={120}
        shockRadius={130}
        shockStrength={14}
        maxSpeed={2800}
        resistance={0.08}
        returnDuration={1.4}
      />
    ),
  },
  {
    id: "dot-field",
    name: "Dot Field",
    family: "backgrounds",
    heavy: true,
    hint: "move to bulge",
    caption: "Gridded dots that bulge and sparkle around the cursor.",
    Demo: () => (
      <RbDotField
        dotRadius={1.8}
        dotSpacing={16}
        cursorRadius={190}
        cursorForce={0.12}
        bulgeOnly
        bulgeStrength={58}
        glowRadius={140}
        sparkle
        waveAmplitude={14}
        gradientFrom="rgba(124, 58, 237, 0.34)"
        gradientTo="rgba(45, 212, 191, 0.22)"
        glowColor="#07070f"
      />
    ),
  },
  {
    id: "waves",
    name: "Waves",
    family: "backgrounds",
    heavy: true,
    hint: "move the water",
    caption: "A two-axis spring mesh — a 2D grid, no GPU needed.",
    Demo: () => (
      <RbWaves
        lineColor="#8b5cf6"
        backgroundColor="#05050b"
        waveSpeedX={0.9}
        waveSpeedY={1.1}
        waveAmpX={44}
        waveAmpY={28}
        xGap={12}
        yGap={12}
        friction={0.0085}
        tension={0.0065}
        maxCursorMove={48}
      />
    ),
  },

  /* ── animations · kinetic type and content ──────────────────── */
  {
    id: "shiny-text",
    name: "Shiny Text",
    family: "animations",
    heavy: false,
    caption: "A specular band travelling across the glyphs on a loop.",
    Demo: ({ still }) => (
      <RbShinyText
        text="polished"
        disabled={still}
        speed={4.5}
        color="#efeaff"
        shineColor="#ffffff"
        /* the prop is typed number but is really the gradient angle in
           degrees — 104deg matches the house .facet-grad sweep */
        spread={104}
      />
    ),
  },
  {
    id: "decrypted-text",
    name: "Decrypted Text",
    family: "animations",
    heavy: false,
    caption: "Characters settle out of a scrambled alphabet, once, on view.",
    Demo: () => (
      <RbDecryptedText
        text="unlocked"
        speed={38}
        maxIterations={7}
        sequential
        revealDirection="center"
        animateOn="view"
        className="font-mono text-[2rem] font-semibold tracking-tight text-neutral-50"
        encryptedClassName="text-neutral-500"
      />
    ),
  },
  {
    id: "count-up",
    name: "Count Up",
    family: "animations",
    heavy: false,
    caption: "A spring-driven number that rolls to its target in view.",
    Demo: () => (
      <div className="flex items-end gap-2">
        <RbCountUp
          to={1284}
          duration={1.8}
          separator=","
          className="font-mono text-[2.75rem] font-semibold leading-none tracking-tight text-neutral-50 tabular-nums"
        />
        <span className="facet-label pb-1.5 text-white/55">primitives</span>
      </div>
    ),
  },
  {
    id: "blur-text",
    name: "Blur Text",
    family: "animations",
    heavy: false,
    caption: "Per-word blur and travel, sequenced by a sine threshold.",
    Demo: ({ still }) => (
      <RbBlurText
        text="rendered, not recorded"
        delay={still ? 0 : 70}
        animateBy="words"
        direction="top"
        threshold={0.1}
        rootMargin="0px"
        className="text-balance text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-neutral-50"
      />
    ),
  },
  {
    id: "split-text",
    name: "Split Text",
    family: "animations",
    heavy: true,
    caption: "GSAP SplitText lifting characters up through the line box.",
    Demo: ({ still }) => (
      <RbSplitText
        text="char by char"
        tag="p"
        splitType="chars"
        delay={still ? 0 : 34}
        duration={0.7}
        ease="power3.out"
        from={still ? { opacity: 0 } : { opacity: 0, y: 34 }}
        to={{ opacity: 1, y: 0 }}
        className="text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-neutral-50"
      />
    ),
  },
  {
    id: "animated-content",
    name: "Animated Content",
    family: "animations",
    heavy: true,
    caption: "A ScrollTrigger panel that slides, scales and disappears.",
    Demo: ({ still }) => (
      <RbAnimatedContent
        distance={still ? 0 : 64}
        direction="vertical"
        duration={0.7}
        scale={1}
        initialOpacity={0}
        animateOpacity
        threshold={0.05}
        disappearAfter={still ? 0 : 1.6}
        disappearDuration={0.6}
        className="rounded-xl bg-white/6 px-6 py-5 ring-1 ring-white/12"
      >
        <p className="text-[1.05rem] font-medium tracking-tight text-neutral-100">
          arrives, holds, leaves
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
          One trigger, one timeline, torn down on unmount.
        </p>
      </RbAnimatedContent>
    ),
  },
  {
    id: "gradient-text",
    name: "Gradient Text",
    family: "animations",
    heavy: false,
    caption: "A three-stop ramp crawling across the word on three axes.",
    Demo: () => (
      <RbGradientText
        colors={["#a78bfa", "#f0abfc", "#5eead4", "#a78bfa"]}
        animationSpeed={6}
        direction="diagonal"
        className="text-[2rem] font-semibold tracking-[-0.03em]"
      >
        gradient
      </RbGradientText>
    ),
  },
  {
    id: "glitch-text",
    name: "Glitch Text",
    family: "animations",
    heavy: false,
    hint: "hover to tear",
    caption: "Clip-path RGB tearing, armed on hover instead of on a loop.",
    Demo: () => (
      <RbGlitchText
        speed={90}
        enableShadows
        enableOnHover
        className="text-[2rem] font-bold tracking-[-0.03em] text-neutral-50"
      >
        signal lost
      </RbGlitchText>
    ),
  },
  {
    id: "scrambled-text",
    name: "Scrambled Text",
    family: "animations",
    heavy: false,
    hint: "hover to resolve",
    caption: "Glyphs churn inside a radius of the pointer, then lock.",
    Demo: () => (
      <RbScrambledText
        radius={90}
        duration={1.1}
        speed={0.12}
        scrambleChars="01"
        className="font-mono text-[1.7rem] font-semibold tracking-tight text-neutral-50"
      >
        handshake
      </RbScrambledText>
    ),
  },
  {
    id: "text-type",
    name: "Text Type",
    family: "animations",
    heavy: false,
    caption: "Type, hold, delete — a caret that keeps its own rhythm.",
    Demo: ({ still }) => (
      <RbTextType
        as="p"
        text={["npm i Facet", "npx Facet add bend", "copy · paste · ship"]}
        typingSpeed={still ? 120 : 52}
        deletingSpeed={26}
        pauseDuration={900}
        loop
        showCursor
        cursorCharacter="▍"
        cursorBlinkDuration={700}
        cursorClassName="text-[var(--facet-violet)]"
        className="font-mono text-[1.15rem] font-medium tracking-tight text-neutral-100"
      />
    ),
  },
  {
    id: "true-focus",
    name: "True Focus",
    family: "animations",
    heavy: false,
    caption: "A focus box that hops word to word, blurring everything else.",
    Demo: () => (
      /* the component hard-codes 3rem words and 1rem corner brackets and
         exposes no size prop, so the pane is dialled down from outside */
      <div className="[&_.rb-true-focus-focus-container]:gap-x-3 [&_.rb-true-focus-focus-container]:gap-y-3 [&_.rb-true-focus-focus-word]:text-[1.35rem] [&_.rb-true-focus-focus-word]:font-semibold [&_.rb-true-focus-focus-word]:tracking-tight [&_.rb-true-focus-corner]:size-3 [&_.rb-true-focus-corner]:border-2">
        <RbTrueFocus
          sentence="every primitive runs itself"
          blurAmount={6}
          borderColor="#8b5cf6"
          glowColor="rgba(139, 92, 246, 0.55)"
          animationDuration={0.55}
          pauseBetweenAnimations={1.1}
        />
      </div>
    ),
  },
];

/* ── WebGL semaphore ───────────────────────────────────────────
   Module-level on purpose: the budget is a property of the browser,
   not of any one gallery instance, so two galleries on one page still
   share the same six slots. */

type Release = () => void;

let freeSlots = MAX_HEAVY_SLOTS;
const waiting: ((slot: Release) => void)[] = [];

const makeRelease = (): Release => {
  let spent = false;
  return () => {
    if (spent) return;
    spent = true;
    freeSlots += 1;
    pump();
  };
};

const pump = () => {
  while (freeSlots > 0 && waiting.length > 0) {
    const next = waiting.shift();
    if (!next) return;
    freeSlots -= 1;
    next(makeRelease());
  }
};

/** asks for one of the capped slots while `want` is true; returns once granted */
function useGpuSlot(want: boolean): boolean {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (!want) return;

    let cancelled = false;
    let release: Release | null = null;

    const take = (slot: Release) => {
      release = slot;
      /* delivered on a microtask so the write belongs to the request
         that asked for the slot rather than to the commit that noticed
         it — React never renders twice for one observation, and the tile
         paints its demo on the very same frame */
      queueMicrotask(() => {
        if (!cancelled) setHeld(true);
      });
    };

    if (freeSlots > 0) {
      freeSlots -= 1;
      take(makeRelease());
    } else {
      waiting.push((slot) => {
        /* the tile scrolled away while it sat in the queue — hand the
           slot straight back instead of booting a component nobody sees */
        if (cancelled) {
          slot();
          return;
        }
        take(slot);
      });
    }

    return () => {
      cancelled = true;
      release?.();
      /* drop the flag with the slot, so a tile that scrolls back out and
         in again has to win a fresh grant rather than riding the old one */
      setHeld(false);
    };
  }, [want]);

  return held;
}

/* ── viewport proximity ─────────────────────────────────────────
   Two observers rather than one: the wider margin decides when a tile
   is allowed to shut down, the narrower one when it may boot. A single
   observer at either radius re-mounts a tile parked on the boundary. */

function useNearViewport<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* no IntersectionObserver to subscribe to (a stripped test env, or a
       browser older than anything Next 16 supports) — there is nothing
       to watch, so opt the whole grid in on the next tick rather than
       leaving every tile a permanent skeleton */
    if (typeof IntersectionObserver === "undefined") {
      const id = setTimeout(() => setNear(true), 0);
      return () => clearTimeout(id);
    }

    let inRange = false;
    let outOfRange = false;
    const sync = () => setNear(inRange && outOfRange);

    const nearIO = new IntersectionObserver(
      ([entry]) => {
        inRange = entry.isIntersecting;
        sync();
      },
      { rootMargin: MOUNT_MARGIN, threshold: 0 },
    );
    const farIO = new IntersectionObserver(
      ([entry]) => {
        outOfRange = entry.isIntersecting;
        sync();
      },
      { rootMargin: UNMOUNT_MARGIN, threshold: 0 },
    );

    nearIO.observe(el);
    farIO.observe(el);

    return () => {
      nearIO.disconnect();
      farIO.disconnect();
    };
  }, []);

  return [ref, near] as const;
}

/* ── per-tile error boundary ────────────────────────────────────
   One exploding vendored component must degrade to a labelled tile,
   not to a blank rectangle and never to a blank page. */

type BoundaryProps = {
  name: string;
  children: React.ReactNode;
};

type BoundaryState = { failed: boolean };

class TileBoundary extends React.Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(`[gallery] ${this.props.name} failed to render`, error);
  }

  render() {
    if (this.state.failed) return <TileFallback name={this.props.name} />;
    return this.props.children;
  }
}

function TileFallback({ name }: { name: string }) {
  return (
    /* a scrim rather than a panel colour: the stage is a dark island in
       both themes, so the fallback has to stay dark in both too */
    <div className="absolute inset-0 grid place-items-center gap-2 bg-black/70 p-6 text-center backdrop-blur-[2px]">
      <span
        aria-hidden
        className="h-px w-10"
        style={{ background: "var(--facet-band-border)" }}
      />
      <p className="facet-label text-white/60">{name}</p>
      <p className="text-xs leading-relaxed text-white/55">
        This primitive needs a context this browser withheld.
      </p>
    </div>
  );
}

/* ── skeleton ──────────────────────────────────────────────────
   Fixed height, identical on the server and on the first client
   render, so the grid never reflows when the real demo boots. */

function TileSkeleton({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <span className="facet-label animate-pulse text-white/55 motion-reduce:animate-none">
        {label}
      </span>
    </div>
  );
}

/* ── specimen ───────────────────────────────────────────────────
   Real DOM for the canvas family to capture: over-tall so the inner
   scroll pane has range, and tinted by tile index so no two panes
   read as the same card. */

function Specimen({ index, title }: { index: number; title: string }) {
  const tint = TINTS[index % TINTS.length];
  return (
    // The canvas engines sample taller than the pane so the fold has somewhere
    // to go — that headroom has to stay. But centring inside the full 140%
    // puts the copy at 98% of the visible height, which pushed the paragraph
    // under the fold and under the hint pill. Centre inside the visible slice
    // (1 / 1.4) and let the rest be overscan.
    <div className="flex h-[140%] w-full flex-col">
      <div className="flex h-[71.428%] w-full flex-col justify-center gap-4 p-8">
        <span aria-hidden className="h-1.5 w-14 rounded-full" style={{ background: tint }} />
        <p className="text-[1.6rem] font-semibold tracking-[-0.02em] text-neutral-50">
          {title}
        </p>
        <p className="max-w-[26ch] text-sm leading-relaxed text-neutral-400">
          Live DOM, re-rendered through the effect on every frame.
        </p>
        <div aria-hidden className="mt-1 flex flex-wrap gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
            <span
              key={n}
              className="size-2 rounded-full"
              style={{ background: tint, opacity: 1 - n * 0.1 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── tile stage ──────────────────────────────────────────────── */

function TileStage({ tile, index, still }: { tile: GalleryTile; index: number; still: boolean }) {
  const [ref, near] = useNearViewport<HTMLDivElement>();
  const granted = useGpuSlot(near && tile.heavy);
  const live = near && (!tile.heavy || granted);
  const tint = TINTS[index % TINTS.length];

  return (
    <div
      ref={ref}
      className="facet-stage relative h-64 w-full overflow-hidden"
      aria-busy={live ? undefined : true}
    >
      <div aria-hidden className="facet-dots absolute inset-0 opacity-25" />
      {/* bloom behind the demo so the pane reads as lit space */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--facet-halo-a), transparent 65%)" }}
      />

      {live ? (
        <TileBoundary name={tile.name}>
          {/* backgrounds bleed to the pane edge; kinetic type wants
              optical centring, so the family picks the wrapper */}
          <div
            className={cn(
              "absolute inset-0",
              tile.family === "animations" && "flex flex-col items-center justify-center gap-3 p-7 text-center",
            )}
          >
            <tile.Demo still={still} />
          </div>
        </TileBoundary>
      ) : (
        <TileSkeleton label={tile.name} />
      )}

      {/* corner chrome — island-local, light-on-dark, fixed inset so it
          never competes with the demo for the same pixels */}
      <span className="pointer-events-none absolute left-4 top-4 flex h-4 items-center facet-label text-white/55">
        {tile.name}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-4 flex h-4 items-center gap-2 facet-label text-white/55"
      >
        {live ? (
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400/80 motion-reduce:animate-none" />
        ) : (
          <span className="size-1.5 rounded-full bg-white/25" />
        )}
        {live ? "live" : "queued"}
      </span>
      {/* the hint fades the moment you engage the tile — once you are
          dragging, the instruction is just chrome over the work */}
      {tile.hint && (
        <span
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-16",
            "opacity-100 transition-opacity duration-300",
            "group-hover/tile:opacity-0 motion-reduce:transition-none",
          )}
        >
          <span className="rounded-full bg-white/8 px-3 py-1.5 text-[11px] font-medium tracking-tight text-white/70 ring-1 ring-white/12 backdrop-blur-sm">
            {tile.hint}
          </span>
        </span>
      )}
      {/* index chip — a quiet reading of where you are in the wall */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-4 left-4 flex h-4 items-center font-mono text-[10px] tabular-nums text-white/50"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-4 right-4 h-px w-10"
        style={{ background: tint, opacity: 0.5 }}
      />
    </div>
  );
}

/* ── tile card ───────────────────────────────────────────────── */

function GalleryTileCard({
  tile,
  index,
  still,
}: {
  tile: GalleryTile;
  index: number;
  still: boolean;
}) {
  return (
    <motion.figure
      initial={still ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: EASE, delay: still ? 0 : (index % 3) * 0.06 }}
      /* the seat shadow lives on the card, never on the stage — an
         ancestor's overflow-hidden would crop it off the page */
      className="facet-seat group/tile flex flex-col overflow-hidden rounded-2xl bg-[var(--facet-panel)]"
    >
      <TileStage tile={tile} index={index} still={still} />
      <figcaption className="flex flex-1 flex-col gap-2 border-t border-[var(--facet-band-border)] px-5 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="truncate text-sm font-medium tracking-tight text-foreground">
            {tile.name}
          </h3>
          <span className="facet-label shrink-0 text-muted-foreground">
            {tile.family}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{tile.caption}</p>
      </figcaption>
    </motion.figure>
  );
}

/* ── section ─────────────────────────────────────────────────── */

export function ComponentGallery({
  heading = (
    <>
      The library, <span className="facet-grad">running live</span>.
    </>
  ),
  sub = "Thirty-three primitives from three vendored families, each one running in this tab. Nothing here is a screenshot — every pane boots the real component, then shuts it down when you scroll away.",
}: {
  heading?: React.ReactNode;
  sub?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  /* framer-motion answers the media query during render, and the
     browser's answer can differ from the server's — so the branch that
     changes markup waits until React has finished hydrating, which is
     exactly what useSyncExternalStore's server snapshot is for */
  const settled = useSyncExternalStore(neverChanges, alwaysTrue, alwaysFalse);
  const still = settled && !!reduce;

  const heavyCount = GALLERY_TILES.filter((t) => t.heavy).length;

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="relative mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 md:py-24 lg:px-10"
    >
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="facet-eyebrow text-primary">
            the gallery · {GALLERY_TILES.length} tiles
          </p>
          <h2
            id="gallery-heading"
            className="mt-3 text-balance text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl"
          >
            {heading}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {sub}
          </p>
        </div>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY_TILES.map((tile, i) => (
          <GalleryTileCard key={tile.id} tile={tile} index={i} still={still} />
        ))}
      </div>

      {/* the budget, stated plainly — an instrument, not a footnote */}
      <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
        <span className="facet-label text-foreground/70">budget</span>
        <span className="h-3 w-px bg-border" aria-hidden />
        <span>
          {heavyCount} tiles hold a graphics context,{" "}
          {MAX_HEAVY_SLOTS} may be live at once.
        </span>
        <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
        <span>The rest queue and boot as slots free.</span>
      </p>
    </section>
  );
}

export default ComponentGallery;
