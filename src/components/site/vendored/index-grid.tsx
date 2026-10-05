"use client";

/* Facet / vendored — the index for everything pulled in from upstream.
 *
 * The hand-authored families at /library stay hand-authored: those 38 demos
 * have real content in them, and generating 250 placeholder tiles next to them
 * would make the curated work look like filler. So the vendored set gets its
 * own honest index instead of being smuggled into the same showcase.
 *
 * The engineering problem is the same one the landing gallery has, and for the
 * same reason: these are canvas / WebGL / GSAP components. 252 of them mounted
 * at once exhausts the browser's graphics contexts and every tile dies for a
 * reason unrelated to itself. Three guards:
 *
 *   1. Lazy mount with hysteresis — two observers at different margins, so a
 *      tile parked at the edge does not thrash.
 *   2. A module-level semaphore caps live graphics contexts; the rest queue.
 *   3. A per-tile error boundary, so one bad component shows a labelled tile
 *      instead of blanking the page.
 */

import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROBE_ENTRIES } from "./manifest";

const MAX_HEAVY_SLOTS = 6;

/* the DOM-only families can all mount at once; the graphics ones cannot */
const GPU_FAMILIES = new Set(["canvas", "backgrounds", "animations"]);

/** a loader resolves to a lazy-able { default } namespace; see manifest.ts */
type TileLoader = () => Promise<{ default: React.ComponentType<Record<string, never>> }>;

interface Tile {
  id: string;
  slug: string;
  family: string;
  name: string;
  Comp: React.ComponentType<Record<string, never>>;
}

/* "backgrounds/rb-acid-squares/RbAcidSquares" -> "Acid Squares" */
function humanise(name: string, slug: string) {
  const stripped = name.replace(/^(Cx|Rb)/, "");
  const fromName = stripped.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  if (fromName.trim().length > 2) return fromName.trim();
  return slug
    .replace(/^(cx|rb)-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const TILES: Tile[] = PROBE_ENTRIES.map((e) => {
  const [, slug, name] = e.id.split("/");
  return {
    id: e.id,
    slug,
    family: e.family,
    name: humanise(name, slug),
    /* lazy() is called once per tile here rather than inside the tile's render:
     * it allocates a wrapper and nothing else — the import() behind it stays
     * parked until the component is actually rendered, which the GPU semaphore
     * and the viewport observer below decide. Creating it in render would
     * remount the tile's subtree on every pass. */
    Comp: lazy(e.load as unknown as TileLoader),
  };
});

/* one line per family, in the sidebar's own voice — the catalogue's rail
   carries a blurb for the engaged row and this should read the same */
const FAMILY_BLURB: Record<string, string> = {
  canvas:
    "WebGL and WebGPU engines from canvas-ui. Each one re-renders real DOM through a graphics pass, so they need children to have anything to show.",
  backgrounds:
    "Shader backgrounds from react-bits. Self-contained — most need no props at all, which is why they are the safest thing to mount in bulk.",
  animations:
    "Text and cursor animation. Mostly DOM and SVG rather than WebGL, so these mount freely without competing for a graphics context.",
  components:
    "Widgets, cards and nav. The widest family and the only one with components that want real content to be worth looking at.",
};

const FAMILY_LABEL: Record<string, string> = {
  canvas: "Canvas",
  backgrounds: "Shaders",
  animations: "Motion",
  components: "Widgets",
};

/* ── GPU slot semaphore ──────────────────────────────────────
 * Modelled as a real external store rather than local state. Holding the
 * grants in a module-level set and exposing them through useSyncExternalStore
 * means a tile learns it got a slot from a store notification instead of a
 * setState() call inside an effect, and React cannot tear the read across a
 * concurrent render.
 */
let version = 0;
const holders = new Set<symbol>();
const queue: symbol[] = [];
const listeners = new Set<() => void>();

function notify() {
  version++;
  for (const cb of listeners) cb();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

const getVersion = () => version;

function tryGrant(id: symbol) {
  if (holders.has(id)) return;
  if (holders.size >= MAX_HEAVY_SLOTS) {
    if (!queue.includes(id)) queue.push(id);
    return;
  }
  holders.add(id);
  notify();
}

function release(id: symbol) {
  const i = queue.indexOf(id);
  if (i !== -1) queue.splice(i, 1);
  if (!holders.delete(id)) return;
  // hand the freed slot to whoever has been waiting longest
  while (queue.length && holders.size < MAX_HEAVY_SLOTS) {
    holders.add(queue.shift()!);
  }
  notify();
}

function useGpuSlot(want: boolean): boolean {
  const id = useMemo(() => Symbol("gpu-slot"), []);

  // subscribe first so a grant that lands during the effect below still
  // schedules a re-render
  useSyncExternalStore(subscribe, getVersion, getVersion);

  useEffect(() => {
    if (!want) {
      release(id);
      return;
    }
    tryGrant(id);
    return () => release(id);
  }, [want, id]);

  return want && holders.has(id);
}

/* ── near-viewport with hysteresis ─────────────────────────── */
function useNearViewport<T extends HTMLElement>(rootMargin = "320px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const enter = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setNear(true)),
      { rootMargin },
    );
    // a wider margin to exit than to enter, so a tile at the boundary does not
    // mount and tear down on every pixel of scroll
    const exit = new IntersectionObserver(
      (es) => es.forEach((e) => !e.isIntersecting && setNear(false)),
      { rootMargin: `-${rootMargin}` },
    );
    enter.observe(el);
    exit.observe(el);
    return () => {
      enter.disconnect();
      exit.disconnect();
    };
  }, [rootMargin]);
  return [ref, near] as const;
}

/* ── per-tile boundary ─────────────────────────────────────── */
class TileBoundary extends React.Component<
  { id: string; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(e: unknown) {
    console.error(`[Facet] vendored tile ${this.props.id} failed:`, e);
  }
  render() {
    if (this.state.failed) {
      return (
        <div
          role="img"
          aria-label={`${this.props.id} failed to render`}
          className="grid h-full w-full place-items-center bg-[var(--facet-panel)] px-3 text-center font-mono text-[10px] text-muted-foreground"
        >
          failed
        </div>
      );
    }
    return this.props.children;
  }
}

/* ── specimen for the canvas family ───────────────────────────
 * The canvas-ui components are wrappers: they re-render whatever children
 * you hand them through a WebGL pass. Mounted bare they are live and correct
 * and completely invisible, which is useless on an index page. A small block
 * of type gives the effect something to refract.
 */
function Specimen({ label }: { label: string }) {
  return (
    // Definite height matters: the canvas family rasterises its children, and a
    // child with no intrinsic height gives the sampler nothing to read, so the
    // effect mounts, runs, and paints an empty pane.
    <div className="flex h-40 w-full flex-col items-center justify-center gap-3 text-center">
      <span aria-hidden className="h-1.5 w-10 rounded-full bg-[var(--facet-violet)]" />
      <span className="text-xl font-semibold tracking-[-0.02em] text-neutral-50">
        {label}
      </span>
      <span className="max-w-[22ch] text-[11px] leading-relaxed text-neutral-400">
        Rendered live through the effect.
      </span>
    </div>
  );
}

/* ── chunk-in-flight placeholder ──────────────────────────────────
 * The tile already holds a GPU slot and is inside its error boundary by the
 * time this can show; it is only covering the network round-trip for the
 * tile's own chunk. Sits at the same size and colour as the queued state so
 * the grid does not jump when the component lands. */
function TileChunk({ label }: { label: string }) {
  return (
    <div className="grid h-full w-full place-items-center font-mono text-[10px] text-white/55">
      {label}
    </div>
  );
}

/* ── tile ──────────────────────────────────────────────────── */
function VendoredTile({
  tile,
  still,
}: {
  tile: Tile;
  still: boolean;
}) {
  const [ref, near] = useNearViewport<HTMLDivElement>();
  const heavy = GPU_FAMILIES.has(tile.family);
  const granted = useGpuSlot(near && heavy);
  const live = near && (!heavy || granted);
  /* Nothing is requested until this tile actually mounts: the tile's Comp is a
   * lazy() wrapper (built at module scope) and React does not call its factory
   * until the element renders — which only happens once `live`, i.e. near the
   * viewport AND holding a GPU slot. The import() therefore costs one chunk per
   * tile actually shown, instead of all 252 up front. */
  const { Comp } = tile;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card",
        "transition-colors duration-300 hover:border-foreground/25",
      )}
    >
      <div
        ref={ref}
        className="facet-stage relative h-48 w-full overflow-hidden"
        aria-busy={live ? undefined : true}
      >
        {live ? (
          <TileBoundary id={tile.id}>
            <div className="absolute inset-0 flex items-center justify-center p-5">
              {/* Mounted with NO props, deliberately. Every one of these 252
                  was verified in a real browser on a bare render, and passing
                  anything extra leaks: several components spread their rest
                  props onto a DOM node, so an unknown prop like `still` lands
                  on the element and React warns about a non-boolean
                  attribute. Zero props is the verified baseline. */}
              <Suspense fallback={<TileChunk label={tile.name} />}>
                {tile.family === "canvas" ? (
                  <Comp {...({ children: <Specimen label={tile.name} /> } as unknown as Record<string, never>)} />
                ) : (
                  <Comp {...({} as Record<string, never>)} />
                )}
              </Suspense>
            </div>
          </TileBoundary>
        ) : (
          <div className="grid h-full w-full place-items-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/25">
              {tile.name}
            </span>
          </div>
        )}

        {/* one dot, not a pair of corner labels. The earlier build stamped the
            name top-left AND a live/queued badge top-right AND a mono family
            label in the footer — three pieces of chrome per card, which is what
            made the grid read like a dashboard instead of a library. The status
            is a single dot that only appears once the tile has actually booted. */}
        <span
          aria-hidden
          className={cn(
            "absolute right-3 top-3 size-1.5 rounded-full transition-opacity duration-300",
            live ? "bg-emerald-400/80 opacity-100" : "bg-white/20 opacity-0",
          )}
        />
      </div>

      {/* footer: name and a hairline rule that draws on hover — the same
          restraint the curated catalogue uses. No subtitle, no index chip. */}
      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
        <span className="truncate text-sm font-medium tracking-tight text-foreground">
          {tile.name}
        </span>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
          {FAMILY_LABEL[tile.family] ?? tile.family}
        </span>
      </div>
    </article>
  );
}

/* ── sidebar item ───────────────────────────────────────────────
 * Deliberately the same shape as the curated catalogue's SideItem
 * (src/components/site/catalogue.tsx): engaged row gets the tinted
 * background, the ring, and the little primary bar on the left edge,
 * with the count right-aligned in mono. One sidebar idiom across both
 * catalogues beats two that look related but are not. */
function SideItem({
  engaged,
  label,
  count,
  onClick,
}: {
  engaged: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={engaged ? "true" : undefined}
      className={cn(
        "group/side relative flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        engaged
          ? "bg-primary/15 font-medium text-foreground ring-1 ring-primary/25"
          : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
      )}
    >
      {engaged && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary"
        />
      )}
      <span className="min-w-0 truncate tracking-tight">{label}</span>
      <span className="font-mono text-[10px] tabular-nums leading-none text-muted-foreground">
        {count}
      </span>
    </button>
  );
}

/* ── index ───────────────────────────────────────────────────── */
export function VendoredIndex() {
  const still = !!useReducedMotion();
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<string>("all");

  const families = useMemo(
    () => ["all", ...Array.from(new Set(TILES.map((t) => t.family)))],
    [],
  );

  const countFor = useCallback(
    (f: string) => (f === "all" ? TILES.length : TILES.filter((t) => t.family === f).length),
    [],
  );

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TILES.filter((t) => {
      if (family !== "all" && t.family !== family) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    });
  }, [query, family]);

  const onQuery = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const activeBlurb = FAMILY_BLURB[family];

  return (
    <section>
      <header className="mx-auto w-full max-w-6xl px-6 pt-14">
        <span className="facet-label text-muted-foreground">vendored</span>
        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
          Everything pulled in from upstream.
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
          {TILES.length} components from canvas-ui and react-bits, every one
          swept in a real browser before it was listed here. These are not Facet
          primitives — they are other people&rsquo;s work, kept under their own
          licences, with the attribution shipped beside them.
        </p>
      </header>

      <div className="mx-auto mt-10 w-full max-w-6xl px-6">
        <label className="relative block w-full sm:max-w-[22rem]">
          <span className="sr-only">Filter components</span>
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={query}
            onChange={onQuery}
            placeholder="Filter primitives"
            className={cn(
              "w-full rounded-full bg-secondary/60 py-2 pl-10 pr-4 text-sm text-foreground",
              "ring-1 ring-border outline-none placeholder:text-muted-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring",
            )}
          />
        </label>
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-8 px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        {/* ── sidebar (desktop) / pills (mobile) ─────────────── */}
        <nav aria-label="Vendored families" className="lg:sticky lg:top-24 lg:self-start">
          {/* mobile: the same list, scrolled sideways. A 220px rail has no
              honest small-screen form, and hiding it entirely would leave the
              families unreachable on a phone. */}
          <div className="facet-scroll -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden">
            {families.map((f) => {
              const engaged = family === f;
              const label = f === "all" ? "All" : (FAMILY_LABEL[f] ?? f);
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFamily(f)}
                  aria-pressed={engaged}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-xs font-medium tracking-tight transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    engaged
                      ? "bg-foreground text-background"
                      : "bg-secondary text-muted-foreground ring-1 ring-border hover:text-foreground",
                  )}
                >
                  {label} · {countFor(f)}
                </button>
              );
            })}
          </div>

          {/* desktop: the vertical rail */}
          <ul className="hidden flex-col gap-0.5 lg:flex">
            <li>
              <SideItem
                engaged={family === "all"}
                label="All components"
                count={TILES.length}
                onClick={() => setFamily("all")}
              />
            </li>
            {families
              .filter((f) => f !== "all")
              .map((f) => (
                <li key={f}>
                  <SideItem
                    engaged={family === f}
                    label={FAMILY_LABEL[f] ?? f}
                    count={countFor(f)}
                    onClick={() => setFamily(f)}
                  />
                </li>
              ))}
          </ul>

          {activeBlurb && (
            <p className="mt-4 hidden border-l-2 border-primary/40 pl-3 text-xs leading-relaxed text-muted-foreground lg:block">
              {activeBlurb}
            </p>
          )}

          <p className="mt-5 hidden font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground lg:block">
            {still ? "reduced motion on" : `max ${MAX_HEAVY_SLOTS} live contexts`}
          </p>
        </nav>

        {/* ── the grid ───────────────────────────────────────── */}
        <div>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {shown.length} shown
          </p>
          {shown.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
              Nothing matches “{query}”.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((t) => (
                <VendoredTile key={t.id} tile={t} still={still} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-24" />
    </section>
  );
}

export default VendoredIndex;
