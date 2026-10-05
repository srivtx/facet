"use client";
/* Vendored from DavidHDev/react-bits — Micro/LatticeLoader/LatticeLoader.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

import { cn } from '@/lib/utils';

const RB_LATTICE_LOADER_CSS = `
.rb-lattice-loader-lattice-loader {
  --ll-n: 3;
  --ll-cell: 6px;
  --ll-gap: 2px;
  --ll-font: 14px;
  --ll-color: currentColor;
  --ll-mark: #22c55e;
  --ll-idle: 0.15;
  --ll-glow: currentColor;
  --ll-mark-glow: #22c55e;
  --ll-peak: 1;
  --ll-cycle: 864ms;
  --ll-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ll-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);

  position: relative;
  display: inline-flex;
  align-items: center;
  gap: calc(var(--ll-font) * 0.625);
  font-family: inherit;
  font-size: var(--ll-font);
  line-height: 1;
}

.rb-lattice-loader-lattice-loader__grid {
  display: grid;
  flex: none;
}

.rb-lattice-loader-lattice-loader__layer {
  grid-area: 1 / 1;
  display: grid;
  grid-template-columns: repeat(var(--ll-n), var(--ll-cell));
  gap: var(--ll-gap);
}

.rb-lattice-loader-lattice-loader__cell {
  width: var(--ll-cell);
  height: var(--ll-cell);
  border-radius: max(1px, calc(var(--ll-cell) * 0.25));
  background: var(--ll-color);
  opacity: var(--ll-idle);
}

.rb-lattice-loader-lattice-loader[data-shape='round'] .rb-lattice-loader-lattice-loader__cell {
  border-radius: 50%;
}

.rb-lattice-loader-lattice-loader[data-glow] .rb-lattice-loader-lattice-loader__run .rb-lattice-loader-lattice-loader__cell:not([data-hole]) {
  box-shadow: 0 0 calc(var(--ll-cell) * 1.2) calc(var(--ll-cell) * 0.12) var(--ll-glow);
}

.rb-lattice-loader-lattice-loader[data-glow] .rb-lattice-loader-lattice-loader__mark .rb-lattice-loader-lattice-loader__cell[data-on] {
  box-shadow: 0 0 calc(var(--ll-cell) * 1.2) calc(var(--ll-cell) * 0.12) var(--ll-mark-glow);
}

.rb-lattice-loader-lattice-loader__run {
  transition: opacity 200ms ease;
}

.rb-lattice-loader-lattice-loader__run .rb-lattice-loader-lattice-loader__cell {
  animation: rb-lattice-loader-lattice-on var(--ll-cycle) var(--ll-ease-in-out) infinite;
}

.rb-lattice-loader-lattice-loader__run .rb-lattice-loader-lattice-loader__cell[data-lit='45'] {
  animation-name: rb-lattice-loader-lattice-on-45;
}

.rb-lattice-loader-lattice-loader__run .rb-lattice-loader-lattice-loader__cell[data-lit='35'] {
  animation-name: rb-lattice-loader-lattice-on-35;
}

.rb-lattice-loader-lattice-loader__run .rb-lattice-loader-lattice-loader__cell[data-lit='25'] {
  animation-name: rb-lattice-loader-lattice-on-25;
}

.rb-lattice-loader-lattice-loader__run .rb-lattice-loader-lattice-loader__cell[data-hole] {
  animation: none;
  opacity: calc(var(--ll-idle) * 0.47);
}

.rb-lattice-loader-lattice-loader__mark {
  opacity: 0;
  transform: scale(0.9);
  transform-origin: center;
  transition:
    opacity 160ms var(--ll-ease-out),
    transform 160ms var(--ll-ease-out);
}

.rb-lattice-loader-lattice-loader__mark .rb-lattice-loader-lattice-loader__cell {
  transition:
    opacity 200ms ease,
    background-color 200ms ease;
}

.rb-lattice-loader-lattice-loader__mark .rb-lattice-loader-lattice-loader__cell[data-on] {
  background: var(--ll-mark);
  opacity: var(--ll-peak);
}

.rb-lattice-loader-lattice-loader:not([data-status='working']) .rb-lattice-loader-lattice-loader__run {
  opacity: 0;
}

.rb-lattice-loader-lattice-loader:not([data-status='working']) .rb-lattice-loader-lattice-loader__run .rb-lattice-loader-lattice-loader__cell {
  animation-play-state: paused;
}

.rb-lattice-loader-lattice-loader:not([data-status='working']) .rb-lattice-loader-lattice-loader__mark {
  opacity: 1;
  transform: none;
  transition:
    opacity 200ms ease,
    transform 200ms var(--ll-ease-out);
}

.rb-lattice-loader-lattice-loader__label {
  position: relative;
  display: inline-block;
  font-weight: 500;
}

.rb-lattice-loader-lattice-loader__text {
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  opacity: 0;
  filter: blur(2px);
  transition:
    opacity 200ms ease,
    filter 200ms ease;
}

.rb-lattice-loader-lattice-loader__text[data-active] {
  position: static;
  opacity: 1;
  filter: blur(0);
}

.rb-lattice-loader-lattice-loader__timer {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: calc(var(--ll-font) * 0.875);
  font-variant-numeric: tabular-nums;
  opacity: 0.6;
}

.rb-lattice-loader-lattice-loader__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@keyframes rb-lattice-loader-lattice-on {
  0%,
  100% {
    opacity: var(--ll-idle);
  }

  18%,
  42% {
    opacity: var(--ll-peak);
  }

  62% {
    opacity: var(--ll-idle);
  }
}

@keyframes rb-lattice-loader-lattice-on-45 {
  0%,
  100% {
    opacity: var(--ll-idle);
  }

  13%,
  31% {
    opacity: var(--ll-peak);
  }

  45% {
    opacity: var(--ll-idle);
  }
}

@keyframes rb-lattice-loader-lattice-on-35 {
  0%,
  100% {
    opacity: var(--ll-idle);
  }

  10%,
  24% {
    opacity: var(--ll-peak);
  }

  35% {
    opacity: var(--ll-idle);
  }
}

@keyframes rb-lattice-loader-lattice-on-25 {
  0%,
  100% {
    opacity: var(--ll-idle);
  }

  7%,
  17% {
    opacity: var(--ll-peak);
  }

  25% {
    opacity: var(--ll-idle);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rb-lattice-loader-lattice-loader__run {
    --ll-peak: 0.7;
  }

  .rb-lattice-loader-lattice-loader__run .rb-lattice-loader-lattice-loader__cell {
    animation-delay: 0ms !important;
    animation-duration: 1400ms !important;
  }

  .rb-lattice-loader-lattice-loader .rb-lattice-loader-lattice-loader__mark {
    transform: none;
  }

  .rb-lattice-loader-lattice-loader .rb-lattice-loader-lattice-loader__text {
    filter: none;
  }
}

`;

export type LatticeStatus = 'working' | 'done' | 'error';
export type LatticePatternName =
  | 'arrow'
  | 'dots'
  | 'orbit'
  | 'ripple'
  | 'snake'
  | 'spiral'
  | 'sweep'
  | 'spin'
  | 'rain'
  | 'pulse';
export type LatticeGrid = 3 | 4;

export interface LatticePattern {
  cells: (number | null)[];
  loop?: number;
  scale?: number;
  lit?: 0.25 | 0.35 | 0.45 | 0.62;
}

export interface LatticeLoaderProps {
  label?: string;
  doneLabel?: string;
  errorLabel?: string;
  status?: LatticeStatus;
  pattern?: LatticePatternName | LatticePattern;
  grid?: LatticeGrid;
  shape?: 'square' | 'round';
  color?: string;
  doneColor?: string;
  errorColor?: string;
  cellSize?: number;
  gap?: number;
  fontSize?: number;
  step?: number;
  idleOpacity?: number;
  glow?: boolean;
  glowColor?: string;
  showTimer?: boolean;
  elapsed?: number;
  className?: string;
  style?: CSSProperties;
}

type ResolvedPattern = { cells: (number | null)[]; loop: number; scale: number; lit?: number };

const PATTERNS: Record<LatticePatternName, Partial<Record<LatticeGrid, ResolvedPattern>>> = {
  arrow: { 3: { cells: [1, 2, 3, 0, 1, 2, 1, 2, 3], loop: 7.2, scale: 1 } },
  dots: { 3: { cells: [0, 1, 2, 0, 1, 2, 0, 1, 2], loop: 3, scale: 2.4 } },
  ripple: { 3: { cells: [2, 1, 2, 1, 0, 1, 2, 1, 2], loop: 4.8, scale: 1.5 } },
  spiral: { 3: { cells: [0, 1, 2, 7, 8, 3, 6, 5, 4], loop: 9, scale: 1.2, lit: 0.35 } },
  orbit: {
    3: { cells: [0, 1, 2, 7, null, 3, 6, 5, 4], loop: 8, scale: 1.2 },
    4: { cells: [0, 1, 2, 3, 11, null, null, 4, 10, null, null, 5, 9, 8, 7, 6], loop: 6, scale: 1.2, lit: 0.45 }
  },
  snake: {
    3: { cells: [0, 1, 2, 5, 4, 3, 6, 7, 8], loop: 9, scale: 1, lit: 0.35 },
    4: { cells: [0, 1, 2, 3, 7, 6, 5, 4, 8, 9, 10, 11, 15, 14, 13, 12], loop: 16, scale: 1, lit: 0.25 }
  },
  sweep: { 4: { cells: [0, 1, 2, 3, 1, 2, 3, 4, 2, 3, 4, 5, 3, 4, 5, 6], loop: 5, scale: 1, lit: 0.45 } },
  spin: { 4: { cells: [0, 0, 1, 1, 0, 0, 1, 1, 3, 3, 2, 2, 3, 3, 2, 2], loop: 4, scale: 1.6, lit: 0.35 } },
  rain: { 4: { cells: [0, 2, 1, 3, 1, 3, 2, 4, 2, 4, 3, 5, 3, 5, 4, 6], loop: 4, scale: 1.2, lit: 0.35 } },
  pulse: { 4: { cells: [2, 1, 1, 2, 1, 0, 0, 1, 1, 0, 0, 1, 2, 1, 1, 2], loop: 2.4, scale: 2.5, lit: 0.45 } }
};
const DEFAULT_PATTERN: Record<LatticeGrid, LatticePatternName> = { 3: 'orbit', 4: 'sweep' };
const MARKS: Record<LatticeGrid, Record<'done' | 'error', number[]>> = {
  3: { done: [2, 3, 5, 7], error: [0, 2, 4, 6, 8] },
  4: { done: [7, 8, 10, 13], error: [0, 3, 5, 6, 9, 10, 12, 15] }
};

const resolvePattern = (pattern: LatticePatternName | LatticePattern, grid: LatticeGrid): ResolvedPattern => {
  if (typeof pattern === 'string') {
    const named = PATTERNS[pattern];
    return (named && named[grid]) || (PATTERNS[DEFAULT_PATTERN[grid]][grid] as ResolvedPattern);
  }
  const cells = Array.from({ length: grid * grid }, (_, i) => pattern.cells[i] ?? null);
  const max = Math.max(0, ...cells.filter(v => v != null));
  return { cells, loop: pattern.loop ?? max + 4.2, scale: pattern.scale ?? 1, lit: pattern.lit ?? 0.62 };
};
const fmt = (ds: number) =>
  ds < 600 ? `${(ds / 10).toFixed(1)}s` : `${Math.floor(ds / 600)}m ${((ds % 600) / 10).toFixed(1)}s`;
const spoken = (ds: number) =>
  ds < 600
    ? `${(ds / 10).toFixed(1)} seconds`
    : `${Math.floor(ds / 600)} minutes ${((ds % 600) / 10).toFixed(1)} seconds`;

const RbLatticeLoader: React.FC<LatticeLoaderProps> = ({
  label = 'Thinking',
  doneLabel = 'Done in',
  errorLabel = 'Failed after',
  status = 'working',
  pattern = 'orbit',
  grid = 3,
  shape = 'round',
  color = 'currentColor',
  doneColor = '#22c55e',
  errorColor = '#ef4444',
  cellSize = 6,
  gap = 2,
  fontSize = 14,
  step = 90,
  idleOpacity = 0.15,
  glow = false,
  glowColor = '',
  showTimer = true,
  elapsed,
  className = '',
  style
}) => {
  const n: LatticeGrid = grid === 4 ? 4 : 3;
  const pat = resolvePattern(pattern, n);
  const marks = MARKS[n];
  const d = step * pat.scale;
  const cycle = Math.round(pat.loop * d);

  const timerRef = useRef<HTMLSpanElement>(null);
  const dsRef = useRef(0);
  const markRef = useRef<'done' | 'error'>('done');
  const mark = status === 'working' ? markRef.current : status;
  markRef.current = mark;
  const [announce, setAnnounce] = useState(`${label}, in progress`);

  const paint = (ds: number) => {
    dsRef.current = ds;
    if (timerRef.current) timerRef.current.textContent = fmt(ds);
  };

  useLayoutEffect(() => {
    if (elapsed != null) {
      paint(Math.round(elapsed * 10));
      return undefined;
    }
    if (status !== 'working') return undefined;
    const startedAt = performance.now();
    paint(0);
    const id = setInterval(() => paint(Math.floor((performance.now() - startedAt) / 100)), 100);
    return () => clearInterval(id);
  }, [status, elapsed]);

  useEffect(() => {
    if (status === 'working') setAnnounce(`${label}, in progress`);
    else setAnnounce(`${status === 'done' ? doneLabel : errorLabel}${showTimer ? ` ${spoken(dsRef.current)}` : ''}`);
     
  }, [status]);

  return (
    <>
          <style href="rb-lattice-loader" precedence="rb">{RB_LATTICE_LOADER_CSS}</style>
          <span
      role="status"
      className={`rb-lattice-loader-lattice-loader${className ? ` ${className}` : ''}`}
      data-status={status}
      data-shape={shape}
      data-glow={glow ? '' : undefined}
      style={
        {
          '--ll-n': n,
          '--ll-cell': `${cellSize}px`,
          '--ll-gap': `${gap}px`,
          '--ll-font': `${fontSize}px`,
          '--ll-color': color,
          '--ll-mark': status === 'error' ? errorColor : doneColor,
          '--ll-idle': idleOpacity,
          '--ll-glow': glowColor || color,
          '--ll-mark-glow': glowColor || (status === 'error' ? errorColor : doneColor),
          '--ll-cycle': `${cycle}ms`,
          ...style
        } as CSSProperties
      }
    >
      <span className={cn("rb-lattice-loader-lattice-loader__grid")} aria-hidden="true">
        <span className={cn("rb-lattice-loader-lattice-loader__layer rb-lattice-loader-lattice-loader__run")}>
          {pat.cells.map((unit, i) => (
            <span
              key={i}
              className={cn("rb-lattice-loader-lattice-loader__cell")}
              data-hole={unit == null ? '' : undefined}
              data-lit={pat.lit && pat.lit !== 0.62 ? Math.round(pat.lit * 100) : undefined}
              style={unit == null ? undefined : { animationDelay: `${Math.round(unit * d)}ms` }}
            />
          ))}
        </span>
        <span className={cn("rb-lattice-loader-lattice-loader__layer rb-lattice-loader-lattice-loader__mark")}>
          {pat.cells.map((_, i) => (
            <span key={i} className={cn("rb-lattice-loader-lattice-loader__cell")} data-on={marks[mark].includes(i) ? '' : undefined} />
          ))}
        </span>
      </span>
      <span className={cn("rb-lattice-loader-lattice-loader__label")} aria-hidden="true">
        <span className={cn("rb-lattice-loader-lattice-loader__text")} data-active={status === 'working' ? '' : undefined}>
          {label}
        </span>
        <span className={cn("rb-lattice-loader-lattice-loader__text")} data-active={status === 'done' ? '' : undefined}>
          {doneLabel}
        </span>
        <span className={cn("rb-lattice-loader-lattice-loader__text")} data-active={status === 'error' ? '' : undefined}>
          {errorLabel}
        </span>
      </span>
      {showTimer ? (
        <span ref={timerRef} className={cn("rb-lattice-loader-lattice-loader__timer")} aria-hidden="true">
          0.0s
        </span>
      ) : null}
      <span className={cn("rb-lattice-loader-lattice-loader__sr")}>{announce}</span>
    </span>
        </>
  );
};

export { RbLatticeLoader };
export default RbLatticeLoader;
