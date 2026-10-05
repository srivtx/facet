"use client";
/* Vendored from DavidHDev/react-bits — Micro/WakeSlider/WakeSlider.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { frame, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useVelocity } from 'motion/react';

import { cn } from '@/lib/utils';

const RB_WAKE_SLIDER_CSS = `
.rb-wake-slider-wake-slider {
  --ws-fill: #f5f5f5;
  --ws-track: #27272a;
  --ws-crest: #f5f5f5;
  --ws-height: 56px;
  --ws-gap: 4px;
  --ws-rest: 0.214;

  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  color: inherit;
}

.rb-wake-slider-wake-slider[aria-disabled='true'] {
  opacity: 0.5;
  pointer-events: none;
}

.rb-wake-slider-wake-slider__track {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: var(--ws-gap);
  height: var(--ws-height);
  min-height: 44px;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

@media (hover: hover) and (pointer: fine) {
  .rb-wake-slider-wake-slider__track {
    cursor: grab;
  }

  .rb-wake-slider-wake-slider__track:active {
    cursor: grabbing;
  }
}

.rb-wake-slider-wake-slider__bar {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  height: var(--ws-height);
  border-radius: 9999px;
  background: var(--ws-track);
  transform: scaleY(var(--ws-rest));
  transform-origin: 50% 50%;
  transition: background-color 120ms ease;
}

.rb-wake-slider-wake-slider__bar[data-on='true'] {
  background: var(--ws-fill);
}

.rb-wake-slider-wake-slider[data-instant='true'] .rb-wake-slider-wake-slider__bar {
  transition-duration: 0ms;
}

.rb-wake-slider-wake-slider__crest {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--ws-crest);
  opacity: 0;
}

.rb-wake-slider-wake-slider__handle {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: transparent;
  outline: none;
  cursor: inherit;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
}

.rb-wake-slider-wake-slider__value {
  min-width: 3ch;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  text-align: right;
  opacity: 0.6;
}

@media (prefers-reduced-motion: reduce) {
  .rb-wake-slider-wake-slider__bar {
    transform: scaleY(var(--ws-rest)) !important;
  }
}

`;

const SETTLE = 9.23;
const FULL_SPEED = 320;
const MIN_REACH = 1.5;
const FLAT = 0.002;

export interface WakeSliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  bars?: number;
  height?: number;
  restHeight?: number;
  gap?: number;
  fillColor?: string;
  trackColor?: string;
  crestColor?: string;
  sensitivity?: number;
  reach?: number;
  skew?: number;
  glide?: number;
  smoothing?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smoothstep = (s: number) => s * s * (3 - 2 * s);
const toPct = (v: number, min: number, max: number) => (max > min ? ((v - min) / (max - min)) * 100 : 0);
const snap = (v: number, min: number, max: number, step: number) => {
  if (!(max > min)) return min;
  if (!(step > 0)) return clamp(v, min, max);
  const lastWhole = min + Math.floor(+((max - min) / step).toFixed(6)) * step;
  const grid = clamp(Math.round((v - min) / step) * step + min, min, lastWhole);
  return +(lastWhole < max && Math.abs(v - max) <= Math.abs(v - grid) ? max : grid).toFixed(6);
};

const RbWakeSlider: React.FC<WakeSliderProps> = ({
  value: valueProp,
  defaultValue = 50,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  bars = 32,
  height = 56,
  restHeight = 12,
  gap = 4,
  fillColor = '#f5f5f5',
  trackColor = '#27272a',
  crestColor = '',
  sensitivity = 1,
  reach = 6,
  skew = 0.6,
  glide = 0.3,
  smoothing = 100,
  showValue = false,
  formatValue,
  disabled = false,
  ariaLabel = 'Value',
  className = ''
}) => {
  const [inner, setInner] = useState(defaultValue);
  const value = clamp(valueProp ?? inner, min, max);
  const pct = toPct(value, min, max);
  const reduce = useReducedMotion();
  const format = formatValue ?? String;
  const rest = Math.min(restHeight, height - 1) / height;

  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const barEls = useRef<(HTMLSpanElement | null)[]>([]);
  const crestEls = useRef<(HTMLSpanElement | null)[]>([]);
  const pointerId = useRef<number | null>(null);
  const lastAmp = useRef(0);
  const latest = useRef(value);
  latest.current = value;

  const target = useMotionValue(pct);
  const w0 = SETTLE / glide;
  const head = useSpring(target, { stiffness: w0 * w0, damping: 2 * w0, mass: 1 });
  const rawSpeed = useVelocity(head);
  const wv = 2000 / smoothing;
  const speed = useSpring(rawSpeed, { stiffness: wv * wv, damping: 2.5 * wv, mass: 1 });

  useEffect(() => {
    target.set(pct);
  }, [pct, target]);

  const paint = (force = false) => {
    const h = ((reduce ? target.get() : head.get()) / 100) * (bars - 1);
    const v = reduce ? 0 : speed.get();
    const amp = smoothstep(clamp((Math.abs(v) * sensitivity) / FULL_SPEED, 0, 1));
    const dir = Math.sign(v) || 1;
    const r = MIN_REACH + (reach - MIN_REACH) * amp;
    const behind = r * (1 + skew);
    const ahead = r * (1 - 0.5 * skew);
    const lit = Math.round(h);
    const flat = !force && amp < FLAT && lastAmp.current < FLAT;
    for (let i = 0; i < bars; i++) {
      const el = barEls.current[i];
      if (!el) continue;
      const on = i <= lit ? 'true' : 'false';
      if (el.dataset.on !== on) el.dataset.on = on;
      if (flat) continue;
      const d = i - h;
      const R = d * dir < 0 ? behind : ahead;
      const lift = Math.abs(d) < R ? amp * Math.cos((Math.PI * d) / (2 * R)) ** 2 : 0;
      el.style.transform = `scaleY(${rest + lift * (1 - rest)})`;
      const crest = crestEls.current[i];
      if (crest) crest.style.opacity = String(lift);
    }
    lastAmp.current = amp;
  };
  const paintRef = useRef(paint);
  paintRef.current = paint;
  const run = useCallback(() => paintRef.current(), []);
  const schedule = useCallback(() => frame.render(run, false, true), [run]);
  useMotionValueEvent(head, 'change', schedule);
  useMotionValueEvent(speed, 'change', schedule);
  useLayoutEffect(() => {
    paintRef.current(true);
  });

  const commit = (next: number) => {
    const clean = snap(next, min, max, step);
    if (clean === latest.current) return;
    latest.current = clean;
    if (valueProp === undefined) setInner(clean);
    onChange?.(clean);
  };
  const commitFromX = (x: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    if (!rect.width) return;
    let ratio = clamp((x - rect.left) / rect.width, 0, 1);
    if (getComputedStyle(track).direction === 'rtl') ratio = 1 - ratio;
    commit(min + ratio * (max - min));
  };
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || pointerId.current !== null) return;
    pointerId.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    rootRef.current?.removeAttribute('data-instant');
    handleRef.current?.focus({ preventScroll: true });
    commitFromX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId === pointerId.current) commitFromX(e.clientX);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== pointerId.current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    pointerId.current = null;
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const jumps: Record<string, number> = {
      ArrowRight: value + step,
      ArrowUp: value + step,
      ArrowLeft: value - step,
      ArrowDown: value - step,
      PageUp: value + step * 10,
      PageDown: value - step * 10,
      Home: min,
      End: max
    };
    if (!(e.key in jumps)) return;
    e.preventDefault();
    const clean = snap(jumps[e.key], min, max, step);
    const p = toPct(clean, min, max);
    rootRef.current?.setAttribute('data-instant', 'true');
    head.jump(p);
    speed.jump(0);
    target.jump(p);
    commit(clean);
  };

  const barNodes = useMemo(() => {
    barEls.current.length = bars;
    crestEls.current.length = bars;
    return Array.from({ length: bars }, (_, i) => (
      <span
        key={i}
        ref={el => {
          barEls.current[i] = el;
        }}
        className={cn("rb-wake-slider-wake-slider__bar")}
      >
        {crestColor ? (
          <span
            ref={el => {
              crestEls.current[i] = el;
            }}
            className={cn("rb-wake-slider-wake-slider__crest")}
          />
        ) : null}
      </span>
    ));
  }, [bars, crestColor]);

  return (
    <>
          <style href="rb-wake-slider" precedence="rb">{RB_WAKE_SLIDER_CSS}</style>
          <div
      ref={rootRef}
      className={`rb-wake-slider-wake-slider${className ? ` ${className}` : ''}`}
      aria-disabled={disabled || undefined}
      style={
        {
          '--ws-fill': fillColor,
          '--ws-track': trackColor,
          '--ws-crest': crestColor || fillColor,
          '--ws-height': `${height}px`,
          '--ws-gap': `${gap}px`,
          '--ws-rest': rest
        } as CSSProperties
      }
    >
      <div
        ref={trackRef}
        className={cn("rb-wake-slider-wake-slider__track")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        {barNodes}
        <button
          ref={handleRef}
          type="button"
          role="slider"
          className={cn("rb-wake-slider-wake-slider__handle")}
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={format(value)}
          aria-disabled={disabled || undefined}
          onKeyDown={onKeyDown}
        />
      </div>
      {showValue ? (
        <span className={cn("rb-wake-slider-wake-slider__value")} aria-hidden="true">
          {format(value)}
        </span>
      ) : null}
    </div>
        </>
  );
};

export { RbWakeSlider };
export default RbWakeSlider;
