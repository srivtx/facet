"use client";
/* Vendored from DavidHDev/react-bits — Components/BubbleMenu/BubbleMenu.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import type { CSSProperties, ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

import { cn } from '@/lib/utils';

const RB_BUBBLE_MENU_CSS = `
.rb-bubble-menu-bubble-menu {
  left: 0;
  right: 0;
  top: 2em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 2em;
  pointer-events: none;
  z-index: 99;
}

.rb-bubble-menu-bubble-menu.rb-bubble-menu-fixed {
  position: fixed;
}

.rb-bubble-menu-bubble-menu.rb-bubble-menu-absolute {
  position: absolute;
}

.rb-bubble-menu-bubble-menu .rb-bubble-menu-bubble {
  --bubble-size: 48px;
  width: var(--bubble-size);
  height: var(--bubble-size);
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.rb-bubble-menu-bubble-menu .rb-bubble-menu-logo-bubble,
.rb-bubble-menu-bubble-menu .rb-bubble-menu-toggle-bubble {
  will-change: transform;
}

.rb-bubble-menu-bubble-menu .rb-bubble-menu-logo-bubble {
  width: auto;
  min-height: var(--bubble-size);
  height: var(--bubble-size);
  padding: 0 16px;
  border-radius: calc(var(--bubble-size) / 2);
  gap: 8px;
}

.rb-bubble-menu-bubble-menu .rb-bubble-menu-toggle-bubble {
  width: var(--bubble-size);
  height: var(--bubble-size);
}

.rb-bubble-menu-bubble-menu .rb-bubble-menu-bubble-logo {
  max-height: 60%;
  max-width: 100%;
  object-fit: contain;
  display: block;
}

.rb-bubble-menu-bubble-menu .rb-bubble-menu-logo-content {
  --logo-max-height: 60%;
  --logo-max-width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 100%;
}

.rb-bubble-menu-bubble-menu .rb-bubble-menu-logo-content > .rb-bubble-menu-bubble-logo,
.rb-bubble-menu-bubble-menu .rb-bubble-menu-logo-content > img,
.rb-bubble-menu-bubble-menu .rb-bubble-menu-logo-content > svg {
  max-height: var(--logo-max-height);
  max-width: var(--logo-max-width);
}

.rb-bubble-menu-bubble-menu .rb-bubble-menu-menu-btn {
  border: none;
  background: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.rb-bubble-menu-bubble-menu .rb-bubble-menu-menu-line {
  width: 26px;
  height: 2px;
  background: #111;
  border-radius: 2px;
  display: block;
  margin: 0 auto;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  transform-origin: center;
}

.rb-bubble-menu-bubble-menu .rb-bubble-menu-menu-line + .rb-bubble-menu-menu-line {
  margin-top: 6px;
}

.rb-bubble-menu-bubble-menu .rb-bubble-menu-menu-btn.rb-bubble-menu-open .rb-bubble-menu-menu-line:first-child {
  transform: translateY(4px) rotate(45deg);
}

.rb-bubble-menu-bubble-menu .rb-bubble-menu-menu-btn.rb-bubble-menu-open .rb-bubble-menu-menu-line:last-child {
  transform: translateY(-4px) rotate(-45deg);
}

@media (min-width: 768px) {
  .rb-bubble-menu-bubble-menu .rb-bubble-menu-bubble {
    --bubble-size: 56px;
  }

  .rb-bubble-menu-bubble-menu .rb-bubble-menu-logo-bubble {
    padding: 0 16px;
  }
}

.rb-bubble-menu-bubble-menu-items {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 98;
}

.rb-bubble-menu-bubble-menu-items.rb-bubble-menu-fixed {
  position: fixed;
}

.rb-bubble-menu-bubble-menu-items.rb-bubble-menu-absolute {
  position: absolute;
}

.rb-bubble-menu-bubble-menu-items .rb-bubble-menu-pill-list {
  list-style: none;
  margin: 0;
  padding: 0 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  row-gap: 4px;
  width: 100%;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
  pointer-events: auto;
  justify-content: stretch;
}

.rb-bubble-menu-bubble-menu-items .rb-bubble-menu-pill-list .rb-bubble-menu-pill-spacer {
  width: 100%;
  height: 0;
  pointer-events: none;
}

.rb-bubble-menu-bubble-menu-items .rb-bubble-menu-pill-list .rb-bubble-menu-pill-col {
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex: 0 0 calc(100% / 3);
  box-sizing: border-box;
}

.rb-bubble-menu-bubble-menu-items .rb-bubble-menu-pill-list .rb-bubble-menu-pill-col:nth-child(4):nth-last-child(2) {
  margin-left: calc(100% / 6);
}

.rb-bubble-menu-bubble-menu-items .rb-bubble-menu-pill-list .rb-bubble-menu-pill-col:nth-child(4):last-child {
  margin-left: calc(100% / 3);
}

.rb-bubble-menu-bubble-menu-items .rb-bubble-menu-pill-link {
  --pill-bg: #ffffff;
  --pill-color: #111;
  --pill-border: rgba(0, 0, 0, 0.12);
  --item-rot: 0deg;
  --pill-min-h: 160px;
  --hover-bg: #f3f4f6;
  --hover-color: #111;
  width: 100%;
  min-height: var(--pill-min-h);
  padding: clamp(1.5rem, 3vw, 8rem) 0;
  font-size: clamp(1.5rem, 4vw, 4rem);
  font-weight: 400;
  line-height: 0;
  border-radius: 999px;
  background: var(--pill-bg);
  color: var(--pill-color);
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition:
    background 0.3s ease,
    color 0.3s ease;
  will-change: transform;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  height: 10px;
}

@media (min-width: 900px) {
  .rb-bubble-menu-bubble-menu-items .rb-bubble-menu-pill-link {
    transform: rotate(var(--item-rot));
  }

  .rb-bubble-menu-bubble-menu-items .rb-bubble-menu-pill-link:hover {
    transform: rotate(var(--item-rot)) scale(1.06);
    background: var(--hover-bg);
    color: var(--hover-color);
  }

  .rb-bubble-menu-bubble-menu-items .rb-bubble-menu-pill-link:active {
    transform: rotate(var(--item-rot)) scale(0.94);
  }
}

.rb-bubble-menu-bubble-menu-items .rb-bubble-menu-pill-link .rb-bubble-menu-pill-label {
  display: inline-block;
  will-change: transform, opacity;
  height: 1.2em;
  line-height: 1.2;
}

@media (max-width: 899px) {
  .rb-bubble-menu-bubble-menu-items {
    padding-top: 0px;
    align-items: flex-start;
    padding-top: 120px;
  }

  .rb-bubble-menu-bubble-menu-items .rb-bubble-menu-pill-list {
    row-gap: 16px;
  }

  .rb-bubble-menu-bubble-menu-items .rb-bubble-menu-pill-list .rb-bubble-menu-pill-col {
    flex: 0 0 100%;
    margin-left: 0 !important;
    overflow: visible;
  }

  .rb-bubble-menu-bubble-menu-items .rb-bubble-menu-pill-link {
    font-size: clamp(1.2rem, 3vw, 4rem);
    padding: clamp(1rem, 2vw, 2rem) 0;
    min-height: 80px;
  }

  .rb-bubble-menu-bubble-menu-items .rb-bubble-menu-pill-link:hover {
    transform: scale(1.06);
    background: var(--hover-bg);
    color: var(--hover-color);
  }

  .rb-bubble-menu-bubble-menu-items .rb-bubble-menu-pill-link:active {
    transform: scale(0.94);
  }
}

`;

type MenuItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: {
    bgColor?: string;
    textColor?: string;
  };
};

export type BubbleMenuProps = {
  logo: ReactNode | string;
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  items?: MenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
};

const DEFAULT_ITEMS: MenuItem[] = [
  {
    label: 'home',
    href: '#',
    ariaLabel: 'Home',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'about',
    href: '#',
    ariaLabel: 'About',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'projects',
    href: '#',
    ariaLabel: 'Documentation',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'blog',
    href: '#',
    ariaLabel: 'Blog',
    rotation: 8,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
  },
  {
    label: 'contact',
    href: '#',
    ariaLabel: 'Contact',
    rotation: -8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  }
];

function RbBubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = 'Toggle menu',
  menuBg = '#fff',
  menuContentColor = '#111',
  useFixedPosition = false,
  items,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.12
}: BubbleMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLAnchorElement[]>([]);
  const labelRefs = useRef<HTMLSpanElement[]>([]);

  const menuItems = items?.length ? items : DEFAULT_ITEMS;
  const containerClassName = ['rb-bubble-menu-bubble-menu', useFixedPosition ? 'rb-bubble-menu-fixed' : 'rb-bubble-menu-absolute', className]
    .filter(Boolean)
    .join(' ');

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);

    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });

        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: 'power3.out'
            },
            `-=${animationDuration * 0.9}`
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power3.in'
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setShowOverlay(false);
        }
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen) {
        const bubbles = bubblesRef.current.filter(Boolean);
        const isDesktop = window.innerWidth >= 900;

        bubbles.forEach((bubble, i) => {
          const item = menuItems[i];
          if (bubble && item) {
            const rotation = isDesktop ? (item.rotation ?? 0) : 0;
            gsap.set(bubble, { rotation });
          }
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen, menuItems]);

  return (
    <>
          <style href="rb-bubble-menu" precedence="rb">{RB_BUBBLE_MENU_CSS}</style>
      <nav className={containerClassName} style={style} aria-label="Main navigation">
        {/* No aria-label on this div: a bare <div> has no role that permits
            one, and the logo inside already carries alt="Logo". Labelling the
            wrapper as well made the container a nameless ARIA violation and
            duplicated the name. */}
        <div className={cn("rb-bubble-menu-bubble rb-bubble-menu-logo-bubble")} style={{ background: menuBg }}>
          <span className={cn("rb-bubble-menu-logo-content")}>
            {typeof logo === 'string' ? <img src={logo} alt="Logo" className={cn("rb-bubble-menu-bubble-logo")} /> : logo}
          </span>
        </div>

        <button
          type="button"
          className={cn("rb-bubble-menu-bubble rb-bubble-menu-toggle-bubble rb-bubble-menu-menu-btn", isMenuOpen ? "rb-bubble-menu-open" : '')}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ background: menuBg }}
        >
          <span className={cn("rb-bubble-menu-menu-line")} style={{ background: menuContentColor }} />
          <span className={cn("rb-bubble-menu-menu-line rb-bubble-menu-short")} style={{ background: menuContentColor }} />
        </button>
      </nav>
      {showOverlay && (
        <div
          ref={overlayRef}
          className={cn("rb-bubble-menu-bubble-menu-items", useFixedPosition ? "rb-bubble-menu-fixed" : "rb-bubble-menu-absolute")}
          aria-hidden={!isMenuOpen}
        >
          <ul className={cn("rb-bubble-menu-pill-list")} role="menu" aria-label="Menu links">
            {menuItems.map((item, idx) => (
              <li key={idx} role="none" className={cn("rb-bubble-menu-pill-col")}>
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  className={cn("rb-bubble-menu-pill-link")}
                  style={
                    {
                      '--item-rot': `${item.rotation ?? 0}deg`,
                      '--pill-bg': menuBg,
                      '--pill-color': menuContentColor,
                      '--hover-bg': item.hoverStyles?.bgColor || '#f3f4f6',
                      '--hover-color': item.hoverStyles?.textColor || menuContentColor
                    } as CSSProperties
                  }
                  ref={el => {
                    if (el) bubblesRef.current[idx] = el;
                  }}
                >
                  <span
                    className={cn("rb-bubble-menu-pill-label")}
                    ref={el => {
                      if (el) labelRefs.current[idx] = el;
                    }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export { RbBubbleMenu };
export default RbBubbleMenu;
