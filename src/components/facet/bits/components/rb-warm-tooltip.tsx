"use client";
/* Vendored from DavidHDev/react-bits — Micro/WarmTooltip/WarmTooltip.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, {
  cloneElement,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode
} from 'react';
import { createPortal } from 'react-dom';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
  type MotionStyle,
  type Variants
} from 'motion/react';

import { cn } from '@/lib/utils';

const RB_WARM_TOOLTIP_CSS = `
.rb-warm-tooltip-warm-tooltip__trigger {
  --wt-surface: #f5f5f5;
  --wt-fuse-ms: 400ms;
  --wt-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  position: relative;
  display: inline-flex;
  vertical-align: middle;
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.rb-warm-tooltip-warm-tooltip__trigger[data-pressing] {
  user-select: none;
  -webkit-user-select: none;
}

.rb-warm-tooltip-warm-tooltip__fuse {
  position: absolute;
  left: 4px;
  right: 4px;
  height: 2px;
  border-radius: 1px;
  background: var(--wt-surface);
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left center;
  pointer-events: none;
  transition:
    transform 125ms var(--wt-ease-out),
    opacity 125ms var(--wt-ease-out);
}

.rb-warm-tooltip-warm-tooltip__fuse[data-side='top'] {
  top: -4px;
}

.rb-warm-tooltip-warm-tooltip__fuse[data-side='bottom'] {
  bottom: -4px;
}

.rb-warm-tooltip-warm-tooltip__fuse[data-side='left'],
.rb-warm-tooltip-warm-tooltip__fuse[data-side='right'] {
  top: 4px;
  bottom: 4px;
  left: auto;
  right: auto;
  width: 2px;
  height: auto;
  transform: scaleY(0);
  transform-origin: center top;
}

.rb-warm-tooltip-warm-tooltip__fuse[data-side='left'] {
  left: -4px;
}

.rb-warm-tooltip-warm-tooltip__fuse[data-side='right'] {
  right: -4px;
}

.rb-warm-tooltip-warm-tooltip__fuse[data-fuse='arming'] {
  opacity: 1;
  transform: scaleX(1);
  transition:
    transform var(--wt-fuse-ms) linear,
    opacity 80ms var(--wt-ease-out);
}

.rb-warm-tooltip-warm-tooltip__fuse[data-side='left'][data-fuse='arming'],
.rb-warm-tooltip-warm-tooltip__fuse[data-side='right'][data-fuse='arming'] {
  transform: scaleY(1);
}

.rb-warm-tooltip-warm-tooltip {
  --wt-surface: #f5f5f5;
  --wt-ink: #18181b;
  --wt-radius: 8px;
  --wt-font: 12.5px;
  --wt-origin: center bottom;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: block;
  pointer-events: none;
  font-family: inherit;
}

.rb-warm-tooltip-warm-tooltip__box {
  position: absolute;
  inset: 0;
  border-radius: var(--wt-radius);
  background: var(--wt-surface);
  color: var(--wt-ink);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.12),
    0 8px 24px -8px rgba(0, 0, 0, 0.45);
  transform-origin: var(--wt-origin);
}

.rb-warm-tooltip-warm-tooltip__layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rb-warm-tooltip-warm-tooltip__text {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: var(--wt-font);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.rb-warm-tooltip-warm-tooltip__kbd {
  display: inline-flex;
  align-items: center;
  height: 1.55em;
  padding: 0 0.45em;
  border-radius: 0.4em;
  background: color-mix(in srgb, var(--wt-ink) 9%, transparent);
  box-shadow: inset 0 -1px 0 color-mix(in srgb, var(--wt-ink) 12%, transparent);
  color: color-mix(in srgb, var(--wt-ink) 72%, transparent);
  font-family: inherit;
  font-size: 0.86em;
  font-weight: 500;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
}

.rb-warm-tooltip-warm-tooltip__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  margin: -4px;
  border-radius: 2px;
  background: var(--wt-surface);
  transform: rotate(45deg);
}

.rb-warm-tooltip-warm-tooltip__arrow[data-side='top'] {
  bottom: 1px;
}

.rb-warm-tooltip-warm-tooltip__arrow[data-side='bottom'] {
  top: 1px;
}

.rb-warm-tooltip-warm-tooltip__arrow[data-side='left'] {
  right: 1px;
}

.rb-warm-tooltip-warm-tooltip__arrow[data-side='right'] {
  left: 1px;
}

@media (prefers-contrast: more) {
  .rb-warm-tooltip-warm-tooltip__box {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wt-ink) 40%, transparent);
  }
}

`;

export type WarmTooltipSide = 'top' | 'bottom' | 'left' | 'right';
export type WarmTooltipSize = 'sm' | 'md' | 'lg';

export interface WarmTooltipGroupProps {
  delay?: number;
  warmWindow?: number;
  travel?: number;
  lean?: number;
  onWarmChange?: (warm: boolean) => void;
  children?: ReactNode;
}

export interface WarmTooltipGroupHandle {
  reset: () => void;
}

export interface WarmTooltipProps {
  content?: ReactNode;
  shortcut?: ReactNode;
  children?: ReactElement<Record<string, unknown>>;
  side?: WarmTooltipSide;
  delay?: number;
  warmWindow?: number;
  surfaceColor?: string;
  inkColor?: string;
  size?: WarmTooltipSize;
  radius?: number;
  gap?: number;
  arrow?: boolean;
  popDuration?: number;
  popScale?: number;
  popBlur?: number;
  showFuse?: boolean;
  longPress?: number;
  disabled?: boolean;
  className?: string;
}

type Phase = 'closed' | 'open' | 'closing';
type Mode = 'cold' | 'warm' | 'instant';
type Timer = ReturnType<typeof setTimeout> | undefined;
type Swap = { dir: number; across: boolean };

interface Payload {
  id: string;
  trigger: HTMLElement;
  content: ReactNode;
  shortcut?: ReactNode;
  side: WarmTooltipSide;
  gap: number;
  arrow: boolean;
  surfaceColor: string;
  inkColor: string;
  radius: number;
  font: number;
  px: number;
  py: number;
  popDuration: number;
  popScale: number;
  popBlur: number;
  warmWindow: number;
}

interface GroupState {
  state: Phase;
  current: Payload | null;
  mode: Mode | 'move';
  instant: boolean;
  warmUntil: number;
  warm: boolean;
  swap: Swap;
  closeTimer: Timer;
  leaveTimer: Timer;
  warmTimer: Timer;
}

interface GroupApi {
  id: string;
  delay: number;
  warmWindow: number;
  activeId: string | null;
  isWarm: () => boolean;
  show: (payload: Payload, mode: Mode) => void;
  hide: (tooltipId: string, instant?: boolean) => void;
  reset: () => void;
}

interface TriggerState {
  open: Timer;
  press: Timer;
  press0: { x: number; y: number; id: number } | null;
  suppressClick: boolean;
}

type TriggerProps = Required<Omit<WarmTooltipProps, 'delay' | 'warmWindow' | 'shortcut' | 'children' | 'content'>> &
  Pick<WarmTooltipProps, 'delay' | 'warmWindow' | 'shortcut' | 'children' | 'content'>;

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const LEAN_SPRING = { stiffness: 260, damping: 22, mass: 0.4 };
const FULL_LEAN_SPEED = 1200;
const SIGN: Record<WarmTooltipSide, number> = { top: 1, bottom: -1, left: -1, right: 1 };
const ORIGIN: Record<WarmTooltipSide, string> = {
  top: 'center bottom',
  bottom: 'center top',
  left: 'right center',
  right: 'left center'
};
const SIZES: Record<WarmTooltipSize, { font: number; px: number; py: number }> = {
  sm: { font: 11.5, px: 8, py: 5 },
  md: { font: 12.5, px: 10, py: 6 },
  lg: { font: 13.5, px: 12, py: 7 }
};
const MARGIN = 8;
const HOLD_SLOP = 10;
const SWAP = 0.14;
const SWAP_SHIFT = 10;
const RISE = 4;
const GRACE = 80;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
const horizontal = (side: WarmTooltipSide) => side === 'top' || side === 'bottom';

const anchorOf = (rect: DOMRect, side: WarmTooltipSide, gap: number): [number, number] => {
  if (side === 'top') return [rect.left + rect.width / 2, rect.top - gap];
  if (side === 'bottom') return [rect.left + rect.width / 2, rect.bottom + gap];
  if (side === 'left') return [rect.left - gap, rect.top + rect.height / 2];
  return [rect.right + gap, rect.top + rect.height / 2];
};

/* motion evaluates a useTransform callback during render to seed its initial
   value, so this runs on the server too — the viewport read has to be guarded or
   the whole component throws "window is not defined" during SSR. */
const layoutOf = (x: number, y: number, width: number, height: number, side: WarmTooltipSide) => {
  const vw = typeof window === 'undefined' ? 0 : window.innerWidth;
  const vh = typeof window === 'undefined' ? 0 : window.innerHeight;
  if (horizontal(side)) {
    const X = clamp(x - width / 2, MARGIN, Math.max(MARGIN, vw - MARGIN - width));
    return { X, Y: side === 'top' ? y - height : y };
  }
  const Y = clamp(y - height / 2, MARGIN, Math.max(MARGIN, vh - MARGIN - height));
  return { X: side === 'left' ? x - width : x, Y };
};

const LAYER: Variants = {
  enter: ({ dir, across }: Swap) => ({
    opacity: dir === 0 ? 1 : 0,
    x: across ? 0 : SWAP_SHIFT * dir,
    y: across ? SWAP_SHIFT * dir : 0,
    filter: dir === 0 ? 'blur(0px)' : 'blur(3px)'
  }),
  show: { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' },
  exit: ({ dir, across }: Swap) => ({
    opacity: 0,
    x: across ? 0 : -SWAP_SHIFT * dir,
    y: across ? -SWAP_SHIFT * dir : 0,
    filter: 'blur(3px)'
  })
};

const GroupContext = createContext<GroupApi | null>(null);

export const RbWarmTooltipGroup = forwardRef<WarmTooltipGroupHandle, WarmTooltipGroupProps>(function RbWarmTooltipGroup(
  { delay = 400, warmWindow = 300, travel = 320, lean = 0, onWarmChange, children },
  ref
) {
  const reduce = useReducedMotion();
  const id = useId();
  const [current, setCurrent] = useState<Payload | null>(null);
  const [state, setState] = useState<Phase>('closed');
  const st = useRef<GroupState>({
    state: 'closed',
    current: null,
    mode: 'cold',
    instant: false,
    warmUntil: -Infinity,
    warm: false,
    swap: { dir: 0, across: false },
    closeTimer: undefined,
    leaveTimer: undefined,
    warmTimer: undefined
  });
  const textRef = useRef<HTMLSpanElement | null>(null);
  const api = useRef<{
    show: (payload: Payload, mode: Mode) => void;
    hide: (tooltipId: string, instant?: boolean) => void;
  }>({
    show: () => {},
    hide: () => {}
  });

  const ax = useMotionValue(0);
  const ay = useMotionValue(0);
  const w = useMotionValue(0);
  const h = useMotionValue(0);
  const presence = useMotionValue(0);
  const vx = useVelocity(ax);
  const vy = useVelocity(ay);
  const speed = useTransform([vx, vy], ([a, b]: number[]) =>
    st.current.current && !horizontal(st.current.current.side) ? b : a
  );
  const leanUnit = useSpring(
    useTransform(speed, [-FULL_LEAN_SPEED, 0, FULL_LEAN_SPEED], [1, 0, -1], { clamp: true }),
    LEAN_SPRING
  );
  const leanDeg = reduce ? 0 : lean;

  const place = useTransform([ax, ay, w, h], ([x, y, width, height]: number[]) => {
    const side = st.current.current ? st.current.current.side : 'top';
    const { X, Y } = layoutOf(x, y, width, height, side);
    return `translate(${X}px, ${Y}px)`;
  });
  const arrowAt = useTransform([ax, ay, w, h], ([x, y, width, height]: number[]) => {
    const side = st.current.current ? st.current.current.side : 'top';
    const { X, Y } = layoutOf(x, y, width, height, side);
    return horizontal(side) ? clamp(x - X, 10, width - 10) : clamp(y - Y, 10, height - 10);
  });
  const pop = useTransform([presence, leanUnit], ([p, l]: number[]) => {
    const c = st.current.current;
    const side = c ? c.side : 'top';
    if (reduce || !c) return 'none';
    const scale = c.popScale + (1 - c.popScale) * p;
    const rise = (1 - p) * RISE * SIGN[side] * (side === 'left' ? -1 : 1);
    const rotate = l * leanDeg * SIGN[side];
    const tx = horizontal(side) ? 0 : rise;
    const ty = horizontal(side) ? rise : 0;
    return `translate(${tx}px, ${ty}px) scale(${scale}) rotate(${rotate}deg)`;
  });
  const blur = useTransform(presence, p => {
    const c = st.current.current;
    return reduce || !c ? 'none' : `blur(${c.popBlur * (1 - p)}px)`;
  });

  const isWarm = () => st.current.state !== 'closed' || now() < st.current.warmUntil;
  const notify = () => {
    const next = isWarm();
    if (next === st.current.warm) return;
    st.current.warm = next;
    onWarmChange?.(next);
  };

  const finishClose = () => {
    st.current.state = 'closed';
    st.current.current = null;
    setState('closed');
    setCurrent(null);
    notify();
  };

  api.current.show = (payload: Payload, mode: Mode) => {
    clearTimeout(st.current.closeTimer);
    clearTimeout(st.current.leaveTimer);
    const prev = st.current.current;
    const fresh = st.current.state === 'closed';
    if (prev && prev.id !== payload.id) {
      const [px, py] = anchorOf(prev.trigger.getBoundingClientRect(), prev.side, prev.gap);
      const [nx, ny] = anchorOf(payload.trigger.getBoundingClientRect(), payload.side, payload.gap);
      const across = !horizontal(payload.side);
      st.current.swap = { dir: Math.sign(across ? ny - py : nx - px) || 1, across };
    } else {
      st.current.swap = { dir: 0, across: !horizontal(payload.side) };
    }
    st.current.mode = fresh ? mode : mode === 'instant' ? 'instant' : 'move';
    st.current.instant = mode === 'instant';
    st.current.current = payload;
    st.current.state = 'open';
    setCurrent(payload);
    setState('open');
    notify();
  };

  const beginClose = (instant: boolean) => {
    const c = st.current.current;
    if (!c || st.current.state !== 'open') return;
    st.current.state = 'closing';
    setState('closing');
    st.current.warmUntil = now() + c.warmWindow;
    clearTimeout(st.current.warmTimer);
    st.current.warmTimer = setTimeout(notify, c.warmWindow + 1);
    if (instant) {
      presence.jump(0);
      finishClose();
      return;
    }
    const closeMs = Math.round(c.popDuration * 0.8);
    animate(presence, 0, { duration: closeMs / 1000, ease: EASE_OUT });
    st.current.closeTimer = setTimeout(finishClose, closeMs);
  };

  api.current.hide = (tooltipId: string, instant?: boolean) => {
    const c = st.current.current;
    if (!c || c.id !== tooltipId || st.current.state !== 'open') return;
    clearTimeout(st.current.leaveTimer);
    if (instant || st.current.instant) {
      beginClose(true);
      return;
    }
    st.current.leaveTimer = setTimeout(() => beginClose(false), GRACE);
  };

  const group = useMemo(
    () => ({
      id,
      delay,
      warmWindow,
      activeId: current ? current.id : null,
      isWarm,
      show: (payload: Payload, mode: Mode) => api.current.show(payload, mode),
      hide: (tooltipId: string, instant?: boolean) => api.current.hide(tooltipId, instant),
      reset: () => {
        if (st.current.current) api.current.hide(st.current.current.id, true);
        st.current.warmUntil = -Infinity;
        clearTimeout(st.current.warmTimer);
        notify();
      }
    }),
     
    [id, delay, warmWindow, current]
  );
  useImperativeHandle(ref, () => ({ reset: group.reset }), [group]);

  useLayoutEffect(() => {
    const c = st.current.current;
    const text = textRef.current;
    if (!c || !text || state !== 'open') return;
    const [tx, ty] = anchorOf(c.trigger.getBoundingClientRect(), c.side, c.gap);
    const tw = text.offsetWidth + c.px * 2;
    const th = text.offsetHeight + c.py * 2;
    const mode = st.current.mode;
    if (mode === 'move' && !reduce && travel > 0) {
      const spring = { type: 'spring' as const, duration: travel / 1000, bounce: 0.1 };
      animate(ax, tx, spring);
      animate(ay, ty, spring);
      animate(w, tw, spring);
      animate(h, th, spring);
      animate(presence, 1, { duration: 0.12, ease: EASE_OUT });
      return;
    }
    ax.jump(tx);
    ay.jump(ty);
    w.jump(tw);
    h.jump(th);
    if (mode === 'cold') {
      presence.jump(0);
      animate(presence, 1, { duration: c.popDuration / 1000, ease: EASE_OUT });
    } else {
      presence.jump(1);
    }
     
  }, [current, state]);

  useEffect(() => {
    if (state === 'closed') return undefined;
    let raf = 0;
    const follow = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const c = st.current.current;
        if (!c) return;
        const [tx, ty] = anchorOf(c.trigger.getBoundingClientRect(), c.side, c.gap);
        ax.jump(tx);
        ay.jump(ty);
      });
    };
    const onHidden = () => {
      if (document.visibilityState === 'hidden' && st.current.current) api.current.hide(st.current.current.id, true);
    };
    window.addEventListener('scroll', follow, { capture: true, passive: true });
    window.addEventListener('resize', follow);
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', follow, { capture: true });
      window.removeEventListener('resize', follow);
      document.removeEventListener('visibilitychange', onHidden);
    };
     
  }, [state]);

  useEffect(
    () => () => {
      clearTimeout(st.current.closeTimer);
      clearTimeout(st.current.leaveTimer);
      clearTimeout(st.current.warmTimer);
    },
    []
  );

  const canPortal = typeof document !== 'undefined';
  const side = current ? current.side : 'top';
  const arrowStyle = horizontal(side) ? { left: arrowAt } : { top: arrowAt };

  return (
    <GroupContext.Provider value={group}>
      {children}
      {state !== 'closed' && current && canPortal
        ? createPortal(
            <motion.span
              id={id}
              role="tooltip"
              className={cn("rb-warm-tooltip-warm-tooltip")}
              data-side={side}
              style={
                {
                  transform: place,
                  width: w,
                  height: h,
                  '--wt-surface': current.surfaceColor,
                  '--wt-ink': current.inkColor,
                  '--wt-radius': `${current.radius}px`,
                  '--wt-font': `${current.font}px`,
                  '--wt-origin': ORIGIN[side]
                } as MotionStyle
              }
            >
              <motion.span className={cn("rb-warm-tooltip-warm-tooltip__box")} style={{ transform: pop, opacity: presence, filter: blur }}>
                <AnimatePresence initial={false} custom={st.current.swap}>
                  <motion.span
                    key={current.id}
                    className={cn("rb-warm-tooltip-warm-tooltip__layer")}
                    custom={st.current.swap}
                    variants={LAYER}
                    initial="enter"
                    animate="show"
                    exit="exit"
                    transition={{ duration: reduce ? 0 : SWAP, ease: EASE_OUT }}
                  >
                    <span
                      ref={el => {
                        if (el) textRef.current = el;
                      }}
                      className={cn("rb-warm-tooltip-warm-tooltip__text")}
                    >
                      {current.content}
                      {current.shortcut ? <kbd className={cn("rb-warm-tooltip-warm-tooltip__kbd")}>{current.shortcut}</kbd> : null}
                    </span>
                  </motion.span>
                </AnimatePresence>
                {current.arrow ? (
                  <motion.span className={cn("rb-warm-tooltip-warm-tooltip__arrow")} data-side={side} style={arrowStyle} aria-hidden="true" />
                ) : null}
              </motion.span>
            </motion.span>,
            document.body
          )
        : null}
    </GroupContext.Provider>
  );
});

const Trigger: React.FC<TriggerProps> = ({
  content,
  shortcut,
  children,
  side,
  delay,
  warmWindow,
  surfaceColor,
  inkColor,
  size,
  radius,
  gap,
  arrow,
  popDuration,
  popScale,
  popBlur,
  showFuse,
  longPress,
  disabled,
  className
}) => {
  const group = useContext(GroupContext) as GroupApi;
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [fuse, setFuse] = useState<'idle' | 'arming'>('idle');
  const [pressing, setPressing] = useState(false);
  const t = useRef<TriggerState>({ open: undefined, press: undefined, press0: null, suppressClick: false });
  const preset = SIZES[size] || SIZES.md;
  const coldDelay = delay ?? group.delay;
  const active = group.activeId === id;

  const payload = (): Payload => ({
    id,
    trigger: triggerRef.current as HTMLSpanElement,
    content,
    shortcut,
    side,
    gap,
    arrow,
    surfaceColor,
    inkColor,
    radius,
    font: preset.font,
    px: preset.px,
    py: preset.py,
    popDuration,
    popScale,
    popBlur,
    warmWindow: warmWindow ?? group.warmWindow
  });

  const hide = (instant?: boolean) => {
    clearTimeout(t.current.open);
    setFuse('idle');
    group.hide(id, instant);
  };

  const arm = () => {
    if (group.isWarm()) {
      group.show(payload(), 'warm');
      return;
    }
    setFuse('arming');
    t.current.open = setTimeout(() => {
      setFuse('idle');
      group.show(payload(), 'cold');
    }, coldDelay);
  };

  const cancelPress = () => {
    clearTimeout(t.current.press);
    if (!t.current.press0) return;
    t.current.press0 = null;
    setPressing(false);
    setFuse('idle');
  };

  useEffect(() => {
    if (disabled) {
      cancelPress();
      hide(true);
    }
     
  }, [disabled]);

  useEffect(() => {
    if (!active) return undefined;
    const onOutside = (e: PointerEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) hide(false);
    };
    document.addEventListener('pointerdown', onOutside, true);
    return () => document.removeEventListener('pointerdown', onOutside, true);
     
  }, [active]);

  useEffect(
    () => () => {
      clearTimeout(t.current.open);
      clearTimeout(t.current.press);
    },
    []
  );

  const handlers = disabled
    ? {}
    : {
        onPointerEnter: (e: React.PointerEvent<HTMLSpanElement>) => {
          if (e.pointerType !== 'touch' && e.buttons === 0) arm();
        },
        onPointerLeave: (e: React.PointerEvent<HTMLSpanElement>) => {
          if (e.pointerType !== 'touch') hide(false);
        },
        onPointerDown: (e: React.PointerEvent<HTMLSpanElement>) => {
          if (e.pointerType === 'mouse') {
            hide(false);
            return;
          }
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {}
          t.current.press0 = { x: e.clientX, y: e.clientY, id: e.pointerId };
          setPressing(true);
          setFuse('arming');
          t.current.press = setTimeout(() => {
            t.current.suppressClick = true;
            t.current.press0 = null;
            setPressing(false);
            setFuse('idle');
            group.show(payload(), 'cold');
          }, longPress);
        },
        onPointerMove: (e: React.PointerEvent<HTMLSpanElement>) => {
          const p = t.current.press0;
          if (p && p.id === e.pointerId && Math.hypot(e.clientX - p.x, e.clientY - p.y) > HOLD_SLOP) cancelPress();
        },
        onPointerUp: cancelPress,
        onPointerCancel: cancelPress,
        onContextMenu: (e: React.MouseEvent<HTMLSpanElement>) => {
          if (t.current.press0) e.preventDefault();
        },
        onClickCapture: (e: React.MouseEvent<HTMLSpanElement>) => {
          if (!t.current.suppressClick) return;
          t.current.suppressClick = false;
          e.preventDefault();
          e.stopPropagation();
        },
        onFocus: (e: React.FocusEvent<HTMLSpanElement>) => {
          if ((e.target as HTMLElement).matches?.(':focus-visible')) group.show(payload(), 'instant');
        },
        onBlur: () => hide(true),
        onKeyDown: (e: React.KeyboardEvent<HTMLSpanElement>) => {
          if (e.key === 'Escape') hide(true);
        }
      };

  /* Without a child element there is nothing to attach to — render the wrapper
     alone rather than crashing in cloneElement. */
  const child = React.isValidElement(children) ? children : null;
  const described = child ? ((child.props as Record<string, unknown>)['aria-describedby'] as string | undefined) : undefined;

  return (
    <span
      ref={triggerRef}
      className={`rb-warm-tooltip-warm-tooltip__trigger${className ? ` ${className}` : ''}`}
      data-pressing={pressing ? '' : undefined}
      style={
        {
          '--wt-surface': surfaceColor,
          '--wt-fuse-ms': `${t.current.press0 ? longPress : coldDelay}ms`
        } as CSSProperties
      }
      {...handlers}
    >
      {child ? cloneElement(child, { 'aria-describedby': active ? group.id : described }) : null}
      {showFuse ? <span className={cn("rb-warm-tooltip-warm-tooltip__fuse")} data-side={side} data-fuse={fuse} aria-hidden="true" /> : null}
    </span>
  );
};

const RbWarmTooltip: React.FC<WarmTooltipProps> = ({
  content,
  shortcut,
  children,
  side = 'top',
  delay,
  warmWindow,
  surfaceColor = '#f5f5f5',
  inkColor = '#18181b',
  size = 'md',
  radius = 8,
  gap = 8,
  arrow = true,
  popDuration = 160,
  popScale = 0.94,
  popBlur = 4,
  showFuse = false,
  longPress = 500,
  disabled = false,
  className = ''
}) => {
  const context = useContext(GroupContext);
  const props = {
    content,
    shortcut,
    children,
    side,
    delay,
    warmWindow,
    surfaceColor,
    inkColor,
    size,
    radius,
    gap,
    arrow,
    popDuration,
    popScale,
    popBlur,
    showFuse,
    longPress,
    disabled,
    className
  };
  if (context) return <>
          <style href="rb-warm-tooltip" precedence="rb">{RB_WARM_TOOLTIP_CSS}</style>
          <Trigger {...props} />
        </>;
  return (
    <>
          <style href="rb-warm-tooltip" precedence="rb">{RB_WARM_TOOLTIP_CSS}</style>
          <RbWarmTooltipGroup delay={delay} warmWindow={warmWindow}>
      <Trigger {...props} />
    </RbWarmTooltipGroup>
        </>
  );
};

export { RbWarmTooltip };
export default RbWarmTooltip;
