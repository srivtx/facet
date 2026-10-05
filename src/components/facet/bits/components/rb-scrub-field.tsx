"use client";
/* Vendored from DavidHDev/react-bits — Micro/ScrubField/ScrubField.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, { useEffect, useId, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionStyle
} from 'motion/react';

import { cn } from '@/lib/utils';

const RB_SCRUB_FIELD_CSS = `
.rb-scrub-field-scrub-field {
  --sf-accent: #f5f5f5;
  --sf-chip: #27272a;
  --sf-ghost-ink: #111111;
  /* The chip is a fixed dark surface, so the ink has to be a fixed light one.
   * Inheriting currentColor tied the text to whatever the *host page* theme was:
   * on a light-themed page that put #1e1e22 on #27272a — 1.11:1, unreadable. The
   * chip does not change with the theme, so neither does its ink. */
  --sf-ink: #f5f5f5;
  color: var(--sf-ink);
  --sf-h: 34px;
  --sf-fs: 13px;
  --sf-r: 8px;
  --sf-w: 128px;
  --sf-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: var(--sf-w);
  height: var(--sf-h);
  padding: 0 8px 0 4px;
  border-radius: var(--sf-r);
  background: var(--sf-chip);
  font-family: inherit;
  font-size: var(--sf-fs);
  line-height: 1;
  box-shadow: 0 0 0 1px transparent;
  cursor: ew-resize;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color 200ms ease,
    box-shadow 200ms ease;
}

.rb-scrub-field-scrub-field[data-dirty='true'] {
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--sf-accent) 55%, transparent);
  transition-duration: 0ms;
}

.rb-scrub-field-scrub-field[data-typing='true'] {
  background: color-mix(in srgb, currentColor 7%, var(--sf-chip));
  cursor: text;
}

.rb-scrub-field-scrub-field__track {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
}

.rb-scrub-field-scrub-field__fill {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--sf-accent) 16%, transparent);
  transform-origin: left center;
}

.rb-scrub-field-scrub-field[data-disabled='true'] {
  opacity: 0.5;
  cursor: default;
}

.rb-scrub-field-scrub-field__handle {
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0 6px;
  border-radius: calc(var(--sf-r) - 2px);
  color: color-mix(in srgb, currentColor 55%, transparent);
  font-weight: 500;
  white-space: nowrap;
  cursor: inherit;
  transition:
    color 120ms ease,
    transform 160ms var(--sf-ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .rb-scrub-field-scrub-field:not([data-disabled='true']):hover .rb-scrub-field-scrub-field__handle {
    color: color-mix(in srgb, currentColor 85%, transparent);
  }
}

.rb-scrub-field-scrub-field:not([data-disabled='true']):not([data-typing='true']):active .rb-scrub-field-scrub-field__handle,
.rb-scrub-field-scrub-field[data-dragging='true'] .rb-scrub-field-scrub-field__handle {
  transform: scale(0.96);
  color: currentColor;
}

.rb-scrub-field-scrub-field__input {
  flex: 1;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  text-align: right;
  cursor: inherit;
  transition: color 120ms ease;
}

.rb-scrub-field-scrub-field[data-typing='true'] .rb-scrub-field-scrub-field__input {
  cursor: text;
}

.rb-scrub-field-scrub-field[data-over='true'] .rb-scrub-field-scrub-field__input {
  color: color-mix(in srgb, currentColor 55%, transparent);
}

.rb-scrub-field-scrub-field__suffix {
  /* 55%, not 45%: at 45% over the #27272a chip the suffix composited to #848486,
   * which is 3.99:1 — under the 4.5:1 minimum even in the dark theme. 55% is the
   * value the handle already uses and lands at 5.2:1. */
  color: color-mix(in srgb, currentColor 55%, transparent);
  font-weight: 500;
}

.rb-scrub-field-scrub-field__ghost {
  position: absolute;
  top: -6px;
  left: 0;
  translate: 0 -100%;
  transform-origin: 50% 100%;
  padding: 2px 6px;
  border-radius: 999px;
  background: var(--sf-accent);
  color: var(--sf-ghost-ink);
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  scale: 0.95;
  transition:
    opacity 125ms var(--sf-ease-out),
    scale 125ms var(--sf-ease-out);
}

.rb-scrub-field-scrub-field[data-dragging='true'] .rb-scrub-field-scrub-field__ghost {
  opacity: 1;
  scale: 1;
}

@media (prefers-reduced-motion: reduce) {
  .rb-scrub-field-scrub-field .rb-scrub-field-scrub-field__handle {
    transform: none;
    transition: color 120ms ease;
  }

  .rb-scrub-field-scrub-field .rb-scrub-field-scrub-field__ghost {
    scale: 1;
    transition: opacity 200ms ease;
  }
}

`;

export type ScrubFieldSize = 'sm' | 'md' | 'lg';

export interface ScrubFieldProps {
  label?: string;
  suffix?: string;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  size?: ScrubFieldSize;
  sensitivity?: number;
  rubberReach?: number;
  returnDuration?: number;
  coarseMultiplier?: number;
  fineMultiplier?: number;
  showDelta?: boolean;
  showDirty?: boolean;
  showFill?: boolean;
  accent?: string;
  chipColor?: string;
  disabled?: boolean;
  onChange?: (value: number) => void;
  onCommit?: (value: number) => void;
  className?: string;
}

interface DragState {
  id: number;
  x: number;
  raw: number;
  mult: number;
  moved: boolean;
  before: number;
  slack: number;
  left: number;
}

type Modifiers = { shiftKey: boolean; altKey: boolean };

const SPRING_UI = { type: 'spring' as const, duration: 0.3, bounce: 0 };
const LEAN = 4;
const SIZES: Record<ScrubFieldSize, { height: number; font: number; radius: number; width: number }> = {
  sm: { height: 28, font: 12, radius: 6, width: 104 },
  md: { height: 34, font: 13, radius: 8, width: 128 },
  lg: { height: 44, font: 16, radius: 10, width: 160 }
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const decimalsOf = (n: number) => {
  const s = String(n);
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
};
const onColor = (hex: string) => {
  const raw = hex.replace('#', '');
  const full = raw.length === 3 ? [...raw].map(ch => ch + ch).join('') : raw.slice(0, 6);
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return '#ffffff';
  const yiq = (((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000;
  return yiq >= 128 ? '#111111' : '#ffffff';
};

const RbScrubField: React.FC<ScrubFieldProps> = ({
  label = 'Radius',
  suffix = 'px',
  value: valueProp,
  defaultValue = 24,
  min = 0,
  max = 100,
  step = 1,
  size = 'md',
  sensitivity = 2,
  rubberReach = 8,
  returnDuration = 300,
  coarseMultiplier = 10,
  fineMultiplier = 0.1,
  showDelta = true,
  showDirty = false,
  showFill = true,
  accent = '#f5f5f5',
  chipColor = '#27272a',
  disabled = false,
  onChange,
  onCommit,
  className = ''
}) => {
  const id = useId();
  const reduce = useReducedMotion();
  const controlled = valueProp !== undefined;
  const [value, setValue] = useState<number>(controlled ? (valueProp as number) : defaultValue);
  const [dragging, setDragging] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const display = useMotionValue(value);
  const chipRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const drag = useRef<DragState | null>(null);
  const valueRef = useRef(value);
  const typingRef = useRef(false);
  const movedRef = useRef(false);
  const endRef = useRef<(cancel?: boolean) => void>(() => {});
  const escRef = useRef<((e: KeyboardEvent) => void) | null>(null);
  const mounted = useRef(false);

  const baseDecimals = decimalsOf(step);
  const fineDecimals = Math.min(6, baseDecimals + decimalsOf(fineMultiplier));
  const preset = SIZES[size] || SIZES.md;

  const fmt = (v: number) => {
    const scaled = v * 10 ** baseDecimals;
    return v.toFixed(Math.abs(scaled - Math.round(scaled)) < 1e-6 ? baseDecimals : fineDecimals);
  };
  const signed = (d: number) => (d < 0 ? '−' : '+') + fmt(Math.abs(d));

  const reach = (rubberReach / 100) * Math.max(max - min, Number.EPSILON);
  const bend = (raw: number) => (reach ? Math.sign(raw) * reach * Math.log1p(Math.abs(raw) / reach) : 0);
  const unbend = (over: number) => (reach ? Math.sign(over) * reach * Math.expm1(Math.abs(over) / reach) : 0);
  const toShown = (raw: number) => {
    const c = clamp(raw, min, max);
    return c + bend(raw - c);
  };
  const toRaw = (shown: number) => {
    const c = clamp(shown, min, max);
    return c + unbend(shown - c);
  };
  const multiplierOf = (e: Modifiers) => (e.shiftKey ? coarseMultiplier : e.altKey ? fineMultiplier : 1);

  const commit = (next: number) => {
    const rounded = clamp(Number(next.toFixed(fineDecimals)), min, max);
    if (rounded === valueRef.current) return;
    valueRef.current = rounded;
    setValue(rounded);
    onChange?.(rounded);
  };

  useMotionValueEvent(display, 'change', d => {
    if (!typingRef.current && inputRef.current) inputRef.current.value = fmt(d);
    if (chipRef.current) chipRef.current.dataset.over = d < min || d > max ? 'true' : 'false';
  });
  const lean = useTransform(display, d =>
    reduce || !reach ? 0 : clamp((d - clamp(d, min, max)) / reach, -1, 1) * LEAN
  );
  const chipTransform = useMotionTemplate`translateX(${lean}px)`;
  const fill = useTransform(display, d => (clamp(d, min, max) - min) / Math.max(max - min, Number.EPSILON));
  const fillTransform = useMotionTemplate`scaleX(${fill})`;

  const adopt = (next: number) => {
    valueRef.current = next;
    setValue(next);
    display.jump(next);
    if (!typingRef.current && inputRef.current) inputRef.current.value = fmt(next);
  };

  useEffect(() => {
    if (controlled && !drag.current && valueProp !== valueRef.current) adopt(clamp(valueProp as number, min, max));
     
  }, [valueProp]);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!controlled && !drag.current) adopt(clamp(defaultValue, min, max));
     
  }, [defaultValue]);
  useEffect(() => {
    if (!typingRef.current && inputRef.current) inputRef.current.value = fmt(valueRef.current);
     
  }, [baseDecimals, fineDecimals]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || drag.current || e.button !== 0 || typingRef.current) return;
    if (e.pointerType !== 'touch') e.preventDefault();
    display.stop();
    movedRef.current = false;
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      raw: toRaw(display.get()),
      mult: multiplierOf(e),
      moved: false,
      before: valueRef.current,
      slack: e.pointerType === 'touch' ? 8 : 3,
      left: chipRef.current ? chipRef.current.getBoundingClientRect().left : 0
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    escRef.current = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') endRef.current(true);
    };
    window.addEventListener('keydown', escRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = drag.current;
    if (!g || e.pointerId !== g.id) return;
    if (!g.moved) {
      if (Math.abs(e.clientX - g.x) < g.slack) return;
      g.moved = true;
      movedRef.current = true;
      g.x = e.clientX;
      setDragging(true);
      /* Scope the drag cursor to this field. Setting it on <html> repaints the
         cursor for every element on the page. */
      if (chipRef.current) chipRef.current.style.cursor = 'ew-resize';
    }
    const m = multiplierOf(e);
    if (m !== g.mult) {
      g.mult = m;
      g.raw = toRaw(display.get());
      g.x = e.clientX;
    }
    const raw = g.raw + Math.round((e.clientX - g.x) / sensitivity) * step * m;
    const shown = toShown(raw);
    display.set(shown);
    commit(clamp(raw, min, max));
    if (ghostRef.current) {
      ghostRef.current.style.translate = `calc(${e.clientX - g.left}px - 50%) -100%`;
      ghostRef.current.textContent = signed(shown - g.before);
    }
  };

  const end = (cancel = false) => {
    const g = drag.current;
    if (!g) return;
    drag.current = null;
    setDragging(false);
    if (chipRef.current) chipRef.current.style.cursor = '';
    if (escRef.current) {
      window.removeEventListener('keydown', escRef.current);
      escRef.current = null;
    }
    if (cancel) {
      commit(g.before);
      display.jump(g.before);
      return;
    }
    if (!g.moved) {
      inputRef.current?.focus();
      return;
    }
    const bound = clamp(display.get(), min, max);
    if (display.get() !== bound) {
      if (reduce) display.jump(bound);
      else animate(display, bound, { ...SPRING_UI, duration: returnDuration / 1000 });
    }
    if (g.moved && valueRef.current !== g.before) onCommit?.(valueRef.current);
  };
  endRef.current = end;

  const leaveTyping = () => {
    typingRef.current = false;
    setDraft(null);
    if (inputRef.current) inputRef.current.value = fmt(valueRef.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const typedNumber = draft !== null && draft.trim() !== '' ? Number(draft) : NaN;
    const from = Number.isNaN(typedNumber) ? valueRef.current : typedNumber;
    const deltas: Record<string, number> = {
      ArrowUp: step * multiplierOf(e),
      ArrowDown: -step * multiplierOf(e),
      PageUp: step * coarseMultiplier,
      PageDown: -step * coarseMultiplier
    };
    const delta = deltas[e.key];
    if (delta !== undefined || e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      leaveTyping();
      commit(delta !== undefined ? from + delta : e.key === 'Home' ? min : max);
      display.jump(valueRef.current);
      if (inputRef.current) inputRef.current.value = fmt(valueRef.current);
      onCommit?.(valueRef.current);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      leaveTyping();
      e.currentTarget.blur();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    typingRef.current = true;
    setDraft(e.target.value);
    e.target.select();
  };

  const handleBlur = () => {
    const n = draft === null ? NaN : parseFloat(draft.replace(/[^\d.-]/g, ''));
    if (!Number.isNaN(n)) {
      commit(n);
      onCommit?.(valueRef.current);
    }
    leaveTyping();
    display.jump(valueRef.current);
  };

  useEffect(
    () => () => {
      if (chipRef.current) chipRef.current.style.cursor = '';
      if (escRef.current) window.removeEventListener('keydown', escRef.current);
    },
    []
  );

  const dirty = showDirty && value !== defaultValue;

  return (
    <>
          <style href="rb-scrub-field" precedence="rb">{RB_SCRUB_FIELD_CSS}</style>
          <motion.div
      ref={chipRef}
      className={`rb-scrub-field-scrub-field${className ? ` ${className}` : ''}`}
      data-dirty={dirty ? 'true' : 'false'}
      data-dragging={dragging ? 'true' : 'false'}
      data-typing={draft !== null ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      aria-disabled={disabled || undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => end()}
      onPointerCancel={() => end(true)}
      onLostPointerCapture={() => end()}
      style={
        {
          '--sf-accent': accent,
          '--sf-chip': chipColor,
          '--sf-ghost-ink': onColor(accent),
          '--sf-h': `${preset.height}px`,
          '--sf-fs': `${preset.font}px`,
          '--sf-r': `${preset.radius}px`,
          '--sf-w': `${preset.width}px`,
          transform: chipTransform
        } as MotionStyle
      }
    >
      {showFill ? (
        <span className={cn("rb-scrub-field-scrub-field__track")} aria-hidden="true">
          <motion.span className={cn("rb-scrub-field-scrub-field__fill")} style={{ transform: fillTransform }} />
        </span>
      ) : null}
      <label
        htmlFor={id}
        className={cn("rb-scrub-field-scrub-field__handle")}
        onClick={e => {
          if (movedRef.current) e.preventDefault();
        }}
      >
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        className={cn("rb-scrub-field-scrub-field__input")}
        type="text"
        inputMode="decimal"
        role="spinbutton"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={`${fmt(value)}${suffix ? ` ${suffix}` : ''}`}
        defaultValue={fmt(value)}
        disabled={disabled}
        onFocus={handleFocus}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      {suffix ? (
        <span className={cn("rb-scrub-field-scrub-field__suffix")} aria-hidden="true">
          {suffix}
        </span>
      ) : null}
      {showDelta ? <span ref={ghostRef} className={cn("rb-scrub-field-scrub-field__ghost")} aria-hidden="true" /> : null}
    </motion.div>
        </>
  );
};

export { RbScrubField };
export default RbScrubField;
