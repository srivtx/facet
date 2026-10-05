/* Vendored from DavidHDev/react-bits — src/ts-default/TextAnimations/SplitFlapText.tsx (MIT + Commons Clause, see bits/ATTRIBUTION.md). Exports renamed with the Rb prefix to avoid API collision. Companion SplitFlapText.css is inlined below with every class/keyframe/custom-property namespaced to `rb-split-flap-text-*`. */

"use client";

import { CSSProperties, HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';

const RB_SPLIT_FLAP_TEXT_CSS = String.raw`
.rb-split-flap-text-split-flap-text{
  display: inline-flex;
  align-items: center;
  gap: var(--rb-split-flap-text-split-flap-gap, 6px);
  color: var(--rb-split-flap-text-color, #f8fafc);
  font-family: 'SFMono-Regular', 'Roboto Mono', 'Cascadia Code', 'Liberation Mono', Menlo, monospace;
  font-size: var(--rb-split-flap-text-split-flap-font-size, 52px);
  font-weight: 760;
  line-height: 1;
  letter-spacing: 0.035em;
  white-space: pre;
  user-select: none;
  font-variant-numeric: tabular-nums;
}

.rb-split-flap-text-split-flap-text__tile{
  position: relative;
  width: 0.78em;
  height: 1.08em;
  overflow: hidden;
  border-radius: var(--rb-split-flap-text-split-flap-radius, 8px);
  background:
    radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.16), transparent 44%),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--rb-split-flap-text-split-flap-tile-color, #111827) 82%, white),
      var(--rb-split-flap-text-split-flap-tile-color, #111827)
    );
  box-shadow:
    0 0.035em 0.08em rgba(255, 255, 255, 0.08) inset,
    0 -0.05em 0.1em rgba(0, 0, 0, 0.38) inset,
    0 0.16em 0.38em rgba(0, 0, 0, 0.28);
  perspective: 520px;
  transform-style: preserve-3d;
  isolation: isolate;
}

.rb-split-flap-text-split-flap-text__tile::before{
  content: '';
  position: absolute;
  z-index: 8;
  top: calc(50% - 0.5px);
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.18) 18%,
    rgba(0, 0, 0, 0.64) 50%,
    rgba(255, 255, 255, 0.14) 82%,
    transparent
  );
  box-shadow:
    0 -1px 0 rgba(255, 255, 255, 0.08),
    0 1px 0 rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.rb-split-flap-text-split-flap-text__tile::after{
  content: '';
  position: absolute;
  inset: 0;
  z-index: 9;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: inherit;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2) inset;
  pointer-events: none;
}

.rb-split-flap-text-split-flap-text__half,
.rb-split-flap-text-split-flap-text__flap{
  position: absolute;
  left: 0;
  width: 100%;
  height: 50%;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07), transparent 34%), var(--rb-split-flap-text-split-flap-tile-color, #111827);
  backface-visibility: hidden;
}

.rb-split-flap-text-split-flap-text__half--top,
.rb-split-flap-text-split-flap-text__flap--front{
  top: 0;
}

.rb-split-flap-text-split-flap-text__half--bottom,
.rb-split-flap-text-split-flap-text__flap--back{
  bottom: 0;
}

.rb-split-flap-text-split-flap-text__half--bottom,
.rb-split-flap-text-split-flap-text__flap--back{
  background:
    linear-gradient(0deg, rgba(255, 255, 255, 0.06), transparent 38%),
    color-mix(in srgb, var(--rb-split-flap-text-split-flap-tile-color, #111827) 92%, black);
}

.rb-split-flap-text-split-flap-text__char{
  position: absolute;
  left: 0;
  width: 100%;
  height: 200%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--rb-split-flap-text-color, #f8fafc);
  text-shadow:
    0 0.025em 0 rgba(255, 255, 255, 0.16),
    0 0.09em 0.16em rgba(0, 0, 0, 0.42);
}

.rb-split-flap-text-split-flap-text__half--top .rb-split-flap-text-split-flap-text__char,
.rb-split-flap-text-split-flap-text__flap--front .rb-split-flap-text-split-flap-text__char{
  top: 0;
}

.rb-split-flap-text-split-flap-text__half--bottom .rb-split-flap-text-split-flap-text__char,
.rb-split-flap-text-split-flap-text__flap--back .rb-split-flap-text-split-flap-text__char{
  bottom: 0;
}

.rb-split-flap-text-split-flap-text__flap{
  z-index: 6;
  will-change: transform, filter;
  transform-style: preserve-3d;
}

.rb-split-flap-text-split-flap-text__flap--front{
  transform-origin: center bottom;
  animation: rb-split-flap-text-split-flap-front var(--rb-split-flap-text-split-flap-flip-duration, 0.12s) cubic-bezier(0.23, 1, 0.32, 1) both;
}

.rb-split-flap-text-split-flap-text__flap--back{
  transform-origin: center top;
  transform: rotateX(90deg);
  animation: rb-split-flap-text-split-flap-back var(--rb-split-flap-text-split-flap-flip-duration, 0.12s) cubic-bezier(0.23, 1, 0.32, 1) both;
}

@keyframes rb-split-flap-text-split-flap-front {
  0% {
    transform: rotateX(0deg);
    filter: brightness(1.08);
  }

  100% {
    transform: rotateX(-90deg);
    filter: brightness(0.52);
  }
}

@keyframes rb-split-flap-text-split-flap-back {
  0%,
  45% {
    transform: rotateX(90deg);
    filter: brightness(0.58);
  }

  100% {
    transform: rotateX(0deg);
    filter: brightness(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rb-split-flap-text-split-flap-text__flap{
    animation: none !important;
  }
}
`;

function RbInjectedStyle({ css }: { css: string }) {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
type TileState = {
  current: string;
  next: string;
  flipping: boolean;
  tick: number;
};

type AnimationPlan = {
  index: number;
  from: string;
  target: string;
  sequence: string[];
  start: number;
  step: number;
  done: boolean;
};

type TileUpdate = {
  index: number;
  current: string;
  next: string;
  done: boolean;
};

export interface RbSplitFlapTextProps extends HTMLAttributes<HTMLDivElement> {
  words?: string[];
  text?: string;
  flipDuration?: number;
  stagger?: number;
  cycleDelay?: number;
  charset?: 'alpha' | 'alphanumeric' | 'numeric' | (string & {});
  flipsPerChar?: number;
  tileColor?: string;
  textColor?: string;
  tileRadius?: number | string;
  gap?: number | string;
  fontSize?: number | string;
  loop?: boolean;
  padTo?: number;
}

const DEFAULT_WORDS = ['LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE'];

const CHARSETS: Record<string, string> = {
  alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  numeric: '0123456789'
};

const toCssUnit = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

const resolveCharset = (charset: RbSplitFlapTextProps['charset']) => {
  if (charset && CHARSETS[charset]) return CHARSETS[charset];
  return typeof charset === 'string' && charset.length > 0 ? charset : CHARSETS.alphanumeric;
};

const normalizePhrase = (phrase: string, width: number) => {
  const safe = String(phrase ?? '');
  return safe.padEnd(width, ' ').slice(0, width);
};

const createTiles = (phrase: string): TileState[] =>
  phrase.split('').map(char => ({
    current: char,
    next: char,
    flipping: false,
    tick: 0
  }));

const sampleChar = (charset: string) => charset.charAt(Math.floor(Math.random() * charset.length)) || ' ';

const buildSequence = (target: string, flips: number, charset: string) => {
  const steps: string[] = [];
  for (let i = 0; i < flips; i += 1) {
    steps.push(sampleChar(charset));
  }
  steps.push(target);
  return steps;
};

const usePrefersReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReduced(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
};

const RbSplitFlapText = ({
  words = ['LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE'],
  text,
  flipDuration = 0.12,
  stagger = 0.06,
  cycleDelay = 2400,
  charset = 'alphanumeric',
  flipsPerChar = 8,
  tileColor = '#111827',
  textColor = '#f8fafc',
  tileRadius = 8,
  gap = 6,
  fontSize = 52,
  loop = true,
  padTo = 12,
  className = '',
  style = {},
  ...props
}: RbSplitFlapTextProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const rafRef = useRef<number | null>(null);
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentTextRef = useRef('');

  const sourceWords = Array.isArray(words) && words.length > 0 ? words : DEFAULT_WORDS;
  const phrasesKey = typeof text === 'string' ? text : sourceWords.map(word => String(word ?? '')).join('\u001f');
  const phrases = useMemo(() => phrasesKey.split('\u001f'), [phrasesKey]);

  const width = useMemo(() => {
    const longest = phrases.reduce((max, phrase) => Math.max(max, phrase.length), 1);
    return Math.max(1, Math.ceil(Number(padTo) || 0), longest);
  }, [padTo, phrases]);

  const normalizedPhrases = useMemo(() => phrases.map(phrase => normalizePhrase(phrase, width)), [phrases, width]);

  const [tiles, setTiles] = useState<TileState[]>(() => createTiles(normalizedPhrases[0] || ''));

  useEffect(() => {
    const clearAnimation = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (cycleTimerRef.current) {
        clearTimeout(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }
    };

    clearAnimation();

    const firstPhrase = normalizedPhrases[0] || '';
    currentTextRef.current = firstPhrase;
    setTiles(createTiles(firstPhrase));

    if (normalizedPhrases.length <= 1 || typeof window === 'undefined') {
      return clearAnimation;
    }

    let phraseIndex = 0;
    let cancelled = false;

    const safeFlipMs = Math.max(40, (Number(flipDuration) || 0.12) * 1000);
    const safeStaggerMs = Math.max(0, (Number(stagger) || 0) * 1000);
    const safeCycleDelay = Math.max(400, Number(cycleDelay) || 2400);
    const safeFlips = Math.max(0, Math.floor(Number(flipsPerChar) || 0));
    const activeCharset = resolveCharset(charset);

    const animateTo = (targetPhrase: string) => {
      if (prefersReducedMotion) {
        currentTextRef.current = targetPhrase;
        setTiles(createTiles(targetPhrase));
        return 0;
      }

      const fromPhrase = normalizePhrase(currentTextRef.current, width);
      const targetChars = targetPhrase.split('');

      const plans = targetChars
        .map<AnimationPlan | null>((targetChar, index) => {
          const fromChar = fromPhrase[index] || ' ';
          if (fromChar === targetChar) return null;

          return {
            index,
            from: fromChar,
            target: targetChar,
            sequence: buildSequence(targetChar, safeFlips, activeCharset),
            start: index * safeStaggerMs,
            step: -1,
            done: false
          };
        })
        .filter((plan): plan is AnimationPlan => plan !== null);

      if (!plans.length) {
        currentTextRef.current = targetPhrase;
        setTiles(createTiles(targetPhrase));
        return 0;
      }

      const totalDuration = plans.reduce(
        (max, plan) => Math.max(max, plan.start + plan.sequence.length * safeFlipMs),
        0
      );
      const startedAt = performance.now();

      const updateTiles = (updates: TileUpdate[]) => {
        setTiles(previous => {
          const nextTiles = [...previous];
          updates.forEach(update => {
            const tile = nextTiles[update.index];
            if (!tile) return;

            nextTiles[update.index] = {
              current: update.current,
              next: update.next,
              flipping: !update.done,
              tick: tile.tick + 1
            };
          });
          return nextTiles;
        });
      };

      const tick = (now: number) => {
        if (cancelled) return;

        const elapsed = now - startedAt;
        const updates: TileUpdate[] = [];
        let shouldContinue = false;

        plans.forEach(plan => {
          const localElapsed = elapsed - plan.start;

          if (localElapsed < 0) {
            shouldContinue = true;
            return;
          }

          const step = Math.floor(localElapsed / safeFlipMs);

          if (step < plan.sequence.length) {
            shouldContinue = true;

            if (step !== plan.step) {
              plan.step = step;
              updates.push({
                index: plan.index,
                current: step === 0 ? plan.from : plan.sequence[step - 1],
                next: plan.sequence[step],
                done: false
              });
            }
          } else if (!plan.done) {
            plan.done = true;
            updates.push({
              index: plan.index,
              current: plan.target,
              next: plan.target,
              done: true
            });
          }
        });

        if (updates.length > 0) updateTiles(updates);

        if (shouldContinue) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          currentTextRef.current = targetPhrase;
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
      return totalDuration;
    };

    const scheduleNext = (delay: number) => {
      cycleTimerRef.current = setTimeout(() => {
        if (cancelled) return;

        const nextIndex = phraseIndex + 1;

        if (nextIndex >= normalizedPhrases.length && !loop) return;

        phraseIndex = nextIndex % normalizedPhrases.length;
        const animationDuration = animateTo(normalizedPhrases[phraseIndex]);
        scheduleNext(safeCycleDelay + animationDuration);
      }, delay);
    };

    scheduleNext(safeCycleDelay);

    return () => {
      cancelled = true;
      clearAnimation();
    };
  }, [normalizedPhrases, width, loop, cycleDelay, flipDuration, stagger, flipsPerChar, charset, prefersReducedMotion]);

  const settledText = tiles
    .map(tile => tile.current)
    .join('')
    .trimEnd();
  const componentStyle: CSSProperties & Record<string, string | number | undefined> = {
    '--rb-split-flap-text-split-flap-tile-color': tileColor,
    '--rb-split-flap-text-color': textColor,
    '--rb-split-flap-text-split-flap-radius': toCssUnit(tileRadius),
    '--rb-split-flap-text-split-flap-gap': toCssUnit(gap),
    '--rb-split-flap-text-split-flap-font-size': toCssUnit(fontSize),
    '--rb-split-flap-text-split-flap-flip-duration': `${Math.max(0.04, Number(flipDuration) || 0.12)}s`,
    ...style
  };

  return (
    <>
      <RbInjectedStyle css={RB_SPLIT_FLAP_TEXT_CSS} />
      {(
    <div
      className={`rb-split-flap-text-split-flap-text ${className}`.trim()}
      style={componentStyle}
      role="text"
      aria-label={settledText || undefined}
      {...props}
    >
      {tiles.map((tile, index) => (
        <span className="rb-split-flap-text-split-flap-text__tile" aria-hidden="true" key={`${index}-${tiles.length}`}>
          <span className="rb-split-flap-text-split-flap-text__half rb-split-flap-text-split-flap-text__half--top">
            <span className="rb-split-flap-text-split-flap-text__char">{tile.current === ' ' ? '\u00A0' : tile.current}</span>
          </span>
          <span className="rb-split-flap-text-split-flap-text__half rb-split-flap-text-split-flap-text__half--bottom">
            <span className="rb-split-flap-text-split-flap-text__char">{tile.flipping ? tile.next : tile.current}</span>
          </span>

          {tile.flipping && (
            <>
              <span className="rb-split-flap-text-split-flap-text__flap rb-split-flap-text-split-flap-text__flap--front" key={`front-${index}-${tile.tick}`}>
                <span className="rb-split-flap-text-split-flap-text__char">{tile.current === ' ' ? '\u00A0' : tile.current}</span>
              </span>
              <span className="rb-split-flap-text-split-flap-text__flap rb-split-flap-text-split-flap-text__flap--back" key={`back-${index}-${tile.tick}`}>
                <span className="rb-split-flap-text-split-flap-text__char">{tile.next === ' ' ? '\u00A0' : tile.next}</span>
              </span>
            </>
          )}
        </span>
      ))}
    </div>
  )}
    </>
  )
};

export default RbSplitFlapText;
