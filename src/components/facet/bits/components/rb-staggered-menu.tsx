"use client";
/* Vendored from DavidHDev/react-bits — Components/StaggeredMenu/StaggeredMenu.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

const RB_STAGGERED_MENU_CSS = `
.rb-staggered-menu-staggered-menu-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 40;
  pointer-events: none;
}

.rb-staggered-menu-staggered-menu-wrapper.rb-staggered-menu-fixed-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 40;
  overflow: hidden;
}

.rb-staggered-menu-staggered-menu-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2em;
  background: transparent;
  pointer-events: none;
  z-index: 20;
}

.rb-staggered-menu-staggered-menu-header > * {
  pointer-events: auto;
}

.rb-staggered-menu-sm-logo {
  display: flex;
  align-items: center;
  user-select: none;
}

.rb-staggered-menu-sm-logo-img {
  display: block;
  height: 32px;
  width: auto;
  object-fit: contain;
}

.rb-staggered-menu-sm-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #e9e9ef;
  font-weight: 500;
  line-height: 1;
  overflow: visible;
}

.rb-staggered-menu-sm-toggle:focus-visible {
  outline: 2px solid #ffffffaa;
  outline-offset: 4px;
  border-radius: 4px;
}

.rb-staggered-menu-sm-line:last-of-type {
  margin-top: 6px;
}

.rb-staggered-menu-sm-toggle-textWrap {
  position: relative;
  display: inline-block;
  height: 1em;
  overflow: hidden;
  white-space: nowrap;
  width: var(--sm-toggle-width, auto);
  min-width: var(--sm-toggle-width, auto);
}

.rb-staggered-menu-sm-toggle-textInner {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.rb-staggered-menu-sm-toggle-line {
  display: block;
  height: 1em;
  line-height: 1;
}

.rb-staggered-menu-sm-icon {
  position: relative;
  width: 14px;
  height: 14px;
  flex: 0 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
}

.rb-staggered-menu-sm-panel-itemWrap {
  position: relative;
  overflow: hidden;
  line-height: 1;
}

.rb-staggered-menu-sm-icon-line {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  transform: translate(-50%, -50%);
  will-change: transform;
}

.rb-staggered-menu-sm-line {
  display: none !important;
}

.rb-staggered-menu-staggered-menu-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: clamp(260px, 38vw, 420px);
  height: 100%;
  background: white;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  padding: 6em 2em 2em 2em;
  overflow-y: auto;
  z-index: 10;
  pointer-events: auto;
  opacity: 0;
}

[data-position='left'] .rb-staggered-menu-staggered-menu-panel {
  right: auto;
  left: 0;
}

.rb-staggered-menu-sm-prelayers {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: clamp(260px, 38vw, 420px);
  pointer-events: none;
  z-index: 5;
  opacity: 0;
}

[data-position='left'] .rb-staggered-menu-sm-prelayers {
  right: auto;
  left: 0;
}

.rb-staggered-menu-sm-prelayer {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  transform: translateX(0);
  opacity: 0;
}

.rb-staggered-menu-sm-panel-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.rb-staggered-menu-sm-socials {
  margin-top: auto;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rb-staggered-menu-sm-socials-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--sm-accent, #ff0000);
}

.rb-staggered-menu-sm-socials-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.rb-staggered-menu-sm-socials-list .rb-staggered-menu-sm-socials-link {
  opacity: 1;
}

.rb-staggered-menu-sm-socials-list:hover .rb-staggered-menu-sm-socials-link {
  opacity: 0.35;
}

.rb-staggered-menu-sm-socials-list:hover .rb-staggered-menu-sm-socials-link:hover {
  opacity: 1;
}

.rb-staggered-menu-sm-socials-link:focus-visible {
  outline: 2px solid var(--sm-accent, #ff0000);
  outline-offset: 3px;
}

.rb-staggered-menu-sm-socials-list:focus-within .rb-staggered-menu-sm-socials-link {
  opacity: 0.35;
}

.rb-staggered-menu-sm-socials-list:focus-within .rb-staggered-menu-sm-socials-link:focus-visible {
  opacity: 1;
}

.rb-staggered-menu-sm-socials-link {
  font-size: 1.2rem;
  font-weight: 500;
  color: #111;
  text-decoration: none;
  position: relative;
  padding: 2px 0;
  display: inline-block;
  transition:
    color 0.3s ease,
    opacity 0.3s ease;
}

.rb-staggered-menu-sm-socials-link:hover {
  color: var(--sm-accent, #ff0000);
}

.rb-staggered-menu-sm-panel-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
}

.rb-staggered-menu-sm-panel-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rb-staggered-menu-sm-panel-item {
  position: relative;
  color: #000;
  font-weight: 600;
  font-size: 4rem;
  cursor: pointer;
  line-height: 1;
  letter-spacing: -2px;
  text-transform: uppercase;
  transition:
    background 0.25s,
    color 0.25s;
  display: inline-block;
  text-decoration: none;
  padding-right: 1.4em;
}

.rb-staggered-menu-staggered-menu-panel .rb-staggered-menu-sm-socials-list .rb-staggered-menu-sm-socials-link {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.rb-staggered-menu-staggered-menu-panel .rb-staggered-menu-sm-socials-list:hover .rb-staggered-menu-sm-socials-link:not(:hover) {
  opacity: 0.35;
}

.rb-staggered-menu-staggered-menu-panel .rb-staggered-menu-sm-socials-list:focus-within .rb-staggered-menu-sm-socials-link:not(:focus-visible) {
  opacity: 0.35;
}

.rb-staggered-menu-staggered-menu-panel .rb-staggered-menu-sm-socials-list .rb-staggered-menu-sm-socials-link:hover,
.rb-staggered-menu-staggered-menu-panel .rb-staggered-menu-sm-socials-list .rb-staggered-menu-sm-socials-link:focus-visible {
  opacity: 1;
}

.rb-staggered-menu-sm-panel-itemLabel {
  display: inline-block;
  will-change: transform;
  transform-origin: 50% 100%;
}

.rb-staggered-menu-sm-panel-item:hover {
  color: var(--sm-accent, #5227ff);
}

.rb-staggered-menu-sm-panel-list[data-numbering] {
  counter-reset: smItem;
}

.rb-staggered-menu-sm-panel-list[data-numbering] .rb-staggered-menu-sm-panel-item::after {
  counter-increment: smItem;
  content: counter(smItem, decimal-leading-zero);
  position: absolute;
  top: 0.1em;
  right: 3.2em;
  font-size: 18px;
  font-weight: 400;
  color: var(--sm-accent, #5227ff);
  letter-spacing: 0;
  pointer-events: none;
  user-select: none;
  opacity: var(--sm-num-opacity, 0);
}

@media (max-width: 1024px) {
  .rb-staggered-menu-staggered-menu-panel {
    width: 100%;
    left: 0;
    right: 0;
  }

  .rb-staggered-menu-staggered-menu-wrapper[data-open] .rb-staggered-menu-sm-logo-img {
    filter: invert(100%);
  }
}

@media (max-width: 640px) {
  .rb-staggered-menu-staggered-menu-panel {
    width: 100%;
    left: 0;
    right: 0;
  }

  .rb-staggered-menu-staggered-menu-wrapper[data-open] .rb-staggered-menu-sm-logo-img {
    filter: invert(100%);
  }
}

`;

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  isFixed?: boolean;
}

export const RbStaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  colors = ['#B497CF', '#5227FF'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  accentColor = '#5227FF',
  isFixed = false,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose
}: StaggeredMenuProps) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const textWrapRef = useRef<HTMLSpanElement | null>(null);
  const [textLines, setTextLines] = useState<string[]>(['Menu', 'Close']);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.rb-staggered-menu-sm-prelayer')) as HTMLElement[];
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
      if (preContainer) {
        gsap.set(preContainer, { xPercent: 0, opacity: 1 });
      }
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      gsap.set(textInner, { yPercent: 0 });
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.rb-staggered-menu-sm-panel-itemLabel')) as HTMLElement[];
    const numberEls = Array.from(
      panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
    ) as HTMLElement[];
    const socialTitle = panel.querySelector('.rb-staggered-menu-sm-socials-title') as HTMLElement | null;
    const socialLinks = Array.from(panel.querySelectorAll('.rb-staggered-menu-sm-socials-link')) as HTMLElement[];

    const offscreen = position === 'left' ? -100 : 100;
    const layerStates = layers.map(el => ({ el, start: offscreen }));
    const panelStart = offscreen;

    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    }
    if (numberEls.length) {
      gsap.set(numberEls, { '--sm-num-opacity': 0 });
    }
    if (socialTitle) {
      gsap.set(socialTitle, { opacity: 0 });
    }
    if (socialLinks.length) {
      gsap.set(socialLinks, { y: 25, opacity: 0 });
    }

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });
    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;
    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: { each: 0.1, from: 'start' }
        },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: 'power2.out',
            '--sm-num-opacity': 1,
            stagger: { each: 0.08, from: 'start' }
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(
          socialTitle,
          {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
          },
          socialsStart
        );
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            }
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all: HTMLElement[] = [...layers, panel];
    closeTweenRef.current?.kill();
    const offscreen = position === 'left' ? -100 : 100;
    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.rb-staggered-menu-sm-panel-itemLabel')) as HTMLElement[];
        if (itemEls.length) {
          gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        }
        const numberEls = Array.from(
          panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
        ) as HTMLElement[];
        if (numberEls.length) {
          gsap.set(numberEls, { '--sm-num-opacity': 0 });
        }
        const socialTitle = panel.querySelector('.rb-staggered-menu-sm-socials-title') as HTMLElement | null;
        const socialLinks = Array.from(panel.querySelectorAll('.rb-staggered-menu-sm-socials-link')) as HTMLElement[];
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        busyRef.current = false;
      }
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    if (opening) {
      spinTweenRef.current = gsap.to(icon, { rotate: 225, duration: 0.8, ease: 'power4.out', overwrite: 'auto' });
    } else {
      spinTweenRef.current = gsap.to(icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq: string[] = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    setTextLines(seq);

    gsap.set(inner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu]);

  return (
    <>
          <style href="rb-staggered-menu" precedence="rb">{RB_STAGGERED_MENU_CSS}</style>
          <div
      className={(className ? className + ' ' : '') + 'rb-staggered-menu-staggered-menu-wrapper' + (isFixed ? ' rb-staggered-menu-fixed-wrapper' : '')}
      style={accentColor ? { ['--sm-accent' as any]: accentColor } : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      <div ref={preLayersRef} className={cn("rb-staggered-menu-sm-prelayers")} aria-hidden="true">
        {(() => {
          const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
          let arr = [...raw];
          if (arr.length >= 3) {
            const mid = Math.floor(arr.length / 2);
            arr.splice(mid, 1);
          }
          return arr.map((c, i) => <div key={i} className={cn("rb-staggered-menu-sm-prelayer")} style={{ background: c }} />);
        })()}
      </div>
      <header className={cn("rb-staggered-menu-staggered-menu-header")} aria-label="Main navigation header">
        {/* No aria-label here: a bare <div> has no role that permits one, and
            the <img alt="Logo"> below is already the accessible name for the
            logo. The wrapper was a nameless-ARIA violation and a duplicate. */}
        <div className={cn("rb-staggered-menu-sm-logo")}>
          {/* Upstream defaulted to /src/assets/logos/reactbits-gh-white.svg, a
              Vite-only path that 404s here. With no logoUrl there is simply no
              image instead of a request for a path that cannot resolve. */}
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className={cn("rb-staggered-menu-sm-logo-img")}
              draggable={false}
              width={110}
              height={24}
            />
          )}
        </div>
        <button
          ref={toggleBtnRef}
          className={cn("rb-staggered-menu-sm-toggle")}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="rb-staggered-menu-staggered-menu-panel"
          onClick={toggleMenu}
          type="button"
        >
          <span ref={textWrapRef} className={cn("rb-staggered-menu-sm-toggle-textWrap")} aria-hidden="true">
            <span ref={textInnerRef} className={cn("rb-staggered-menu-sm-toggle-textInner")}>
              {textLines.map((l, i) => (
                <span className={cn("rb-staggered-menu-sm-toggle-line")} key={i}>
                  {l}
                </span>
              ))}
            </span>
          </span>
          <span ref={iconRef} className={cn("rb-staggered-menu-sm-icon")} aria-hidden="true">
            <span ref={plusHRef} className={cn("rb-staggered-menu-sm-icon-line")} />
            <span ref={plusVRef} className={cn("rb-staggered-menu-sm-icon-line rb-staggered-menu-sm-icon-line-v")} />
          </span>
        </button>
      </header>

      {/* `inert` alongside `aria-hidden`: the closed panel is invisible but its
          links are still in the tab order and still clickable, so a keyboard user
          could land inside a menu that no assistive technology reports. `inert`
          takes the whole subtree out of focus and hit-testing and is undone the
          moment the panel opens. */}
      <aside id="rb-staggered-menu-staggered-menu-panel" ref={panelRef} className={cn("rb-staggered-menu-staggered-menu-panel")} aria-hidden={!open} inert={!open}>
        <div className={cn("rb-staggered-menu-sm-panel-inner")}>
          <ul className={cn("rb-staggered-menu-sm-panel-list")} role="list" data-numbering={displayItemNumbering || undefined}>
            {items && items.length ? (
              items.map((it, idx) => (
                <li className={cn("rb-staggered-menu-sm-panel-itemWrap")} key={it.label + idx}>
                  <a className={cn("rb-staggered-menu-sm-panel-item")} href={it.link} aria-label={it.ariaLabel} data-index={idx + 1}>
                    <span className={cn("rb-staggered-menu-sm-panel-itemLabel")}>{it.label}</span>
                  </a>
                </li>
              ))
            ) : (
              <li className={cn("rb-staggered-menu-sm-panel-itemWrap")} aria-hidden="true">
                <span className={cn("rb-staggered-menu-sm-panel-item")}>
                  <span className={cn("rb-staggered-menu-sm-panel-itemLabel")}>No items</span>
                </span>
              </li>
            )}
          </ul>
          {displaySocials && socialItems && socialItems.length > 0 && (
            <div className={cn("rb-staggered-menu-sm-socials")} aria-label="Social links">
              <h3 className={cn("rb-staggered-menu-sm-socials-title")}>Socials</h3>
              <ul className={cn("rb-staggered-menu-sm-socials-list")} role="list">
                {socialItems.map((s, i) => (
                  <li key={s.label + i} className={cn("rb-staggered-menu-sm-socials-item")}>
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className={cn("rb-staggered-menu-sm-socials-link")}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
        </>
  );
};

export default RbStaggeredMenu;
