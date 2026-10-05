"use client";
/* Vendored from DavidHDev/react-bits — Micro/FolderFloat/FolderFloat.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent
} from 'react';
import Matter from 'matter-js';
import { cn } from '@/lib/utils';

const RB_FOLDER_FLOAT_CSS = `
.rb-folder-float-folder-float {
  --ff-w: 200px;
  --ff-h: 148px;
  --ff-r: 14px;
  --ff-tab: 14px;
  --ff-back: #3f3f46;
  --ff-front: #52525b;
  --ff-paper: #f5f5f5;
  --ff-item: #f5f5f5;
  --ff-item-ink: #18181b;
  --ff-label: #f5f5f5;
  --ff-spread: 180px;
  --ff-lift: 26px;
  --ff-angle: 34deg;
  --ff-rest: 16deg;
  --ff-open: 520ms;
  --ff-close: 312ms;
  --ff-stagger: 45ms;
  --ff-n: 6;
  --ff-spring: cubic-bezier(0.34, 1.57, 0.64, 1);
  --ff-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  position: relative;
  display: inline-block;
  width: var(--ff-w);
  padding-top: var(--ff-tab);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
}

.rb-folder-float-folder-float__folder {
  position: relative;
  width: var(--ff-w);
  height: var(--ff-h);
}

.rb-folder-float-folder-float__back {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: var(--ff-r);
  background: var(--ff-back);
  transform: perspective(600px) rotateX(8deg);
  transform-origin: 50% 100%;
}

.rb-folder-float-folder-float__back::before {
  content: '';
  position: absolute;
  top: calc(-1 * var(--ff-tab));
  left: 0;
  width: 42%;
  height: calc(var(--ff-tab) + var(--ff-r));
  border-radius: var(--ff-r) var(--ff-r) 0 0;
  background: inherit;
}

.rb-folder-float-folder-float__paper {
  position: absolute;
  top: 10%;
  z-index: 1;
  right: 8%;
  left: 8%;
  height: 50%;
  border-radius: 6px;
  background: var(--ff-paper);
  opacity: 0;
  transform: translateY(10px);
  transition:
    transform var(--ff-close) var(--ff-ease-out),
    opacity var(--ff-close) ease;
}

.rb-folder-float-folder-float__front {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 5px;
  height: 76%;
  padding: 14px 16px;
  box-sizing: border-box;
  border-radius: var(--ff-r);
  background: linear-gradient(180deg, color-mix(in srgb, var(--ff-front) 92%, #fff), var(--ff-front) 60%);
  color: var(--ff-label);
  box-shadow: 0 -10px 24px rgba(0, 0, 0, 0.28);
  transform: perspective(600px) rotateX(calc(-1 * var(--ff-rest)));
  transform-origin: 50% 100%;
  transition: transform var(--ff-open) var(--ff-ease-out);
}

.rb-folder-float-folder-float__label {
  font-size: 13px;
  font-weight: 500;
}

.rb-folder-float-folder-float__sub {
  font-size: 11px;
  opacity: 0.55;
}

.rb-folder-float-folder-float__trigger {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  height: 76%;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--ff-r);
  background: transparent;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.rb-folder-float-folder-float[data-open] .rb-folder-float-folder-float__front {
  transform: perspective(600px) rotateX(calc(-1 * var(--ff-angle)));
}

.rb-folder-float-folder-float[data-open] .rb-folder-float-folder-float__paper {
  opacity: 1;
  transform: translateY(0);
  transition:
    transform var(--ff-open) var(--ff-ease-out),
    opacity 200ms ease;
}

.rb-folder-float-folder-float__items {
  position: absolute;
  top: var(--ff-tab);
  left: 50%;
  z-index: 1;
  width: 0;
  height: 0;
}

.rb-folder-float-folder-float[data-open] .rb-folder-float-folder-float__items::before {
  content: '';
  position: absolute;
  top: calc(-1 * (var(--ff-lift) + 120px));
  left: calc(-1 * (var(--ff-spread) + 100px));
  width: calc(2 * var(--ff-spread) + 200px);
  height: calc(var(--ff-lift) + 120px);
}

.rb-folder-float-folder-float__item {
  position: absolute;
  top: 0;
  left: 50%;
  margin: 0;
  padding: 0 14px;
  height: 34px;
  border: 0;
  border-radius: 17px;
  background: var(--ff-item);
  color: var(--ff-item-ink);
  font: inherit;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.14);
  cursor: pointer;
  outline: none;
  opacity: 0;
  transform: translate(-50%, 44px) scale(0.6);
  transform-origin: 50% 50%;
  pointer-events: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform var(--ff-close) var(--ff-ease-out) calc((var(--ff-n) - 1 - var(--i)) * var(--ff-stagger) * 0.5),
    opacity 160ms ease calc((var(--ff-n) - 1 - var(--i)) * var(--ff-stagger) * 0.5 + var(--ff-close) * 0.45),
    scale 160ms var(--ff-ease-out);
}

.rb-folder-float-folder-float[data-open] .rb-folder-float-folder-float__item {
  opacity: 1;
  transform: translate(calc(-50% + var(--x)), var(--y)) rotate(var(--r)) scale(1);
  pointer-events: auto;
  transition:
    transform var(--ff-open) var(--ff-spring) calc(var(--i) * var(--ff-stagger)),
    opacity 160ms ease calc(var(--i) * var(--ff-stagger)),
    scale 160ms var(--ff-ease-out);
}

.rb-folder-float-folder-float[data-live] .rb-folder-float-folder-float__item {
  cursor: grab;
  transition: scale 160ms var(--ff-ease-out);
}

.rb-folder-float-folder-float__item[data-drag] {
  cursor: grabbing;
}

@media (hover: hover) and (pointer: fine) {
  .rb-folder-float-folder-float[data-open] .rb-folder-float-folder-float__item:hover {
    scale: 1.05;
  }
}

.rb-folder-float-folder-float[data-open] .rb-folder-float-folder-float__item:active {
  scale: 0.97;
}

.rb-folder-float-folder-float__item[data-pop] {
  animation: rb-folder-float-folder-float-pop 320ms var(--ff-ease-out);
}

.rb-folder-float-folder-float__drift {
  display: block;
  animation: rb-folder-float-folder-float-drift 3.2s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.7s);
  animation-play-state: paused;
}

.rb-folder-float-folder-float[data-open] .rb-folder-float-folder-float__drift {
  animation-play-state: running;
}

.rb-folder-float-folder-float[data-physics] .rb-folder-float-folder-float__drift,
.rb-folder-float-folder-float[data-live] .rb-folder-float-folder-float__drift {
  animation: none;
}

@keyframes rb-folder-float-folder-float-drift {
  0%,
  100% {
    translate: 0 0;
  }

  50% {
    translate: 0 -3px;
  }
}

@keyframes rb-folder-float-folder-float-pop {
  30% {
    scale: 1.1;
  }

  100% {
    scale: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rb-folder-float-folder-float__front,
  .rb-folder-float-folder-float__paper {
    transition: opacity 200ms ease;
  }

  .rb-folder-float-folder-float[data-open] .rb-folder-float-folder-float__front {
    transform: perspective(600px) rotateX(calc(-1 * var(--ff-rest)));
  }

  .rb-folder-float-folder-float__paper {
    transform: none !important;
  }

  .rb-folder-float-folder-float__item {
    transition: opacity 200ms ease;
  }

  .rb-folder-float-folder-float[data-open] .rb-folder-float-folder-float__item {
    transition: opacity 200ms ease calc(var(--i) * var(--ff-stagger));
  }

  .rb-folder-float-folder-float__drift {
    animation: none;
  }
}

`;

const { Bodies, Body, Composite, Engine } = Matter;

export type FolderFloatItem = string | { label: string; value: string };
export type FolderFloatTrigger = 'hover' | 'click';

export interface FolderFloatProps {
  items?: FolderFloatItem[];
  label?: string;
  sublabel?: string;
  trigger?: FolderFloatTrigger;
  defaultOpen?: boolean;
  closeOnSelect?: boolean;
  physics?: boolean;
  drift?: number;
  onSelect?: (value: string, index: number) => void;
  onOpenChange?: (open: boolean) => void;
  folderColor?: string;
  frontColor?: string;
  paperColor?: string;
  itemColor?: string;
  itemTextColor?: string;
  labelColor?: string;
  width?: number;
  height?: number;
  radius?: number;
  spread?: number;
  lift?: number;
  tilt?: number;
  flapAngle?: number;
  restAngle?: number;
  openDuration?: number;
  stagger?: number;
  bounce?: number;
  className?: string;
}

type Entry = { label: string; value: string };
type Size = { w: number; h: number };
type Zone = { left: number; right: number; top: number; bottom: number };
type Drag = { i: number; id: number; dx: number; dy: number; sx: number; sy: number; moved: boolean };
interface World {
  engine: Matter.Engine | null;
  bodies: Matter.Body[];
  sizes: Size[];
  raf: number;
  last: number;
  t0: number;
  drag: Drag | null;
  zone: Zone | null;
  live: boolean;
}
interface Latest {
  onSelect?: FolderFloatProps['onSelect'];
  onOpenChange?: FolderFloatProps['onOpenChange'];
  drift: number;
  reduce: boolean;
}

const DEFAULT_ITEMS: FolderFloatItem[] = [
  'Try a warmer palette',
  'Tighten the spacing',
  'Logo feels small',
  'Love the new hero'
];
const PAD = 28;
const CHAR = 6.8;
const GAP = 12;
const ROW = 52;
const DRAG_MIN = 4;
const ZONE_PAD = 8;
/* Matter's documented maximum delta. Anything larger trips a console warning. */
const MAX_STEP = 1000 / 60;
const MAX_SUBSTEPS = 3;

const jitter = (i: number) => {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
};

const layout = (list: Entry[], spread: number, lift: number, tilt: number, sizes: (Size | null)[]) => {
  const rows: { items: { i: number; pw: number }[]; width: number }[] = [];
  let row: { i: number; pw: number }[] = [];
  let width = 0;
  list.forEach((item, i) => {
    const pw = sizes[i]?.w ?? PAD + item.label.length * CHAR;
    if (row.length && width + GAP + pw > spread * 2) {
      rows.push({ items: row, width });
      row = [];
      width = 0;
    }
    row.push({ i, pw });
    width += (row.length > 1 ? GAP : 0) + pw;
  });
  if (row.length) rows.push({ items: row, width });
  const pos: { x: number; y: number; r: number }[] = [];
  rows.forEach((r, ri) => {
    let x = -r.width / 2;
    const shift = (ri % 2 ? 1 : -1) * Math.min(16, spread * 0.1);
    r.items.forEach(({ i, pw }) => {
      const j = jitter(i);
      pos[i] = { x: x + pw / 2 + shift + (j - 0.5) * 6, y: -lift - ri * ROW - j * 6, r: tilt * (j * 2 - 1) };
      x += pw + GAP;
    });
  });
  return pos;
};

const RbFolderFloat: React.FC<FolderFloatProps> = ({
  items = DEFAULT_ITEMS,
  label = 'Design feedback',
  sublabel = '',
  trigger = 'hover',
  defaultOpen = false,
  closeOnSelect = true,
  physics = true,
  drift = 0.5,
  onSelect,
  onOpenChange,
  folderColor = '#3f3f46',
  frontColor = '#52525b',
  paperColor = '#f5f5f5',
  itemColor = '#f5f5f5',
  itemTextColor = '#18181b',
  labelColor = '#f5f5f5',
  width = 200,
  height = 148,
  radius = 14,
  spread = 180,
  lift = 26,
  tilt = 8,
  flapAngle = 34,
  restAngle = 16,
  openDuration = 520,
  stagger = 45,
  bounce = 0.3,
  className = ''
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [popped, setPopped] = useState(-1);
  const [live, setLive] = useState(false);
  const [sizes, setSizes] = useState<Size[]>([]);
  const anchorRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const world = useRef<World>({
    engine: null,
    bodies: [],
    sizes: [],
    raf: 0,
    last: 0,
    t0: 0,
    drag: null,
    zone: null,
    live: false
  });
  const latest = useRef<Latest>({} as Latest);
  latest.current = { onSelect, onOpenChange, drift, reduce: false };
  const popTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const liveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const list: Entry[] = items.map(item => (typeof item === 'string' ? { label: item, value: item } : item));
  const n = list.length;
  const sub = sublabel || `${n} ${n === 1 ? 'note' : 'notes'}`;
  const pos = layout(list, spread, lift, tilt, sizes);

  const labelsKey = list.map(item => item.label).join('|');
  // The physics effect keys off the laid-out positions. Building that signature
  // inline in the dep array produced a fresh string every render, so the whole
  // Matter world tore down and rebuilt each frame.
  const posSig = useMemo(() => pos.map(p => `${p.x},${p.y}`).join('|'), [pos]);
  useLayoutEffect(() => {
    const measure = () => {
      const next = pillRefs.current.slice(0, n).map(el => (el ? { w: el.offsetWidth, h: el.offsetHeight } : null));
      if (next.some(s => !s)) return;
      const sized = next as Size[];
      setSizes(prev =>
        prev.length === sized.length && prev.every((s, i) => s.w === sized[i].w && s.h === sized[i].h) ? prev : sized
      );
    };
    measure();
    document.fonts?.ready.then(measure);
     
  }, [n, labelsKey]);

  const stopPhysics = useCallback(() => {
    const w = world.current;
    clearTimeout(liveTimer.current);
    cancelAnimationFrame(w.raf);
    w.raf = 0;
    if (w.engine) {
      w.bodies.forEach((b, i) => {
        const el = pillRefs.current[i];
        if (!el) return;
        el.style.setProperty('--x', `${b.position.x.toFixed(1)}px`);
        el.style.setProperty('--y', `${(b.position.y - w.sizes[i].h / 2).toFixed(1)}px`);
      });
      Composite.clear(w.engine.world, false, true);
      Engine.clear(w.engine);
      w.engine = null;
    }
    w.bodies = [];
    w.drag = null;
    w.live = false;
    setLive(false);
  }, []);

  const startPhysics = useCallback(() => {
    const w = world.current;
    if (w.engine) return;
    const els = pillRefs.current.slice(0, n);
    if (els.some(el => !el)) return;
    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    engine.enableSleeping = false;
    w.engine = engine;
    w.sizes = (els as HTMLButtonElement[]).map(el => ({ w: el.offsetWidth, h: el.offsetHeight }));
    const ys = pos.map(p => p.y);
    const zone = {
      left: -spread - ZONE_PAD,
      right: spread + ZONE_PAD,
      top: Math.min(...ys) - ZONE_PAD,
      bottom: -lift + Math.max(...w.sizes.map(s => s.h))
    };
    w.zone = zone;
    w.bodies = els.map((el, i) => {
      const { w: bw, h: bh } = w.sizes[i];
      const b = Bodies.rectangle(pos[i].x, pos[i].y + bh / 2, bw, bh, {
        chamfer: { radius: Math.min(bh / 2 - 1, 16) },
        restitution: 0.55,
        friction: 0,
        frictionAir: 0.08,
        inertia: Infinity
      });
      (b as Matter.Body & { plugin: { phase: number } }).plugin = { phase: jitter(i) * Math.PI * 2 };
      return b;
    });
    const T = 80;
    const walls = [
      Bodies.rectangle((zone.left + zone.right) / 2, zone.top - T / 2, zone.right - zone.left + 2 * T, T, {
        isStatic: true
      }),
      Bodies.rectangle((zone.left + zone.right) / 2, zone.bottom + T / 2, zone.right - zone.left + 2 * T, T, {
        isStatic: true
      }),
      Bodies.rectangle(zone.left - T / 2, (zone.top + zone.bottom) / 2, T, zone.bottom - zone.top + 2 * T, {
        isStatic: true
      }),
      Bodies.rectangle(zone.right + T / 2, (zone.top + zone.bottom) / 2, T, zone.bottom - zone.top + 2 * T, {
        isStatic: true
      })
    ];
    Composite.add(engine.world, [...w.bodies, ...walls]);
    w.live = true;
    w.last = 0;
    w.t0 = performance.now();
    setLive(true);
    const tick = (now: number) => {
      const s = world.current;
      if (!s.engine) return;
      /* Matter logs "delta argument is recommended to be less than or equal to
       * 16.667 ms" for any larger step, and a single oversized step also makes the
       * solver unstable. Feed it fixed 60 Hz steps and take a couple more of them
       * after a slow frame instead of one big jump. */
      const elapsed = s.last ? Math.min(now - s.last, MAX_STEP * MAX_SUBSTEPS) : MAX_STEP;
      s.last = now;
      const t = (now - s.t0) / 1000;
      const k = latest.current.drift * 0.00005 * Math.min(1, t / 2);
      const steps = Math.max(1, Math.min(MAX_SUBSTEPS, Math.round(elapsed / MAX_STEP)));
      for (let step = 0; step < steps; step += 1) {
        s.bodies.forEach((b, i) => {
          if (s.drag && s.drag.i === i) return;
          const ph = (b as Matter.Body & { plugin: { phase: number } }).plugin.phase;
          Body.applyForce(b, b.position, {
            x: Math.sin(t * 0.9 + ph) * k * b.mass,
            y: Math.cos(t * 1.3 + ph * 1.7) * k * b.mass
          });
        });
        Engine.update(s.engine, MAX_STEP);
      }
      s.bodies.forEach((b, i) => {
        const el = pillRefs.current[i];
        if (!el) return;
        el.style.setProperty('--x', `${b.position.x.toFixed(1)}px`);
        el.style.setProperty('--y', `${(b.position.y - s.sizes[i].h / 2).toFixed(1)}px`);
      });
      s.raf = requestAnimationFrame(tick);
    };
    w.raf = requestAnimationFrame(tick);
     
  }, [n, spread, lift, posSig]);

  const set = useCallback(
    (next: boolean) => {
      if (!next) stopPhysics();
      setOpen(prev => {
        if (prev === next) return prev;
        latest.current.onOpenChange?.(next);
        return next;
      });
    },
    [stopPhysics]
  );

  useEffect(() => {
    clearTimeout(liveTimer.current);
    if (!open || !physics || latest.current.reduce) {
      if (!open) stopPhysics();
      else if (!physics) stopPhysics();
      return undefined;
    }
    liveTimer.current = setTimeout(startPhysics, openDuration + (n - 1) * stagger + 80);
    return () => clearTimeout(liveTimer.current);
  }, [open, physics, openDuration, stagger, n, startPhysics, stopPhysics]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      latest.current.reduce = mq.matches;
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(
    () => () => {
      clearTimeout(popTimer.current);
      stopPhysics();
    },
    [stopPhysics]
  );

  const pick = (item: Entry, i: number) => {
    latest.current.onSelect?.(item.value, i);
    clearTimeout(popTimer.current);
    setPopped(i);
    popTimer.current = setTimeout(() => setPopped(-1), 320);
    if (closeOnSelect) set(false);
  };

  const pointerAt = (e: PointerEvent<HTMLButtonElement>) => {
    const r = anchorRef.current?.getBoundingClientRect();
    return r ? { x: e.clientX - r.left, y: e.clientY - r.top } : { x: 0, y: 0 };
  };
  const down = (e: PointerEvent<HTMLButtonElement>, i: number) => {
    const w = world.current;
    if (!w.live || e.button !== 0) return;
    const b = w.bodies[i];
    if (!b) return;
    const p = pointerAt(e);
    w.drag = {
      i,
      id: e.pointerId,
      dx: b.position.x - p.x,
      dy: b.position.y - p.y,
      sx: e.clientX,
      sy: e.clientY,
      moved: false
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };
  const move = (e: PointerEvent<HTMLButtonElement>, i: number) => {
    const w = world.current;
    const d = w.drag;
    if (!d || d.i !== i || d.id !== e.pointerId) return;
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) >= DRAG_MIN) {
      d.moved = true;
      e.currentTarget.setAttribute('data-drag', '');
    }
    if (!d.moved) return;
    const b = w.bodies[i];
    const { w: bw, h: bh } = w.sizes[i];
    const z = w.zone as Zone;
    const p = pointerAt(e);
    const x = Math.min(z.right - bw / 2, Math.max(z.left + bw / 2, p.x + d.dx));
    const y = Math.min(z.bottom - bh / 2, Math.max(z.top + bh / 2, p.y + d.dy));
    Body.setVelocity(b, { x: (x - b.position.x) * 0.6, y: (y - b.position.y) * 0.6 });
    Body.setPosition(b, { x, y });
  };
  const up = (e: PointerEvent<HTMLButtonElement>, i: number, item: Entry) => {
    const w = world.current;
    const d = w.drag;
    if (!d || d.i !== i || d.id !== e.pointerId) return;
    w.drag = null;
    e.currentTarget.removeAttribute('data-drag');
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    if (!d.moved && e.type === 'pointerup') pick(item, i);
  };

  const hover = trigger === 'hover';

  return (
    <>
          <style href="rb-folder-float" precedence="rb">{RB_FOLDER_FLOAT_CSS}</style>
          <div
      className={`rb-folder-float-folder-float${className ? ` ${className}` : ''}`}
      data-open={open ? '' : undefined}
      data-live={live ? '' : undefined}
      data-physics={physics ? '' : undefined}
      data-trigger={trigger}
      onPointerEnter={hover ? () => set(true) : undefined}
      onPointerLeave={
        hover
          ? () => {
              if (!world.current.drag) set(false);
            }
          : undefined
      }
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation();
          set(false);
        }
      }}
      style={
        {
          '--ff-w': `${width}px`,
          '--ff-h': `${height}px`,
          '--ff-r': `${radius}px`,
          '--ff-back': folderColor,
          '--ff-front': frontColor,
          '--ff-paper': paperColor,
          '--ff-item': itemColor,
          '--ff-item-ink': itemTextColor,
          '--ff-label': labelColor,
          '--ff-spread': `${spread}px`,
          '--ff-lift': `${lift}px`,
          '--ff-angle': `${flapAngle}deg`,
          '--ff-rest': `${restAngle}deg`,
          '--ff-open': `${openDuration}ms`,
          '--ff-close': `${Math.round(openDuration * 0.6)}ms`,
          '--ff-stagger': `${stagger}ms`,
          '--ff-n': n,
          '--ff-spring': `cubic-bezier(0.34, ${(1 + bounce * 1.9).toFixed(2)}, 0.64, 1)`
        } as CSSProperties
      }
    >
      <div ref={anchorRef} className={cn("rb-folder-float-folder-float__items")}>
        {list.map((item, i) => {
          const p = pos[i];
          return (
            <button
              key={`${item.value}-${i}`}
              ref={el => {
                pillRefs.current[i] = el;
              }}
              type="button"
              className={cn("rb-folder-float-folder-float__item")}
              tabIndex={open ? 0 : -1}
              aria-hidden={!open}
              data-pop={popped === i ? '' : undefined}
              style={
                {
                  '--i': i,
                  '--x': `${p.x.toFixed(1)}px`,
                  '--y': `${p.y.toFixed(1)}px`,
                  '--r': `${p.r.toFixed(2)}deg`
                } as CSSProperties
              }
              onPointerDown={e => down(e, i)}
              onPointerMove={e => move(e, i)}
              onPointerUp={e => up(e, i, item)}
              onPointerCancel={e => up(e, i, item)}
              onClick={e => {
                if (!world.current.live || e.detail === 0) pick(item, i);
              }}
            >
              <span className={cn("rb-folder-float-folder-float__drift")}>{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className={cn("rb-folder-float-folder-float__folder")}>
        <span className={cn("rb-folder-float-folder-float__back")} aria-hidden="true" />
        <span className={cn("rb-folder-float-folder-float__paper")} aria-hidden="true" />
        <span className={cn("rb-folder-float-folder-float__front")} aria-hidden="true">
          <span className={cn("rb-folder-float-folder-float__label")}>{label}</span>
          <span className={cn("rb-folder-float-folder-float__sub")}>{sub}</span>
        </span>
        <button
          type="button"
          className={cn("rb-folder-float-folder-float__trigger")}
          aria-expanded={open}
          aria-label={`${label}, ${sub}`}
          onClick={() => set(!open)}
        />
      </div>
    </div>
        </>
  );
};

export { RbFolderFloat };
export default RbFolderFloat;
