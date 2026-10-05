"use client";
/* Vendored from DavidHDev/react-bits — Components/DriftWall/DriftWall.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import { CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const RB_DRIFT_WALL_CSS = `
.rb-drift-wall-drift-wall {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  perspective: var(--dw-perspective, 1200px);
  perspective-origin: 50% 50%;
  --dw-tile-w: 200px;
  --dw-tile-h: 132px;
  --dw-gap: 18px;
  --dw-radius: 14px;
  --dw-lift: 64px;
  --dw-dim: 0.55;
  --dw-gray: 0;
  --dw-overlay: #060010;
  --dw-edge: 40%;
  -webkit-mask-image:
    radial-gradient(ellipse 78% 82% at 50% 46%, #000 var(--dw-edge), transparent 100%),
    linear-gradient(to top, #000 var(--dw-edge), transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    radial-gradient(ellipse 78% 82% at 50% 46%, #000 var(--dw-edge), transparent 100%),
    linear-gradient(to top, #000 var(--dw-edge), transparent 100%);
  mask-composite: intersect;
}

.rb-drift-wall-drift-wall__plane {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: row;
  transform-style: preserve-3d;
  cursor: pointer;
  transform-origin: 50% 50%;
  will-change: transform;
}

.rb-drift-wall-drift-wall__col {
  position: relative;
  width: calc(var(--dw-tile-w) + var(--dw-gap));
  transform-style: preserve-3d;
}

.rb-drift-wall-drift-wall__track {
  display: flex;
  flex-direction: column;
  will-change: transform;
  transform-style: preserve-3d;
}

.rb-drift-wall-drift-wall__tile {
  position: relative;
  display: block;
  width: 100%;
  height: calc(var(--dw-tile-h) + var(--dw-gap));
  flex: 0 0 auto;
  outline: none;
  transform-style: preserve-3d;
}

.rb-drift-wall-drift-wall__inner {
  position: absolute;
  inset: calc(var(--dw-gap) / 2);
  display: block;
  border-radius: var(--dw-radius);
  overflow: hidden;
  background: #0b0b12;
  opacity: var(--dw-dim);
  transform: translateZ(0);
  pointer-events: none;
  transition:
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.42s cubic-bezier(0.22, 1, 0.36, 1);
}

.rb-drift-wall-drift-wall__tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: grayscale(var(--dw-gray)) saturate(0.92);
  transition: filter 0.42s cubic-bezier(0.22, 1, 0.36, 1);
  user-select: none;
  -webkit-user-drag: none;
}

.rb-drift-wall-drift-wall__overlay {
  position: absolute;
  inset: 0;
  background: var(--dw-overlay);
  opacity: 0.42;
  pointer-events: none;
  transition: opacity 0.42s cubic-bezier(0.22, 1, 0.36, 1);
}

.rb-drift-wall-drift-wall__tile.rb-drift-wall-is-active .rb-drift-wall-drift-wall__inner,
.rb-drift-wall-drift-wall__tile:focus-visible .rb-drift-wall-drift-wall__inner {
  opacity: 1;
  transform: translateZ(var(--dw-lift));
  box-shadow: 0 24px 60px -18px rgba(0, 0, 0, 0.7);
}

.rb-drift-wall-drift-wall__tile.rb-drift-wall-is-active img,
.rb-drift-wall-drift-wall__tile:focus-visible img {
  filter: grayscale(0) saturate(1.05);
}

.rb-drift-wall-drift-wall__tile.rb-drift-wall-is-active .rb-drift-wall-drift-wall__overlay,
.rb-drift-wall-drift-wall__tile:focus-visible .rb-drift-wall-drift-wall__overlay {
  opacity: 0;
}

.rb-drift-wall-drift-wall__tile:focus-visible .rb-drift-wall-drift-wall__inner {
  box-shadow:
    0 24px 60px -18px rgba(0, 0, 0, 0.7),
    0 0 0 2px rgba(255, 255, 255, 0.9);
}

@media (prefers-reduced-motion: reduce) {
  .rb-drift-wall-drift-wall__plane,
  .rb-drift-wall-drift-wall__track {
    will-change: auto;
  }
}

`;

export interface DriftWallItem {
  image: string;
  title?: string;
  href?: string;
}

export interface DriftWallProps {
  items?: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: 'up' | 'down';
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  className?: string;
  style?: CSSProperties;
}

interface ColumnMeta {
  copyHeight: number;
  copies: number;
}

/* Upstream pulled fifteen 600x400 placeholders from picsum.photos. Fifteen distinct
 * crops of the same vendored set are served from /public/photos/vendor instead, so the
 * wall keeps its staggered, non-repeating layout with no third-party request. */
const DEFAULT_DRIFT_WALL_IDS = [
  1015, 1025, 1039, 1043, 1044, 1050, 1062, 1069, 1074, 1080, 1084, 106, 110, 133, 164
];

const DEFAULT_ITEMS: DriftWallItem[] = Array.from({ length: 15 }, (_, i) => {
  const id = DEFAULT_DRIFT_WALL_IDS[i % DEFAULT_DRIFT_WALL_IDS.length];
  return {
    image: `/photos/vendor/pic-${id}.jpg`,
    title: `Tile ${i + 1}`,
    href: undefined
  };
});

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index: number, variance: number): number => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

const RbDriftWall = ({
  items = DEFAULT_ITEMS,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = 'up',
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  grayscale = false,
  overlayColor = '#060010',
  className = '',
  style
}: DriftWallProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const hoveredColRef = useRef<number>(-1);
  const wallHoveredRef = useRef<boolean>(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef<number | null>(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const columnItems = useMemo<DriftWallItem[][]>(() => {
    const cols: DriftWallItem[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns].push(item));
    return cols.map(col => (col.length ? col : items.slice(0, 1)));
  }, [items, columns]);

  const columnMeta = useMemo<ColumnMeta[]>(() => {
    const unit = tileHeight + gap;
    return columnItems.map(col => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo<number[]>(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px: number, py: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  useEffect(() => {
    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredColRef.current === c ? 0 : 1;
          const target = baseVelocities[c] * factor;

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;

          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform]);

  const activate = useCallback((id: string, index: number): void => {
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  }, []);
  const release = useCallback((): void => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5
        };
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = hit && hit.closest ? (hit.closest('[data-tile-id]') as HTMLElement | null) : null;
      if (!tile) return;
      const id = tile.dataset.tileId ?? null;
      if (id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredColRef.current = Number(tile.dataset.col);
      setActiveId(id);
    },
    [parallax, reduced]
  );

  const handlePointerLeaveWall = useCallback((): void => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  const cssVars = useMemo<CSSProperties>(
    () =>
      ({
        '--dw-tile-w': `${tileWidth}px`,
        '--dw-tile-h': `${tileHeight}px`,
        '--dw-gap': `${gap}px`,
        '--dw-radius': `${radius}px`,
        '--dw-perspective': `${perspective}px`,
        '--dw-lift': `${lift}px`,
        '--dw-dim': dim,
        '--dw-gray': grayscale ? 1 : 0,
        '--dw-overlay': overlayColor,
        '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
        ...style
      }) as CSSProperties,
    [tileWidth, tileHeight, gap, radius, perspective, lift, dim, grayscale, overlayColor, fade, style]
  );

  const renderTile = (item: DriftWallItem, id: string, colIndex: number) => {
    const inner = (
      <span className={cn("rb-drift-wall-drift-wall__inner")}>
        <img src={item.image} alt={item.title ?? ''} loading="lazy" decoding="async" draggable={false} />
        <span className={cn("rb-drift-wall-drift-wall__overlay")} aria-hidden="true" />
      </span>
    );
    const commonProps = {
      className: `drift-wall__tile${activeId === id ? ' rb-drift-wall-is-active' : ''}`,
      'data-tile-id': id,
      'data-col': colIndex,
      onFocus: () => activate(id, colIndex),
      onBlur: release
    };
    if (item.href) {
      return (
        <a key={id} href={item.href} target="_blank" rel="noreferrer noopener" {...commonProps}>
          {inner}
        </a>
      );
    }
    return (
      <div key={id} tabIndex={0} role="button" aria-label={item.title ?? 'tile'} {...commonProps}>
        {inner}
      </div>
    );
  };

  const rootClass = ['rb-drift-wall-drift-wall', reduced ? 'drift-wall--reduced' : '', className].filter(Boolean).join(' ');

  return (
    <>
          <style href="rb-drift-wall" precedence="rb">{RB_DRIFT_WALL_CSS}</style>
          <div
      ref={containerRef}
      className={rootClass}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Drifting wall of tiles"
    >
      <div ref={planeRef} className={cn("rb-drift-wall-drift-wall__plane")}>
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta.copies });
          return (
            <div className={cn("rb-drift-wall-drift-wall__col")} key={`col-${c}`}>
              <div
                className={cn("rb-drift-wall-drift-wall__track")}
                ref={el => {
                  trackRefs.current[c] = el;
                }}
              >
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
        </>
  );
};

export { RbDriftWall };
export default RbDriftWall;
