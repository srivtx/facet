"use client";
/* Vendored from DavidHDev/react-bits — Micro/FuseButton/FuseButton.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Archive02Icon, Tick02Icon, Undo02Icon } from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';

const RB_FUSE_BUTTON_CSS = `
.rb-fuse-button-fuse-button {
  --fb-ink: #f5f5f5;
  --fb-bg: #27272a;
  --fb-fuse: #f5a524;
  --fb-fuse-h: 1.5px;
  --fb-radius: 22px;
  --fb-fade: 200ms;
  --fb-press: 0.97;
  --fb-h: 44px;
  --fb-fs: 14px;
  --fb-icon: 15px;
  --fb-px: 20px;
  --fb-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  position: relative;
  display: inline-grid;
  grid-template-columns: minmax(0, 1fr);
  height: var(--fb-h);
  border-radius: var(--fb-radius);
  background: var(--fb-bg);
  color: var(--fb-ink);
  font-family: inherit;
  font-size: var(--fb-fs);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.01em;
  overflow: hidden;
  isolation: isolate;
  outline: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition: transform 160ms var(--fb-ease-out);
}

.rb-fuse-button-fuse-button[data-pressed] {
  transform: scale(var(--fb-press));
}

.rb-fuse-button-fuse-button:has(:focus-visible) {
  outline: 2px solid color-mix(in srgb, var(--fb-ink) 60%, transparent);
  outline-offset: 3px;
}

.rb-fuse-button-fuse-button__idle:focus-visible,
.rb-fuse-button-fuse-button__undo:focus-visible {
  outline: none;
}

@supports not selector(:has(a)) {
  .rb-fuse-button-fuse-button__idle:focus-visible,
  .rb-fuse-button-fuse-button__undo:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--fb-ink) 60%, transparent);
    outline-offset: -3px;
  }
}

.rb-fuse-button-fuse-button__face {
  position: relative;
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  min-width: 0;
  margin: 0;
  padding: 0 var(--fb-px);
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  white-space: nowrap;
  cursor: pointer;
  opacity: 0;
  filter: blur(2px);
  visibility: hidden;
  transition:
    opacity var(--fb-fade) ease,
    filter var(--fb-fade) ease,
    visibility 0s linear var(--fb-fade),
    background-color 160ms ease;
}

.rb-fuse-button-fuse-button[data-phase='idle'] .rb-fuse-button-fuse-button__idle,
.rb-fuse-button-fuse-button[data-phase='armed'] .rb-fuse-button-fuse-button__undo,
.rb-fuse-button-fuse-button[data-phase='settled'] .rb-fuse-button-fuse-button__settled {
  opacity: 1;
  filter: blur(0);
  visibility: visible;
  transition-delay: 0s;
}

.rb-fuse-button-fuse-button[data-instant] .rb-fuse-button-fuse-button__face {
  transition-duration: 0s;
}

.rb-fuse-button-fuse-button__idle:disabled,
.rb-fuse-button-fuse-button__settled {
  cursor: default;
}

.rb-fuse-button-fuse-button[data-phase='idle']:has(.rb-fuse-button-fuse-button__idle:disabled) {
  opacity: 0.55;
}

.rb-fuse-button-fuse-button__icon {
  display: inline-flex;
  width: var(--fb-icon);
  height: var(--fb-icon);
}

.rb-fuse-button-fuse-button__icon svg {
  width: 100%;
  height: 100%;
}

.rb-fuse-button-fuse-button__icon--undo {
  transform: rotate(-70deg);
  transition: transform var(--fb-fade) var(--fb-ease-out);
}

.rb-fuse-button-fuse-button[data-phase='armed'] .rb-fuse-button-fuse-button__icon--undo {
  transform: rotate(0deg);
}

.rb-fuse-button-fuse-button__fuse {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--fb-fuse-h);
  background: var(--fb-fuse);
  box-shadow: 0 0 6px color-mix(in srgb, var(--fb-fuse) 55%, transparent);
  transform-origin: left center;
  pointer-events: none;
}

.rb-fuse-button-fuse-button[data-fuse='top'] .rb-fuse-button-fuse-button__fuse {
  bottom: auto;
  top: 0;
}

.rb-fuse-button-fuse-button__rim {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  opacity: 0;
  filter: drop-shadow(0 0 3px color-mix(in srgb, var(--fb-fuse) 60%, transparent));
  transition: opacity var(--fb-fade) ease;
}

.rb-fuse-button-fuse-button[data-phase='armed'] .rb-fuse-button-fuse-button__rim {
  opacity: 1;
}

.rb-fuse-button-fuse-button[data-instant] .rb-fuse-button-fuse-button__rim {
  transition-duration: 0s;
}

.rb-fuse-button-fuse-button__rim rect {
  x: calc(var(--fb-fuse-h) / 2);
  y: calc(var(--fb-fuse-h) / 2);
  width: calc(100% - var(--fb-fuse-h));
  height: calc(100% - var(--fb-fuse-h));
  rx: max(0px, calc(var(--fb-radius) - var(--fb-fuse-h) / 2));
  fill: none;
  stroke: var(--fb-fuse);
  stroke-width: var(--fb-fuse-h);
  stroke-linecap: round;
  stroke-dasharray: 1;
}

.rb-fuse-button-fuse-button__status {
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

@media (hover: hover) and (pointer: fine) {
  .rb-fuse-button-fuse-button__idle:not(:disabled):hover,
  .rb-fuse-button-fuse-button__undo:hover {
    background: color-mix(in srgb, var(--fb-ink) 7%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rb-fuse-button-fuse-button[data-pressed] {
    transform: none;
  }

  .rb-fuse-button-fuse-button .rb-fuse-button-fuse-button__face {
    filter: none;
    transition:
      opacity var(--fb-fade) ease,
      visibility 0s linear var(--fb-fade);
  }

  .rb-fuse-button-fuse-button .rb-fuse-button-fuse-button__icon--undo {
    transform: none;
    transition: none;
  }
}

@media (prefers-contrast: more) {
  .rb-fuse-button-fuse-button {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--fb-ink) 40%, transparent);
  }
}

@media (forced-colors: active) {
  .rb-fuse-button-fuse-button__fuse {
    background: Highlight;
  }

  .rb-fuse-button-fuse-button__rim rect {
    stroke: Highlight;
  }
}

`;

export type FusePosition = 'outline' | 'bottom' | 'top';
export type FuseCommitOn = 'press' | 'fuseEnd';
export type FuseSettle = 'reset' | 'stay';
export type FusePhase = 'idle' | 'armed' | 'settled';
export type FuseSize = 'sm' | 'md' | 'lg';

export interface FuseButtonProps {
  label?: string;
  undoLabel?: string;
  doneLabel?: string;
  icon?: ReactNode;
  color?: string;
  background?: string;
  fuseColor?: string;
  size?: FuseSize;
  radius?: number;
  undoWindow?: number;
  fuse?: FusePosition;
  fuseThickness?: number;
  crossfadeMs?: number;
  commitOn?: FuseCommitOn;
  pauseOnHover?: boolean;
  settle?: FuseSettle;
  disabled?: boolean;
  onCommit?: (reason: FuseCommitOn) => void;
  onUndo?: () => void;
  onFuseEnd?: () => void;
  onPhaseChange?: (phase: FusePhase) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

interface Latest {
  onCommit?: (reason: FuseCommitOn) => void;
  onUndo?: () => void;
  onFuseEnd?: () => void;
  onPhaseChange?: (phase: FusePhase) => void;
  commitOn: FuseCommitOn;
  settle: FuseSettle;
}

const LINE: Keyframe[] = [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }];
const OUTLINE: Keyframe[] = [{ strokeDashoffset: 0 }, { strokeDashoffset: -1 }];
const SIZES: Record<FuseSize, { height: number; font: number; icon: number; px: number }> = {
  sm: { height: 36, font: 13, icon: 14, px: 16 },
  md: { height: 44, font: 14, icon: 15, px: 20 },
  lg: { height: 52, font: 15, icon: 17, px: 24 }
};

const RbFuseButton: React.FC<FuseButtonProps> = ({
  label = 'Archive',
  undoLabel = 'Undo',
  doneLabel = 'Archived',
  icon,
  color = '#f5f5f5',
  background = '#27272a',
  fuseColor = '#f5a524',
  size = 'md',
  radius = 22,
  undoWindow = 4000,
  fuse = 'outline',
  fuseThickness = 1.5,
  crossfadeMs = 200,
  commitOn = 'press',
  pauseOnHover = true,
  settle = 'reset',
  disabled = false,
  onCommit,
  onUndo,
  onFuseEnd,
  onPhaseChange,
  className = '',
  type = 'button'
}) => {
  const [phase, setPhase] = useState<FusePhase>('idle');
  const [instant, setInstant] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const idleRef = useRef<HTMLButtonElement>(null);
  const undoRef = useRef<HTMLButtonElement>(null);
  const lineRef = useRef<HTMLElement>(null);
  const rimRef = useRef<SVGRectElement>(null);
  const anim = useRef<Animation | null>(null);
  const pause = useRef({ hover: false, hidden: false, canHoverPause: false });
  const lastInput = useRef<'pointer' | 'keyboard'>('pointer');
  const windowRef = useRef(undoWindow);
  const latest = useRef<Latest>({ commitOn, settle });
  latest.current = { onCommit, onUndo, onFuseEnd, onPhaseChange, commitOn, settle };
  const statusId = useId();
  const preset = SIZES[size] || SIZES.md;

  const go = (next: FusePhase) => {
    setInstant(lastInput.current === 'keyboard');
    setPhase(next);
    latest.current.onPhaseChange?.(next);
  };

  const syncPlayState = () => {
    const a = anim.current;
    if (!a) return;
    const { hover, hidden } = pause.current;
    if (hover || hidden) {
      if (a.playState === 'running') a.pause();
    } else if (a.playState === 'paused') {
      a.play();
    }
  };

  const light = (from = 0) => {
    const el = fuse === 'outline' ? rimRef.current : lineRef.current;
    if (!el) return;
    anim.current?.cancel();
    const a = el.animate(fuse === 'outline' ? OUTLINE : LINE, {
      duration: windowRef.current,
      easing: 'linear',
      fill: 'forwards'
    });
    if (from) a.currentTime = from;
    a.onfinish = () => {
      const l = latest.current;
      l.onFuseEnd?.();
      if (l.commitOn === 'fuseEnd') l.onCommit?.('fuseEnd');
      lastInput.current = 'pointer';
      go(l.settle === 'stay' ? 'settled' : 'idle');
    };
    anim.current = a;
    syncPlayState();
  };

  const arm = () => {
    if (disabled || phase !== 'idle') return;
    windowRef.current = undoWindow;
    light();
    pause.current.canHoverPause = false;
    pause.current.hover = false;
    if (commitOn === 'press') onCommit?.('press');
    go('armed');
  };

  const undo = () => {
    if (phase !== 'armed') return;
    const a = anim.current;
    if (a) {
      a.onfinish = null;
      a.pause();
    }
    onUndo?.();
    go('idle');
  };

  useEffect(() => {
    const inside = rootRef.current?.contains(document.activeElement);
    if (phase === 'armed') undoRef.current?.focus({ preventScroll: true });
    else if (inside) (phase === 'idle' ? idleRef.current : rootRef.current)?.focus({ preventScroll: true });
  }, [phase]);

  useEffect(() => {
    const onVisibility = () => {
      pause.current.hidden = document.hidden;
      syncPlayState();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      anim.current?.cancel();
    };
     
  }, []);

  useEffect(() => {
    const a = anim.current;
    if (!a || phase !== 'armed') return;
    light(Number(a.currentTime) || 0);
     
  }, [fuse]);

  useEffect(() => {
    if (pauseOnHover) return;
    pause.current.hover = false;
    syncPlayState();
     
  }, [pauseOnHover]);

  const handlePointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    lastInput.current = 'pointer';
    const pressable = phase === 'armed' || (phase === 'idle' && !disabled);
    if (e.button === 0 && pressable && rootRef.current) rootRef.current.dataset.pressed = '';
  };
  const release = () => {
    if (rootRef.current) delete rootRef.current.dataset.pressed;
  };
  const handlePointerEnter = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (pauseOnHover && e.pointerType === 'mouse' && pause.current.canHoverPause) {
      pause.current.hover = true;
      syncPlayState();
    }
  };
  const handlePointerLeave = (e: React.PointerEvent<HTMLSpanElement>) => {
    release();
    if (e.pointerType !== 'mouse') return;
    pause.current.canHoverPause = true;
    pause.current.hover = false;
    syncPlayState();
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ') lastInput.current = 'keyboard';
    if (e.key === 'Escape' && phase === 'armed') {
      e.preventDefault();
      lastInput.current = 'keyboard';
      undo();
    }
  };

  const actionIcon = icon ?? <HugeiconsIcon icon={Archive02Icon} size={preset.icon} strokeWidth={1.8} />;
  const line = <i ref={lineRef} className={cn("rb-fuse-button-fuse-button__fuse")} aria-hidden="true" />;

  return (
    <>
          <style href="rb-fuse-button" precedence="rb">{RB_FUSE_BUTTON_CSS}</style>
          <span
      ref={rootRef}
      tabIndex={-1}
      className={`rb-fuse-button-fuse-button${className ? ` ${className}` : ''}`}
      data-phase={phase}
      data-fuse={fuse}
      data-instant={instant ? '' : undefined}
      aria-disabled={phase === 'settled' || undefined}
      style={
        {
          '--fb-ink': color,
          '--fb-bg': background,
          '--fb-fuse': fuseColor,
          '--fb-fuse-h': `${fuseThickness}px`,
          '--fb-radius': `${radius}px`,
          '--fb-fade': `${crossfadeMs}ms`,
          '--fb-h': `${preset.height}px`,
          '--fb-fs': `${preset.font}px`,
          '--fb-icon': `${preset.icon}px`,
          '--fb-px': `${preset.px}px`
        } as CSSProperties
      }
      onPointerDown={handlePointerDown}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={idleRef}
        type={type}
        className={cn("rb-fuse-button-fuse-button__face rb-fuse-button-fuse-button__idle")}
        disabled={disabled}
        inert={phase !== 'idle'}
        onClick={arm}
      >
        <span className={cn("rb-fuse-button-fuse-button__icon")} aria-hidden="true">
          {actionIcon}
        </span>
        {label}
      </button>
      <button
        ref={undoRef}
        type="button"
        className={cn("rb-fuse-button-fuse-button__face rb-fuse-button-fuse-button__undo")}
        aria-describedby={statusId}
        aria-keyshortcuts="Escape"
        inert={phase !== 'armed'}
        onClick={undo}
      >
        <span className={cn("rb-fuse-button-fuse-button__icon rb-fuse-button-fuse-button__icon--undo")} aria-hidden="true">
          <HugeiconsIcon icon={Undo02Icon} size={preset.icon} strokeWidth={2} />
        </span>
        {undoLabel}
        {fuse !== 'outline' ? line : null}
      </button>
      <span className={cn("rb-fuse-button-fuse-button__face rb-fuse-button-fuse-button__settled")} inert={phase !== 'settled'}>
        <span className={cn("rb-fuse-button-fuse-button__icon")} aria-hidden="true">
          <HugeiconsIcon icon={Tick02Icon} size={preset.icon} strokeWidth={2.2} />
        </span>
        {doneLabel}
      </span>
      {fuse === 'outline' ? (
        <svg className={cn("rb-fuse-button-fuse-button__rim")} aria-hidden="true">
          <rect ref={rimRef} pathLength="1" />
        </svg>
      ) : null}
      <span className={cn("rb-fuse-button-fuse-button__status")} id={statusId} role="status" aria-live="polite">
        {phase === 'idle' ? '' : doneLabel}
      </span>
    </span>
        </>
  );
};

export { RbFuseButton };
export default RbFuseButton;
