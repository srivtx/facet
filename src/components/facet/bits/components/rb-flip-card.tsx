"use client";
/* Vendored from DavidHDev/react-bits — Micro/FlipCard/FlipCard.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode
} from 'react';
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
  type MotionStyle
} from 'motion/react';

import { cn } from '@/lib/utils';

const RB_FLIP_CARD_CSS = `
.rb-flip-card-flip-card {
  --fc-w: 300px;
  --fc-h: 400px;
  --fc-radius: 22px;
  --fc-bg: #27272a;
  --fc-ink: #f5f5f5;
  --fc-shadow: #000000;
  --fc-shadow-o: 0.45;
  --fc-glare: 0.22;

  position: relative;
  display: inline-block;
  width: var(--fc-w);
  max-width: 100%;
  height: var(--fc-h);
  border-radius: var(--fc-radius);
  outline: none;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: pan-y;
}

.rb-flip-card-flip-card[data-axis='x'] {
  touch-action: pan-x;
}

.rb-flip-card-flip-card[data-draggable] {
  cursor: grab;
}

.rb-flip-card-flip-card[data-dragging] {
  cursor: grabbing;
}

.rb-flip-card-flip-card[data-disabled] {
  cursor: default;
  opacity: 0.6;
}

.rb-flip-card-flip-card__shadow {
  position: absolute;
  inset: 12% 9% -5%;
  border-radius: var(--fc-radius);
  background: color-mix(in srgb, var(--fc-shadow) calc(var(--fc-shadow-o) * 100%), transparent);
  filter: blur(22px);
  pointer-events: none;
}

.rb-flip-card-flip-card__rotor {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.rb-flip-card-flip-card__face {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: var(--fc-radius);
  background: var(--fc-bg);
  color: var(--fc-ink);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.rb-flip-card-flip-card__face img {
  -webkit-user-drag: none;
}

.rb-flip-card-flip-card__face--back {
  transform: rotateY(180deg);
}

.rb-flip-card-flip-card[data-axis='x'] .rb-flip-card-flip-card__face--back {
  transform: rotateX(180deg);
}

.rb-flip-card-flip-card__glare {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle farthest-side at var(--fc-gx, 50%) var(--fc-gy, 50%),
    rgba(255, 255, 255, var(--fc-glare)) 0%,
    rgba(255, 255, 255, calc(var(--fc-glare) * 0.76)) 12%,
    rgba(255, 255, 255, calc(var(--fc-glare) * 0.5)) 26%,
    rgba(255, 255, 255, calc(var(--fc-glare) * 0.28)) 42%,
    rgba(255, 255, 255, calc(var(--fc-glare) * 0.12)) 60%,
    rgba(255, 255, 255, calc(var(--fc-glare) * 0.04)) 78%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: var(--fc-sheen, 0);
  pointer-events: none;
}

.rb-flip-card-flip-card[data-fade] .rb-flip-card-flip-card__face {
  transform: none;
  opacity: 0;
  backface-visibility: visible;
  -webkit-backface-visibility: visible;
  transition: opacity 200ms ease;
}

.rb-flip-card-flip-card[data-fade='front'] .rb-flip-card-flip-card__face--front,
.rb-flip-card-flip-card[data-fade='back'] .rb-flip-card-flip-card__face--back {
  opacity: 1;
}

`;

export type FlipCardAxis = 'x' | 'y';

export interface FlipCardProps {
  front?: ReactNode;
  back?: ReactNode;
  flipped?: boolean;
  defaultFlipped?: boolean;
  onFlipChange?: (flipped: boolean) => void;
  axis?: FlipCardAxis;
  flipOnClick?: boolean;
  draggable?: boolean;
  dragDistance?: number;
  tilt?: boolean;
  tiltMax?: number;
  glare?: boolean;
  glareOpacity?: number;
  hoverScale?: number;
  perspective?: number;
  stiffness?: number;
  damping?: number;
  width?: number;
  height?: number;
  radius?: number;
  background?: string;
  color?: string;
  shadow?: boolean;
  shadowColor?: string;
  shadowOpacity?: number;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

interface Grip {
  id: number;
  x: number;
  y: number;
  base: number;
  moved: boolean;
  slop: number;
  hist: { t: number; v: number }[];
}

const SLOP = { fine: 4, coarse: 8 };
const TILT_SPRING = { stiffness: 240, damping: 24, mass: 0.6 };
const LIFT_SPRING = { stiffness: 320, damping: 26 };
const FLING = 0.16;
const HISTORY_MS = 90;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const snap = (deg: number) => Math.round(deg / 180) * 180;
const isBack = (deg: number) => Math.abs(Math.round(deg / 180)) % 2 === 1;

const RbFlipCard: React.FC<FlipCardProps> = ({
  front = null,
  back = null,
  flipped,
  defaultFlipped = false,
  onFlipChange,
  axis = 'y',
  flipOnClick = true,
  draggable = true,
  dragDistance = 0,
  tilt = true,
  tiltMax = 12,
  glare = true,
  glareOpacity = 0.22,
  hoverScale = 1.03,
  perspective = 1100,
  stiffness = 170,
  damping = 20,
  width = 300,
  height = 400,
  radius = 22,
  background = '#27272a',
  color = '#f5f5f5',
  shadow = true,
  shadowColor = '#000000',
  shadowOpacity = 0.45,
  disabled = false,
  ariaLabel = 'Flip card',
  className = ''
}) => {
  const reduce = useReducedMotion();
  const controlled = flipped !== undefined;
  const [inner, setInner] = useState(defaultFlipped);
  const [dragging, setDragging] = useState(false);
  const shown = controlled ? flipped : inner;
  const shownRef = useRef(shown);
  shownRef.current = shown;
  const rootRef = useRef<HTMLDivElement>(null);
  const grip = useRef<Grip | null>(null);
  const spin = useRef<AnimationPlaybackControls | null>(null);
  const target = useRef(shown ? 180 : 0);

  const turn = useMotionValue(shown ? 180 : 0);
  const tiltX = useSpring(0, TILT_SPRING);
  const tiltY = useSpring(0, TILT_SPRING);
  const lift = useSpring(1, LIFT_SPRING);
  const sheen = useSpring(0, LIFT_SPRING);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  const sumX = useTransform([turn, tiltX], ([t, x]: number[]) => t + x);
  const sumY = useTransform([turn, tiltY], ([t, y]: number[]) => t + y);
  const turnY = useMotionTemplate`perspective(${perspective}px) scale(${lift}) rotateX(${tiltX}deg) rotateY(${sumY}deg)`;
  const turnX = useMotionTemplate`perspective(${perspective}px) scale(${lift}) rotateY(${tiltY}deg) rotateX(${sumX}deg)`;
  const facing = useTransform(turn, t => Math.abs(Math.cos((t * Math.PI) / 180)));
  const spread = useTransform(facing, f => 0.08 + 0.92 * f);
  const shade = useTransform(facing, f => 0.1 + 0.9 * f * f);
  const gxPct = useMotionTemplate`${gx}%`;
  const gyPct = useMotionTemplate`${gy}%`;

  const settle = (to: number, velocity: number, instant: boolean) => {
    spin.current?.stop();
    target.current = to;
    if (instant || reduce) turn.jump(to);
    else spin.current = animate(turn, to, { type: 'spring', stiffness, damping, velocity, restDelta: 0.05 });
    const next = isBack(to);
    if (next === shownRef.current) return;
    shownRef.current = next;
    if (!controlled) setInner(next);
    onFlipChange?.(next);
  };
  const flip = (instant: boolean) => {
    const base = snap(turn.get());
    settle(isBack(base) ? base - 180 : base + 180, 0, instant);
  };
  const rest = () => {
    tiltX.set(0);
    tiltY.set(0);
    sheen.set(0);
    lift.set(1);
  };

  useEffect(() => {
    if (!controlled || isBack(target.current) === flipped) return;
    const base = target.current;
    spin.current?.stop();
    target.current = isBack(base) ? base - 180 : base + 180;
    if (reduce) turn.jump(target.current);
    else spin.current = animate(turn, target.current, { type: 'spring', stiffness, damping, restDelta: 0.05 });
     
  }, [flipped]);
  useEffect(() => () => spin.current?.stop(), []);
  useEffect(() => {
    if (disabled) rest();
     
  }, [disabled]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0 || grip.current) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    spin.current?.stop();
    grip.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      base: turn.get(),
      moved: false,
      slop: e.pointerType === 'touch' ? SLOP.coarse : SLOP.fine,
      hist: []
    };
    if (!reduce) lift.set(hoverScale);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = grip.current;
    if (g && g.id === e.pointerId) {
      const d = axis === 'x' ? e.clientY - g.y : e.clientX - g.x;
      if (!g.moved) {
        if (Math.abs(d) < g.slop || !draggable || reduce) return;
        g.moved = true;
        setDragging(true);
        tiltX.set(0);
        tiltY.set(0);
        sheen.set(0);
      }
      const span = dragDistance > 0 ? dragDistance : axis === 'x' ? height : width;
      const deg = g.base + (axis === 'x' ? -1 : 1) * (d / span) * 180;
      turn.set(deg);
      const now = performance.now();
      g.hist.push({ t: now, v: deg });
      while (g.hist.length > 2 && now - g.hist[0].t > HISTORY_MS) g.hist.shift();
      return;
    }
    if (!tilt || reduce || disabled || e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = clamp((e.clientX - r.left) / r.width, 0, 1);
    const py = clamp((e.clientY - r.top) / r.height, 0, 1);
    tiltX.set((0.5 - py) * 2 * tiltMax);
    tiltY.set((px - 0.5) * 2 * tiltMax);
    gx.set(px * 100);
    gy.set(py * 100);
    sheen.set(1);
  };
  const release = (e: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const g = grip.current;
    if (!g || g.id !== e.pointerId) return;
    grip.current = null;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setDragging(false);
    if (e.pointerType === 'touch' || !rootRef.current?.matches(':hover')) rest();
    if (!g.moved) {
      if (!cancelled && flipOnClick) flip(false);
      else settle(target.current, 0, false);
      return;
    }
    const here = turn.get();
    let velocity = 0;
    const a = g.hist[0];
    const b = g.hist[g.hist.length - 1];
    if (!cancelled && a && b && b.t > a.t && performance.now() - b.t < 60)
      velocity = ((b.v - a.v) / (b.t - a.t)) * 1000;
    const to = cancelled ? snap(g.base) : clamp(snap(here + velocity * FLING), snap(here) - 180, snap(here) + 180);
    settle(to, velocity, false);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    if (!e.repeat) flip(true);
  };
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!disabled && e.detail === 0) flip(true);
  };

  const rotorStyle = {
    transform: axis === 'x' ? turnX : turnY,
    '--fc-gx': gxPct,
    '--fc-gy': gyPct,
    '--fc-sheen': sheen
  } as MotionStyle;

  return (
    <>
          <style href="rb-flip-card" precedence="rb">{RB_FLIP_CARD_CSS}</style>
          <div
      ref={rootRef}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={shown}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={`rb-flip-card-flip-card${className ? ` ${className}` : ''}`}
      data-axis={axis}
      data-draggable={draggable && !disabled && !reduce ? '' : undefined}
      data-dragging={dragging ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-fade={reduce ? (shown ? 'back' : 'front') : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={e => release(e, false)}
      onPointerCancel={e => release(e, true)}
      onLostPointerCapture={e => release(e, true)}
      onPointerEnter={e => {
        if (!reduce && !disabled && e.pointerType !== 'touch') lift.set(hoverScale);
      }}
      onPointerLeave={() => {
        if (!grip.current) rest();
      }}
      onKeyDown={onKeyDown}
      onClick={onClick}
      onDragStart={e => e.preventDefault()}
      style={
        {
          '--fc-w': `${width}px`,
          '--fc-h': `${height}px`,
          '--fc-radius': `${radius}px`,
          '--fc-bg': background,
          '--fc-ink': color,
          '--fc-shadow': shadowColor,
          '--fc-shadow-o': shadowOpacity,
          '--fc-glare': glareOpacity
        } as CSSProperties
      }
    >
      {shadow ? (
        <motion.span
          className={cn("rb-flip-card-flip-card__shadow")}
          aria-hidden="true"
          style={axis === 'x' ? { scaleY: spread, opacity: shade } : { scaleX: spread, opacity: shade }}
        />
      ) : null}
      <motion.div className={cn("rb-flip-card-flip-card__rotor")} style={reduce ? undefined : rotorStyle}>
        <div className={cn("rb-flip-card-flip-card__face rb-flip-card-flip-card__face--front")} aria-hidden={shown} inert={shown}>
          {front}
          {glare ? <span className={cn("rb-flip-card-flip-card__glare")} aria-hidden="true" /> : null}
        </div>
        <div className={cn("rb-flip-card-flip-card__face rb-flip-card-flip-card__face--back")} aria-hidden={!shown} inert={!shown}>
          {back}
          {glare ? <span className={cn("rb-flip-card-flip-card__glare")} aria-hidden="true" /> : null}
        </div>
      </motion.div>
    </div>
        </>
  );
};

export { RbFlipCard };
export default RbFlipCard;
