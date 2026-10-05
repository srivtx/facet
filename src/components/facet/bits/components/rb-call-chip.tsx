"use client";
/* Vendored from DavidHDev/react-bits — Micro/CallChip/CallChip.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CommandLineIcon,
  File02Icon,
  PencilEdit01Icon,
  RefreshIcon,
  Search01Icon,
  Tick02Icon
} from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';

const RB_CALL_CHIP_CSS = `
.rb-call-chip-call-chip {
  --cc-size: 34px;
  --cc-font: 13px;
  --cc-pad: 12px;
  --cc-gap: 7px;
  --cc-radius: 10px;
  /* Like --cc-surface below, the ink is a fixed light value rather than
   * currentColor: the chip is a dark surface in every theme, so letting the ink
   * follow the host page put near-black text on #27272a on a light-themed page
   * (1.13:1). A caller can still pass currentColor to opt back into inheriting. */
  --cc-color: #f5f5f5;
  --cc-surface: #27272a;
  --cc-progress: #f5f5f5;
  --cc-progress-pct: 8%;
  --cc-done: #22c55e;
  --cc-error: #ef4444;
  --cc-wash-pct: 14%;
  --cc-expected: 2500ms;
  --cc-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--cc-gap);
  box-sizing: border-box;
  height: var(--cc-size);
  padding: 0 var(--cc-pad);
  border-radius: var(--cc-radius);
  overflow: hidden;
  background: var(--cc-surface);
  color: var(--cc-color);
  font-size: var(--cc-font);
  line-height: 1;
  white-space: nowrap;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  transition: transform 160ms var(--cc-ease-out);
}

.rb-call-chip-call-chip[data-status='error'] {
  cursor: pointer;
}

.rb-call-chip-call-chip[data-pressed] {
  transform: scale(0.97);
}

.rb-call-chip-call-chip__fill {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--cc-progress) var(--cc-progress-pct), transparent);
  transform: scaleX(0);
  transform-origin: left center;
  clip-path: inset(0 0 0 0);
  pointer-events: none;
}

.rb-call-chip-call-chip[data-status='running'] .rb-call-chip-call-chip__fill {
  transition: transform var(--cc-expected) linear;
}

.rb-call-chip-call-chip[data-status='done'] .rb-call-chip-call-chip__fill {
  background: color-mix(in srgb, var(--cc-done) var(--cc-wash-pct), transparent);
  clip-path: inset(100% 0 0 0);
  transition:
    transform 200ms var(--cc-ease-out),
    background-color 120ms ease,
    clip-path 400ms var(--cc-ease-out) 200ms;
}

.rb-call-chip-call-chip[data-status='error'] .rb-call-chip-call-chip__fill {
  background: color-mix(in srgb, var(--cc-error) var(--cc-wash-pct), transparent);
  transition: background-color 200ms ease;
}

.rb-call-chip-call-chip:not([data-mounted]) .rb-call-chip-call-chip__fill,
.rb-call-chip-call-chip:not([data-mounted]) .rb-call-chip-call-chip__glyph {
  transition: none !important;
}

.rb-call-chip-call-chip__slot {
  position: relative;
  flex: none;
  width: calc(var(--cc-font) + 2px);
  height: calc(var(--cc-font) + 2px);
  overflow: hidden;
}

.rb-call-chip-call-chip__glyph {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  opacity: 0;
  transform: translateY(70%);
  filter: blur(3px);
}

.rb-call-chip-call-chip__glyph[data-state='in'] {
  opacity: 1;
  transform: none;
  filter: blur(0);
  transition:
    opacity 240ms var(--cc-ease-out),
    transform 240ms var(--cc-ease-out),
    filter 240ms var(--cc-ease-out);
}

.rb-call-chip-call-chip__glyph[data-state='out'] {
  transform: translateY(-70%);
  transition:
    opacity 160ms var(--cc-ease-out),
    transform 160ms var(--cc-ease-out),
    filter 160ms var(--cc-ease-out);
}

.rb-call-chip-call-chip[data-status='done'] .rb-call-chip-call-chip__glyph[data-state='in'] {
  color: var(--cc-done);
}

.rb-call-chip-call-chip[data-status='error'] .rb-call-chip-call-chip__glyph[data-state='in'] {
  color: var(--cc-error);
}

.rb-call-chip-call-chip__name,
.rb-call-chip-call-chip__arg,
.rb-call-chip-call-chip__timer {
  position: relative;
}

.rb-call-chip-call-chip__name {
  font-weight: 500;
}

.rb-call-chip-call-chip__arg {
  opacity: 0.72;
}

.rb-call-chip-call-chip__timer {
  min-width: 6ch;
  font-variant-numeric: tabular-nums;
  text-align: right;
  opacity: 0.5;
}

.rb-call-chip-call-chip__retry {
  position: absolute;
  inset: -5px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--cc-radius);
  background: transparent;
  appearance: none;
  cursor: pointer;
  outline: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.rb-call-chip-call-chip__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .rb-call-chip-call-chip[data-status='done'] .rb-call-chip-call-chip__fill {
    clip-path: inset(0 0 0 0);
    transition: background-color 120ms ease;
  }

  .rb-call-chip-call-chip__glyph {
    transform: none !important;
    filter: none !important;
  }

  .rb-call-chip-call-chip[data-pressed] {
    transform: none;
  }
}

`;

export type CallChipStatus = 'idle' | 'running' | 'done' | 'error';
export type CallChipIcon = 'terminal' | 'file' | 'search' | 'edit';

export interface CallChipProps {
  icon?: CallChipIcon | ReactNode;
  name?: string;
  argument?: string;
  status?: CallChipStatus;
  expectedMs?: number;
  size?: number;
  radius?: number;
  color?: string;
  surfaceColor?: string;
  progressColor?: string;
  progressOpacity?: number;
  doneColor?: string;
  errorColor?: string;
  washOpacity?: number;
  shake?: number;
  showTimer?: boolean;
  onRetry?: () => void;
  className?: string;
  style?: CSSProperties;
}

type Glyph = 'tool' | 'check' | 'retry';

const HOLD_AT = 0.9;
const SHAKE = [0, -1, 1, -0.66, 0.66, -0.33, 0];
const ICONS: Record<CallChipIcon, typeof CommandLineIcon> = {
  terminal: CommandLineIcon,
  file: File02Icon,
  search: Search01Icon,
  edit: PencilEdit01Icon
};
const WORDS: Record<CallChipStatus, string> = { running: 'running', done: 'done', error: 'failed', idle: 'queued' };

const fmt = (ms: number) => (ms < 10000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`);
const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const glyphOf = (s: CallChipStatus): Glyph => (s === 'done' ? 'check' : s === 'error' ? 'retry' : 'tool');

const RbCallChip: React.FC<CallChipProps> = ({
  icon = 'terminal',
  name = 'bash',
  argument = 'npm test',
  status = 'running',
  expectedMs = 2500,
  size = 34,
  radius = 10,
  color = '#f5f5f5',
  surfaceColor = '#27272a',
  progressColor = '#f5f5f5',
  progressOpacity = 0.08,
  doneColor = '#22c55e',
  errorColor = '#ef4444',
  washOpacity = 0.14,
  shake = 6,
  showTimer = true,
  onRetry,
  className = '',
  style
}) => {
  const rootRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);
  const mountedRef = useRef(false);
  const fraction = useRef(0);
  const clock = useRef({ ms: 0 });
  const shakeAnim = useRef<Animation | null>(null);
  const statusRef = useRef(status);
  statusRef.current = status;
  const [mounted, setMounted] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [announce, setAnnounce] = useState('');
  const roll = useRef<{ cur: Glyph; prev: Glyph | null }>({ cur: glyphOf(status), prev: null });
  if (glyphOf(status) !== roll.current.cur) roll.current = { cur: glyphOf(status), prev: roll.current.cur };

  const setFraction = (f: number, instant: boolean) => {
    const fill = fillRef.current;
    if (!fill) return;
    fraction.current = f;
    if (instant) fill.style.transition = 'none';
    fill.style.transform = `scaleX(${f})`;
    if (instant) {
      void fill.getBoundingClientRect();
      fill.style.transition = '';
    }
  };
  const apply = (s: CallChipStatus, animate: boolean) => {
    if (s === 'running') {
      shakeAnim.current?.cancel();
      setFraction(0, true);
      if (animate) setFraction(HOLD_AT, false);
    } else if (s === 'done') {
      setFraction(1, !animate);
    } else if (s === 'error') {
      const fill = fillRef.current;
      const live = fill ? new DOMMatrix(getComputedStyle(fill).transform).a : fraction.current;
      setFraction(Math.min(1, Math.max(0, live)), true);
      if (animate && shake > 0 && !reduceMotion() && rootRef.current) {
        shakeAnim.current = rootRef.current.animate(
          SHAKE.map(k => ({ transform: `translateX(${k * shake}px)`, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' })),
          { duration: 450, composite: 'add' }
        );
      }
    } else setFraction(0, true);
  };

  useEffect(() => {
    mountedRef.current = true;
    setMounted(true);
    apply(statusRef.current, statusRef.current === 'running');
    return () => {
      mountedRef.current = false;
      shakeAnim.current?.cancel();
    };
     
  }, []);
  useLayoutEffect(() => {
    if (mountedRef.current) apply(status, true);
     
  }, [status]);

  useEffect(() => {
    const write = (ms: number) => {
      clock.current.ms = ms;
      if (timerRef.current) timerRef.current.textContent = fmt(ms);
    };
    if (status !== 'running') {
      if ((status === 'idle' || !clock.current.ms) && timerRef.current) timerRef.current.textContent = '—';
      return undefined;
    }
    const startedAt = performance.now();
    write(0);
    if (reduceMotion()) {
      const id = setInterval(() => write(performance.now() - startedAt), 100);
      return () => {
        clearInterval(id);
        write(performance.now() - startedAt);
      };
    }
    let raf = 0;
    const tick = () => {
      write(performance.now() - startedAt);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      write(performance.now() - startedAt);
    };
  }, [status]);
  useEffect(() => {
    const ms = showTimer && clock.current.ms ? Math.round(clock.current.ms) : 0;
    const when = status === 'done' && ms ? ` in ${ms} ms` : status === 'error' && ms ? ` after ${ms} ms` : '';
    setAnnounce(`${name} ${argument}, ${WORDS[status] ?? status}${when}`);
     
  }, [status]);

  const font = Math.max(11, Math.round(size * 0.38));
  const glyphState = (g: Glyph) => (g === roll.current.cur ? 'in' : g === roll.current.prev ? 'out' : undefined);
  const toolIcon = typeof icon === 'string' ? (ICONS[icon as CallChipIcon] ?? ICONS.terminal) : null;
  const iconSize = font + 2;

  return (
    <>
          <style href="rb-call-chip" precedence="rb">{RB_CALL_CHIP_CSS}</style>
          <span
      ref={rootRef}
      role="status"
      aria-busy={status === 'running' || undefined}
      data-status={status}
      data-mounted={mounted ? '' : undefined}
      data-pressed={pressed ? '' : undefined}
      className={`rb-call-chip-call-chip${className ? ` ${className}` : ''}`}
      style={
        {
          '--cc-size': `${size}px`,
          '--cc-font': `${font}px`,
          '--cc-pad': `${Math.round(size * 0.35)}px`,
          '--cc-gap': `${Math.round(font * 0.55)}px`,
          '--cc-radius': `${radius}px`,
          '--cc-color': color,
          '--cc-surface': surfaceColor,
          '--cc-progress': progressColor,
          '--cc-progress-pct': `${progressOpacity * 100}%`,
          '--cc-done': doneColor,
          '--cc-error': errorColor,
          '--cc-wash-pct': `${washOpacity * 100}%`,
          '--cc-expected': `${expectedMs}ms`,
          ...style
        } as CSSProperties
      }
    >
      <span ref={fillRef} className={cn("rb-call-chip-call-chip__fill")} aria-hidden="true" />
      <span className={cn("rb-call-chip-call-chip__slot")} aria-hidden="true">
        <span className={cn("rb-call-chip-call-chip__glyph")} data-state={glyphState('tool')}>
          {toolIcon ? <HugeiconsIcon icon={toolIcon} size={iconSize} strokeWidth={1.8} /> : icon}
        </span>
        <span className={cn("rb-call-chip-call-chip__glyph")} data-state={glyphState('check')}>
          <HugeiconsIcon icon={Tick02Icon} size={iconSize} strokeWidth={2.2} />
        </span>
        <span className={cn("rb-call-chip-call-chip__glyph")} data-state={glyphState('retry')}>
          <HugeiconsIcon icon={RefreshIcon} size={iconSize} strokeWidth={2} />
        </span>
      </span>
      <span className={cn("rb-call-chip-call-chip__name")} aria-hidden="true">
        {name}
      </span>
      <span className={cn("rb-call-chip-call-chip__arg")} aria-hidden="true">
        {argument}
      </span>
      {showTimer ? (
        <span ref={timerRef} className={cn("rb-call-chip-call-chip__timer")} aria-hidden="true">
          0 ms
        </span>
      ) : null}
      {status === 'error' && onRetry ? (
        <button
          type="button"
          className={cn("rb-call-chip-call-chip__retry")}
          aria-label={`Retry ${name} ${argument}`}
          onClick={() => onRetry()}
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerCancel={() => setPressed(false)}
        />
      ) : null}
      <span className={cn("rb-call-chip-call-chip__sr")}>{announce}</span>
    </span>
        </>
  );
};

export { RbCallChip };
export default RbCallChip;
