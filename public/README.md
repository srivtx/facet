# Vendored third-party assets

Everything under `public/` is served from this origin. Nothing in the app fetches a
third-party host at runtime, so the site works offline / air-gapped.

| Path | What it is | Source | Licence |
| --- | --- | --- | --- |
| `photos/vendor/uns-*.jpg` | Demo photography for the vendored bits (carousels, galleries, morph sliders, fluid glass) | [Unsplash](https://unsplash.com) (`images.unsplash.com`), re-encoded to progressive JPEG at the width each demo requests | [Unsplash Licence](https://unsplash.com/license) — free for commercial and non-commercial use, no permission needed |
| `photos/vendor/pravatar-*.jpg` | Avatar set for the ChromaGrid demo | [Pravatar](https://i.pravatar.cc) (`i.pravatar.cc`), which serves Unsplash portraits | Unsplash Licence |
| `photos/vendor/pic-*.jpg` | Placeholder photography for the gallery/wall demos | [Lorem Picsum](https://picsum.photos) (`picsum.photos/id/<n>`) — Picsum's own catalogue of Unsplash photos | Unsplash Licence / CC0 per image |
| `assets/lanyard/card.glb` | The lanyard badge model | `card.glb` from [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) (`Components/Lanyard/card.glb`) | MIT — see `src/components/ax/bits/ATTRIBUTION.md` |
| `fonts/Geist-Variable.ttf` | Font file for the in-scene 3D text in `rb-fluid-glass` | [Vercel Geist](https://github.com/vercel/geist) via the `geist` npm package — the same typeface `src/app/layout.tsx` already self-hosts | OFL-1.1 |
| `three/draco/gltf/*` | Draco geometry decoder used by `THREE.DRACOLoader` for compressed glTF | Copied verbatim from `three/examples/jsm/libs/draco/gltf/` (already an installed dependency) | MIT (three.js) |
| `face-api/weights/*` | face-api.js model weights for the GridScan webcam face tracking | `justadudewhohacks/face-api.js@0.22.2/weights` — the exact release that is pinned in `package.json` | Apache-2.0 (face-api.js) |
| `three/earth-blue-marble.jpg` | Earth colour map for `aceternity/3d-globe` (`Globe3D`) | `unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg`, copied out of `node_modules/three-globe/example/img/` — sha256-identical to what that URL serves. NASA Blue Marble source imagery | Public domain (NASA); MIT (three-globe, Vasco Asturiano) |
| `three/earth-topology.png` | Terrain bump map for `aceternity/3d-globe` (`Globe3D`) | `unpkg.com/three-globe@2.31.0/example/img/earth-topology.png`, copied from `node_modules/three-globe/example/img/` — sha256-identical. NASA topography | Public domain (NASA); MIT (three-globe) |
| `textures/noise.webp` | Film-grain overlay for `aceternity/noise-background` and `aceternity/wobble-card` | **Generated** (see below) — replaces the hotlinked `assets.aceternity.com/noise.webp` | Generated here |
| `mask.svg` | Reveal mask for `aceternity/svg-mask-effect` (`MaskContainer`) | **Generated** — a soft radial reveal. The component referenced `/mask.svg`, which never existed in `public/`, so every mount 404'd | Generated here |
| `sounds/sound.ogg` | Keypress sample for `aceternity/keyboard` and `aceternity/terminal` | **Generated** — a synthesised 55 ms mechanical click. Both components already fetched `/sounds/sound.ogg`; the file was missing, so `decodeAudioData` never had anything to decode | Generated here |
| `logos/navbar-mark.svg` | Default mark for `aceternity/resizable-navbar` (`NavbarLogo`) | **Generated** — a neutral placeholder. The component hotlinked `assets.aceternity.com/logo-dark.png`, which is *Aceternity's* brand mark; rather than vendor a third party's logo, `NavbarLogo` now takes a `src` and defaults to this | Generated here |

## Notes

- `card.glb` was re-packed here rather than copied byte-for-byte: the upstream file
  carries a 2.3 MB 1678×1677 RGBA PNG atlas that is 95% of the file. The atlas was
  re-encoded to a 1400px 4:4:4 JPEG and the GLB chunks rewritten in place, taking the
  asset from 2.4 MB to 457 KB. Geometry, node names (`card`, `clip`, `clamp`),
  material names (`base`, `metal`) and the atlas UV layout (front face in the left
  half, back face in the right half) are unchanged.
- `photos/vendor/pic-gray-*.jpg` have the grayscale conversion upstream requested via
  `?grayscale` / `sat=-100` baked in, so the components need no CSS filter to match.
- Every image is progressive JPEG, encoded to the largest width any demo asks for, so
  no component renders softer than it did against the remote original.
- `fonts/Geist-Variable.ttf` exists because troika (behind drei's `<Text>`) parses TTF/OTF/WOFF
  only, and `next/font` emits woff2 under a per-build hash. With no explicit `font`,
  troika 0.52 fetches a per-codepoint fallback font from a `unicode-font-resolver` dataset on
  cdn.jsdelivr.net. Naming this file makes the resolver unnecessary. troika uses the font's
  default instance (Geist Regular 400); the file is the variable build, so the `wght`
  100–900 axis is available if a caller ever wants to set `fontWeight`.
- `textures/noise.webp` is generated rather than vendored byte-for-byte.
  `assets.aceternity.com/noise.webp` is 2049×2049 of white RGB with the grain carried in the
  alpha channel — 732 KB of essentially incompressible randomness. The replacement is a
  1024×1024 tile built from iid grain smoothed on a torus (a binomial kernel, so it tiles with
  no seam) and clustered by a low-frequency logistic weight, then rank-matched onto the upstream
  alpha histogram so the composited result lands in the same place: white RGB, mean alpha 95,
  sd 80, 18% of pixels at exactly 0, lag-1 autocorrelation 0.87. Encoded with libwebp at
  `quality=80, alpha_quality=40`, which costs 6.8/255 of alpha RMSE (2.7% of the grain's own
  standard deviation) and is invisible under the 10–20% opacities the two call sites use; a
  lossless alpha plane would be 949 KB for a file nobody can tell apart.
- `sounds/sound.ogg` is a 55 ms stereo Vorbis click: a 1.75 kHz body with a 9 ms exponential
  decay, a 3.4 kHz ring with a 3.5 ms decay, and a 1.2 ms noise transient, peak-limited to
  0.72 so the Vorbis decode does not clip. Both consumers already treated a missing or
  undecodable file as "stay silent", so this is additive.
