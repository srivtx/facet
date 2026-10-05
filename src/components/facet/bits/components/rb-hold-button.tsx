"use client";
/* Vendored from DavidHDev/react-bits — Micro/HoldButton/HoldButton.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

const RB_HOLD_BUTTON_CSS = `
.rb-hold-button-hold-button {
  --hb-radius: 14px;
  --hb-bg: #27272a;
  --hb-fill: #5227ff;
  --hb-text: #f5f5f5;
  --hb-fill-text: #ffffff;
  --hb-hold: 2000ms;
  --hb-release: 200ms;
  --hb-press: 0.97;
  --hb-wave: 6px;
  --hb-w: 0px;
  --hb-h: 0px;
  --hb-cycles: 2;
  --hb-p: 0;
  --hb-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --hb-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  --hb-glow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 10px 32px -6px color-mix(in srgb, var(--hb-fill) 70%, transparent);

  position: relative;
  display: inline-grid;
  place-items: center;
  isolation: isolate;
  margin: 0;
  border: 0;
  border-radius: var(--hb-radius);
  background: var(--hb-bg);
  color: var(--hb-text);
  font-family: inherit;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1;
  box-shadow: var(--hb-shadow);
  cursor: pointer;
  outline: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition:
    transform 160ms var(--hb-ease-out),
    background-color 160ms ease,
    box-shadow var(--hb-release) var(--hb-ease-out);
}

.rb-hold-button-hold-button--sm {
  height: 36px;
  padding: 0 16px;
  font-size: 13px;
}

.rb-hold-button-hold-button--md {
  height: 44px;
  padding: 0 22px;
  font-size: 15px;
}

.rb-hold-button-hold-button--lg {
  height: 52px;
  padding: 0 28px;
  font-size: 17px;
}

@media (hover: hover) and (pointer: fine) {
  .rb-hold-button-hold-button:not(:disabled):hover {
    background: color-mix(in srgb, var(--hb-bg) 92%, #fff);
  }
}

.rb-hold-button-hold-button[data-phase='holding'][data-input='pointer'] {
  transform: scale(var(--hb-press));
}

.rb-hold-button-hold-button[data-glow='true'][data-phase='holding'],
.rb-hold-button-hold-button[data-glow='true'][data-phase='done'] {
  box-shadow: var(--hb-glow);
}

.rb-hold-button-hold-button[data-glow='true'][data-phase='holding'] {
  transition:
    transform 160ms var(--hb-ease-out),
    background-color 160ms ease,
    box-shadow var(--hb-hold) linear;
}

.rb-hold-button-hold-button:focus-visible {
  outline: 2px solid var(--hb-fill);
  outline-offset: 3px;
}

.rb-hold-button-hold-button:disabled {
  opacity: 0.5;
  cursor: default;
  pointer-events: none;
}

.rb-hold-button-hold-button__pulse {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: var(--hb-radius);
  pointer-events: none;
  opacity: 0;
}

.rb-hold-button-hold-button[data-glow='true'][data-phase='done'] .rb-hold-button-hold-button__pulse {
  animation: rb-hold-button-hb-pulse 600ms var(--hb-ease-out) forwards;
}

@keyframes rb-hold-button-hb-pulse {
  from {
    opacity: 1;
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--hb-fill) 55%, transparent);
  }
  to {
    opacity: 0;
    box-shadow: 0 0 0 14px color-mix(in srgb, var(--hb-fill) 0%, transparent);
  }
}

.rb-hold-button-hold-button__label {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
}

.rb-hold-button-hold-button__label > span {
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition:
    opacity 200ms ease,
    filter 200ms ease;
}

.rb-hold-button-hold-button__icon {
  display: inline-flex;
  flex: none;
}

.rb-hold-button-hold-button__icon > svg {
  display: block;
}

.rb-hold-button-hold-button__done {
  opacity: 0;
  filter: blur(2px);
}

.rb-hold-button-hold-button[data-phase='done'] .rb-hold-button-hold-button__idle {
  opacity: 0;
  filter: blur(2px);
}

.rb-hold-button-hold-button[data-phase='done'] .rb-hold-button-hold-button__done {
  opacity: 1;
  filter: blur(0);
}

.rb-hold-button-hold-button__clip {
  position: absolute;
  inset: 0;
  z-index: 3;
  clip-path: inset(0 round var(--hb-radius));
  pointer-events: none;
}

.rb-hold-button-hold-button__fill {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: var(--hb-fill);
  color: var(--hb-fill-text);
  clip-path: inset(
    0 calc((1 - var(--hb-p)) * (100% + 0.75 * var(--hb-wave)) - var(--hb-p) * 0.25 * var(--hb-wave)) 0 0
  );
}

.rb-hold-button-hold-button[data-direction='up'] .rb-hold-button-hold-button__fill {
  clip-path: inset(
    calc((1 - var(--hb-p)) * (100% + 0.75 * var(--hb-wave)) - var(--hb-p) * 0.25 * var(--hb-wave)) 0 0 0
  );
}

.rb-hold-button-hold-button__crest {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: var(--hb-fill);
  color: var(--hb-fill-text);
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='200' viewBox='0 0 20 200' preserveAspectRatio='none'%3E%3Cpath d='M0 0H10C18 8 18 25.3 10 33.3S2 58.7 10 66.7S18 92 10 100S2 125.3 10 133.3S18 158.7 10 166.7S2 192 10 200H0Z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='200' viewBox='0 0 20 200' preserveAspectRatio='none'%3E%3Cpath d='M0 0H10C18 8 18 25.3 10 33.3S2 58.7 10 66.7S18 92 10 100S2 125.3 10 133.3S18 158.7 10 166.7S2 192 10 200H0Z'/%3E%3C/svg%3E");
  -webkit-mask-repeat: repeat-y;
  mask-repeat: repeat-y;
  -webkit-mask-size: var(--hb-wave) calc(var(--hb-h) * 2);
  mask-size: var(--hb-wave) calc(var(--hb-h) * 2);
  -webkit-mask-position-x: calc(-1 * var(--hb-wave) + var(--hb-p) * (var(--hb-w) + var(--hb-wave)));
  mask-position-x: calc(-1 * var(--hb-wave) + var(--hb-p) * (var(--hb-w) + var(--hb-wave)));
  -webkit-mask-position-y: calc(-1 * var(--hb-p) * var(--hb-cycles) * var(--hb-h));
  mask-position-y: calc(-1 * var(--hb-p) * var(--hb-cycles) * var(--hb-h));
}

.rb-hold-button-hold-button[data-direction='up'] .rb-hold-button-hold-button__crest {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='20' viewBox='0 0 200 20' preserveAspectRatio='none'%3E%3Cpath d='M0 20V10C12 2 38 2 50 10S88 18 100 10S138 2 150 10S188 18 200 10V20Z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='20' viewBox='0 0 200 20' preserveAspectRatio='none'%3E%3Cpath d='M0 20V10C12 2 38 2 50 10S88 18 100 10S138 2 150 10S188 18 200 10V20Z'/%3E%3C/svg%3E");
  -webkit-mask-repeat: repeat-x;
  mask-repeat: repeat-x;
  -webkit-mask-size: calc(var(--hb-w) * 2) var(--hb-wave);
  mask-size: calc(var(--hb-w) * 2) var(--hb-wave);
  -webkit-mask-position-x: calc(-1 * var(--hb-p) * var(--hb-cycles) * var(--hb-w));
  mask-position-x: calc(-1 * var(--hb-p) * var(--hb-cycles) * var(--hb-w));
  -webkit-mask-position-y: calc(var(--hb-h) - var(--hb-p) * (var(--hb-h) + var(--hb-wave)));
  mask-position-y: calc(var(--hb-h) - var(--hb-p) * (var(--hb-h) + var(--hb-wave)));
}

.rb-hold-button-hold-button__label--fill {
  z-index: auto;
}

.rb-hold-button-hold-button__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (prefers-contrast: more) {
  .rb-hold-button-hold-button {
    outline: 1px solid var(--hb-text);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rb-hold-button-hold-button {
    transition:
      background-color 160ms ease,
      box-shadow var(--hb-release) ease;
    transform: none !important;
  }

  .rb-hold-button-hold-button__fill,
  .rb-hold-button-hold-button[data-direction='up'] .rb-hold-button-hold-button__fill {
    clip-path: inset(0);
    opacity: 0;
    transition: opacity var(--hb-release) ease;
  }

  .rb-hold-button-hold-button__crest {
    display: none;
  }

  .rb-hold-button-hold-button[data-phase='holding'] .rb-hold-button-hold-button__fill,
  .rb-hold-button-hold-button[data-phase='done'] .rb-hold-button-hold-button__fill {
    opacity: 1;
    transition: opacity var(--hb-hold) linear;
  }

  .rb-hold-button-hold-button__pulse {
    animation: none !important;
  }

  .rb-hold-button-hold-button__label > span {
    transition: opacity 200ms ease;
    filter: none !important;
  }
}

`;

export type HoldButtonSize = 'sm' | 'md' | 'lg';
export type HoldButtonDirection = 'right' | 'up';

export interface HoldButtonProps {
  children?: ReactNode;
  doneLabel?: ReactNode;
  icon?: ReactNode;
  doneIcon?: ReactNode;
  backgroundColor?: string;
  fillColor?: string;
  textColor?: string;
  fillTextColor?: string;
  size?: HoldButtonSize;
  radius?: number;
  fillDirection?: HoldButtonDirection;
  holdTime?: number;
  releaseTime?: number;
  pressScale?: number;
  wave?: boolean;
  waveAmplitude?: number;
  glow?: boolean;
  resetAfter?: number;
  disabled?: boolean;
  onHold?: () => void;
  onTap?: () => void;
  className?: string;
}

type Phase = 'idle' | 'holding' | 'done';
type Input = 'pointer' | 'key' | null;

interface Motion {
  raf: number;
  p: number;
  from: number;
  to: number;
  start: number;
}

interface Gesture {
  pointerId: number | null;
  start: number;
  rect: DOMRect | null;
}

interface ReleaseOptions {
  drifted?: boolean;
}

const TAP_MS = 250;
const HIT_PAD = 10;
const LINEAR = (t: number) => t;
const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 3);

const RbHoldButton: React.FC<HoldButtonProps> = ({
  children = 'Hold to delete',
  doneLabel = 'Deleted',
  icon = null,
  doneIcon = null,
  backgroundColor = '#27272a',
  fillColor = '#5227FF',
  textColor = '#f5f5f5',
  fillTextColor = '#ffffff',
  size = 'md',
  radius = 14,
  fillDirection = 'right',
  holdTime = 2000,
  releaseTime = 200,
  pressScale = 0.97,
  wave = true,
  waveAmplitude = 6,
  glow = true,
  resetAfter = 1200,
  disabled = false,
  onHold,
  onTap,
  className = ''
}) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [input, setInput] = useState<Input>(null);
  const phaseRef = useRef<Phase>('idle');
  const inputRef = useRef<Input>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const gesture = useRef<Gesture>({ pointerId: null, start: 0, rect: null });
  const timers = useRef({ complete: 0, reset: 0 });
  const hintId = useId();

  const go = (next: Phase, kind: Input = null) => {
    phaseRef.current = next;
    inputRef.current = kind;
    setPhase(next);
    setInput(kind);
  };

  const clearTimers = () => {
    clearTimeout(timers.current.complete);
    clearTimeout(timers.current.reset);
  };

  const motion = useRef<Motion>({ raf: 0, p: 0, from: 0, to: 0, start: 0 });
  const drive = (to: number, duration: number, ease: (t: number) => number) => {
    const m = motion.current;
    cancelAnimationFrame(m.raf);
    m.from = m.p;
    m.to = to;
    m.start = performance.now();
    const step = (now: number) => {
      const t = duration > 0 ? Math.min(1, (now - m.start) / duration) : 1;
      m.p = m.from + (m.to - m.from) * ease(t);
      buttonRef.current?.style.setProperty('--hb-p', m.p.toFixed(4));
      if (t < 1) {
        m.raf = requestAnimationFrame(step);
        return;
      }
      m.raf = 0;
      if (m.to === 1) complete();
    };
    m.raf = requestAnimationFrame(step);
  };

  const complete = () => {
    if (phaseRef.current !== 'holding') return;
    if (performance.now() - gesture.current.start < holdTime - 50) return;
    clearTimers();
    go('done', inputRef.current);
    onHold?.();
    if (resetAfter > 0) {
      timers.current.reset = window.setTimeout(() => {
        go('idle');
        drive(0, releaseTime, EASE_OUT);
      }, resetAfter);
    }
  };

  const begin = (kind: Input) => {
    if (disabled || phaseRef.current !== 'idle') return false;
    const button = buttonRef.current;
    if (!button) return false;
    gesture.current.start = performance.now();
    gesture.current.rect = button.getBoundingClientRect();
    go('holding', kind);
    drive(1, holdTime, LINEAR);
    timers.current.complete = window.setTimeout(complete, holdTime + 100);
    return true;
  };

  const release = ({ drifted = false }: ReleaseOptions = {}) => {
    if (phaseRef.current !== 'holding') return;
    clearTimers();
    const held = performance.now() - gesture.current.start;
    go('idle');
    drive(0, releaseTime, EASE_OUT);
    if (!drifted && held < TAP_MS) onTap?.();
  };
  const releaseRef = useRef(release);
  releaseRef.current = release;

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 || !e.isPrimary || gesture.current.pointerId !== null) return;
    if (!begin('pointer')) return;
    gesture.current.pointerId = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const endPointer = (e: React.PointerEvent<HTMLButtonElement>, options?: ReleaseOptions) => {
    if (e.pointerId !== gesture.current.pointerId) return;
    gesture.current.pointerId = null;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    release(options);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerId !== gesture.current.pointerId) return;
    const r = gesture.current.rect;
    if (!r) return;
    const out =
      e.clientX < r.left - HIT_PAD ||
      e.clientX > r.right + HIT_PAD ||
      e.clientY < r.top - HIT_PAD ||
      e.clientY > r.bottom + HIT_PAD;
    if (out) endPointer(e, { drifted: true });
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== 'touch') endPointer(e, { drifted: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Escape') {
      if (inputRef.current === 'key') release({ drifted: true });
      return;
    }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!e.repeat) begin('key');
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (inputRef.current === 'key') release();
    }
  };

  useLayoutEffect(() => {
    const button = buttonRef.current;
    if (!button) return undefined;
    const measure = () => {
      button.style.setProperty('--hb-w', `${button.offsetWidth}px`);
      button.style.setProperty('--hb-h', `${button.offsetHeight}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(button);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== 'holding') return undefined;
    const cancel = () => releaseRef.current({ drifted: true });
    const onVisibility = () => {
      if (document.hidden) cancel();
    };
    window.addEventListener('blur', cancel);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('blur', cancel);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [phase]);

  useEffect(() => {
    const t = timers.current;
    const m = motion.current;
    return () => {
      clearTimeout(t.complete);
      clearTimeout(t.reset);
      cancelAnimationFrame(m.raf);
    };
  }, []);

  const direction: HoldButtonDirection = fillDirection === 'up' ? 'up' : 'right';
  const labels = (
    <>
      <span className={cn("rb-hold-button-hold-button__idle")} aria-hidden={phase === 'done'}>
        {icon ? <span className={cn("rb-hold-button-hold-button__icon")}>{icon}</span> : null}
        {children}
      </span>
      <span className={cn("rb-hold-button-hold-button__done")} aria-hidden={phase !== 'done'}>
        {doneIcon ? <span className={cn("rb-hold-button-hold-button__icon")}>{doneIcon}</span> : null}
        {doneLabel}
      </span>
    </>
  );

  const cssVars = {
    '--hb-radius': `${radius}px`,
    '--hb-bg': backgroundColor,
    '--hb-fill': fillColor,
    '--hb-text': textColor,
    '--hb-fill-text': fillTextColor,
    '--hb-hold': `${holdTime}ms`,
    '--hb-cycles': holdTime / 1100,
    '--hb-release': `${releaseTime}ms`,
    '--hb-press': pressScale,
    '--hb-wave': `${wave ? waveAmplitude : 0}px`
  } as CSSProperties;

  return (
    <>
          <style href="rb-hold-button" precedence="rb">{RB_HOLD_BUTTON_CSS}</style>
          <button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      className={`rb-hold-button-hold-button rb-hold-button-hold-button--${size}${className ? ` ${className}` : ''}`}
      data-phase={phase}
      data-input={input ?? undefined}
      data-direction={direction}
      data-glow={glow ? 'true' : undefined}
      aria-describedby={hintId}
      style={cssVars}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={e => endPointer(e)}
      onPointerCancel={e => endPointer(e, { drifted: true })}
      onLostPointerCapture={e => endPointer(e, { drifted: true })}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onContextMenu={e => e.preventDefault()}
    >
      <span className={cn("rb-hold-button-hold-button__pulse")} aria-hidden="true" />
      <span className={cn("rb-hold-button-hold-button__label")}>{labels}</span>
      <span className={cn("rb-hold-button-hold-button__clip")} aria-hidden="true">
        <span className={cn("rb-hold-button-hold-button__fill")}>
          <span className={cn("rb-hold-button-hold-button__label rb-hold-button-hold-button__label--fill")}>{labels}</span>
        </span>
        <span className={cn("rb-hold-button-hold-button__crest")} aria-hidden="true">
          <span className={cn("rb-hold-button-hold-button__label rb-hold-button-hold-button__label--fill")}>{labels}</span>
        </span>
      </span>
      <span id={hintId} className={cn("rb-hold-button-hold-button__sr")}>
        Press and hold for {Math.round(holdTime / 100) / 10} seconds to confirm
      </span>
    </button>
        </>
  );
};

export { RbHoldButton };
export default RbHoldButton;
