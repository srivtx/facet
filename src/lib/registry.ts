/* Facet registry — the catalogue of primitives.
   Every entry renders a live demo via <DemoStage comp=... variant=... />. */

export type FamilyId =
  | "ambience"
  | "buttons"
  | "cards"
  | "textfx"
  | "motion3d"
  | "galleries"
  | "navigation"
  | "loaders"
  | "inputs"
  | "showcase";

export interface Variant {
  id: string;
  label: string;
  hint: string;
}

export interface AxiomEntry {
  id: string;
  name: string;
  family: FamilyId;
  tagline: string;
  description: string;
  tags: string[];
  variants: Variant[];
  featured?: boolean;
  wide?: boolean;
  /** shipped in the latest release — shows a New badge in the catalogue */
  isNew?: boolean;
}

export const FAMILIES: { id: FamilyId; label: string; blurb: string }[] = [
  { id: "ambience", label: "Ambience", blurb: "Backgrounds that breathe — rays, gradients, grids." },
  { id: "buttons", label: "Buttons", blurb: "Tactile controls with shine, halo and sweep." },
  { id: "cards", label: "Cards", blurb: "Surfaces that react to pointers and glow on focus." },
  { id: "textfx", label: "Kinetic Type", blurb: "Type that flips, cascades, rolls and melts." },
  { id: "motion3d", label: "Dimension", blurb: "Isometric stages, tilt physics and ribbons." },
  { id: "galleries", label: "Galleries", blurb: "Orbits, rails, trails and elastic decks." },
  { id: "navigation", label: "Navigation", blurb: "Notched bars, spotlight menus, glass docks." },
  { id: "loaders", label: "Loaders", blurb: "Kinetic waiting states worth watching." },
  { id: "inputs", label: "Inputs", blurb: "Search and typing surfaces with character." },
  { id: "showcase", label: "Showcase", blurb: "Habitats — players, systems, peeks and leaves." },
];

export const ENTRIES: AxiomEntry[] = [
  /* ── ambience ───────────────────────────────────────────── */
  {
    id: "corona",
    name: "Corona",
    family: "ambience",
    tagline: "Rotating light rays behind a focal point.",
    description:
      "A conic field of soft rays that rotates at reading speed behind your hero copy. Built from layered repeating gradients with a blur pass, so it stays cheap on the GPU. Two variants tune the mood: pale monochrome for quiet sections, violet for the money shot.",
    tags: ["background", "css", "ambient"],
    variants: [
      { id: "mono", label: "Monochrome", hint: "Quiet white rays for deep sections" },
      { id: "violet", label: "Violet", hint: "Signature gradient rays for heroes" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "flux",
    name: "Flux",
    family: "ambience",
    tagline: "Liquid gradient that never repeats.",
    description:
      "Four blurred gradient cells drift on independent 20–40s clocks and blend through a soft-light stack. The result reads as liquid light rather than a looping GIF — perfect behind a headline you want to feel alive without motion sickness.",
    tags: ["background", "gradient", "ambient"],
    variants: [
      { id: "dusk", label: "Dusk", hint: "Violet to fuchsia melt" },
      { id: "ember", label: "Ember", hint: "Amber to rose melt" },
    ],
  },
  {
    id: "tracegrid",
    name: "Trace Grid",
    family: "ambience",
    tagline: "Isometric floor that draws itself once.",
    description:
      "An SVG isometric lattice that strokes itself in on load (2s, ease-out) then sits still. The draw-once treatment gives structure without the endless hum of a looping animation. Mask fades the grid before it meets the viewport edge.",
    tags: ["background", "svg", "isometric"],
    variants: [
      { id: "wide", label: "Wide", hint: "Full-bleed floor plane" },
      { id: "macro", label: "Macro", hint: "Zoomed, denser lattice" },
    ],
    featured: true,
  },
  {
    id: "beamlines",
    name: "Beam Lines",
    family: "ambience",
    tagline: "Hairlines that sweep the section border.",
    description:
      "Thin gradient filaments travel along the top and bottom hairlines of a band, catching attention without raising the noise floor. Durations stay above 8s so the motion reads as ambience, never as alarm.",
    tags: ["background", "hairline", "ambient"],
    variants: [
      { id: "single", label: "Single", hint: "One filament per edge" },
      { id: "duo", label: "Duo", hint: "Counter-phased pair" },
    ],
  },
  {
    id: "auroraveil",
    name: "Aurora Veil",
    family: "ambience",
    tagline: "Two breathing glows, 26s and 34s clocks.",
    description:
      "The signature Facet page wash: one violet and one fuchsia radial glow inhale on offset clocks. Opacity is capped at 16% so text keeps 4.5:1 contrast everywhere it overlaps. This is the single ambient loop the whole page is allowed.",
    tags: ["background", "glow", "ambient"],
    variants: [
      { id: "standard", label: "Standard", hint: "Violet over fuchsia" },
      { id: "polar", label: "Polar", hint: "Teal over violet, colder cast" },
    ],
  },

  /* ── buttons ────────────────────────────────────────────── */
  {
    id: "sheen",
    name: "Sheen",
    family: "buttons",
    tagline: "A shine sweeps the label every second.",
    description:
      "The workhorse CTA. A diagonal light band passes through the label via an animated mask, and the border catches a synchronized glint through a mask-composite ring. Spring physics on press (stiffness 500, damping 30) make it feel machined.",
    tags: ["button", "shine", "framer"],
    variants: [
      { id: "light", label: "Light", hint: "White label, quiet glint" },
      { id: "violet", label: "Violet", hint: "Signature gradient glint" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "sweep",
    name: "Sweep",
    family: "buttons",
    tagline: "Label swaps out, intent sweeps in.",
    description:
      "On hover the resting label slides clear while a duplicate with an arrow slides in from the opposite rail. A small dot pulses at the leading edge. Pure CSS transitions at 300ms with a 100.8 dot scale — deceptively simple, endlessly reusable.",
    tags: ["button", "hover", "css"],
    variants: [
      { id: "standard", label: "Standard", hint: "Slide + arrow swap" },
      { id: "wide", label: "Wide", hint: "Pill geometry, larger type" },
    ],
  },
  {
    id: "halo",
    name: "Halo",
    family: "buttons",
    tagline: "Radial glow that tracks the pointer.",
    description:
      "A CSS custom-property radial background follows the cursor across the surface, brightening the border ring as it moves. Registered properties animate at 0.25s so the light lags just enough to feel physical. Best for the one primary action per view.",
    tags: ["button", "pointer", "glow"],
    variants: [
      { id: "iris", label: "Iris", hint: "Violet radial that chases" },
      { id: "static", label: "Static", hint: "Fixed center bloom" },
    ],
  },
  {
    id: "notchbtn",
    name: "Notch",
    family: "buttons",
    tagline: "Clipped corner with a beam that laps it.",
    description:
      "The rectangle loses a corner to a 45° clip, and a thin beam orbits the resulting outline on a 6s clock. The geometry stays sharp because the clip is on the border-box while the beam rides an offset-path. Edgy without being cyberpunk-loud.",
    tags: ["button", "clip-path", "beam"],
    variants: [
      { id: "tl", label: "Top-left", hint: "Corner removed at top-left" },
      { id: "br", label: "Bottom-right", hint: "Mirrored clip" },
    ],
  },
  {
    id: "pop",
    name: "Pop",
    family: "buttons",
    tagline: "Scale bounce with a soft shadow drop.",
    description:
      "A press-feedback button with spring overshoot on hover (1.04) and squish on tap (0.96). The shadow widens as it lifts, grounding the illusion. Pairs well with icon glyphs for toolbar actions.",
    tags: ["button", "spring", "feedback"],
    variants: [
      { id: "chip", label: "Chip", hint: "Compact icon action" },
      { id: "full", label: "Full", hint: "Label + icon, padding-xl" },
    ],
  },
  {
    id: "candy",
    name: "Candy",
    family: "buttons",
    tagline: "Glossy capsule with an inner highlight.",
    description:
      "A hard-surface capsule: inset white top highlight, gradient body, and a crisp outer ring. On hover the gloss slides 4px. It borrows the physicality of a physical keycap — satisfying to press, calm to look at.",
    tags: ["button", "gloss", "css"],
    variants: [
      { id: "grape", label: "Grape", hint: "Violet body" },
      { id: "cream", label: "Cream", hint: "Inverted, light body" },
    ],
  },

  /* ── cards ──────────────────────────────────────────────── */
  {
    id: "pointercard",
    name: "Pointer Card",
    family: "cards",
    tagline: "A spotlight that follows the cursor.",
    description:
      "A pointer-tracked radial highlight sits under the content and a gradient border ignites on the nearest edge. On leave, everything relaxes to hairlines. The tracking is a single rAF-throttled CSS variable update — no re-renders, 60fps on modest hardware.",
    tags: ["card", "pointer", "glow"],
    variants: [
      { id: "spotlight", label: "Spotlight", hint: "Radial follow glow" },
      { id: "edge", label: "Edge light", hint: "Nearest-edge ignition" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "halocard",
    name: "Halo Card",
    family: "cards",
    tagline: "Beam orbits the border while content sits still.",
    description:
      "A 42px gradient beam travels the card outline on an offset-path at 6s. The content itself never moves — motion budget spent on exactly one ornament. Focus-visible triggers the same orbit for keyboard users, which doubles as the accessibility affordance.",
    tags: ["card", "beam", "border"],
    variants: [
      { id: "orbit", label: "Orbit", hint: "Continuous 6s lap" },
      { id: "hover", label: "On hover", hint: "Beam only while engaged" },
    ],
    featured: true,
  },
  {
    id: "deck",
    name: "Stack Deck",
    family: "cards",
    tagline: "Card deck that spreads elastically on hover.",
    description:
      "Overlapping cards push apart with a custom spring easing curve — overshoot to 1.2, settle at 1.0 — while the engaged card lifts and scales to 1.25. Works with avatars, covers or plain initials; the geometry recomputes from stack length.",
    tags: ["card", "stack", "spring"],
    variants: [
      { id: "avatars", label: "Avatars", hint: "Initial discs" },
      { id: "tickets", label: "Tickets", hint: "Rounded rectangles" },
    ],
  },
  {
    id: "voicecard",
    name: "Voice Card",
    family: "cards",
    tagline: "Testimonial with a rolling count-up.",
    description:
      "A quote surface that pairs kinetic digits (milestones count up when scrolled into view) with a masked avatar row. The digits roll on a 0.5s ease-out with a layout-aware strip, so the number physically passes through the window rather than snapping.",
    tags: ["card", "social-proof", "counter"],
    variants: [
      { id: "metric", label: "Metric", hint: "Big rolling stat" },
      { id: "quote", label: "Quote", hint: "Attribution focus" },
    ],
  },

  /* ── textfx ─────────────────────────────────────────────── */
  {
    id: "flipcycle",
    name: "Flip Cycle",
    family: "textfx",
    tagline: "Characters flip in 3D on a sine stagger.",
    description:
      "Each glyph rotates through its own 3D hinge; the per-character delay follows a sine curve across the string so the wave feels organic instead of metronomic. Two speeds ship: 1.2s snappy and 2.4s cinematic.",
    tags: ["text", "3d", "stagger"],
    variants: [
      { id: "fast", label: "Fast", hint: "1.2s wave, tight stagger" },
      { id: "slow", label: "Slow", hint: "2.4s wave, luxurious" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "morphstream",
    name: "Morph Stream",
    family: "textfx",
    tagline: "Words morph through weight and blur.",
    description:
      "A word rotates through a list, each transition blurring out at 10px while the successor un-blurs. The blur pass is the trick: it hides the width change so the line never jumps horizontally. Pointer-events are disabled to keep links stable.",
    tags: ["text", "blur", "rotate"],
    variants: [
      { id: "verbs", label: "Verbs", hint: "ship / craft / ship" },
      { id: "nouns", label: "Nouns", hint: "primitives / habitats" },
    ],
  },
  {
    id: "cascade",
    name: "Cascade",
    family: "textfx",
    tagline: "Words rise 8px with a blur-in stagger.",
    description:
      "The reference-grade reveal: each word starts at opacity 0, blur 10px, y 8px and animates to rest at 0.2s intervals. Small distance is the discipline — 8px, never 40px — so the reveal feels like focus pulling, not a parade.",
    tags: ["text", "reveal", "scroll"],
    variants: [
      { id: "load", label: "On load", hint: "Runs immediately" },
      { id: "loop", label: "Looping", hint: "Demo loop every 6s" },
    ],
  },
  {
    id: "glitch",
    name: "Glitch",
    family: "textfx",
    tagline: "RGB split that triggers on demand.",
    description:
      "Two clipped pseudo-layers offset in red and cyan shudder for 300ms. The trigger is hover or a 5s idle pulse — never continuous — because glitch is seasoning, not sauce. Contrast is preserved by keeping the base layer intact.",
    tags: ["text", "glitch", "rgb"],
    variants: [
      { id: "pulse", label: "Idle pulse", hint: "Every 5s" },
      { id: "hover", label: "On hover", hint: "Engagement only" },
    ],
  },
  {
    id: "rolldigits",
    name: "Roll Digits",
    family: "textfx",
    tagline: "Numbers roll through a digit strip.",
    description:
      "Each digit lives in a window over a 0–9 strip; value changes translateY the strip with layout animation, so 9→0 physically rolls the full distance. Direction follows increase/decrease. This powers the Facet stats band.",
    tags: ["text", "numbers", "counter"],
    variants: [
      { id: "stat", label: "Stat", hint: "Plain rolling number" },
      { id: "metric", label: "Metric", hint: "Number + suffix + label" },
    ],
    featured: true,
  },

  /* ── motion3d ───────────────────────────────────────────── */
  {
    id: "isostage",
    name: "Iso Stage",
    family: "motion3d",
    tagline: "Isometric slab that pops from its shadow.",
    description:
      "An SVG extruded slab — back hull, connecting ribs, front face — where the front pops to sit flush on hover while the shadow dissolves. The transition uses a 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) so it lands with a snap. Content rides in a foreignObject, so anything renderable fits inside.",
    tags: ["3d", "isometric", "svg"],
    variants: [
      { id: "slab", label: "Slab", hint: "Single unit" },
      { id: "cluster", label: "Cluster", hint: "Three-unit stepped stack" },
    ],
    featured: true,
  },
  {
    id: "tiltcard",
    name: "Tilt Card",
    family: "motion3d",
    tagline: "Perspective tilt capped at 8 degrees.",
    description:
      "Pointer position maps to rotateX/rotateY against a 1000px perspective, hard-capped at 8° so nothing spills into gimmick. Depth layers (translateZ) let a badge float above the surface. Resets on leave with a 200ms ease-linear settle.",
    tags: ["3d", "tilt", "pointer"],
    variants: [
      { id: "badge", label: "Layered", hint: "Floating badge at translateZ(40px)" },
      { id: "flat", label: "Flat", hint: "Single plane, subtle drift" },
    ],
    isNew: true,
  },
  {
    id: "ribbon",
    name: "Ribbon",
    family: "motion3d",
    tagline: "A ribbon that twists along its length.",
    description:
      "Segmented planes rotate on alternating X axes to fake a continuous twist through 3D space. The seam period is 11 segments; the whole strip drifts 4px on a 7s float. Reads as sculpture — good for section intermissions.",
    tags: ["3d", "ribbon", "css"],
    variants: [
      { id: "still", label: "Still drift", hint: "Floating only" },
      { id: "spin", label: "Slow spin", hint: "Full rotation, 24s" },
    ],
  },
  {
    id: "orbitcam",
    name: "Orbit Cam",
    family: "motion3d",
    tagline: "A clean cube — nothing inside but light.",
    description:
      "The Facet hero object: a six-face glass cube rotating on a 26s linear clock with a 6s counter-float. Faces carry a single glyph mark at most — no paragraphs, no cramming — because the cube is the texture, not the message. Ground glow and a masked isometric floor anchor it.",
    tags: ["3d", "cube", "hero"],
    variants: [
      { id: "mark", label: "With mark", hint: "One glyph on one face" },
      { id: "blank", label: "Blank glass", hint: "Pure geometry" },
    ],
    featured: true,
  },

  /* ── galleries ──────────────────────────────────────────── */
  {
    id: "orbitgal",
    name: "Orbit Gallery",
    family: "galleries",
    tagline: "Cards orbit a center on a drag dial.",
    description:
      "A ring of cards rotates on a shared axis; drag or auto-rotate at 12s per lap. Front-most card scales to 1 and holds full contrast while the rear cards dim to 55% — the depth cue. Clicking any card rotates it to the front.",
    tags: ["gallery", "orbit", "drag"],
    variants: [
      { id: "auto", label: "Auto", hint: "12s continuous lap" },
      { id: "manual", label: "Manual", hint: "Drag to spin" },
    ],
    isNew: true,
  },
  {
    id: "diagonalrail",
    name: "Diagonal Rail",
    family: "galleries",
    tagline: "Marquee on a 12° diagonal, dual rows.",
    description:
      "Two marquee rows run opposite directions on a skewY(-12°) plane, masked to fade at both ends. Hover pauses the row you are reading while the other keeps drifting — a detail that reads as craft. Speeds sit at 40s per crossing.",
    tags: ["gallery", "marquee", "diagonal"],
    variants: [
      { id: "pair", label: "Counter pair", hint: "Two rows, opposite" },
      { id: "solo", label: "Solo", hint: "One band, steeper 18°" },
    ],
  },
  {
    id: "cursortrail",
    name: "Cursor Trail",
    family: "galleries",
    tagline: "Images spawn and chase the pointer.",
    description:
      "Movement above a velocity threshold births a sprite that scales in, follows with spring lag, then dissolves. Population is capped at 12 and sprites pool, so memory stays flat. The kinetic energy is the point — it makes a static grid feel inhabited.",
    tags: ["gallery", "pointer", "spring"],
    variants: [
      { id: "glyphs", label: "Glyphs", hint: "Typographic sprites" },
      { id: "covers", label: "Covers", hint: "Gradient cover sprites" },
    ],
  },

  /* ── navigation ─────────────────────────────────────────── */
  {
    id: "notchbar",
    name: "Notch Bar",
    family: "navigation",
    tagline: "Floating bar with a clipped active notch.",
    description:
      "A pill navbar whose active item is a clip-path notch that morphs between links on a 0.3s spring. The bar itself floats 24px off the top with a hairline and backdrop blur. Active state is keyboard-reachable with focus-visible parity.",
    tags: ["nav", "clip-path", "spring"],
    variants: [
      { id: "icons", label: "Icons", hint: "Compact icon rail" },
      { id: "labels", label: "Labels", hint: "Full word items" },
    ],
  },
  {
    id: "spotbar",
    name: "Spotlight Bar",
    family: "navigation",
    tagline: "Menu items pull light toward the pointer.",
    description:
      "Each nav link hosts a radial gradient whose center follows the cursor, and the link ignites as the light crosses it. The underline grows from center on hover at 200ms. Quiet, precise, extremely Vercel.",
    tags: ["nav", "pointer", "gradient"],
    variants: [
      { id: "line", label: "Underline", hint: "Center-out rule" },
      { id: "glow", label: "Glow", hint: "Soft label bloom" },
    ],
  },
  {
    id: "glassdock",
    name: "Glass Dock",
    family: "navigation",
    tagline: "macOS-style dock with magnification falloff.",
    description:
      "Icons magnify on a gaussian falloff from the pointer — the engaged icon hits 1.5x while second neighbors get 1.15x. The dock glass is a 12% white panel with a 1px gradient rim. Tooltips rise on hover with 100ms delay.",
    tags: ["nav", "dock", "magnify"],
    variants: [
      { id: "std", label: "Standard", hint: "8-slot dock" },
      { id: "mini", label: "Mini", hint: "5-slot, tighter" },
    ],
  },

  /* ── loaders ────────────────────────────────────────────── */
  {
    id: "kinetic",
    name: "Kinetic",
    family: "loaders",
    tagline: "Letters stretch while a dot orbits them.",
    description:
      "A wordmark becomes its own loader: the dot travels an elliptical path while individual letters stretch on per-frame keyframes (scale 0.35→1.4→1). Pure CSS, 1.8s loop, and a size that scales from 0.6 on mobile to 1 on desktop.",
    tags: ["loader", "type", "css"],
    variants: [
      { id: "word", label: "Word", hint: "Full word treatment" },
      { id: "mono", label: "Mono", hint: "Tight letter-spacing cut" },
    ],
  },
  {
    id: "shutter",
    name: "Shutter",
    family: "loaders",
    tagline: "Two blades close over the content, then reveal.",
    description:
      "Top and bottom gradient blades slide shut (400ms), hold one beat, then retract to reveal fresh content behind. The hold is what makes it feel intentional. Use it for view swaps where a hard cut would be jarring.",
    tags: ["loader", "reveal", "transition"],
    variants: [
      { id: "once", label: "Once", hint: "Single cycle" },
      { id: "loop", label: "Loop", hint: "Continuous demo" },
    ],
  },
  {
    id: "orbitdot",
    name: "Orbit Dot",
    family: "loaders",
    tagline: "Three dots on intersecting orbits.",
    description:
      "Dots ride two crossing elliptical tracks with offset phases, trading z-depth at the crossings. 1.4s period, ease-in-out both legs. It is the loader you reach for when a spinner would undersell the product.",
    tags: ["loader", "orbit", "css"],
    variants: [
      { id: "duo", label: "Duo", hint: "Two dots" },
      { id: "trio", label: "Trio", hint: "Three, offset thirds" },
    ],
  },

  /* ── inputs ─────────────────────────────────────────────── */
  {
    id: "goosearch",
    name: "Goo Search",
    family: "inputs",
    tagline: "Search field that melts on focus.",
    description:
      "On focus the field's silhouette loosens via an SVG goo filter (feGaussianBlur + feColorMatrix), then re-solidifies as the clear button scales in. Blur radius is registered so it animates. The goo stays under 6px — beyond that it reads as broken, not soft.",
    tags: ["input", "filter", "focus"],
    variants: [
      { id: "bar", label: "Bar", hint: "Inline field" },
      { id: "modal", label: "Modal", hint: "Centered command field" },
    ],
  },
  {
    id: "typedeck",
    name: "Type Deck",
    family: "inputs",
    tagline: "A keyboard that lights up as you type.",
    description:
      "A rendered key grid mirrors physical keystrokes — the matching cap dips 2px and glows for 180ms. It also self-types a demo string when idle. Layout is a real staggered QWERTY so it doubles as a typing-practice prop.",
    tags: ["input", "keyboard", "demo"],
    variants: [
      { id: "live", label: "Live", hint: "Follows your real keys" },
      { id: "auto", label: "Auto", hint: "Self-typing" },
    ],
  },

  /* ── showcase ───────────────────────────────────────────── */
  {
    id: "playerdeck",
    name: "Player Deck",
    family: "showcase",
    tagline: "A music player that actually plays.",
    description:
      "Album art, a scrub bar with buffered gradient, and a spinning disc when the track runs. The disc uses conic-gradient grooves and spins at 8s per lap; the needle tracks progress. All state is local — wire it to anything.",
    tags: ["showcase", "player", "conic"],
    variants: [
      { id: "rest", label: "Resting", hint: "Paused, needle parked" },
      { id: "play", label: "Playing", hint: "Disc spinning, bars up" },
    ],
    featured: true,
  },
  {
    id: "orbitsys",
    name: "Orbit System",
    family: "showcase",
    tagline: "A tiny solar system, to scale-ish.",
    description:
      "Bodies ride concentric orbits with period squared to radius (Kepler-ish), each trail drawn as a fading arc. The whole system tilts 18° toward the viewer. Hover any body to freeze the system and read its label.",
    tags: ["showcase", "orbit", "canvas-free"],
    variants: [
      { id: "five", label: "Five bodies", hint: "Full system" },
      { id: "three", label: "Three bodies", hint: "Tight cut" },
    ],
  },
  {
    id: "peekfolder",
    name: "Peek Folder",
    family: "showcase",
    tagline: "A folder that fans its pages on hover.",
    description:
      "A folder icon whose contents fan out as stacked sheets — each sheet offsets on an arc with a 40ms stagger. On leave they tuck back with the same physics. Doubles as a file-picker when sheets are clickable.",
    tags: ["showcase", "folder", "fan"],
    variants: [
      { id: "sheets", label: "Sheets", hint: "Document fan" },
      { id: "tabs", label: "Tabs", hint: "Colored tab fan" },
    ],
  },
];

export const LIBRARY = ENTRIES;

export const entryById = (id: string) => ENTRIES.find((e) => e.id === id);

export const familyLabel = (id: FamilyId) =>
  FAMILIES.find((f) => f.id === id)?.label ?? id;

export const familyBlurb = (id: FamilyId) =>
  FAMILIES.find((f) => f.id === id)?.blurb ?? "";

export const featured = ENTRIES.filter((e) => e.featured);

export const COUNTS = {
  families: FAMILIES.length,
  entries: ENTRIES.length,
  variants: ENTRIES.reduce((n, e) => n + e.variants.length, 0),
};

/* ── routing helpers ────────────────────────────────────────── */

/** canonical shareable URL for an entry's dedicated page */
export const entryPath = (e: AxiomEntry) => `/library/${e.family}/${e.id}`;

/** family listing page */
export const familyPath = (id: FamilyId) => `/library/${id}`;

/** which file a component lives in, for the honest install story */
export const importPath = (id: string) => {
  const fam = ENTRIES.find((e) => e.id === id)?.family;
  return fam ? `@/components/facet/${fam}` : "@/components/facet";
};

/** prev/next within the whole catalogue (alphabetical by family order) */
export function neighbours(id: string) {
  const i = ENTRIES.findIndex((e) => e.id === id);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? ENTRIES[i - 1] : null,
    next: i < ENTRIES.length - 1 ? ENTRIES[i + 1] : null,
  };
}

/** related entries: same family first, then featured, excluding self */
export function related(id: string, take = 3): AxiomEntry[] {
  const self = entryById(id);
  if (!self) return [];
  const sameFamily = ENTRIES.filter((e) => e.family === self.family && e.id !== id);
  const rest = ENTRIES.filter(
    (e) => e.family !== self.family && e.featured && e.id !== id,
  );
  return [...sameFamily, ...rest].slice(0, take);
}

/** entries flagged as shipped in the current release */
export const fresh = ENTRIES.filter((e) => e.isNew);
