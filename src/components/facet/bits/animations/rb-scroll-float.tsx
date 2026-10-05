/* Vendored from DavidHDev/react-bits — src/ts-default/TextAnimations/ScrollFloat.tsx (MIT + Commons Clause, see bits/ATTRIBUTION.md). Exports renamed with the Rb prefix to avoid API collision. Companion ScrollFloat.css is inlined below with every class/keyframe/custom-property namespaced to `rb-scroll-float-*`. */

"use client";

import React, { useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const RB_SCROLL_FLOAT_CSS = String.raw`
.rb-scroll-float-scroll-float{
  overflow: hidden;
}

.rb-scroll-float-scroll-float-text{
  display: inline-block;
  font-size: clamp(1.6rem, 8vw, 10rem);
  font-weight: 900;
  text-align: center;
  line-height: 1.5;
}

.rb-scroll-float-char{
  display: inline-block;
}

.rb-scroll-float-scroll-float-sr-only{
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

interface ScrollFloatProps {
  children?: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  /**
   * Accessible name for the heading. Only used when the heading would otherwise
   * have no text of its own — see the render for why that can happen.
   */
  label?: string;
}

const RbScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  label = 'Scroll float heading'
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const text = typeof children === 'string' ? children : '';

  const splitText = useMemo(() => {
    return text.split('').map((char, index) => (
      <span className="rb-scroll-float-char" key={index}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  }, [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const charElements = el.querySelectorAll('.rb-scroll-float-char');
    /* No text (or no glyphs yet) means there is nothing for GSAP to animate.
     * Passing an empty target makes gsap log "target not found" on every mount. */
    if (charElements.length === 0) return;

    gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: '50% 0%'
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true
        }
      }
    );
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <>
      <RbInjectedStyle css={RB_SCROLL_FLOAT_CSS} />
      {(
    /* The float animation only ever renders string children, so any other node
       type — or no children at all — leaves this <h2> with no text, and it gets
       announced as a blank heading. A phantom entry in the heading rotor is
       worse than no heading, so when there is nothing to animate the heading
       still gets real text, just visually hidden. String children already supply
       the name and are left alone. */
    <h2 ref={containerRef} className={`rb-scroll-float-scroll-float ${containerClassName}`}>
      {text.trim().length === 0 && <span className="rb-scroll-float-scroll-float-sr-only">{label}</span>}
      <span className={`rb-scroll-float-scroll-float-text ${textClassName}`}>{splitText}</span>
    </h2>
  )}
    </>
  )
};

export default RbScrollFloat;
