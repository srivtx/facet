<div align="center">

<br />

<img src="public/logo.svg" width="64" height="64" alt="Facet" />

# Facet

**Precision-cut interface primitives, live-rendered.**

A living library of motion-grade UI primitives — every tile is the component
itself, live and interactive. No screenshots, no video loops: real markup, real
CSS, real WebGL. First-class light and dark themes from a single token system.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=black)](https://tailwindcss.com/)
[![framer-motion](https://img.shields.io/badge/framer--motion-12-E879F9?style=flat-square)](https://motion.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-8b5cf6?style=flat-square)](LICENSE)

<br />

</div>

## What's inside

**Two libraries, kept deliberately separate.**

### 1. The Facet primitives — 39 components, 10 families, 77 variant forms

Hand-authored, each with its own page, live stage, variant switcher, import
line and design notes.

| Family | Primitives |
| --- | --- |
| **Ambience** | Corona, Flux, Trace Grid, Beam Lines, Aurora Veil |
| **Buttons** | Sheen, Sweep, Halo, Notch, Pop, Candy |
| **Cards** | Pointer Card, Halo Card, Stack Deck, Voice Card |
| **Kinetic Type** | Flip Cycle, Morph Stream, Cascade, Glitch, Roll Digits |
| **Dimension** | Iso Stage, Tilt Card, Ribbon, Orbit Cam |
| **Galleries** | Orbit Gallery, Diagonal Rail, Cursor Trail |
| **Navigation** | Notch Bar, Spotlight Bar, Glass Dock |
| **Loaders** | Kinetic, Shutter, Orbit Dot |
| **Inputs** | Goo Search, Type Deck |
| **Showcase** | Player Deck, Orbit System, Peek Folder |

### 2. The vendored families — 361 components, 252 browsable

Pulled in from upstream open source, mounted live at `/library/vendored`. These
are **other people's work** under their own licences, namespaced (`Cx*` / `Rb*`)
so nothing collides with the primitives above.

| Upstream | Files | Prefix | Licence |
| --- | --- | --- | --- |
| [DavidHDev/canvas-ui](https://github.com/DavidHDev/canvas-ui) | 35 | `Cx` | MIT |
| [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) | 213 | `Rb` | **MIT + Commons Clause** |
| [Aceternity UI](https://ui.aceternity.com) free registry | 113 | — | MIT |

> **Commons Clause, read this before you republish anything.** react-bits is
> *MIT + Commons Clause License Condition v1.0*. Embedding these components in
> your own product is fine. **Selling, sublicensing or redistributing the
> components themselves — alone, in a bundle, or as a ported version — is not.**
> If `/library/vendored` ever becomes a public registry or a template you sell,
> that clause applies. Full text and per-file provenance:
> `src/components/facet/bits/ATTRIBUTION.md`.

They live in separate directories rather than mixed into the showcase because
`DemoStage` is a hand-curated `switch` — the 39 Facet demos have real content in
them, and 250 generated placeholder tiles beside them would make the curated
work look like filler.

## Routes

| Route | What lives there |
| --- | --- |
| `/` | canvas-ui's landing funnel: hero running a live `CxFrost`, a 33-tile live gallery, install steps, stack, FAQ |
| `/library` | The Facet catalogue: family sidebar, search, live tiles |
| `/library/[family]` | A family pass with its own count and blurb |
| `/library/[family]/[id]` | A page per primitive: live stage, `?v=` variant deep-links, import line, related entries, keyboard navigation |
| `/library/vendored` | All 252 vendored components, searchable, with live demos |
| `/docs` | Getting started, the three laws, the token table |
| `/changelog` | Release notes, one entry per release |

## Highlights

- **Live, not recorded.** Every stage renders the real component — hover, drag,
  type and scroll them directly on the page.
- **Dual theme, one system.** Semantic design tokens flip between light and
  dark; demo stages are deliberate dark islands in both, so component lighting
  never needs re-tuning. AA contrast holds in both, including inside the dark
  islands.
- **No runtime network calls.** Every font, texture, model and photo is served
  from this origin, so the site works offline. See `public/README.md` for
  provenance and licences of all 12 MB of vendored assets.
- **Graphics budgets are enforced, not hoped for.** A browser allows roughly 16
  live WebGL contexts and kills the oldest past that. Both the landing gallery
  and the vendored index lazy-mount on intersection, cap live contexts behind a
  `useSyncExternalStore` semaphore, and wrap each tile in an error boundary. 252
  components on one page peaks at 6 live contexts.
- **Keyboard-complete.** Focus-visible parity throughout, region landmarks named
  per instance, `prefers-reduced-motion` respected on every ambient loop —
  verified with `document.getAnimations()`, not by trusting a `useEffect`.
- **Audited, not asserted.** axe-core is clean on every route in both themes
  bar four confirmed false positives on the landing hero (axe resolves only
  `background-color` and walks past the opaque stage gradient; measured
  composited ratios are 7.3–12.7:1).

## The three laws

1. **Motion budget.** One ambient loop + one 200ms affordance per surface.
   Ambient clocks live between 6s and 60s — motion you can stare at.
2. **Contrast floor.** Text over any animated background holds 4.5:1 against
   the worst-case frame. Glows cap at 16% opacity.
3. **Borrow the physics.** Every effect decomposes into primitives you
   already own — custom properties, `offset-path`, `preserve-3d`,
   `conic-gradient`. Take the technique; it composes with your system.

## Run it

```bash
bun install
bun run dev
```

Open <http://localhost:3000>.

```bash
bun run lint     # eslint, must be clean
bun run build    # production build
```

## Maintenance

Two scripts keep the vendored families honest. Run them after re-syncing
anything.

```bash
# re-fetch the Aceternity free registry (idempotent; --force overwrites local edits)
node scripts/sync-aceternity.mjs

# regenerate the vendored index after adding or removing a component
python3 scripts/gen-vendored.py
```

`gen-vendored.py` walks the three vendored trees, pulls out every exported
component, and emits `src/components/site/vendored/manifest.ts` as **loaders,
not imports**. That is deliberate: the eager form pulled all 252 modules — and
three.js, rapier3d and react-icons behind them — into the route bundle whether
or not a tile ever scrolled into range. Measured, the route's critical path went
from 2557 KB to 240 KB gzipped. If you edit that manifest by hand, the next
regen will revert it; edit the generator instead.

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # canvas-ui style landing funnel
│   ├── library/
│   │   ├── page.tsx                # Facet catalogue
│   │   ├── [family]/               # family pass
│   │   ├── [family]/[id]/          # per-primitive page
│   │   └── vendored/               # the 252 vendored components
│   ├── docs/                       # getting started, laws, tokens
│   ├── changelog/                  # release log
│   ├── globals.css                 # the token system (light + dark)
│   └── opengraph-image.tsx
├── components/
│   ├── facet/                      # hand-authored primitives, 11 modules
│   │   ├── aceternity/             #   vendored — 113 + 6 blocks
│   │   ├── canvas/                 #   vendored — 35
│   │   ├── blocks/                 #   vendored — 6 page sections
│   │   └── bits/                   #   vendored — 213
│   │       ├── backgrounds/        #     59
│   │       ├── animations/         #     73
│   │       └── components/         #     81
│   └── site/
│       ├── landing/                # hero, gallery, sections, stat band
│       ├── vendored/               # the searchable index + generated manifest
│       └── hero, rows, catalogue, detail, sections
├── data/globe.json                 # country geometry for the 3d globe
├── hooks/use-outside-click.ts
└── lib/registry.ts                 # catalogue data: families, entries, variants
```

### A note on the vendored directories

They are excluded from four ESLint rules — `react-hooks/immutability`,
`set-state-in-effect`, `refs` and `preserve-manual-memoization` — because they
are synced from upstream rather than hand-authored, and those compiler-era rules
flag patterns the upstream code predates. Scoping them off beats patching files
a re-sync would overwrite.

`rules-of-hooks` is deliberately **not** in that list. It is a correctness rule,
and turning it off is how two real crashes reached main: an early `return`
above `useSpring` in `rb-counter`, and `useGLTF`/`useLoader` called inside a
`useMemo` callback in `rb-model-viewer`.

## Stack

- Next.js 16 (App Router) · React 19
- TypeScript strict
- Tailwind CSS v4 (CSS-first token system)
- framer-motion 12 · three.js r186 · GSAP · OGL
- Geist type system
- lucide icons

## License

Facet is MIT — steal the technique, keep the craft.

The vendored families keep their own terms. See
`src/components/facet/bits/ATTRIBUTION.md` and `src/components/facet/canvas/ATTRIBUTION.md`.