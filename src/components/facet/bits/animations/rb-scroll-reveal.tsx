/* Vendored from DavidHDev/react-bits — src/ts-default/TextAnimations/ScrollReveal.tsx (MIT + Commons Clause, see bits/ATTRIBUTION.md). Exports renamed with the Rb prefix to avoid API collision. Companion ScrollReveal.css is inlined below with every class/keyframe/custom-property namespaced to `rb-scroll-reveal-*`. */

"use client";

import React, { useEffect, useRef, useMemo, type ReactNode, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const RB_SCROLL_REVEAL_CSS = String.raw`
.rb-scroll-reveal-scroll-reveal{
  margin: 20px 0;
}

.rb-scroll-reveal-scroll-reveal-text{
  font-size: clamp(1.6rem, 4vw, 3rem);
  line-height: 1.5;
  font-weight: 600;
}

.rb-scroll-reveal-word{
  display: inline-block;
}

.rb-scroll-reveal-scroll-reveal-sr-only{
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
`;

function RbInjectedStyle({ css }: { css: string }) {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  /**
   * Accessible name for the heading. Only used when the heading would otherwise
   * have no text of its own — see the render for why that can happen.
   */
  label?: string;
}

const RbScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
  label = 'Scroll reveal heading'
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const text = typeof children === 'string' ? children : '';

  const splitText = useMemo(() => {
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="rb-scroll-reveal-word" key={index}>
          {word}
        </span>
      );
    });
  }, [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: true
        }
      }
    );

    const wordElements = el.querySelectorAll<HTMLElement>('.rb-scroll-reveal-word');

    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: 'opacity' },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: wordAnimationEnd,
          scrub: true
        }
      }
    );

    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <>
      <RbInjectedStyle css={RB_SCROLL_REVEAL_CSS} />
      {(
    /* The reveal animation only ever renders string children, so any other node
       type — or no children at all — leaves this <h2> with no text, and it gets
       announced as a blank heading. A phantom entry in the heading rotor is
       worse than no heading, so when there is nothing to reveal the heading
       still gets real text, just visually hidden. String children already supply
       the name and are left alone. */
    <h2 ref={containerRef} className={`rb-scroll-reveal-scroll-reveal ${containerClassName}`}>
      {text.trim().length === 0 && <span className="rb-scroll-reveal-scroll-reveal-sr-only">{label}</span>}
      <p className={`rb-scroll-reveal-scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  )}
    </>
  )
};

export default RbScrollReveal;
