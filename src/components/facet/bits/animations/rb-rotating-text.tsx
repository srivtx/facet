/* Vendored from DavidHDev/react-bits — src/ts-default/TextAnimations/RotatingText.tsx (MIT + Commons Clause, see bits/ATTRIBUTION.md). Exports renamed with the Rb prefix to avoid API collision. Companion RotatingText.css is inlined below with every class/keyframe/custom-property namespaced to `rb-rotating-text-*`. */

"use client";

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import {
  motion,
  AnimatePresence,
  type Transition,
  type VariantLabels,
  type Target,
  type TargetAndTransition
} from 'motion/react';

const RB_ROTATING_TEXT_CSS = String.raw`
.rb-rotating-text-text-rotate{
  display: flex;
  flex-wrap: wrap;
  white-space: pre-wrap;
  position: relative;
}

.rb-rotating-text-text-rotate-sr-only{
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.rb-rotating-text-text-rotate-word{
  display: inline-flex;
}

.rb-rotating-text-text-rotate-lines{
  display: flex;
  flex-direction: column;
  width: 100%;
}

.rb-rotating-text-text-rotate-element{
  display: inline-block;
}

.rb-rotating-text-text-rotate-space{
  white-space: pre;
}
`;

function RbInjectedStyle({ css }: { css: string }) {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface RbRotatingTextRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

export interface RbRotatingTextProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof motion.span>,
    'children' | 'transition' | 'initial' | 'animate' | 'exit'
  > {
  texts: string[];
  transition?: Transition;
  initial?: boolean | Target | VariantLabels;
  animate?: boolean | VariantLabels | TargetAndTransition;
  exit?: Target | VariantLabels;
  animatePresenceMode?: 'sync' | 'wait';
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: 'first' | 'last' | 'center' | 'random' | number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
}

/* Stable module-level fallback so the default `texts` value is referentially
 * stable across renders (a fresh [] literal in the destructure would retrigger
 * every memo/effect that depends on it on each render). */
const EMPTY_TEXTS: string[] = [];

/* Stable pseudo-random integer in [0, total). Used for staggerFrom="random" so
 * the stagger order is scattered but render-deterministic. */
const deterministicIndex = (index: number, total: number): number => {
  if (total <= 1) return 0;
  let h = (index * 2654435761) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;
  return h % total;
};

const RbRotatingText = forwardRef<RbRotatingTextRef, RbRotatingTextProps>((props, ref) => {
  const {
    texts = EMPTY_TEXTS,
    transition = { type: 'spring', damping: 25, stiffness: 300 },
    initial = { y: '100%', opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: '-120%', opacity: 0 },
    animatePresenceMode = 'wait',
    animatePresenceInitial = false,
    rotationInterval = 2000,
    staggerDuration = 0,
    staggerFrom = 'first',
    loop = true,
    auto = true,
    splitBy = 'characters',
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);

  /* `texts` can legitimately be empty (or shorter than the index we are
   * pointing at) when a caller passes a filtered/async list. Clamp once here so
   * neither the memo below nor the auto-advance interval can read off the end
   * of the array. */
  const safeIndex = texts.length > 0 ? Math.min(currentTextIndex, texts.length - 1) : 0;
  const currentTextValue: string = texts.length > 0 ? texts[safeIndex] : '';

  const splitIntoCharacters = (text: string): string[] => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), segment => segment.segment);
    }
    return Array.from(text);
  };

  const elements = useMemo(() => {
    const currentText: string = currentTextValue;
    if (splitBy === 'characters') {
      const words = currentText.split(' ');
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1
      }));
    }
    if (splitBy === 'words') {
      return currentText.split(' ').map((word, i, arr) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1
      }));
    }
    if (splitBy === 'lines') {
      return currentText.split('\n').map((line, i, arr) => ({
        characters: [line],
        needsSpace: i !== arr.length - 1
      }));
    }

    return currentText.split(splitBy).map((part, i, arr) => ({
      characters: [part],
      needsSpace: i !== arr.length - 1
    }));
  }, [currentTextValue, splitBy]);

  const getStaggerDelay = useCallback(
    (index: number, totalChars: number): number => {
      const total = totalChars;
      if (staggerFrom === 'first') return index * staggerDuration;
      if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration;
      if (staggerFrom === 'center') {
        const center = Math.floor(total / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      if (staggerFrom === 'random') {
        /* getStaggerDelay is called while rendering the transition props, so this
         * must not use Math.random(): it would produce a different delay on the
         * server than on the client. Derive a stable pseudo-random offset from
         * the character index instead — visually just as scattered, and
         * identical on both passes. */
        const randomIndex = deterministicIndex(index, total);
        return Math.abs(randomIndex - index) * staggerDuration;
      }
      return Math.abs((staggerFrom as number) - index) * staggerDuration;
    },
    [staggerFrom, staggerDuration]
  );

  const handleIndexChange = useCallback(
    (newIndex: number) => {
      setCurrentTextIndex(newIndex);
      if (onNext) onNext(newIndex);
    },
    [onNext]
  );

  const next = useCallback(() => {
    if (texts.length === 0) return;
    const nextIndex = safeIndex === texts.length - 1 ? (loop ? 0 : safeIndex) : safeIndex + 1;
    if (nextIndex !== currentTextIndex) {
      handleIndexChange(nextIndex);
    }
  }, [texts.length, safeIndex, currentTextIndex, loop, handleIndexChange]);

  const previous = useCallback(() => {
    if (texts.length === 0) return;
    const prevIndex = safeIndex === 0 ? (loop ? texts.length - 1 : safeIndex) : safeIndex - 1;
    if (prevIndex !== currentTextIndex) {
      handleIndexChange(prevIndex);
    }
  }, [texts.length, safeIndex, currentTextIndex, loop, handleIndexChange]);

  const jumpTo = useCallback(
    (index: number) => {
      if (texts.length === 0) return;
      const validIndex = Math.max(0, Math.min(index, texts.length - 1));
      if (validIndex !== currentTextIndex) {
        handleIndexChange(validIndex);
      }
    },
    [texts.length, currentTextIndex, handleIndexChange]
  );

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) {
      handleIndexChange(0);
    }
  }, [currentTextIndex, handleIndexChange]);

  useImperativeHandle(
    ref,
    () => ({
      next,
      previous,
      jumpTo,
      reset
    }),
    [next, previous, jumpTo, reset]
  );

  useEffect(() => {
    if (!auto) return;
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval, auto]);

  return (
    <>
      <RbInjectedStyle css={RB_ROTATING_TEXT_CSS} />
      {(
    <motion.span className={cn('rb-rotating-text-text-rotate', mainClassName)} {...rest} layout transition={transition}>
      <span className="rb-rotating-text-text-rotate-sr-only">{currentTextValue}</span>
      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <motion.span
          key={currentTextIndex}
          className={cn(splitBy === 'lines' ? 'rb-rotating-text-text-rotate-lines' : 'rb-rotating-text-text-rotate')}
          layout
          aria-hidden="true"
        >
          {elements.map((wordObj, wordIndex, array) => {
            const previousCharsCount = array.slice(0, wordIndex).reduce((sum, word) => sum + word.characters.length, 0);
            return (
              <span key={wordIndex} className={cn('rb-rotating-text-text-rotate-word', splitLevelClassName)}>
                {wordObj.characters.map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    transition={{
                      ...transition,
                      delay: getStaggerDelay(
                        previousCharsCount + charIndex,
                        array.reduce((sum, word) => sum + word.characters.length, 0)
                      )
                    }}
                    className={cn('rb-rotating-text-text-rotate-element', elementLevelClassName)}
                  >
                    {char}
                  </motion.span>
                ))}
                {wordObj.needsSpace && <span className="rb-rotating-text-text-rotate-space"> </span>}
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )}
    </>
  )
});

RbRotatingText.displayName = 'RotatingText';
export default RbRotatingText;
