/* Vendored from DavidHDev/react-bits — src/ts-default/Animations/LogoLoop.tsx (MIT + Commons Clause, see bits/ATTRIBUTION.md). Exports renamed with the Rb prefix to avoid API collision. Companion LogoLoop.css is inlined below with every class/keyframe/custom-property namespaced to `rb-logo-loop-*`. */

"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const RB_LOGO_LOOP_CSS = String.raw`
.rb-logo-loop-logoloop{
  position: relative;
  overflow-x: hidden;

  --rb-logo-loop-gap: 32px;
  --rb-logo-loop-logoHeight: 28px;
  --rb-logo-loop-fadeColorAuto: #ffffff;
}

.rb-logo-loop-logoloop--vertical{
  overflow: hidden;
  height: 100%;
  display: inline-block;
}

.rb-logo-loop-logoloop--scale-hover{
  padding-top: calc(var(--rb-logo-loop-logoHeight) * 0.1);
  padding-bottom: calc(var(--rb-logo-loop-logoHeight) * 0.1);
}

@media (prefers-color-scheme: dark) {
  .rb-logo-loop-logoloop{
    --rb-logo-loop-fadeColorAuto: #0b0b0b;
  }
}

.rb-logo-loop-logoloop__track{
  display: flex;
  width: max-content;
  will-change: transform;
  user-select: none;
  position: relative;
  z-index: 0;
}

.rb-logo-loop-logoloop--vertical .rb-logo-loop-logoloop__track{
  flex-direction: column;
  height: max-content;
  width: 100%;
}

.rb-logo-loop-logoloop__list{
  display: flex;
  align-items: center;
}

.rb-logo-loop-logoloop--vertical .rb-logo-loop-logoloop__list{
  flex-direction: column;
}

.rb-logo-loop-logoloop__item{
  flex: 0 0 auto;
  margin-right: var(--rb-logo-loop-gap);
  font-size: var(--rb-logo-loop-logoHeight);
  line-height: 1;
}

.rb-logo-loop-logoloop--vertical .rb-logo-loop-logoloop__item{
  margin-right: 0;
  margin-bottom: var(--rb-logo-loop-gap);
}

.rb-logo-loop-logoloop__item:last-child{
  margin-right: var(--rb-logo-loop-gap);
}

.rb-logo-loop-logoloop--vertical .rb-logo-loop-logoloop__item:last-child{
  margin-right: 0;
  margin-bottom: var(--rb-logo-loop-gap);
}

.rb-logo-loop-logoloop__node{
  display: inline-flex;
  align-items: center;
}

.rb-logo-loop-logoloop__item img{
  height: var(--rb-logo-loop-logoHeight);
  width: auto;
  display: block;
  object-fit: contain;
  image-rendering: -webkit-optimize-contrast;
  -webkit-user-drag: none;
  pointer-events: none;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.rb-logo-loop-logoloop--scale-hover .rb-logo-loop-logoloop__item{
  overflow: visible;
}

.rb-logo-loop-logoloop--scale-hover .rb-logo-loop-logoloop__item:hover img,
.rb-logo-loop-logoloop--scale-hover .rb-logo-loop-logoloop__item:hover .rb-logo-loop-logoloop__node{
  transform: scale(1.2);
  transform-origin: center center;
}

.rb-logo-loop-logoloop--scale-hover .rb-logo-loop-logoloop__node{
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.rb-logo-loop-logoloop__link{
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  border-radius: 4px;
  transition: opacity 0.2s ease;
}

.rb-logo-loop-logoloop__link:hover{
  opacity: 0.8;
}

.rb-logo-loop-logoloop__link:focus-visible{
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.rb-logo-loop-logoloop--fade::before,
.rb-logo-loop-logoloop--fade::after{
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: clamp(24px, 8%, 120px);
  pointer-events: none;
  z-index: 10;
}

.rb-logo-loop-logoloop--fade::before{
  left: 0;
  background: linear-gradient(
    to right,
    var(--rb-logo-loop-fadeColor, var(--rb-logo-loop-fadeColorAuto)) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.rb-logo-loop-logoloop--fade::after{
  right: 0;
  background: linear-gradient(
    to left,
    var(--rb-logo-loop-fadeColor, var(--rb-logo-loop-fadeColorAuto)) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.rb-logo-loop-logoloop--vertical.rb-logo-loop-logoloop--fade::before,
.rb-logo-loop-logoloop--vertical.rb-logo-loop-logoloop--fade::after{
  left: 0;
  right: 0;
  width: 100%;
  height: clamp(24px, 8%, 120px);
}

.rb-logo-loop-logoloop--vertical.rb-logo-loop-logoloop--fade::before{
  top: 0;
  bottom: auto;
  background: linear-gradient(
    to bottom,
    var(--rb-logo-loop-fadeColor, var(--rb-logo-loop-fadeColorAuto)) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.rb-logo-loop-logoloop--vertical.rb-logo-loop-logoloop--fade::after{
  bottom: 0;
  top: auto;
  background: linear-gradient(
    to top,
    var(--rb-logo-loop-fadeColor, var(--rb-logo-loop-fadeColorAuto)) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

@media (prefers-reduced-motion: reduce) {
  .rb-logo-loop-logoloop__track{
    transform: translate3d(0, 0, 0) !important;
  }

  .rb-logo-loop-logoloop__item img,
  .rb-logo-loop-logoloop__node{
    transition: none !important;
  }
}
`;

function RbInjectedStyle({ css }: { css: string }) {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
export type RbLogoItem =
  | {
      node: React.ReactNode;
      href?: string;
      title?: string;
      ariaLabel?: string;
    }
  | {
      src: string;
      alt?: string;
      href?: string;
      title?: string;
      srcSet?: string;
      sizes?: string;
      width?: number;
      height?: number;
    };

export interface RbLogoLoopProps {
  logos?: RbLogoItem[];
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: RbLogoItem, key: React.Key) => React.ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2
} as const;

/* Referentially stable fallback so `logos` defaulting to [] does not produce a
 * new array identity on every render (it feeds the logoLists memo and the
 * image-loader / resize-observer effects). */
const EMPTY_LOGOS: RbLogoItem[] = [];

const orUndefined = (value: unknown): string | undefined =>
  typeof value === 'string' && value.length > 0 ? value : undefined;

const toCssLength = (value?: number | string): string | undefined =>
  typeof value === 'number' ? `${value}px` : (value ?? undefined);

const useResizeObserver = (
  callback: () => void,
  elements: Array<React.RefObject<Element | null>>,
  dependencies: React.DependencyList
) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }

    const observers = elements.map(ref => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });

    callback();

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, dependencies);
};

const useImageLoader = (
  seqRef: React.RefObject<HTMLUListElement | null>,
  onLoad: () => void,
  dependencies: React.DependencyList
) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];

    if (images.length === 0) {
      onLoad();
      return;
    }

    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) {
        onLoad();
      }
    };

    images.forEach(img => {
      const htmlImg = img as HTMLImageElement;
      if (htmlImg.complete) {
        handleImageLoad();
      } else {
        htmlImg.addEventListener('load', handleImageLoad, { once: true });
        htmlImg.addEventListener('error', handleImageLoad, { once: true });
      }
    });

    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageLoad);
      });
    };
  }, dependencies);
};

const useAnimationLoop = (
  trackRef: React.RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  seqHeight: number,
  isHovered: boolean,
  hoverSpeed: number | undefined,
  isVertical: boolean
) => {
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const seqSize = isVertical ? seqHeight : seqWidth;

    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      const transformValue = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`;
      track.style.transform = transformValue;
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqSize > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
        offsetRef.current = nextOffset;

        const transformValue = isVertical
          ? `translate3d(0, ${-offsetRef.current}px, 0)`
          : `translate3d(${-offsetRef.current}px, 0, 0)`;
        track.style.transform = transformValue;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical]);
};

export const RbLogoLoop = React.memo<RbLogoLoopProps>(
  ({
    logos = EMPTY_LOGOS,
    speed = 120,
    direction = 'left',
    width = '100%',
    logoHeight = 28,
    gap = 32,
    pauseOnHover,
    hoverSpeed,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    renderItem,
    ariaLabel = 'Partner logos',
    className,
    style
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLUListElement>(null);

    const [seqWidth, setSeqWidth] = useState<number>(0);
    const [seqHeight, setSeqHeight] = useState<number>(0);
    const [copyCount, setCopyCount] = useState<number>(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const effectiveHoverSpeed = useMemo(() => {
      if (hoverSpeed !== undefined) return hoverSpeed;
      if (pauseOnHover === true) return 0;
      if (pauseOnHover === false) return undefined;
      return 0;
    }, [hoverSpeed, pauseOnHover]);

    const isVertical = direction === 'up' || direction === 'down';

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      let directionMultiplier: number;
      if (isVertical) {
        directionMultiplier = direction === 'up' ? 1 : -1;
      } else {
        directionMultiplier = direction === 'left' ? 1 : -1;
      }
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction, isVertical]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceRect = seqRef.current?.getBoundingClientRect?.();
      const sequenceWidth = sequenceRect?.width ?? 0;
      const sequenceHeight = sequenceRect?.height ?? 0;
      if (isVertical) {
        const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
        if (containerRef.current && parentHeight > 0) {
          const targetHeight = Math.ceil(parentHeight);
          if (containerRef.current.style.height !== `${targetHeight}px`)
            containerRef.current.style.height = `${targetHeight}px`;
        }
        if (sequenceHeight > 0) {
          setSeqHeight(Math.ceil(sequenceHeight));
          const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
          const copiesNeeded = Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
          setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
        }
      } else if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    }, [isVertical]);

    useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical]);

    useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);

    useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical);

    const cssVariables = useMemo(
      () =>
        ({
          '--rb-logo-loop-gap': `${gap}px`,
          '--rb-logo-loop-logoHeight': `${logoHeight}px`,
          ...(fadeOutColor && { '--rb-logo-loop-fadeColor': fadeOutColor })
        }) as React.CSSProperties,
      [gap, logoHeight, fadeOutColor]
    );

    const rootClassName = useMemo(
      () =>
        [
          'rb-logo-loop-logoloop',
          isVertical ? 'rb-logo-loop-logoloop--vertical' : 'logoloop--horizontal',
          fadeOut && 'rb-logo-loop-logoloop--fade',
          scaleOnHover && 'rb-logo-loop-logoloop--scale-hover',
          className
        ]
          .filter(Boolean)
          .join(' '),
      [isVertical, fadeOut, scaleOnHover, className]
    );

    const handleMouseEnter = useCallback(() => {
      if (effectiveHoverSpeed !== undefined) setIsHovered(true);
    }, [effectiveHoverSpeed]);
    const handleMouseLeave = useCallback(() => {
      if (effectiveHoverSpeed !== undefined) setIsHovered(false);
    }, [effectiveHoverSpeed]);

    const renderLogoItem = useCallback(
      (item: RbLogoItem, key: React.Key) => {
        if (renderItem) {
          return (
            <li className="rb-logo-loop-logoloop__item" key={key} role="listitem">
              {renderItem(item, key)}
            </li>
          );
        }
        const isNodeItem = 'node' in item;
        /* React treats "" as a present-but-empty URL attribute, which makes the
         * browser re-request the current document. Normalise to undefined so the
         * attribute is omitted entirely. */
        const itemSrc = orUndefined((item as any).src);
        const itemSrcSet = orUndefined((item as any).srcSet);
        const itemSizes = orUndefined((item as any).sizes);
        const itemTitle = orUndefined((item as any).title);
        const content = isNodeItem ? (
          <span className="rb-logo-loop-logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
            {(item as any).node}
          </span>
        ) : (
          <img
            src={itemSrc}
            srcSet={itemSrcSet}
            sizes={itemSizes}
            width={(item as any).width}
            height={(item as any).height}
            alt={(item as any).alt ?? ''}
            title={itemTitle}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        );
        const itemAriaLabel = isNodeItem
          ? ((item as any).ariaLabel ?? (item as any).title)
          : ((item as any).alt ?? (item as any).title);
        const itemHref = orUndefined((item as any).href);
        const itemContent = itemHref ? (
          <a
            className="rb-logo-loop-logoloop__link"
            href={itemHref}
            aria-label={itemAriaLabel || 'logo link'}
            target="_blank"
            rel="noreferrer noopener"
          >
            {content}
          </a>
        ) : (
          content
        );
        return (
          <li className="rb-logo-loop-logoloop__item" key={key} role="listitem">
            {itemContent}
          </li>
        );
      },
      [renderItem]
    );

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className="rb-logo-loop-logoloop__list"
            key={`copy-${copyIndex}`}
            role="list"
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem]
    );

    const containerStyle = useMemo(
      (): React.CSSProperties => ({
        width: isVertical
          ? toCssLength(width) === '100%'
            ? undefined
            : toCssLength(width)
          : (toCssLength(width) ?? '100%'),
        ...cssVariables,
        ...style
      }),
      [width, cssVariables, style, isVertical]
    );

    return (
    <>
      <RbInjectedStyle css={RB_LOGO_LOOP_CSS} />
      {(
      <div ref={containerRef} className={rootClassName} style={containerStyle} role="region" aria-label={ariaLabel}>
        <div className="rb-logo-loop-logoloop__track" ref={trackRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {logoLists}
        </div>
      </div>
    )}
    </>
  )
  }
);

RbLogoLoop.displayName = 'LogoLoop';

export default RbLogoLoop;
