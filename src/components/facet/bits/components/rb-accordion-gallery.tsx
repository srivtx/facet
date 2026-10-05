"use client";
/* Vendored from DavidHDev/react-bits — Components/AccordionGallery/AccordionGallery.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import { useRef, useEffect, useState, useCallback, CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import { gsap } from 'gsap';

import { cn } from '@/lib/utils';

const RB_ACCORDION_GALLERY_CSS = `
.rb-accordion-gallery-accordion-gallery {
  --ag-accent: #ffffff;
  --ag-overlay: #060010;
  --ag-text: #ffffff;
  --ag-gap: 10px;
  --ag-radius: 16px;
  --ag-media-size: 320px;

  display: flex;
  flex-direction: row;
  gap: var(--ag-gap);
  width: 100%;
  max-width: 100%;
  perspective: 1400px;
  perspective-origin: 50% 50%;
  list-style: none;
  margin: 0;
  padding: 0;
}

.rb-accordion-gallery-accordion-gallery--vertical {
  flex-direction: column;
}

/* The panels are the flex items — they carry the flex-grow and the GSAP
   transform — so the list item that wraps them must not generate a box of its
   own. display:contents keeps the <li> in the accessibility tree as the
   listitem for its panel while letting the panel stay a direct flex child. */
.rb-accordion-gallery-ag-item {
  display: contents;
}

.rb-accordion-gallery-ag-panel {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border-radius: var(--ag-radius);
  cursor: pointer;
  display: block;
  text-decoration: none;
  outline: none;
  transform-style: preserve-3d;
  transform-origin: center center;
  background: #0a0713;
  box-shadow: 0 10px 30px -18px rgba(0, 0, 0, 0.8);
  will-change: flex-grow, transform;
  -webkit-tap-highlight-color: transparent;
}

.rb-accordion-gallery-ag-panel:focus-visible {
  box-shadow:
    0 0 0 2px var(--ag-accent),
    0 10px 30px -18px rgba(0, 0, 0, 0.8);
}

.rb-accordion-gallery-ag-panel__frame {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
}

.rb-accordion-gallery-ag-panel__media {
  --ag-gray: 1;
  --ag-dim: 0.35;
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--ag-media-size);
  height: 100%;
  filter: grayscale(var(--ag-gray));
  will-change: transform, filter;
}

.rb-accordion-gallery-accordion-gallery--vertical .rb-accordion-gallery-ag-panel__media {
  width: 100%;
  height: var(--ag-media-size);
}

.rb-accordion-gallery-ag-panel__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.rb-accordion-gallery-ag-panel__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, transparent 45%, color-mix(in srgb, var(--ag-overlay) 78%, transparent) 100%),
    color-mix(in srgb, var(--ag-overlay) calc(var(--ag-dim, 0.35) * 100%), transparent);
}

.rb-accordion-gallery-ag-panel__label {
  position: absolute;
  left: 20px;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: none;
  z-index: 2;
}

.rb-accordion-gallery-ag-panel__bar {
  flex: 0 0 auto;
  width: 3px;
  height: 26px;
  border-radius: 3px;
  background: var(--ag-accent);
  opacity: 0;
  box-shadow: 0 0 12px color-mix(in srgb, var(--ag-accent) 60%, transparent);
}

.rb-accordion-gallery-ag-panel__text {
  color: var(--ag-text);
  font-family: inherit;
  font-weight: 600;
  font-size: clamp(1rem, 1.4vw, 1.4rem);
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.55);
}

@media (max-width: 520px) {
  .rb-accordion-gallery-accordion-gallery {
    flex-direction: column;
    perspective: none;
    height: auto !important;
  }
  .rb-accordion-gallery-ag-panel {
    min-height: 84px;
    transform: none !important;
  }
  .rb-accordion-gallery-accordion-gallery .rb-accordion-gallery-ag-panel__media {
    width: 100%;
    height: var(--ag-media-size);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rb-accordion-gallery-ag-panel,
  .rb-accordion-gallery-ag-panel__media {
    will-change: auto;
  }
}

`;

export interface AccordionGalleryItem {
  image: string;
  label?: string;
  link?: string;
  alt?: string;
}

export interface AccordionGalleryProps {
  items?: AccordionGalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: 'horizontal' | 'vertical';
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: 'hover' | 'click';
  showLabels?: boolean;
  grayscale?: boolean;
  className?: string;
}

/* Upstream used picsum placeholder URLs; five 900x1200 portraits are vendored under
 * /public/photos/vendor instead (see public/README.md). */
const DEFAULT_ITEMS: AccordionGalleryItem[] = [
  { image: '/photos/vendor/pic-acc-1015.jpg', label: 'Canyon', link: '#' },
  { image: '/photos/vendor/pic-acc-1018.jpg', label: 'Ridgeline', link: '#' },
  { image: '/photos/vendor/pic-acc-1039.jpg', label: 'Falls', link: '#' },
  { image: '/photos/vendor/pic-acc-1043.jpg', label: 'Harbour', link: '#' },
  { image: '/photos/vendor/pic-acc-1044.jpg', label: 'Skyline', link: '#' }
];

const RbAccordionGallery = ({
  items = DEFAULT_ITEMS,
  defaultIndex = 2,
  accentColor = '#ffffff',
  overlayColor = '#060010',
  textColor = '#ffffff',
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = ''
}: AccordionGalleryProps) => {
  /* The list root is a <ul> now that the panels are wrapped in <li>, but nothing
     downstream of this ref is div-specific: it only measures and sets a custom
     property. */
  const rootRef = useRef<HTMLUListElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLElement | null)[]>([]);
  const barRefs = useRef<(HTMLElement | null)[]>([]);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === 'vertical';
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));

  /* Read the media query from an effect and keep it in a ref: a render-time
     matchMedia gives the server `false` and the client the real answer, which
     would make applyLayout's identity (and every effect depending on it) differ
     across hydration. */
  const prefersReducedRef = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return undefined;
    const sync = () => {
      prefersReducedRef.current = mq.matches;
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReducedRef.current ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 1) : 0;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              '--ag-gray': gray,
              '--ag-dim': isActive ? 0 : 0.35,
              duration: dur,
              ease
            },
            0
          );
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReducedRef.current ? 0 : stagger }, 0);
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
          }
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger
    ]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
      mediaSizeRef.current = size;
      el.style.setProperty('--ag-media-size', `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    []
  );

  const handleEnter = (i: number) => {
    if (trigger === 'hover') setActive(i);
  };

  const handleClick = (i: number, e: MouseEvent) => {
    if (i !== active) {
      e.preventDefault();
      setActive(i);
    }
  };

  const handleKeyDown = (i: number, e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  const rootStyle = {
    '--ag-accent': accentColor,
    '--ag-overlay': overlayColor,
    '--ag-text': textColor,
    '--ag-gap': `${gap}px`,
    '--ag-radius': `${radius}px`,
    height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`
  } as CSSProperties;

  return (
    <>
          <style href="rb-accordion-gallery" precedence="rb">{RB_ACCORDION_GALLERY_CSS}</style>
          <ul
      ref={rootRef}
      className={`rb-accordion-gallery-accordion-gallery${vertical ? ' rb-accordion-gallery-accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={rootStyle}
      aria-label="Image accordion gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const Tag = (item.link ? 'a' : 'div') as 'a';
        return (
          /* The panels are <a>/<div> and `listitem` is not an allowed role on
             either host, so the list item has to be a wrapper rather than a role
             bolted onto the panel. That wrapper is an <li> — which is also why
             it is display:contents rather than the panel: the panel stays the
             flex item, so flex-grow and the GSAP transform keep working. */
          <li className="rb-accordion-gallery-ag-item" key={i}>
          <Tag
            ref={(el: HTMLElement | null) => {
              panelRefs.current[i] = el;
            }}
            className={cn("rb-accordion-gallery-ag-panel", isActive ? "rb-accordion-gallery-ag-panel--active" : '')}
            style={{ borderRadius: `${radius}px` }}
            href={item.link || undefined}
            onClick={e => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={e => handleKeyDown(i, e)}
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label}
          >
            <span className={cn("rb-accordion-gallery-ag-panel__frame")}>
              <span
                className={cn("rb-accordion-gallery-ag-panel__media")}
                ref={(el: HTMLElement | null) => {
                  mediaRefs.current[i] = el;
                }}
              >
                <img src={item.image} alt={item.alt || item.label || ''} draggable={false} />
              </span>
              <span className={cn("rb-accordion-gallery-ag-panel__overlay")} aria-hidden="true" />
            </span>
            {showLabels && (
              <span className={cn("rb-accordion-gallery-ag-panel__label")} aria-hidden="true">
                <span
                  className={cn("rb-accordion-gallery-ag-panel__bar")}
                  ref={(el: HTMLElement | null) => {
                    barRefs.current[i] = el;
                  }}
                />
                <span
                  className={cn("rb-accordion-gallery-ag-panel__text")}
                  ref={(el: HTMLElement | null) => {
                    textRefs.current[i] = el;
                  }}
                >
                  {item.label}
                </span>
              </span>
            )}
          </Tag>
          </li>
        );
      })}
    </ul>
        </>
  );
};

export { RbAccordionGallery };
export default RbAccordionGallery;
