"use client";
/* Vendored from DavidHDev/react-bits — Micro/DodgeField/DodgeField.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

const RB_DODGE_FIELD_CSS = `
.rb-dodge-field-dodge-field {
  --df-ink: #f5f5f5;
  --df-contrast: #18181b;
  --df-height: 240px;
  --df-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: var(--df-height);
}

.rb-dodge-field-dodge-field__mover {
  display: inline-grid;
  will-change: transform;
}

.rb-dodge-field-dodge-field__pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  margin: 0;
  padding: 0 28px;
  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--df-ink) 8%, transparent);
  color: color-mix(in srgb, var(--df-ink) 72%, transparent);
  font-family: inherit;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.012em;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition:
    transform 160ms var(--df-ease-out),
    background-color 220ms ease,
    color 220ms ease;
}

.rb-dodge-field-dodge-field__pill:active {
  transform: scale(0.97);
}

.rb-dodge-field-dodge-field__pill:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--df-ink) 60%, transparent);
  outline-offset: 3px;
}

@media (hover: hover) and (pointer: fine) {
  .rb-dodge-field-dodge-field__pill:hover {
    color: color-mix(in srgb, var(--df-ink) 90%, transparent);
  }
}

.rb-dodge-field-dodge-field__mover[data-relented='true'] .rb-dodge-field-dodge-field__pill {
  color: var(--df-ink);
}

.rb-dodge-field-dodge-field__mover[data-caught='true'] .rb-dodge-field-dodge-field__pill {
  background: var(--df-ink);
  color: var(--df-contrast);
}

.rb-dodge-field-dodge-field__labels {
  display: grid;
}

.rb-dodge-field-dodge-field__label {
  grid-area: 1 / 1;
  white-space: nowrap;
  transition:
    opacity 200ms ease,
    filter 200ms ease;
}

.rb-dodge-field-dodge-field__label[data-active='false'] {
  opacity: 0;
  filter: blur(2px);
}

.rb-dodge-field-dodge-field__notice {
  position: absolute;
  inset: auto 0 12px;
  margin: 0;
  color: color-mix(in srgb, var(--df-ink) 55%, transparent);
  font-size: 12px;
  text-align: center;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .rb-dodge-field-dodge-field__pill {
    transition:
      background-color 220ms ease,
      color 220ms ease;
  }

  .rb-dodge-field-dodge-field__pill:active {
    transform: none;
  }

  .rb-dodge-field-dodge-field .rb-dodge-field-dodge-field__label {
    filter: none;
  }
}

`;

export type DodgeAxis = 'both' | 'x' | 'y';
export type DodgeWall = 'clamp' | 'bounce';
export type DodgeFieldState = { dodges: number; gave: boolean; caught: boolean; fleeing: boolean };

export interface DodgeFieldProps {
  children?: ReactNode | ((state: DodgeFieldState) => ReactNode);
  taunts?: string[];
  notice?: string;
  inkColor?: string;
  contrastColor?: string;
  fieldHeight?: number;
  reach?: number;
  radius?: number;
  falloff?: number;
  fleeDuration?: number;
  returnDuration?: number;
  returnBounce?: number;
  axis?: DodgeAxis;
  wall?: DodgeWall;
  patience?: number;
  disabled?: boolean;
  onDodge?: (count: number) => void;
  onRelent?: () => void;
  onCatch?: () => void;
  className?: string;
  style?: CSSProperties;
}

interface Live {
  reach: number;
  radius: number;
  falloff: number;
  fleeDuration: number;
  returnDuration: number;
  returnBounce: number;
  axis: DodgeAxis;
  wall: DodgeWall;
  still: boolean;
  inside: boolean;
  reduce: boolean | null;
}

const COUNT_LINE = 0.55;
const DEAD_ZONE = 6;
const CAUGHT_HOLD_MS = 760;
const INSET = 12;
const DEFAULT_TAUNTS = ['Catch me', 'Nope', 'Too slow', 'Almost', 'Okay, okay'];

const wallIt = (t: number, room: number, wall: DodgeWall) => {
  if (wall === 'bounce') {
    if (t > room) return Math.max(-room, 2 * room - t);
    if (t < -room) return Math.min(room, -2 * room - t);
    return t;
  }
  return Math.min(room, Math.max(-room, t));
};
const bearingOf = (dx: number, dy: number, d: number, axis: DodgeAxis) => {
  if (axis === 'x') return { x: Math.sign(dx) || 1, y: 0 };
  if (axis === 'y') return { x: 0, y: Math.sign(dy) || 1 };
  return { x: dx / d, y: dy / d };
};

const RbDodgeField: React.FC<DodgeFieldProps> = ({
  children,
  taunts = DEFAULT_TAUNTS,
  notice = '',
  inkColor = '#f5f5f5',
  contrastColor = '#18181b',
  fieldHeight = 240,
  reach = 72,
  radius = 120,
  falloff = 2,
  fleeDuration = 130,
  returnDuration = 620,
  returnBounce = 0.1,
  axis = 'both',
  wall = 'clamp',
  patience = 4,
  disabled = false,
  onDodge,
  onRelent,
  onCatch,
  className = '',
  style
}) => {
  const fieldRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const transform = useMotionTemplate`translate(${x}px, ${y}px)`;
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(true);
  const [inside, setInside] = useState(false);
  const [dodges, setDodges] = useState(0);
  const [caught, setCaught] = useState(false);
  const gave = dodges >= Math.max(1, patience);
  const still = gave || caught || disabled || !!reduce;

  const pointer = useRef<{ x: number; y: number } | null>(null);
  const bearing = useRef({ x: 1, y: 0 });
  const armed = useRef(true);
  const room = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const hold = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const live = useRef<Live>({} as Live);
  live.current = {
    reach,
    radius,
    falloff,
    fleeDuration,
    returnDuration,
    returnBounce,
    axis,
    wall,
    still,
    inside,
    reduce
  };

  useEffect(() => {
    const field = fieldRef.current;
    const mover = moverRef.current;
    if (!field || !mover) return undefined;
    const measure = () => {
      room.current = {
        x: Math.max(0, (field.clientWidth - mover.offsetWidth) / 2 - INSET),
        y: Math.max(0, (field.clientHeight - mover.offsetHeight) / 2 - INSET)
      };
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(field);
    observer.observe(mover);
    return () => observer.disconnect();
  }, []);

  const frame = useCallback(() => {
    raf.current = 0;
    const field = fieldRef.current;
    const p = pointer.current;
    const L = live.current;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    const zoom = rect.width / (field.offsetWidth || rect.width) || 1;
    const dx = p ? (p.x - (rect.left + rect.width / 2)) / zoom : Infinity;
    const dy = p ? (p.y - (rect.top + rect.height / 2)) / zoom : Infinity;
    const d = Math.hypot(dx, dy);
    const isInside = d <= L.radius;
    if (!isInside && !L.inside) return;
    if (!L.still) {
      if (d < L.radius * COUNT_LINE) {
        if (armed.current) {
          armed.current = false;
          setDodges(n => n + 1);
        }
      } else if (d > L.radius) {
        armed.current = true;
      }
    }
    if (Number.isFinite(d) && d > DEAD_ZONE) bearing.current = bearingOf(dx, dy, d, L.axis);
    const flee = isInside && !L.still ? (1 - d / L.radius) ** L.falloff : 0;
    const tx = wallIt(-bearing.current.x * flee * L.reach, room.current.x, L.wall);
    const ty = wallIt(-bearing.current.y * flee * L.reach, room.current.y, L.wall);
    if (L.reduce) {
      x.jump(0);
      y.jump(0);
    } else {
      const cfg =
        flee > 0
          ? { type: 'spring' as const, duration: L.fleeDuration / 1000, bounce: 0 }
          : { type: 'spring' as const, duration: L.returnDuration / 1000, bounce: L.returnBounce };
      animate(x, tx, cfg);
      animate(y, ty, cfg);
    }
    if (isInside !== L.inside) setInside(isInside);
  }, [x, y]);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setFine(query.matches);
    sync();
    query.addEventListener('change', sync);
    if (!query.matches || disabled) return () => query.removeEventListener('change', sync);
    const tick = () => {
      if (!raf.current) raf.current = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pointer.current = { x: e.clientX, y: e.clientY };
      tick();
    };
    const onLeave = () => {
      pointer.current = null;
      tick();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', tick, { passive: true, capture: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    return () => {
      query.removeEventListener('change', sync);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', tick, { capture: true });
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [disabled, frame]);

  useEffect(() => {
    if (!raf.current) raf.current = requestAnimationFrame(frame);
  }, [still, frame]);
  useEffect(() => {
    if (dodges) onDodge?.(dodges);
     
  }, [dodges]);
  useEffect(() => {
    if (gave) onRelent?.();
     
  }, [gave]);
  useEffect(() => () => clearTimeout(hold.current), []);

  const handleClick = () => {
    setCaught(true);
    onCatch?.();
    clearTimeout(hold.current);
    hold.current = setTimeout(() => {
      setCaught(false);
      setDodges(0);
      armed.current = false;
    }, CAUGHT_HOLD_MS);
  };

  const state: DodgeFieldState = { dodges, gave, caught, fleeing: inside && !still };
  const index = gave || caught ? taunts.length - 1 : Math.min(dodges, Math.max(0, taunts.length - 2));
  const content =
    typeof children === 'function'
      ? children(state)
      : (children ?? (
          <button type="button" className={cn("rb-dodge-field-dodge-field__pill")} aria-label={taunts[0]}>
            <span className={cn("rb-dodge-field-dodge-field__labels")}>
              {taunts.map((taunt, i) => (
                <span
                  key={`${taunt}-${i}`}
                  className={cn("rb-dodge-field-dodge-field__label")}
                  data-active={i === index ? 'true' : 'false'}
                  aria-hidden="true"
                >
                  {taunt}
                </span>
              ))}
            </span>
          </button>
        ));

  return (
    <>
          <style href="rb-dodge-field" precedence="rb">{RB_DODGE_FIELD_CSS}</style>
          <div
      ref={fieldRef}
      className={`rb-dodge-field-dodge-field${className ? ` ${className}` : ''}`}
      data-coarse={fine ? undefined : ''}
      data-flat={reduce ? '' : undefined}
      style={
        {
          '--df-ink': inkColor,
          '--df-contrast': contrastColor,
          '--df-height': `${fieldHeight}px`,
          ...style
        } as CSSProperties
      }
    >
      <motion.div
        ref={moverRef}
        className={cn("rb-dodge-field-dodge-field__mover")}
        style={{ transform }}
        data-fled={inside && !still ? 'true' : 'false'}
        data-relented={gave ? 'true' : 'false'}
        data-caught={caught ? 'true' : 'false'}
        onClick={handleClick}
      >
        {content}
      </motion.div>
      {!fine && notice ? <p className={cn("rb-dodge-field-dodge-field__notice")}>{notice}</p> : null}
    </div>
        </>
  );
};

export { RbDodgeField };
export default RbDodgeField;
