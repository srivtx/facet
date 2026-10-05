/* Vendored from DavidHDev/react-bits — src/ts-default/TextAnimations/TrueFocus.tsx (MIT + Commons Clause, see bits/ATTRIBUTION.md). Exports renamed with the Rb prefix to avoid API collision. Companion TrueFocus.css is inlined below with every class/keyframe/custom-property namespaced to `rb-true-focus-*`. */

"use client";

import { useEffect, useRef, useState, type RefObject } from 'react';
import { motion } from 'motion/react';

const RB_TRUE_FOCUS_CSS = String.raw`
.rb-true-focus-focus-container{
  position: relative;
  display: flex;
  gap: 1em;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  outline: none;
  user-select: none;
}

.rb-true-focus-focus-word{
  position: relative;
  font-size: 3rem;
  font-weight: 900;
  cursor: pointer;
  transition:
    filter 0.3s ease,
    color 0.3s ease;
  outline: none;
  user-select: none;
}

.rb-true-focus-focus-word.rb-true-focus-active{
  filter: blur(0);
}

.rb-true-focus-focus-frame{
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  box-sizing: content-box;
  border: none;
}

.rb-true-focus-corner{
  position: absolute;
  width: 1rem;
  height: 1rem;
  border: 3px solid var(--rb-true-focus-border-color, #fff);
  filter: drop-shadow(0px 0px 4px var(--rb-true-focus-border-color, #fff));
  border-radius: 3px;
  transition: none;
}

.rb-true-focus-top-left{
  top: -10px;
  left: -10px;
  border-right: none;
  border-bottom: none;
}

.rb-true-focus-top-right{
  top: -10px;
  right: -10px;
  border-left: none;
  border-bottom: none;
}

.rb-true-focus-bottom-left{
  bottom: -10px;
  left: -10px;
  border-right: none;
  border-top: none;
}

.rb-true-focus-bottom-right{
  bottom: -10px;
  right: -10px;
  border-left: none;
  border-top: none;
}
`;

function RbInjectedStyle({ css }: { css: string }) {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
interface TrueFocusProps {
  sentence?: string;
  separator?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const RbTrueFocus: React.FC<TrueFocusProps> = ({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  blurAmount = 5,
  borderColor = 'green',
  glowColor = 'rgba(0, 255, 0, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1
}) => {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs: React.MutableRefObject<(HTMLSpanElement | null)[]> = useRef([]);
  const [focusRect, setFocusRect] = useState<FocusRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex(prev => (prev + 1) % words.length);
        },
        (animationDuration + pauseBetweenAnimations) * 1000
      );

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;

    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex ?? 0);
    }
  };

  return (
    <>
      <RbInjectedStyle css={RB_TRUE_FOCUS_CSS} />
      {(
    <div className="rb-true-focus-focus-container" ref={containerRef}>
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={el => {
              if (el) {
                wordRefs.current[index] = el;
              }
            }}
            className={`rb-true-focus-focus-word ${manualMode ? 'manual' : ''} ${isActive && !manualMode ? 'rb-true-focus-active' : ''}`}
            style={
              {
                filter: manualMode
                  ? isActive
                    ? `blur(0px)`
                    : `blur(${blurAmount}px)`
                  : isActive
                    ? `blur(0px)`
                    : `blur(${blurAmount}px)`,
                transition: `filter ${animationDuration}s ease`,
                '--rb-true-focus-border-color': borderColor,
                '--glow-color': glowColor
              } as React.CSSProperties
            }
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="rb-true-focus-focus-frame"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0
        }}
        transition={{
          duration: animationDuration
        }}
        style={
          {
            '--rb-true-focus-border-color': borderColor,
            '--glow-color': glowColor
          } as React.CSSProperties
        }
      >
        <span className="rb-true-focus-corner rb-true-focus-top-left"></span>
        <span className="rb-true-focus-corner rb-true-focus-top-right"></span>
        <span className="rb-true-focus-corner rb-true-focus-bottom-left"></span>
        <span className="rb-true-focus-corner rb-true-focus-bottom-right"></span>
      </motion.div>
    </div>
  )}
    </>
  )
};

export default RbTrueFocus;
