"use client";
/* Vendored from DavidHDev/react-bits — Components/LineSidebar/LineSidebar.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import { useRef, useState, useCallback, useEffect, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

const RB_LINE_SIDEBAR_CSS = `
.rb-line-sidebar-line-sidebar {
  --accent-color: #a855f7;
  --text-color: #c4c4c4;
  --marker-color: #6c6c6c;
  --marker-length: 60px;
  --marker-gap: 0px;
  --tick-scale: 0.5;
  --max-shift: 30px;
  --item-gap: 20px;
  --font-size: 1.1rem;
  --smoothing: 100ms;

  position: relative;
  display: flex;
  justify-content: flex-start;
}

.rb-line-sidebar-line-sidebar--markers {
  padding-left: calc(var(--marker-length) + var(--marker-gap));
}

.rb-line-sidebar-line-sidebar__list {
  list-style: none;
  margin: 0;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: var(--item-gap);
}

/* --effect (0..1) is driven per item by a rAF lerp in JS, so every derived
   property below reads the same continuously-animating value and stays in
   step, with no CSS transitions to stagger. */
.rb-line-sidebar-line-sidebar__item {
  position: relative;
  cursor: pointer;
}

/* Widen the pointer target so items react a touch before the cursor arrives */
.rb-line-sidebar-line-sidebar__item::before {
  content: '';
  position: absolute;
  inset: -6px -48px;
}

.rb-line-sidebar-line-sidebar__label {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  font-size: var(--font-size);
  line-height: 1.2;
  color: color-mix(in srgb, var(--accent-color) calc(var(--effect, 0) * 100%), var(--text-color));
  transform: translateX(calc(var(--effect, 0) * var(--max-shift)));
}

.rb-line-sidebar-line-sidebar__index {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  margin-right: 0.6rem;
  font-size: 0.85em;
  opacity: calc(0.55 + var(--effect, 0) * 0.45);
}

.rb-line-sidebar-line-sidebar__marker {
  position: absolute;
  top: 50%;
  left: calc(-1 * var(--marker-length) - var(--marker-gap));
  height: 1px;
  width: var(--marker-length);
  background-color: color-mix(in srgb, var(--accent-color) calc(var(--effect, 0) * 100%), var(--marker-color));
  transform-origin: left center;
  transform: translateY(-50%) scaleX(calc(0.7 + var(--effect, 0) * 0.5));
}

/* Short static tick centered in the gap between two menu items */
.rb-line-sidebar-line-sidebar--markers .rb-line-sidebar-line-sidebar__item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: calc(100% + var(--item-gap) / 2);
  left: calc(-1 * var(--marker-length) - var(--marker-gap));
  height: 1px;
  width: calc(var(--marker-length) * var(--tick-scale));
  background-color: var(--marker-color);
  opacity: 0.5;
  transform: translateY(-50%);
}

/* When enabled, the in-between ticks grow with cursor proximity too */
.rb-line-sidebar-line-sidebar--scale-tick .rb-line-sidebar-line-sidebar__item:not(:last-child)::after {
  transform-origin: left center;
  transform: translateY(-50%) scaleX(calc(0.7 + var(--effect, 0) * 0.6));
}

`;

type Falloff = 'linear' | 'smooth' | 'sharp';

export interface LineSidebarProps {
  items?: string[];
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: Falloff;
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  defaultActive?: number | null;
  onItemClick?: (index: number, label: string) => void;
  className?: string;
}

const FALLOFF_CURVES: Record<Falloff, (p: number) => number> = {
  linear: p => p,
  smooth: p => p * p * (3 - 2 * p),
  sharp: p => p * p * p
};

const DEFAULT_ITEMS = [
  'Overview',
  'Components',
  'Animations',
  'Backgrounds',
  'Showcase',
  'Playground',
  'Templates',
  'Changelog',
  'Community',
  'Resources',
  'Documentation',
  'Support'
];

const RbLineSidebar = ({
  items = DEFAULT_ITEMS,
  accentColor = '#A855F7',
  textColor = '#c4c4c4',
  markerColor = '#6c6c6c',
  showIndex = true,
  showMarker = true,
  proximityRadius = 100,
  maxShift = 30,
  falloff = 'smooth',
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.1,
  smoothing = 100,
  defaultActive = null,
  onItemClick,
  className = ''
}: LineSidebarProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const activeRef = useRef<number | null>(defaultActive);
  const smoothingRef = useRef(smoothing);
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultActive);

  activeRef.current = activeIndex;
  smoothingRef.current = smoothing;

  // Single rAF loop that eases every item's --effect toward its target using
  // frame-rate independent exponential smoothing, so color, shift and scale
  // all move together without staggering CSS transitions.
  const runFrame = useCallback((now: number) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = Math.max(smoothingRef.current, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    let moving = false;
    const items = itemRefs.current;
    for (let i = 0; i < items.length; i++) {
      const el = items[i];
      if (!el) continue;
      const target = Math.max(targetsRef.current[i] || 0, activeRef.current === i ? 1 : 0);
      const cur = currentRef.current[i] || 0;
      const next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      currentRef.current[i] = value;
      el.style.setProperty('--effect', value.toFixed(4));
      if (!settled) moving = true;
    }

    rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
    }
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLUListElement>) => {
      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const pointerY = e.clientY - rect.top;
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear;
      const items = itemRefs.current;
      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        if (!el) continue;
        const center = el.offsetTop + el.offsetHeight / 2;
        const distance = Math.abs(pointerY - center);
        targetsRef.current[i] = ease(Math.max(0, 1 - distance / proximityRadius));
      }
      startLoop();
    },
    [falloff, proximityRadius, startLoop]
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  }, [startLoop]);

  const handleClick = useCallback(
    (index: number, label: string) => {
      setActiveIndex(index);
      onItemClick?.(index, label);
    },
    [onItemClick]
  );

  useEffect(() => {
    startLoop();
  }, [activeIndex, startLoop]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    },
    []
  );

  return (
    <>
          <style href="rb-line-sidebar" precedence="rb">{RB_LINE_SIDEBAR_CSS}</style>
          <nav
      aria-label="Line sidebar links"
      className={`rb-line-sidebar-line-sidebar${showMarker ? ' rb-line-sidebar-line-sidebar--markers' : ''}${scaleTick ? ' rb-line-sidebar-line-sidebar--scale-tick' : ''}${className ? ` ${className}` : ''}`}
      style={
        {
          '--accent-color': accentColor,
          '--text-color': textColor,
          '--marker-color': markerColor,
          '--marker-length': `${markerLength}px`,
          '--marker-gap': `${markerGap}px`,
          '--tick-scale': tickScale,
          '--max-shift': `${maxShift}px`,
          '--item-gap': `${itemGap}px`,
          '--font-size': `${fontSize}rem`,
          '--smoothing': `${smoothing}ms`
        } as CSSProperties
      }
    >
      <ul ref={listRef} className={cn("rb-line-sidebar-line-sidebar__list")} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        {items.map((label, index) => (
          <li
            key={`${label}-${index}`}
            ref={el => {
              itemRefs.current[index] = el;
            }}
            className={cn("rb-line-sidebar-line-sidebar__item")}
            aria-current={activeIndex === index ? 'true' : undefined}
            onClick={() => handleClick(index, label)}
          >
            {showMarker && <span className={cn("rb-line-sidebar-line-sidebar__marker")} aria-hidden="true" />}
            <span className={cn("rb-line-sidebar-line-sidebar__label")}>
              {showIndex && <span className={cn("rb-line-sidebar-line-sidebar__index")}>{String(index + 1).padStart(2, '0')}</span>}
              <span className={cn("rb-line-sidebar-line-sidebar__text")}>{label}</span>
            </span>
          </li>
        ))}
      </ul>
    </nav>
        </>
  );
};

export { RbLineSidebar };
export default RbLineSidebar;
