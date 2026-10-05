"use client";
/* Vendored from DavidHDev/react-bits — Components/CardNav/CardNav.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
// use your own icon import if react-icons is not available
import { GoArrowUpRight } from 'react-icons/go';
import { cn } from '@/lib/utils';

const RB_CARD_NAV_CSS = `
.rb-card-nav-card-nav-container {
  position: absolute;
  top: 2em;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
  z-index: 99;
  box-sizing: border-box;
}

.rb-card-nav-card-nav {
  display: block;
  height: 60px;
  padding: 0;
  background-color: white;
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  will-change: height;
}

.rb-card-nav-card-nav-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.45rem 0.55rem 1.1rem;
  z-index: 2;
}

.rb-card-nav-hamburger-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 6px;
}

.rb-card-nav-hamburger-menu:hover .rb-card-nav-hamburger-line {
  opacity: 0.75;
}

.rb-card-nav-hamburger-line {
  width: 30px;
  height: 2px;
  background-color: currentColor;
  transition:
    transform 0.25s ease,
    opacity 0.2s ease,
    margin 0.3s ease;
  transform-origin: 50% 50%;
}

.rb-card-nav-hamburger-menu.rb-card-nav-open .rb-card-nav-hamburger-line:first-child {
  transform: translateY(4px) rotate(45deg);
}

.rb-card-nav-hamburger-menu.rb-card-nav-open .rb-card-nav-hamburger-line:last-child {
  transform: translateY(-4px) rotate(-45deg);
}

.rb-card-nav-logo-container {
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.rb-card-nav-logo {
  height: 28px;
}

.rb-card-nav-card-nav-cta-button {
  background-color: #111;
  color: white;
  border: none;
  border-radius: calc(0.75rem - 0.35rem);
  padding: 0 1rem;
  height: 100%;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-items: center;
}

.rb-card-nav-card-nav-cta-button:hover {
  background-color: #333;
}

.rb-card-nav-card-nav-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 60px;
  bottom: 0;
  padding: 0.5rem;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  visibility: hidden;
  pointer-events: none;
  z-index: 1;
}

.rb-card-nav-card-nav.rb-card-nav-open .rb-card-nav-card-nav-content {
  visibility: visible;
  pointer-events: auto;
}

.rb-card-nav-nav-card {
  height: 100%;
  flex: 1 1 0;
  min-width: 0;
  border-radius: calc(0.75rem - 0.2rem);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  gap: 8px;
  user-select: none;
}

.rb-card-nav-nav-card-label {
  font-weight: 400;
  font-size: 22px;
  letter-spacing: -0.5px;
}

.rb-card-nav-nav-card-links {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rb-card-nav-nav-card-link {
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.rb-card-nav-nav-card-link:hover {
  opacity: 0.75;
}

@media (max-width: 768px) {
  .rb-card-nav-card-nav-container {
    width: 90%;
    top: 1.2em;
  }

  .rb-card-nav-card-nav-top {
    padding: 0.5rem 1rem;
    justify-content: space-between;
  }

  .rb-card-nav-hamburger-menu {
    order: 2;
  }

  .rb-card-nav-logo-container {
    position: static;
    transform: none;
    order: 1;
  }

  .rb-card-nav-card-nav-cta-button {
    display: none;
  }

  .rb-card-nav-card-nav-content {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding: 0.5rem;
    bottom: 0;
    justify-content: flex-start;
  }

  .rb-card-nav-nav-card {
    height: auto;
    min-height: 60px;
    flex: 1 1 auto;
    max-height: none;
  }

  .rb-card-nav-nav-card-label {
    font-size: 18px;
  }

  .rb-card-nav-nav-card-link {
    font-size: 15px;
  }
}

`;

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const RbCardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.rb-card-nav-card-nav-content') as HTMLElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    /* An empty cards array is a valid state (`items` may be empty); GSAP warns
     * about unresolvable targets, so only touch the cards when there are some. */
    const cards = cardsRef.current;
    if (cards.length) {
      gsap.set(cards, { y: 50, opacity: 0 });
    }

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease
    });

    if (cards.length) {
      tl.to(cards, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');
    }

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <>
          <style href="rb-card-nav" precedence="rb">{RB_CARD_NAV_CSS}</style>
          <div className={cn("rb-card-nav-card-nav-container", className)}>
      <nav ref={navRef} aria-label="Card navigation" className={cn("rb-card-nav-card-nav", isExpanded ? "rb-card-nav-open" : '')} style={{ backgroundColor: baseColor }}>
        <div className={cn("rb-card-nav-card-nav-top")}>
          <div
            className={cn("rb-card-nav-hamburger-menu", isHamburgerOpen ? "rb-card-nav-open" : '')}
            onClick={toggleMenu}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
              }
            }}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            aria-expanded={isExpanded}
            tabIndex={0}
            style={{ color: menuColor || '#000' }}
          >
            <div className={cn("rb-card-nav-hamburger-line")} />
            <div className={cn("rb-card-nav-hamburger-line")} />
          </div>

          <div className={cn("rb-card-nav-logo-container")}>
            {logo ? <img src={logo} alt={logoAlt} className={cn("rb-card-nav-logo")} /> : null}
          </div>

          <button
            type="button"
            className={cn("rb-card-nav-card-nav-cta-button")}
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            Get Started
          </button>
        </div>

        <div className={cn("rb-card-nav-card-nav-content")} aria-hidden={!isExpanded}>
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className={cn("rb-card-nav-nav-card")}
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className={cn("rb-card-nav-nav-card-label")}>{item.label}</div>
              <div className={cn("rb-card-nav-nav-card-links")}>
                {item.links?.map((lnk, i) => (
                  <a key={`${lnk.label}-${i}`} className={cn("rb-card-nav-nav-card-link")} href={lnk.href} aria-label={lnk.ariaLabel}>
                    <GoArrowUpRight className={cn("rb-card-nav-nav-card-link-icon")} aria-hidden="true" />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
        </>
  );
};

export { RbCardNav };
export default RbCardNav;
