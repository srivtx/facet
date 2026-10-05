"use client";
/* Vendored from DavidHDev/react-bits — Micro/StatusMark/StatusMark.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { animate, useMotionValue, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

const RB_STATUS_MARK_CSS = `
.rb-status-mark-status-mark {
  --sm-size: 20px;
  --sm-stroke: 2;
  --sm-color: currentColor;
  --sm-done: #22c55e;
  --sm-error: #ef4444;
  --sm-fill: 0.06;
  --sm-font: 14px;
  --sm-draw: 240ms;
  --sm-strike-delay: 180ms;
  --sm-muted: 0.55;
  --sm-check-delay: 120ms;
  --sm-label-o: 0.65;
  --sm-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --sm-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);

  position: relative;
  display: inline-flex;
  align-items: center;
  gap: calc(var(--sm-size) * 0.5);
  vertical-align: middle;
  line-height: 1;
}

.rb-status-mark-status-mark__glyph {
  flex: none;
  overflow: visible;
  color: var(--sm-color);
  transition: color 200ms ease;
}

.rb-status-mark-status-mark[data-status='done'] .rb-status-mark-status-mark__glyph {
  color: var(--sm-done);
}

.rb-status-mark-status-mark[data-status='failed'] .rb-status-mark-status-mark__glyph {
  color: var(--sm-error);
}

.rb-status-mark-status-mark__track {
  fill: currentColor;
  stroke: currentColor;
  stroke-width: var(--sm-stroke);
  fill-opacity: 0;
  stroke-opacity: 0;
  transition:
    fill-opacity 180ms ease,
    stroke-opacity 200ms ease;
}

.rb-status-mark-status-mark[data-status='running'] .rb-status-mark-status-mark__track {
  stroke-opacity: 0.2;
}

.rb-status-mark-status-mark[data-status='done'] .rb-status-mark-status-mark__track,
.rb-status-mark-status-mark[data-status='failed'] .rb-status-mark-status-mark__track {
  fill-opacity: var(--sm-fill);
}

.rb-status-mark-status-mark__ring {
  fill: none;
  stroke: currentColor;
  stroke-width: var(--sm-stroke);
  stroke-linecap: round;
  opacity: var(--sm-muted);
  transition: opacity 200ms ease;
}

.rb-status-mark-status-mark[data-status='running'] .rb-status-mark-status-mark__ring,
.rb-status-mark-status-mark[data-status='done'] .rb-status-mark-status-mark__ring,
.rb-status-mark-status-mark[data-status='failed'] .rb-status-mark-status-mark__ring {
  opacity: 1;
}

.rb-status-mark-status-mark__check,
.rb-status-mark-status-mark__cross {
  fill: none;
  stroke: currentColor;
  stroke-width: var(--sm-stroke);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1 2;
  stroke-dashoffset: 1.05;
  opacity: 0;
  transition:
    stroke-dashoffset 160ms var(--sm-ease-out),
    opacity 0ms linear 160ms;
}

.rb-status-mark-status-mark[data-status='done'] .rb-status-mark-status-mark__check,
.rb-status-mark-status-mark[data-status='failed'] .rb-status-mark-status-mark__cross,
.rb-status-mark-status-mark[data-status='cancelled'] .rb-status-mark-status-mark__cross {
  stroke-dashoffset: 0;
  opacity: 1;
  transition:
    stroke-dashoffset var(--sm-draw) var(--sm-ease-out) var(--sm-check-delay),
    opacity 0ms linear var(--sm-check-delay);
}

.rb-status-mark-status-mark__label {
  position: relative;
  color: var(--sm-color);
  font-size: var(--sm-font);
  line-height: 1.25;
  opacity: var(--sm-label-o);
  transition: opacity 200ms ease;
}

.rb-status-mark-status-mark[data-status='running'] {
  --sm-label-o: 1;
}

.rb-status-mark-status-mark[data-status='done'] {
  --sm-label-o: 0.6;
}

.rb-status-mark-status-mark[data-status='failed'] {
  --sm-label-o: 1;
}

.rb-status-mark-status-mark[data-status='cancelled'] {
  --sm-label-o: 0.55;
}

.rb-status-mark-status-mark__strike {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  height: max(1px, calc(var(--sm-font) / 14));
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left center;
  translate: 0 -50%;
  pointer-events: none;
  transition: transform 160ms var(--sm-ease-out);
}

.rb-status-mark-status-mark[data-status='done'][data-strike] .rb-status-mark-status-mark__strike {
  transform: scaleX(1);
  transition: transform 280ms var(--sm-ease-out) var(--sm-strike-delay);
}

.rb-status-mark-status-mark__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@keyframes rb-status-mark-sm-breathe {
  50% {
    opacity: 0.45;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rb-status-mark-status-mark[data-indeterminate] .rb-status-mark-status-mark__ring {
    animation: rb-status-mark-sm-breathe 1400ms var(--sm-ease-in-out) infinite;
  }

  .rb-status-mark-status-mark__check,
  .rb-status-mark-status-mark__cross {
    stroke-dashoffset: 0;
    transition: opacity 200ms ease;
  }

  .rb-status-mark-status-mark__strike {
    opacity: 0;
    transform: scaleX(1) !important;
    transition: opacity 200ms ease;
  }

  .rb-status-mark-status-mark[data-status='done'][data-strike] .rb-status-mark-status-mark__strike {
    opacity: 1;
  }
}

`;

export type StatusMarkStatus = 'pending' | 'running' | 'done' | 'failed' | 'cancelled';

export interface StatusMarkProps {
  status?: StatusMarkStatus;
  progress?: number;
  label?: ReactNode;
  color?: string;
  doneColor?: string;
  errorColor?: string;
  size?: number;
  strokeWidth?: number;
  dashes?: number;
  fontSize?: number;
  spinDuration?: number;
  arcLength?: number;
  drawDuration?: number;
  fillOpacity?: number;
  strike?: boolean;
  strikeDelay?: number;
  className?: string;
  style?: CSSProperties;
}

const UI = { type: 'spring' as const, duration: 0.3, bounce: 0 };
const MORPH = { duration: 0.3, ease: [0.77, 0, 0.175, 1] as [number, number, number, number] };
const CHECK = 'M7.5 12.25 10.5 15.25 16.75 8.75';
const CROSS = 'M8.5 8.5 15.5 15.5M15.5 8.5 8.5 15.5';
const TEXT: Record<StatusMarkStatus, string> = {
  pending: 'Pending',
  running: 'In progress',
  done: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled'
};
const IDLE_DASH = 0.3;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const RbStatusMark: React.FC<StatusMarkProps> = ({
  status = 'pending',
  progress,
  label,
  color = 'currentColor',
  doneColor = '#22c55e',
  errorColor = '#ef4444',
  size = 20,
  strokeWidth = 2,
  dashes = 8,
  fontSize = 14,
  spinDuration = 1100,
  arcLength = 0.68,
  drawDuration = 240,
  fillOpacity = 0.06,
  strike = true,
  strikeDelay = 60,
  className = '',
  style
}) => {
  const reduce = useReducedMotion();
  const r = 10 - strokeWidth / 2;
  const C = 2 * Math.PI * r;
  const P = C / Math.max(1, dashes);
  const determinate = status === 'running' && typeof progress === 'number' && Number.isFinite(progress);
  const indeterminate = status === 'running' && !determinate;
  const solid = status === 'running' || status === 'done' || status === 'failed';
  const targetArc = indeterminate ? arcLength : determinate ? clamp01(progress as number) : 1;

  const mode = useMotionValue(solid ? 1 : 0);
  const arc = useMotionValue(targetArc);
  const travel = useMotionValue(0);
  const ringRef = useRef<SVGCircleElement>(null);
  const geo = useRef({ C, P });
  geo.current = { C, P };
  const gen = useRef(0);

  const writeDash = () => {
    const g = geo.current;
    const m = mode.get();
    const a = arc.get();
    const dash = IDLE_DASH * g.P + (a * g.C - IDLE_DASH * g.P) * m;
    const gap = (1 - IDLE_DASH) * g.P + ((1 - a) * g.C - (1 - IDLE_DASH) * g.P) * m;
    ringRef.current?.setAttribute('stroke-dasharray', `${Math.max(0, dash)} ${Math.max(0, gap)}`);
  };
  useLayoutEffect(() => {
    writeDash();
    ringRef.current?.setAttribute('stroke-dashoffset', String(travel.get()));
     
  }, [C, P]);
  useEffect(() => {
    const offs = [
      mode.on('change', writeDash),
      arc.on('change', writeDash),
      travel.on('change', (v: number) => ringRef.current?.setAttribute('stroke-dashoffset', String(v)))
    ];
    return () => {
      offs.forEach(off => off());
      mode.stop();
      arc.stop();
      travel.stop();
    };
     
  }, []);

  useEffect(() => {
    const g = ++gen.current;
    if (reduce) {
      mode.jump(solid ? 1 : 0);
      arc.jump(targetArc);
      travel.jump(0);
      return;
    }
    if (mode.get() === 0) arc.jump(targetArc);
    animate(mode, solid ? 1 : 0, MORPH);
    animate(arc, targetArc, UI);
    if (indeterminate) {
      const t0 = travel.get();
      animate(travel, [t0, t0 - C], { duration: spinDuration / 1000, ease: 'linear', repeat: Infinity });
      return;
    }
    const unit = determinate ? C : P;
    const to = Math.floor(travel.get() / unit) * unit;
    animate(travel, to, UI).then(() => {
      if (gen.current === g) travel.jump(0);
    });
     
  }, [status, determinate, targetArc, reduce, C, P, spinDuration]);

  const spoken = TEXT[status] + (determinate ? `, ${Math.round(clamp01(progress as number) * 100)}%` : '');
  const hasLabel = label !== undefined && label !== null;

  return (
    <>
          <style href="rb-status-mark" precedence="rb">{RB_STATUS_MARK_CSS}</style>
          <span
      className={`rb-status-mark-status-mark${className ? ` ${className}` : ''}`}
      data-status={status}
      data-indeterminate={indeterminate ? '' : undefined}
      data-strike={strike ? '' : undefined}
      style={
        {
          '--sm-size': `${size}px`,
          '--sm-stroke': strokeWidth,
          '--sm-color': color,
          '--sm-done': doneColor,
          '--sm-error': errorColor,
          '--sm-fill': fillOpacity,
          '--sm-font': `${fontSize}px`,
          '--sm-draw': `${drawDuration}ms`,
          '--sm-strike-delay': `${120 + strikeDelay}ms`,
          ...style
        } as CSSProperties
      }
    >
      <svg
        className={cn("rb-status-mark-status-mark__glyph")}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        role={hasLabel ? undefined : 'img'}
        aria-label={hasLabel ? undefined : spoken}
        aria-hidden={hasLabel || undefined}
      >
        <circle className={cn("rb-status-mark-status-mark__track")} cx="12" cy="12" r={r} transform="rotate(-90 12 12)" />
        <circle ref={ringRef} className={cn("rb-status-mark-status-mark__ring")} cx="12" cy="12" r={r} transform="rotate(-90 12 12)" />
        <path className={cn("rb-status-mark-status-mark__check")} d={CHECK} pathLength="1" />
        <path className={cn("rb-status-mark-status-mark__cross")} d={CROSS} pathLength="1" />
      </svg>
      {hasLabel ? <span className={cn("rb-status-mark-status-mark__sr")}>{spoken}: </span> : null}
      {hasLabel ? (
        <span className={cn("rb-status-mark-status-mark__label")}>
          {label}
          <span className={cn("rb-status-mark-status-mark__strike")} aria-hidden="true" />
        </span>
      ) : null}
    </span>
        </>
  );
};

export { RbStatusMark };
export default RbStatusMark;
