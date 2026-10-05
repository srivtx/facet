"use client";
/* Vendored from DavidHDev/react-bits — Components/ChromaGrid/ChromaGrid.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

const RB_CHROMA_GRID_CSS = `
.rb-chroma-grid-chroma-grid {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(var(--cols, 3), 320px);
  grid-auto-rows: auto;
  justify-content: center;
  gap: 0.75rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;

  --x: 50%;
  --y: 50%;
  --r: 220px;
}

@media (max-width: 1124px) {
  .rb-chroma-grid-chroma-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 320px));
    gap: 0.5rem;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .rb-chroma-grid-chroma-grid {
    grid-template-columns: 320px;
    gap: 0.75rem;
    padding: 1rem;
  }
}

.rb-chroma-grid-chroma-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 320px;
  height: auto;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #333;
  transition: border-color 0.3s ease;
  background: var(--card-gradient);

  --mouse-x: 50%;
  --mouse-y: 50%;
  --spotlight-color: rgba(255, 255, 255, 0.3);
}

.rb-chroma-grid-chroma-card:hover {
  border-color: var(--card-border);
}

.rb-chroma-grid-chroma-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 2;
}

.rb-chroma-grid-chroma-card:hover::before {
  opacity: 1;
}

.rb-chroma-grid-chroma-img-wrapper {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 10px;
  box-sizing: border-box;
  background: transparent;
  transition: background 0.3s ease;
}

.rb-chroma-grid-chroma-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}

.rb-chroma-grid-chroma-info {
  position: relative;
  z-index: 1;
  padding: 0.75rem 1rem;
  color: #fff;
  font-family: system-ui, sans-serif;
  display: grid;
  grid-template-columns: 1fr auto;
  row-gap: 0.25rem;
  column-gap: 0.75rem;
}

.rb-chroma-grid-chroma-info .rb-chroma-grid-role,
.rb-chroma-grid-chroma-info .rb-chroma-grid-handle {
  color: #aaa;
}

.rb-chroma-grid-chroma-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  backdrop-filter: grayscale(1) brightness(0.78);
  -webkit-backdrop-filter: grayscale(1) brightness(0.78);
  background: rgba(0, 0, 0, 0.001);

  mask-image: radial-gradient(
    circle var(--r) at var(--x) var(--y),
    transparent 0%,
    transparent 15%,
    rgba(0, 0, 0, 0.1) 30%,
    rgba(0, 0, 0, 0.22) 45%,
    rgba(0, 0, 0, 0.35) 60%,
    rgba(0, 0, 0, 0.5) 75%,
    rgba(0, 0, 0, 0.68) 88%,
    white 100%
  );
  -webkit-mask-image: radial-gradient(
    circle var(--r) at var(--x) var(--y),
    transparent 0%,
    transparent 15%,
    rgba(0, 0, 0, 0.1) 30%,
    rgba(0, 0, 0, 0.22) 45%,
    rgba(0, 0, 0, 0.35) 60%,
    rgba(0, 0, 0, 0.5) 75%,
    rgba(0, 0, 0, 0.68) 88%,
    white 100%
  );
}

.rb-chroma-grid-chroma-fade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
  backdrop-filter: grayscale(1) brightness(0.78);
  -webkit-backdrop-filter: grayscale(1) brightness(0.78);
  background: rgba(0, 0, 0, 0.001);

  mask-image: radial-gradient(
    circle var(--r) at var(--x) var(--y),
    white 0%,
    white 15%,
    rgba(255, 255, 255, 0.9) 30%,
    rgba(255, 255, 255, 0.78) 45%,
    rgba(255, 255, 255, 0.65) 60%,
    rgba(255, 255, 255, 0.5) 75%,
    rgba(255, 255, 255, 0.32) 88%,
    transparent 100%
  );
  -webkit-mask-image: radial-gradient(
    circle var(--r) at var(--x) var(--y),
    white 0%,
    white 15%,
    rgba(255, 255, 255, 0.9) 30%,
    rgba(255, 255, 255, 0.78) 45%,
    rgba(255, 255, 255, 0.65) 60%,
    rgba(255, 255, 255, 0.5) 75%,
    rgba(255, 255, 255, 0.32) 88%,
    transparent 100%
  );

  opacity: 1;
  transition: opacity 0.25s ease;
}

`;

export interface ChromaItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  location?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
}

export interface ChromaGridProps {
  items?: ChromaItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

type SetterFn = (v: number | string) => void;

export const RbChromaGrid: React.FC<ChromaGridProps> = ({
  items,
  className = '',
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out'
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<SetterFn | null>(null);
  const setY = useRef<SetterFn | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  const demo: ChromaItem[] = [
    {
      image: '/photos/vendor/pravatar-8.jpg',
      title: 'Alex Rivera',
      subtitle: 'Full Stack Developer',
      handle: '@alexrivera',
      borderColor: '#4F46E5',
      gradient: 'linear-gradient(145deg, #4F46E5, #000)',
      url: 'https://github.com/'
    },
    {
      image: '/photos/vendor/pravatar-11.jpg',
      title: 'Jordan Chen',
      subtitle: 'DevOps Engineer',
      handle: '@jordanchen',
      borderColor: '#10B981',
      gradient: 'linear-gradient(210deg, #10B981, #000)',
      url: 'https://linkedin.com/in/'
    },
    {
      image: '/photos/vendor/pravatar-3.jpg',
      title: 'Morgan Blake',
      subtitle: 'UI/UX Designer',
      handle: '@morganblake',
      borderColor: '#F59E0B',
      gradient: 'linear-gradient(165deg, #F59E0B, #000)',
      url: 'https://dribbble.com/'
    },
    {
      image: '/photos/vendor/pravatar-16.jpg',
      title: 'Casey Park',
      subtitle: 'Data Scientist',
      handle: '@caseypark',
      borderColor: '#EF4444',
      gradient: 'linear-gradient(195deg, #EF4444, #000)',
      url: 'https://kaggle.com/'
    },
    {
      image: '/photos/vendor/pravatar-25.jpg',
      title: 'Sam Kim',
      subtitle: 'Mobile Developer',
      handle: '@thesamkim',
      borderColor: '#8B5CF6',
      gradient: 'linear-gradient(225deg, #8B5CF6, #000)',
      url: 'https://github.com/'
    },
    {
      image: '/photos/vendor/pravatar-60.jpg',
      title: 'Tyler Rodriguez',
      subtitle: 'Cloud Architect',
      handle: '@tylerrod',
      borderColor: '#06B6D4',
      gradient: 'linear-gradient(135deg, #06B6D4, #000)',
      url: 'https://aws.amazon.com/'
    }
  ];
  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px') as SetterFn;
    setY.current = gsap.quickSetter(el, '--y', 'px') as SetterFn;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true
    });
  };

  const handleMove = (e: React.PointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true
    });
  };

  const handleCardClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardMove: React.MouseEventHandler<HTMLElement> = e => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <>
          <style href="rb-chroma-grid" precedence="rb">{RB_CHROMA_GRID_CSS}</style>
          <div
      ref={rootRef}
      className={cn("rb-chroma-grid-chroma-grid", className)}
      style={
        {
          '--r': `${radius}px`,
          '--cols': columns,
          '--rows': rows
        } as React.CSSProperties
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={i}
          className={cn("rb-chroma-grid-chroma-card")}
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          style={
            {
              '--card-border': c.borderColor || 'transparent',
              '--card-gradient': c.gradient,
              cursor: c.url ? 'pointer' : 'default'
            } as React.CSSProperties
          }
        >
          <div className={cn("rb-chroma-grid-chroma-img-wrapper")}>
            <img src={c.image} alt={c.title} loading="lazy" />
          </div>
          <footer className={cn("rb-chroma-grid-chroma-info")}>
            {/* h2, not h3: each card names itself, and the page heading above
                the grid is the h1. An h3 here skipped a level and announced a
                person as a sub-sub-section of nothing. */}
            <h2 className={cn("rb-chroma-grid-name")}>{c.title}</h2>
            {c.handle && <span className={cn("rb-chroma-grid-handle")}>{c.handle}</span>}
            <p className={cn("rb-chroma-grid-role")}>{c.subtitle}</p>
            {c.location && <span className={cn("rb-chroma-grid-location")}>{c.location}</span>}
          </footer>
        </article>
      ))}
      <div className={cn("rb-chroma-grid-chroma-overlay")} />
      <div ref={fadeRef} className={cn("rb-chroma-grid-chroma-fade")} />
    </div>
        </>
  );
};

export default RbChromaGrid;
