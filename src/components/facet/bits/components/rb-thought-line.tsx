"use client";
/* Vendored from DavidHDev/react-bits — Micro/ThoughtLine/ThoughtLine.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { animate, useReducedMotion, type AnimationPlaybackControls } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, SparklesIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

const RB_THOUGHT_LINE_CSS = `
.rb-thought-line-thought-line {
  --tl-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --tl-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --tl-font: 16px;
  --tl-color: currentColor;
  --tl-glyph: currentColor;
  --tl-settle: 350ms;
  --tl-blur: 2px;
  --tl-shimmer: 1.8s;
  --tl-done: 0.75;
  --tl-timer: 0.55;

  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  color: var(--tl-color);
  font-family: inherit;
  font-size: var(--tl-font);
  font-weight: 500;
  line-height: 1.2;
}

.rb-thought-line-thought-line__head {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  white-space: nowrap;
  outline: none;
  cursor: default;
}

.rb-thought-line-thought-line__head[data-toggle] {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.rb-thought-line-thought-line__glyph {
  display: inline-flex;
  flex: none;
  width: 1.1em;
  height: 1.1em;
  margin-right: 0.2em;
  color: var(--tl-glyph);
}

.rb-thought-line-thought-line__glyph svg {
  display: block;
  width: 100%;
  height: 100%;
}

.rb-thought-line-thought-line__dot {
  width: 0.5em;
  height: 0.5em;
  margin: auto;
  border-radius: 50%;
  background: currentColor;
}

.rb-thought-line-thought-line__label {
  display: inline-grid;
}

.rb-thought-line-thought-line__text {
  grid-area: 1 / 1;
  width: max-content;
  opacity: 0;
  filter: blur(var(--tl-blur));
  transition:
    opacity var(--tl-settle) var(--tl-ease-out),
    filter var(--tl-settle) var(--tl-ease-out);
}

.rb-thought-line-thought-line__text[data-active] {
  opacity: 1;
  filter: blur(0);
}

.rb-thought-line-thought-line__text--done[data-active] {
  opacity: var(--tl-done);
}

.rb-thought-line-thought-line__breath {
  display: inline-block;
}

.rb-thought-line-thought-line[data-working] .rb-thought-line-thought-line__breath[data-shimmer] {
  background: linear-gradient(
    100deg,
    color-mix(in srgb, var(--tl-color) 50%, transparent) 30%,
    var(--tl-color) 50%,
    color-mix(in srgb, var(--tl-color) 50%, transparent) 70%
  );
  background-size: 250% 100%;
  background-position: 125% 0;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: rb-thought-line-thought-line-shimmer var(--tl-shimmer) linear infinite;
}

@keyframes rb-thought-line-thought-line-shimmer {
  to {
    background-position: -125% 0;
  }
}

.rb-thought-line-thought-line__timer {
  font-variant-numeric: tabular-nums;
  opacity: var(--tl-timer);
  transition:
    opacity var(--tl-settle) ease,
    transform var(--tl-settle) var(--tl-ease-in-out);
}

.rb-thought-line-thought-line__timer[data-done] {
  opacity: var(--tl-done);
}

.rb-thought-line-thought-line__chevron {
  display: inline-flex;
  margin-left: 0.1em;
  opacity: 0;
  transition:
    opacity 200ms ease,
    transform 200ms var(--tl-ease-out);
}

.rb-thought-line-thought-line__chevron[data-on] {
  opacity: 0.55;
}

.rb-thought-line-thought-line[data-open] .rb-thought-line-thought-line__chevron {
  transform: rotate(180deg);
}

.rb-thought-line-thought-line__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.rb-thought-line-thought-line__trace {
  display: grid;
  grid-template-rows: 0fr;
  width: 0;
  min-width: 100%;
  transition: grid-template-rows var(--tl-settle) var(--tl-ease-out);
}

.rb-thought-line-thought-line__trace[data-open] {
  grid-template-rows: 1fr;
}

.rb-thought-line-thought-line__fold {
  min-height: 0;
  overflow-x: visible;
  overflow-y: clip;
}

.rb-thought-line-thought-line__steps {
  display: flex;
  flex-direction: column;
  gap: 0.45em;
  width: max-content;
  padding: 0.6em 0 0.2em 1.6em;
  font-size: 0.875em;
  font-weight: 400;
  white-space: nowrap;
}

.rb-thought-line-thought-line__step {
  display: flex;
  align-items: center;
  gap: 0.5em;
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 200ms var(--tl-ease-out),
    transform 200ms var(--tl-ease-out);
}

@starting-style {
  .rb-thought-line-thought-line__step {
    opacity: 0;
    transform: translateY(-4px);
  }
}

.rb-thought-line-thought-line__mark {
  display: inline-grid;
  flex: none;
  place-items: center;
  width: 1em;
  height: 1em;
  opacity: 0.55;
}

.rb-thought-line-thought-line__pulse {
  display: block;
  width: 0.4em;
  height: 0.4em;
  border-radius: 50%;
  background: currentColor;
  animation: rb-thought-line-thought-line-pulse 1.6s var(--tl-ease-in-out) infinite;
}

@keyframes rb-thought-line-thought-line-pulse {
  0%,
  100% {
    opacity: 0.55;
  }

  50% {
    opacity: 1;
  }
}

.rb-thought-line-thought-line__step-text {
  transition: opacity var(--tl-settle) ease;
}

.rb-thought-line-thought-line__step[data-done] .rb-thought-line-thought-line__step-text {
  opacity: 0.55;
}

@media (prefers-reduced-motion: reduce) {
  .rb-thought-line-thought-line__text {
    filter: none !important;
    transition: opacity var(--tl-settle) ease;
  }

  .rb-thought-line-thought-line__timer {
    transition: opacity var(--tl-settle) ease;
  }

  .rb-thought-line-thought-line__step {
    transform: none !important;
    transition: opacity 200ms ease;
  }

  .rb-thought-line-thought-line__pulse {
    /* Off, not merely slowed: this keyframe loops forever, so leaving it
       running at a longer duration still leaves a permanent pulse on screen. */
    animation: none;
    opacity: 0.55;
  }
}

`;

export type ThoughtLineGlyph = 'sparkle' | 'dot' | 'none' | ReactNode;

export interface ThoughtLineProps {
  label?: string;
  doneLabel?: string;
  renderLabel?: (text: string, working: boolean) => ReactNode;
  glyph?: ThoughtLineGlyph;
  steps?: string[];
  collapsible?: boolean;
  collapseOnSettle?: boolean;
  color?: string;
  glyphColor?: string;
  fontSize?: number;
  breathPeriod?: number;
  breathDepth?: number;
  shimmer?: boolean;
  shimmerDuration?: number;
  settleDuration?: number;
  settleBlur?: number;
  working?: boolean;
  settleAfter?: number;
  elapsed?: number;
  showTimer?: boolean;
  onSettle?: (seconds: number) => void;
  className?: string;
  style?: CSSProperties;
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.77, 0, 0.175, 1];
const GLYPH_DONE = 0.55;
const EMPTY_STEPS: string[] = [];

const fmt = (ds: number) =>
  ds < 600 ? `${(ds / 10).toFixed(1)}s` : `${Math.floor(ds / 600)}m ${((ds % 600) / 10).toFixed(1)}s`;
const spoken = (ds: number) =>
  ds < 600
    ? `${(ds / 10).toFixed(1)} seconds`
    : `${Math.floor(ds / 600)} minutes ${((ds % 600) / 10).toFixed(1)} seconds`;

const RbThoughtLine: React.FC<ThoughtLineProps> = ({
  label = 'Thinking…',
  doneLabel = '',
  renderLabel,
  glyph = 'sparkle',
  steps = EMPTY_STEPS,
  collapsible = true,
  collapseOnSettle = true,
  color = 'currentColor',
  glyphColor = '',
  fontSize = 16,
  breathPeriod = 1.6,
  breathDepth = 0.45,
  shimmer = true,
  shimmerDuration = 1.8,
  settleDuration = 350,
  settleBlur = 2,
  working = true,
  settleAfter = 0,
  elapsed,
  showTimer = true,
  onSettle,
  className = '',
  style
}) => {
  const reduce = useReducedMotion();
  const [autoSettled, setAutoSettled] = useState(false);
  const [open, setOpen] = useState(true);
  const isWorking = working && !autoSettled;
  const doneText = doneLabel || (showTimer ? 'Thought for' : 'Done thinking');
  const hasTrace = steps.length > 0;
  /* prefers-reduced-motion has to gate the animation itself, not soften it.
   * The breath and glyph are driven by motion/react's animate(), which compiles
   * down to element.animate(), so the @media block above cannot reach them —
   * an opacity pulse that never settles is exactly what the setting is asking
   * to be removed. At depth 0 there is no loop to start, and the effect below
   * paints the resting opacity directly instead of creating an Animation. */
  const depth = reduce ? 0 : breathDepth;
  const period = breathPeriod;
  const trough = 1 - depth;
  const sheen = shimmer && !reduce;

  const glyphRef = useRef<HTMLSpanElement>(null);
  const breathRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);
  const stackRef = useRef<HTMLSpanElement>(null);
  const workRef = useRef<HTMLSpanElement>(null);
  const doneRef = useRef<HTMLSpanElement>(null);
  const dsRef = useRef(0);
  const prevWorking = useRef(isWorking);
  const latest = useRef<{ onSettle?: (seconds: number) => void }>({});
  latest.current = { onSettle };
  const [announce, setAnnounce] = useState(label);

  useEffect(() => {
    if (working) setAutoSettled(false);
  }, [working]);
  useEffect(() => {
    if (isWorking) setOpen(true);
    else if (collapseOnSettle) setOpen(false);
  }, [isWorking, collapseOnSettle]);

  useEffect(() => {
    const glyphEl = glyphRef.current;
    const breathEl = breathRef.current;
    if (!breathEl) return undefined;
    const s = settleDuration / 1000;
    const loop = (el: HTMLElement, delay: number) =>
      animate(el, { opacity: [trough, 1, trough] }, { duration: period, ease: EASE_IN_OUT, repeat: Infinity, delay });
    let cancelled = false;
    const running: AnimationPlaybackControls[] = [];
    if (reduce) {
      // No Animation at all: write the end state the loop would have settled on
      // and leave the DOM alone. Nothing is running, so there is nothing to stop.
      breathEl.style.opacity = '1';
      if (glyphEl) glyphEl.style.opacity = isWorking ? '1' : String(GLYPH_DONE);
    } else if (isWorking) {
      if (depth > 0) {
        if (sheen) running.push(animate(breathEl, { opacity: 1 }, { duration: 0.2, ease: EASE_OUT }));
        if (glyphEl) {
          const lead = animate(glyphEl, { opacity: trough }, { duration: 0.2, ease: EASE_OUT });
          running.push(lead);
          lead.then(() => {
            if (cancelled) return;
            running.push(loop(glyphEl, 0));
            if (!sheen) running.push(loop(breathEl, 0.14));
          });
        } else if (!sheen) {
          running.push(loop(breathEl, 0.14));
        }
      } else {
        if (glyphEl) running.push(animate(glyphEl, { opacity: 1 }, { duration: 0.2, ease: EASE_OUT }));
        running.push(animate(breathEl, { opacity: 1 }, { duration: 0.2, ease: EASE_OUT }));
      }
    } else {
      if (glyphEl) running.push(animate(glyphEl, { opacity: GLYPH_DONE }, { duration: s, ease: EASE_OUT }));
      running.push(animate(breathEl, { opacity: 1 }, { duration: s, ease: EASE_OUT }));
    }
    return () => {
      cancelled = true;
      running.forEach(a => a.stop());
      // clear whatever the reduced-motion branch wrote so switching the setting
      // back on does not start from a stale inline opacity
      breathEl.style.opacity = '';
      if (glyphEl) glyphEl.style.opacity = '';
    };
  }, [isWorking, period, depth, trough, settleDuration, glyph, sheen, reduce]);

  const paint = (ds: number) => {
    dsRef.current = ds;
    if (timerRef.current) timerRef.current.textContent = fmt(ds);
  };
  useLayoutEffect(() => {
    if (elapsed != null) {
      paint(Math.round(elapsed * 10));
      return undefined;
    }
    if (!isWorking) return undefined;
    const startedAt = performance.now();
    paint(0);
    const id = setInterval(() => {
      const ds = Math.floor((performance.now() - startedAt) / 100);
      paint(ds);
      if (settleAfter > 0 && ds >= Math.round(settleAfter * 10)) setAutoSettled(true);
    }, 100);
    return () => clearInterval(id);
  }, [isWorking, elapsed, settleAfter]);

  useLayoutEffect(() => {
    const t = timerRef.current;
    const stack = stackRef.current;
    if (!t || !stack) return undefined;
    const place = (glide: boolean) => {
      const active = isWorking ? workRef.current : doneRef.current;
      if (!active) return;
      const shift = active.offsetWidth - stack.offsetWidth;
      if (!glide) t.style.transition = 'none';
      t.style.transform = `translateX(${shift}px)`;
      if (!glide) {
        void t.offsetWidth;
        t.style.transition = '';
      }
    };
    place(prevWorking.current !== isWorking);
    prevWorking.current = isWorking;
    const ro = new ResizeObserver(() => place(false));
    if (workRef.current) ro.observe(workRef.current);
    if (doneRef.current) ro.observe(doneRef.current);
    return () => ro.disconnect();
  }, [isWorking, label, doneText, fontSize, showTimer]);

  useEffect(() => {
    if (isWorking) {
      setAnnounce(label);
      return;
    }
    setAnnounce(showTimer ? `${doneText} ${spoken(dsRef.current)}` : doneText);
    latest.current.onSettle?.(dsRef.current / 10);
     
  }, [isWorking]);

  const toggle = hasTrace && collapsible;
  const head = (
    <>
      {glyph !== 'none' ? (
        <span ref={glyphRef} className={cn("rb-thought-line-thought-line__glyph")} aria-hidden="true">
          {glyph === 'sparkle' ? (
            <HugeiconsIcon icon={SparklesIcon} size="100%" strokeWidth={2} />
          ) : glyph === 'dot' ? (
            <span className={cn("rb-thought-line-thought-line__dot")} />
          ) : (
            glyph
          )}
        </span>
      ) : null}
      <span ref={stackRef} className={cn("rb-thought-line-thought-line__label")} aria-hidden="true">
        <span ref={workRef} className={cn("rb-thought-line-thought-line__text")} data-active={isWorking ? '' : undefined}>
          <span ref={breathRef} className={cn("rb-thought-line-thought-line__breath")} data-shimmer={sheen ? '' : undefined}>
            {renderLabel ? renderLabel(label, true) : label}
          </span>
        </span>
        <span
          ref={doneRef}
          className={cn("rb-thought-line-thought-line__text rb-thought-line-thought-line__text--done")}
          data-active={isWorking ? undefined : ''}
        >
          {renderLabel ? renderLabel(doneText, false) : doneText}
        </span>
      </span>
      {showTimer ? (
        <span ref={timerRef} className={cn("rb-thought-line-thought-line__timer")} data-done={isWorking ? undefined : ''} aria-hidden="true">
          0.0s
        </span>
      ) : null}
      {collapsible ? (
        <span className={cn("rb-thought-line-thought-line__chevron")} data-on={hasTrace ? '' : undefined} aria-hidden="true">
          <HugeiconsIcon icon={ArrowDown01Icon} size="1em" strokeWidth={2.2} />
        </span>
      ) : null}
      <span className={cn("rb-thought-line-thought-line__sr")} role="status">
        {announce}
      </span>
    </>
  );

  return (
    <>
          <style href="rb-thought-line" precedence="rb">{RB_THOUGHT_LINE_CSS}</style>
          <div
      className={`rb-thought-line-thought-line${className ? ` ${className}` : ''}`}
      data-working={isWorking ? '' : undefined}
      data-open={open && hasTrace ? '' : undefined}
      style={
        {
          '--tl-font': `${fontSize}px`,
          '--tl-color': color,
          '--tl-glyph': glyphColor || color,
          '--tl-settle': `${settleDuration}ms`,
          '--tl-blur': `${settleBlur}px`,
          '--tl-shimmer': `${shimmerDuration}s`,
          ...style
        } as CSSProperties
      }
    >
      {collapsible ? (
        <button
          type="button"
          className={cn("rb-thought-line-thought-line__head")}
          data-toggle={toggle ? '' : undefined}
          aria-expanded={toggle ? open : undefined}
          tabIndex={toggle ? 0 : -1}
          onClick={() => {
            if (toggle) setOpen(v => !v);
          }}
        >
          {head}
        </button>
      ) : (
        <div className={cn("rb-thought-line-thought-line__head")}>{head}</div>
      )}
      {hasTrace ? (
        <div className={cn("rb-thought-line-thought-line__trace")} data-open={open ? '' : undefined} aria-hidden={!open}>
          <div className={cn("rb-thought-line-thought-line__fold")}>
            <div className={cn("rb-thought-line-thought-line__steps")}>
              {steps.map((text, i) => {
                const done = !isWorking || i < steps.length - 1;
                return (
                  <div key={`${i}-${text}`} className={cn("rb-thought-line-thought-line__step")} data-done={done ? '' : undefined}>
                    <span className={cn("rb-thought-line-thought-line__mark")} aria-hidden="true">
                      {done ? (
                        <HugeiconsIcon icon={Tick02Icon} size="1em" strokeWidth={2.5} />
                      ) : (
                        <i className={cn("rb-thought-line-thought-line__pulse")} />
                      )}
                    </span>
                    <span className={cn("rb-thought-line-thought-line__step-text")}>{text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
        </>
  );
};

export { RbThoughtLine };
export default RbThoughtLine;
