/* Vendored from DavidHDev/react-bits — src/ts-default/Animations/StickerPeel.tsx (MIT + Commons Clause, see bits/ATTRIBUTION.md). Exports renamed with the Rb prefix to avoid API collision. Companion StickerPeel.css is inlined below with every class/keyframe/custom-property namespaced to `rb-sticker-peel-*`. */

"use client";

import { useRef, useEffect, useMemo, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

const RB_STICKER_PEEL_CSS = String.raw`
:where(.rb-sticker-peel-sticker-container){
  --rb-sticker-peel-sticker-rotate: 30deg;
  --rb-sticker-peel-sticker-p: 10px;
  --rb-sticker-peel-sticker-peelback-hover: 30%;
  --rb-sticker-peel-sticker-peelback-active: 40%;
  --rb-sticker-peel-easing: power3.out;
  --rb-sticker-peel-hover-easing: power2.out;
  --rb-sticker-peel-sticker-start: calc(-1 * var(--rb-sticker-peel-sticker-p));
  --rb-sticker-peel-sticker-end: calc(100% + var(--rb-sticker-peel-sticker-p));
  --rb-sticker-peel-sticker-shadow-opacity: 0.6;
  --rb-sticker-peel-sticker-lighting-constant: 0.1;
  --rb-sticker-peel-peel-direction: 0deg;
}

.rb-sticker-peel-sticker-container{
  position: relative;
  transform: rotate(var(--rb-sticker-peel-peel-direction));
  transform-origin: center;
}

.rb-sticker-peel-sticker-container *{
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.rb-sticker-peel-sticker-main{
  clip-path: polygon(
    var(--rb-sticker-peel-sticker-start) var(--rb-sticker-peel-sticker-start),
    var(--rb-sticker-peel-sticker-end) var(--rb-sticker-peel-sticker-start),
    var(--rb-sticker-peel-sticker-end) var(--rb-sticker-peel-sticker-end),
    var(--rb-sticker-peel-sticker-start) var(--rb-sticker-peel-sticker-end)
  );
  transition: clip-path 0.6s ease-out;
  filter: url(#dropShadow);
}

.rb-sticker-peel-sticker-main > *{
  transform: rotate(calc(-1 * var(--rb-sticker-peel-peel-direction)));
}

.rb-sticker-peel-sticker-lighting{
  filter: url(#pointLight);
}

.rb-sticker-peel-sticker-container:hover .rb-sticker-peel-sticker-main,
.rb-sticker-peel-sticker-container.rb-sticker-peel-touch-active .rb-sticker-peel-sticker-main{
  clip-path: polygon(
    var(--rb-sticker-peel-sticker-start) var(--rb-sticker-peel-sticker-peelback-hover),
    var(--rb-sticker-peel-sticker-end) var(--rb-sticker-peel-sticker-peelback-hover),
    var(--rb-sticker-peel-sticker-end) var(--rb-sticker-peel-sticker-end),
    var(--rb-sticker-peel-sticker-start) var(--rb-sticker-peel-sticker-end)
  );
}

.rb-sticker-peel-sticker-container:active .rb-sticker-peel-sticker-main{
  clip-path: polygon(
    var(--rb-sticker-peel-sticker-start) var(--rb-sticker-peel-sticker-peelback-active),
    var(--rb-sticker-peel-sticker-end) var(--rb-sticker-peel-sticker-peelback-active),
    var(--rb-sticker-peel-sticker-end) var(--rb-sticker-peel-sticker-end),
    var(--rb-sticker-peel-sticker-start) var(--rb-sticker-peel-sticker-end)
  );
}

.rb-sticker-peel-sticker-image{
  transform: rotate(var(--rb-sticker-peel-sticker-rotate));
}

.rb-sticker-peel-flap{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: calc(-100% - var(--rb-sticker-peel-sticker-p) - var(--rb-sticker-peel-sticker-p));
  clip-path: polygon(
    var(--rb-sticker-peel-sticker-start) var(--rb-sticker-peel-sticker-start),
    var(--rb-sticker-peel-sticker-end) var(--rb-sticker-peel-sticker-start),
    var(--rb-sticker-peel-sticker-end) var(--rb-sticker-peel-sticker-start),
    var(--rb-sticker-peel-sticker-start) var(--rb-sticker-peel-sticker-start)
  );
  transform: scaleY(-1);
  transition: all 0.6s ease-out;
}

.rb-sticker-peel-flap > *{
  transform: rotate(calc(-1 * var(--rb-sticker-peel-peel-direction)));
}

.rb-sticker-peel-sticker-container:hover .rb-sticker-peel-flap,
.rb-sticker-peel-sticker-container.rb-sticker-peel-touch-active .rb-sticker-peel-flap{
  clip-path: polygon(
    var(--rb-sticker-peel-sticker-start) var(--rb-sticker-peel-sticker-start),
    var(--rb-sticker-peel-sticker-end) var(--rb-sticker-peel-sticker-start),
    var(--rb-sticker-peel-sticker-end) var(--rb-sticker-peel-sticker-peelback-hover),
    var(--rb-sticker-peel-sticker-start) var(--rb-sticker-peel-sticker-peelback-hover)
  );
  top: calc(-100% + 2 * var(--rb-sticker-peel-sticker-peelback-hover) - 1px);
}

.rb-sticker-peel-sticker-container:active .rb-sticker-peel-flap{
  clip-path: polygon(
    var(--rb-sticker-peel-sticker-start) var(--rb-sticker-peel-sticker-start),
    var(--rb-sticker-peel-sticker-end) var(--rb-sticker-peel-sticker-start),
    var(--rb-sticker-peel-sticker-end) var(--rb-sticker-peel-sticker-peelback-active),
    var(--rb-sticker-peel-sticker-start) var(--rb-sticker-peel-sticker-peelback-active)
  );
  top: calc(-100% + 2 * var(--rb-sticker-peel-sticker-peelback-active) - 1px);
}

.rb-sticker-peel-flap-lighting{
  filter: url(#pointLightFlipped);
}

.rb-sticker-peel-flap-image{
  transform: rotate(var(--rb-sticker-peel-sticker-rotate));
  filter: url(#expandAndFill);
}

.rb-sticker-peel-draggable{
  position: absolute;
  cursor: grab;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

.rb-sticker-peel-draggable:active{
  cursor: grabbing;
}

@media (hover: none) and (pointer: coarse) {
  .rb-sticker-peel-draggable{
    cursor: default;
  }

  .rb-sticker-peel-sticker-container{
    touch-action: none;
  }
}

.rb-sticker-peel-sticker-image,
.rb-sticker-peel-flap-image{
  width: var(--rb-sticker-peel-sticker-width, 200px);
}

.rb-sticker-peel-sticker-main,
.rb-sticker-peel-flap{
  will-change: clip-path, transform;
}

.rb-sticker-peel-sticker-ripple{
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  z-index: 10;
}
`;

function RbInjectedStyle({ css }: { css: string }) {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
gsap.registerPlugin(Draggable);

interface StickerPeelProps {
  imageSrc?: string;
  rotate?: number;
  peelBackHoverPct?: number;
  peelBackActivePct?: number;
  peelEasing?: string;
  peelHoverEasing?: string;
  width?: number;
  shadowIntensity?: number;
  lightingIntensity?: number;
  initialPosition?: 'center' | 'random' | { x: number; y: number };
  peelDirection?: number;
  className?: string;
}

interface CSSVars extends CSSProperties {
  '--rb-sticker-peel-sticker-rotate'?: string;
  '--rb-sticker-peel-sticker-p'?: string;
  '--rb-sticker-peel-sticker-peelback-hover'?: string;
  '--rb-sticker-peel-sticker-peelback-active'?: string;
  '--rb-sticker-peel-easing'?: string;
  '--rb-sticker-peel-hover-easing'?: string;
  '--rb-sticker-peel-sticker-width'?: string;
  '--rb-sticker-peel-sticker-shadow-opacity'?: number;
  '--rb-sticker-peel-sticker-lighting-constant'?: number;
  '--rb-sticker-peel-peel-direction'?: string;
}

const RbStickerPeel: React.FC<StickerPeelProps> = ({
  imageSrc,
  rotate = 30,
  peelBackHoverPct = 30,
  peelBackActivePct = 40,
  peelEasing = 'power3.out',
  peelHoverEasing = 'power2.out',
  width = 200,
  shadowIntensity = 0.6,
  lightingIntensity = 0.1,
  initialPosition = 'center',
  peelDirection = 0,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragTargetRef = useRef<HTMLDivElement>(null);
  const pointLightRef = useRef<SVGFEPointLightElement>(null);
  const pointLightFlippedRef = useRef<SVGFEPointLightElement>(null);
  const draggableInstanceRef = useRef<Draggable | null>(null);

  /* React treats "" as a real URL attribute and makes the browser re-request the
   * current document, so an absent/blank source renders no <img> at all rather
   * than an empty one. */
  const resolvedImageSrc = typeof imageSrc === 'string' && imageSrc.length > 0 ? imageSrc : undefined;

  const defaultPadding = 10;

  useEffect(() => {
    const target = dragTargetRef.current;
    if (!target) return;

    let startX = 0,
      startY = 0;

    if (initialPosition === 'center') {
      return;
    }

    if (typeof initialPosition === 'object' && initialPosition.x !== undefined && initialPosition.y !== undefined) {
      startX = initialPosition.x;
      startY = initialPosition.y;
    }

    gsap.set(target, { x: startX, y: startY });
  }, [initialPosition]);

  useEffect(() => {
    const target = dragTargetRef.current;
    if (!target) return;

    const boundsEl = target.parentNode as HTMLElement;

    const draggable = Draggable.create(target, {
      type: 'x,y',
      bounds: boundsEl,
      inertia: true,
      onDrag(this: Draggable) {
        const rot = gsap.utils.clamp(-24, 24, this.deltaX * 0.4);
        gsap.to(target, { rotation: rot, duration: 0.15, ease: 'power1.out' });
      },
      onDragEnd() {
        const rotationEase = 'power2.out';
        const duration = 0.8;
        gsap.to(target, { rotation: 0, duration, ease: rotationEase });
      }
    });

    draggableInstanceRef.current = draggable[0];

    const handleResize = () => {
      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.update();

        const currentX = gsap.getProperty(target, 'x') as number;
        const currentY = gsap.getProperty(target, 'y') as number;

        const boundsRect = boundsEl.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        const maxX = boundsRect.width - targetRect.width;
        const maxY = boundsRect.height - targetRect.height;

        const newX = Math.max(0, Math.min(currentX, maxX));
        const newY = Math.max(0, Math.min(currentY, maxY));

        if (newX !== currentX || newY !== currentY) {
          gsap.to(target, {
            x: newX,
            y: newY,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    const updateLight = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;

      if (pointLightRef.current) {
        gsap.set(pointLightRef.current, { attr: { x, y } });
      }

      const normalizedAngle = Math.abs(peelDirection % 360);
      if (pointLightFlippedRef.current) {
        if (normalizedAngle !== 180) {
          gsap.set(pointLightFlippedRef.current, {
            attr: { x, y: rect.height - y }
          });
        } else {
          gsap.set(pointLightFlippedRef.current, {
            attr: { x: -1000, y: -1000 }
          });
        }
      }
    };

    const container = containerRef.current;
    const eventType = 'mousemove';

    if (container) {
      container.addEventListener(eventType, updateLight);
      return () => container.removeEventListener(eventType, updateLight);
    }
  }, [peelDirection]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = () => {
      container.classList.add('rb-sticker-peel-touch-active');
    };

    const handleTouchEnd = () => {
      container.classList.remove('rb-sticker-peel-touch-active');
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  const cssVars: CSSVars = useMemo(
    () => ({
      '--rb-sticker-peel-sticker-rotate': `${rotate}deg`,
      '--rb-sticker-peel-sticker-p': `${defaultPadding}px`,
      '--rb-sticker-peel-sticker-peelback-hover': `${peelBackHoverPct}%`,
      '--rb-sticker-peel-sticker-peelback-active': `${peelBackActivePct}%`,
      '--rb-sticker-peel-easing': peelEasing,
      '--rb-sticker-peel-hover-easing': peelHoverEasing,
      '--rb-sticker-peel-sticker-width': `${width}px`,
      '--rb-sticker-peel-sticker-shadow-opacity': shadowIntensity,
      '--rb-sticker-peel-sticker-lighting-constant': lightingIntensity,
      '--rb-sticker-peel-peel-direction': `${peelDirection}deg`
    }),
    [
      rotate,
      peelBackHoverPct,
      peelBackActivePct,
      peelEasing,
      peelHoverEasing,
      width,
      shadowIntensity,
      lightingIntensity,
      peelDirection
    ]
  );

  return (
    <>
      <RbInjectedStyle css={RB_STICKER_PEEL_CSS} />
      {(
    <div className={`rb-sticker-peel-draggable ${className}`} ref={dragTargetRef} style={cssVars}>
      <svg width="0" height="0">
        <defs>
          <filter id="pointLight">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feSpecularLighting
              result="spec"
              in="blur"
              specularExponent="100"
              specularConstant={lightingIntensity}
              lightingColor="white"
            >
              <fePointLight ref={pointLightRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>

          <filter id="pointLightFlipped">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feSpecularLighting
              result="spec"
              in="blur"
              specularExponent="100"
              specularConstant={lightingIntensity * 7}
              lightingColor="white"
            >
              <fePointLight ref={pointLightFlippedRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>

          <filter id="dropShadow">
            <feDropShadow
              dx="2"
              dy="4"
              stdDeviation={3 * shadowIntensity}
              floodColor="black"
              floodOpacity={shadowIntensity}
            />
          </filter>

          <filter id="expandAndFill">
            <feOffset dx="0" dy="0" in="SourceAlpha" result="shape" />
            <feFlood floodColor="rgb(179,179,179)" result="flood" />
            <feComposite operator="in" in="flood" in2="shape" />
          </filter>
        </defs>
      </svg>

      <div className="rb-sticker-peel-sticker-container" ref={containerRef}>
        <div className="rb-sticker-peel-sticker-main">
          <div className="rb-sticker-peel-sticker-lighting">
            {resolvedImageSrc ? (
              <img
                src={resolvedImageSrc}
                alt=""
                className="rb-sticker-peel-sticker-image"
                draggable="false"
                onContextMenu={e => e.preventDefault()}
              />
            ) : null}
          </div>
        </div>

        <div className="rb-sticker-peel-flap">
          <div className="rb-sticker-peel-flap-lighting">
            {resolvedImageSrc ? (
              <img
                src={resolvedImageSrc}
                alt=""
                className="rb-sticker-peel-flap-image"
                draggable="false"
                onContextMenu={e => e.preventDefault()}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )}
    </>
  )
};

export default RbStickerPeel;
