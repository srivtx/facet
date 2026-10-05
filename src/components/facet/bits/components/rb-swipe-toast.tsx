"use client";
/* Vendored from DavidHDev/react-bits — Micro/SwipeToast/SwipeToast.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';

const RB_SWIPE_TOAST_CSS = `
.rb-swipe-toast-swipe-toast {
  --st-bg: #27272a;
  --st-ink: #f5f5f5;
  --st-fuse: #f5a524;
  --st-fuse-h: 2px;
  --st-w: 356px;
  --st-radius: 12px;
  --st-slide: 400ms;
  --st-gap: 10px;
  --st-offset: 32px;
  --st-z: 999999999;
  --st-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  display: grid;
  grid-template-rows: 1fr;
  width: min(var(--st-w), 100%);
  color: var(--st-ink);
  font-family: inherit;
  font-size: 13px;
  line-height: 1.5;
}

.rb-swipe-toast-swipe-toast[data-inline='false'] {
  position: fixed;
  right: var(--st-offset);
  bottom: calc(var(--st-offset) + env(safe-area-inset-bottom, 0px));
  z-index: var(--st-z);
  width: min(var(--st-w), calc(100vw - 2 * var(--st-offset)));
}

@media (max-width: 600px) {
  .rb-swipe-toast-swipe-toast[data-inline='false'] {
    --st-offset: 16px;
  }
}

.rb-swipe-toast-swipe-toast[data-inline='true'] {
  transition: grid-template-rows var(--st-slide) var(--st-ease-out);
}

.rb-swipe-toast-swipe-toast[data-inline='true'][data-mounted='false'] {
  grid-template-rows: 0fr;
}

.rb-swipe-toast-swipe-toast[data-inline='true'][data-phase='closing'],
.rb-swipe-toast-swipe-toast[data-inline='true'][data-phase='gone'] {
  grid-template-rows: 0fr;
}

.rb-swipe-toast-swipe-toast[data-inline='true'][data-phase='closing'] {
  transition-duration: calc(var(--st-slide) * 0.7);
}

.rb-swipe-toast-swipe-toast[data-inline='true'][data-phase='gone'] {
  transition-duration: 200ms;
}

.rb-swipe-toast-swipe-toast__gate {
  min-height: 0;
}

.rb-swipe-toast-swipe-toast[data-inline='true'] .rb-swipe-toast-swipe-toast__lift {
  margin-top: var(--st-gap);
}

.rb-swipe-toast-swipe-toast__lift {
  opacity: 1;
  transform: translateY(0);
  transition:
    transform var(--st-slide) var(--st-ease-out),
    opacity calc(var(--st-slide) * 0.6) ease;
}

@starting-style {
  .rb-swipe-toast-swipe-toast[data-inline='true'] {
    grid-template-rows: 0fr;
  }

  .rb-swipe-toast-swipe-toast__lift {
    opacity: 0;
    transform: translateY(100%);
  }
}

.rb-swipe-toast-swipe-toast[data-mounted='false'] .rb-swipe-toast-swipe-toast__lift {
  opacity: 0;
  transform: translateY(100%);
}

.rb-swipe-toast-swipe-toast[data-phase='closing'] .rb-swipe-toast-swipe-toast__lift {
  opacity: 0;
  transform: translateY(100%);
  transition:
    transform calc(var(--st-slide) * 0.7) var(--st-ease-out),
    opacity calc(var(--st-slide) * 0.5) ease;
}

.rb-swipe-toast-swipe-toast[data-phase='gone'] .rb-swipe-toast-swipe-toast__lift {
  opacity: 0;
  visibility: hidden;
  transform: translateY(100%);
}

.rb-swipe-toast-swipe-toast[data-instant] .rb-swipe-toast-swipe-toast__lift {
  transition-duration: 0s;
}

.rb-swipe-toast-swipe-toast__card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: var(--st-radius);
  overflow: hidden;
  background: var(--st-bg);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.05),
    0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: grab;
  outline: none;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.rb-swipe-toast-swipe-toast__card[data-swiping] {
  cursor: grabbing;
}

.rb-swipe-toast-swipe-toast[data-dismissible='false'] .rb-swipe-toast-swipe-toast__card {
  cursor: default;
  touch-action: auto;
}

.rb-swipe-toast-swipe-toast__icon {
  display: inline-flex;
  flex: none;
  width: 18px;
  height: 18px;
}

.rb-swipe-toast-swipe-toast__icon svg {
  width: 100%;
  height: 100%;
}

.rb-swipe-toast-swipe-toast__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.rb-swipe-toast-swipe-toast__title {
  font-weight: 500;
  line-height: 1.5;
}

.rb-swipe-toast-swipe-toast__desc {
  color: color-mix(in srgb, var(--st-ink) 66%, transparent);
  font-weight: 400;
  line-height: 1.4;
}

.rb-swipe-toast-swipe-toast__action,
.rb-swipe-toast-swipe-toast__close {
  flex: none;
  border: 0;
  font: inherit;
  cursor: pointer;
  outline: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform 160ms var(--st-ease-out),
    background-color 160ms ease,
    opacity 160ms ease;
}

.rb-swipe-toast-swipe-toast__action {
  height: 24px;
  padding: 0 8px;
  border-radius: 5px;
  background: var(--st-ink);
  color: var(--st-bg);
  font-size: 12px;
  font-weight: 500;
}

.rb-swipe-toast-swipe-toast__close {
  position: relative;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  background: transparent;
  color: inherit;
}

.rb-swipe-toast-swipe-toast__close::before {
  content: '';
  position: absolute;
  inset: -8px;
}

.rb-swipe-toast-swipe-toast__action:active,
.rb-swipe-toast-swipe-toast__close:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .rb-swipe-toast-swipe-toast__action:hover {
    opacity: 0.88;
  }

  .rb-swipe-toast-swipe-toast__close:hover {
    background: color-mix(in srgb, var(--st-ink) 10%, transparent);
  }
}

.rb-swipe-toast-swipe-toast__fuse {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: var(--st-fuse-h);
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--st-fuse) 18%, transparent) 9%,
    color-mix(in srgb, var(--st-fuse) 50%, transparent) 18%,
    color-mix(in srgb, var(--st-fuse) 84%, transparent) 28%,
    var(--st-fuse) 38%,
    var(--st-fuse) 62%,
    color-mix(in srgb, var(--st-fuse) 84%, transparent) 72%,
    color-mix(in srgb, var(--st-fuse) 50%, transparent) 82%,
    color-mix(in srgb, var(--st-fuse) 18%, transparent) 91%,
    transparent 100%
  );
  transform-origin: left center;
  pointer-events: none;
}

.rb-swipe-toast-swipe-toast[data-fuse='top'] .rb-swipe-toast-swipe-toast__fuse {
  top: 0;
  bottom: auto;
}

.rb-swipe-toast-swipe-toast[data-fuse='none'] .rb-swipe-toast-swipe-toast__fuse {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .rb-swipe-toast-swipe-toast__lift {
    transform: none !important;
    transition: opacity 200ms ease;
  }

  .rb-swipe-toast-swipe-toast__action:active,
  .rb-swipe-toast-swipe-toast__close:active {
    transform: none;
  }
}

`;

export type SwipeToastCloseReason = 'timeout' | 'swipe' | 'action' | 'close' | 'escape' | 'programmatic';
export type SwipeToastFuse = 'bottom' | 'top' | 'none';
export type SwipeToastPhase = 'open' | 'closing' | 'gone';

export interface SwipeToastProps {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actionLabel?: ReactNode;
  onAction?: () => void;
  open?: boolean;
  onClose?: (reason: SwipeToastCloseReason) => void;
  background?: string;
  color?: string;
  fuseColor?: string;
  width?: number;
  radius?: number;
  slideMs?: number;
  settleBounce?: number;
  swipeDistance?: number;
  duration?: number;
  fuse?: SwipeToastFuse;
  pauseOnHover?: boolean;
  closeButton?: boolean;
  inline?: boolean;
  dismissible?: boolean;
  className?: string;
}

type Sample = [number, number];

interface Drag {
  id: number;
  startY: number;
  grab: number | null;
  moved: boolean;
  hist: Sample[];
}

interface Latest {
  onClose?: (reason: SwipeToastCloseReason) => void;
  onAction?: () => void;
  slideMs: number;
  inline: boolean;
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const FLICK = 0.11;
const DEAD_ZONE = 3;
const RESIST_PX = 24;
const COLLAPSE_MS = 200;
const EXIT = 0.7;
const BURN = [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }];
/* The enter animation needs a hidden starting state. Browsers with
   @starting-style get it from the stylesheet; everywhere else the component
   renders data-mounted="false" and flips it on the next frame. Both paths must
   render the same thing on the server, so the @starting-style feature check may
   not seed the state — it used to, which made the server emit data-mounted="false"
   and the client "true". */

const rubberband = (over: number, dim: number, c = 0.55) => (over * dim * c) / (dim + c * Math.abs(over));
const velocityOf = (hist: Sample[]) => {
  if (hist.length < 2) return 0;
  const [t0, y0] = hist[0];
  const [t1, y1] = hist[hist.length - 1];
  return performance.now() - t1 > 100 ? 0 : (y1 - y0) / Math.max(1, t1 - t0);
};

const RbSwipeToast: React.FC<SwipeToastProps> = ({
  title = 'File archived',
  description = '',
  icon,
  actionLabel = '',
  onAction,
  open = true,
  onClose,
  background = '#27272a',
  color = '#f5f5f5',
  fuseColor = '#f5a524',
  width = 356,
  radius = 12,
  slideMs = 400,
  settleBounce = 0.2,
  swipeDistance = 40,
  duration = 4000,
  fuse = 'bottom',
  pauseOnHover = true,
  closeButton = false,
  inline = false,
  dismissible = true,
  className = ''
}) => {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<SwipeToastPhase>('open');
  const [instant, setInstant] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const fuseRef = useRef<HTMLElement>(null);
  const anim = useRef<Animation | null>(null);
  const drag = useRef<Drag | null>(null);
  const flags = useRef({ hover: false, interacting: false, focus: false, hidden: false });
  const lastInput = useRef<'pointer' | 'keyboard'>('pointer');
  const pendingClose = useRef<SwipeToastCloseReason | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reason = useRef<SwipeToastCloseReason>('timeout');
  const leaving = useRef(false);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const latest = useRef<Latest>({} as Latest);
  latest.current = { onClose, onAction, slideMs, inline };

  const y = useMotionValue(0);
  const fade = useMotionValue(1);
  const transform = useTransform(y, v => `translateY(${v}px)`);

  const syncFuse = () => {
    const a = anim.current;
    if (!a) return;
    const f = flags.current;
    if (f.hover || f.interacting || f.focus || f.hidden) a.pause();
    else if (a.playState === 'paused') a.play();
  };
  const finish = (why: SwipeToastCloseReason) => {
    setPhase('gone');
    leaving.current = false;
    if (latest.current.inline) closeTimer.current = setTimeout(() => latest.current.onClose?.(why), COLLAPSE_MS);
    else latest.current.onClose?.(why);
  };
  const close = (why: SwipeToastCloseReason) => {
    if (phaseRef.current !== 'open' || leaving.current) return;
    if (drag.current) {
      pendingClose.current = why;
      return;
    }
    anim.current?.pause();
    reason.current = why;
    const now = why === 'escape' || ((why === 'action' || why === 'close') && lastInput.current === 'keyboard');
    setInstant(now);
    setPhase('closing');
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => finish(why), now ? 0 : latest.current.slideMs * EXIT + 60);
  };
  const rescue = () => {
    clearTimeout(closeTimer.current);
    setInstant(false);
    y.set(0);
    fade.set(1);
    setPhase('open');
  };

  useEffect(() => {
    if (!open) close('programmatic');
    else if (phaseRef.current !== 'open') rescue();
     
  }, [open]);
  useEffect(() => {
    /* Always start hidden so the server and the client agree, then reveal on the
       next frame. The CSS transition does the animating either way. */
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  useEffect(() => {
    if (phase !== 'open' || duration <= 0 || !fuseRef.current) return undefined;
    anim.current?.cancel();
    const a = fuseRef.current.animate(BURN, { duration, easing: 'linear', fill: 'forwards' });
    a.onfinish = () => close('timeout');
    anim.current = a;
    syncFuse();
    return () => {
      a.onfinish = null;
      a.pause();
    };
     
  }, [phase, duration]);
  useEffect(() => {
    if (!pauseOnHover) {
      flags.current.hover = false;
      syncFuse();
    }
     
  }, [pauseOnHover]);
  useEffect(() => {
    const onVisibility = () => {
      flags.current.hidden = document.hidden;
      syncFuse();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      clearTimeout(closeTimer.current);
      anim.current?.cancel();
    };
     
  }, []);

  const swipeOut = (dy: number, v: number) => {
    anim.current?.pause();
    leaving.current = true;
    pendingClose.current = null;
    if (!reduce && cardRef.current) {
      animate(y, dy + cardRef.current.offsetHeight, { type: 'spring', duration: 0.3, bounce: 0, velocity: v * 1000 });
    }
    animate(fade, 0, { duration: 0.2, ease: EASE_OUT }).then(() => finish('swipe'));
  };
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    lastInput.current = 'pointer';
    if (
      e.button !== 0 ||
      !dismissible ||
      drag.current ||
      leaving.current ||
      (e.target as HTMLElement).closest('button')
    )
      return;
    if (phaseRef.current === 'closing') rescue();
    try {
      cardRef.current?.setPointerCapture(e.pointerId);
    } catch {}
    y.stop();
    drag.current = {
      id: e.pointerId,
      startY: e.clientY,
      grab: null,
      moved: false,
      hist: [[performance.now(), y.get()]]
    };
    flags.current.interacting = true;
    syncFuse();
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (d.grab === null) {
      if (Math.abs(e.clientY - d.startY) < DEAD_ZONE) return;
      d.grab = e.clientY - y.get();
      if (cardRef.current) cardRef.current.dataset.swiping = '';
    }
    const raw = e.clientY - d.grab;
    const next = raw >= 0 ? raw : rubberband(raw, RESIST_PX);
    y.set(next);
    d.moved = true;
    d.hist.push([performance.now(), next]);
    if (d.hist.length > 4) d.hist.shift();
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (cardRef.current) delete cardRef.current.dataset.swiping;
    try {
      cardRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
    flags.current.interacting = false;
    const dy = y.get();
    const v = velocityOf(d.hist);
    if (dy > 0 && (v > FLICK || (dy >= swipeDistance && v >= 0))) {
      swipeOut(dy, v);
      return;
    }
    if (d.moved) {
      animate(
        y,
        0,
        reduce
          ? { duration: 0.2, ease: EASE_OUT }
          : { type: 'spring', duration: 0.5, bounce: settleBounce, velocity: v * 1000 }
      );
    }
    const queued = pendingClose.current;
    pendingClose.current = null;
    if (queued) close(queued);
    else syncFuse();
  };

  return (
    <>
          <style href="rb-swipe-toast" precedence="rb">{RB_SWIPE_TOAST_CSS}</style>
          <div
      className={`rb-swipe-toast-swipe-toast${className ? ` ${className}` : ''}`}
      data-phase={phase}
      data-inline={inline ? 'true' : 'false'}
      data-fuse={duration > 0 ? fuse : 'none'}
      data-dismissible={dismissible ? 'true' : 'false'}
      data-instant={instant ? '' : undefined}
      data-mounted={mounted ? 'true' : 'false'}
      style={
        {
          '--st-bg': background,
          '--st-ink': color,
          '--st-fuse': fuseColor,
          '--st-w': `${width}px`,
          '--st-radius': `${radius}px`,
          '--st-slide': `${slideMs}ms`,
          '--st-gap': '10px'
        } as CSSProperties
      }
    >
      <div className={cn("rb-swipe-toast-swipe-toast__gate")}>
        <div className={cn("rb-swipe-toast-swipe-toast__lift")}>
          <motion.div
            ref={cardRef}
            className={cn("rb-swipe-toast-swipe-toast__card")}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            tabIndex={0}
            style={{ transform, opacity: fade }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerEnter={e => {
              if (pauseOnHover && e.pointerType === 'mouse') {
                flags.current.hover = true;
                syncFuse();
              }
            }}
            onPointerLeave={e => {
              if (e.pointerType === 'mouse') {
                flags.current.hover = false;
                syncFuse();
              }
            }}
            onFocus={() => {
              flags.current.focus = true;
              syncFuse();
            }}
            onBlur={e => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                flags.current.focus = false;
                syncFuse();
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') lastInput.current = 'keyboard';
              if (e.key === 'Escape' && dismissible) {
                e.stopPropagation();
                close('escape');
              }
            }}
          >
            {icon ? (
              <span className={cn("rb-swipe-toast-swipe-toast__icon")} aria-hidden="true">
                {icon}
              </span>
            ) : null}
            <span className={cn("rb-swipe-toast-swipe-toast__body")}>
              <span className={cn("rb-swipe-toast-swipe-toast__title")}>{title}</span>
              {description ? <span className={cn("rb-swipe-toast-swipe-toast__desc")}>{description}</span> : null}
            </span>
            {actionLabel ? (
              <button
                type="button"
                className={cn("rb-swipe-toast-swipe-toast__action")}
                onClick={() => {
                  latest.current.onAction?.();
                  close('action');
                }}
              >
                {actionLabel}
              </button>
            ) : null}
            {closeButton ? (
              <button type="button" className={cn("rb-swipe-toast-swipe-toast__close")} aria-label="Close" onClick={() => close('close')}>
                <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2.5} />
              </button>
            ) : null}
            <i ref={fuseRef} className={cn("rb-swipe-toast-swipe-toast__fuse")} aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </div>
        </>
  );
};

export { RbSwipeToast };
export default RbSwipeToast;
