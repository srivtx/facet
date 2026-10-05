/* Vendored from DavidHDev/react-bits — src/ts-default/Backgrounds/GridMotion.tsx (MIT + Commons Clause, see bits/ATTRIBUTION.md). Exports renamed with the Rb prefix to avoid API collision. Companion GridMotion.css is inlined below with every class/keyframe/custom-property namespaced to `rb-grid-motion-*`. */

"use client";

import { useEffect, useRef, type FC, type ReactNode } from 'react';
import { gsap } from 'gsap';

const RB_GRID_MOTION_CSS = String.raw`
.rb-grid-motion-noscroll{
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.rb-grid-motion-intro{
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rb-grid-motion-intro::after{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 250px;
  pointer-events: none;
  z-index: 4;
}

.rb-grid-motion-gridMotion-container{
  gap: 1rem;
  flex: none;
  position: relative;
  width: 150vw;
  height: 150vh;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: 100%;
  transform: rotate(-15deg);
  transform-origin: center center;
  z-index: 2;
}

.rb-grid-motion-row{
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(7, 1fr);
  will-change: transform, filter;
}

.rb-grid-motion-row__item{
  position: relative;
}

.rb-grid-motion-row__item-inner{
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
  background-color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.rb-grid-motion-row__item-img{
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: 50% 50%;
  position: absolute;
  top: 0;
  left: 0;
}

.rb-grid-motion-row__item-content{
  padding: 1rem;
  text-align: center;
  z-index: 1;
}

.rb-grid-motion-fullview{
  position: relative;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.rb-grid-motion-fullview .rb-grid-motion-row__item-inner{
  border-radius: 0px;
}
`;

function RbInjectedStyle({ css }: { css: string }) {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
interface GridMotionProps {
  items?: (string | ReactNode)[];
  gradientColor?: string;
}

const RbGridMotion: FC<GridMotionProps> = ({ items = [], gradientColor = 'black' }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Seeded inside the effect so nothing reads window during render/SSR.
  const mouseXRef = useRef<number>(0);

  const totalItems = 28;
  const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
  const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    mouseXRef.current = window.innerWidth / 2;

    const handleMouseMove = (e: MouseEvent): void => {
      mouseXRef.current = e.clientX;
    };

    const updateMotion = (): void => {
      const maxMoveAmount = 300;
      const baseDuration = 0.8;
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1;
          const moveAmount = ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction;

          gsap.to(row, {
            x: moveAmount,
            duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });
    };

    const removeAnimationLoop = gsap.ticker.add(updateMotion);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      removeAnimationLoop();
    };
  }, []);

  return (
    <>
      <RbInjectedStyle css={RB_GRID_MOTION_CSS} />
      {(
    <div className="rb-grid-motion-noscroll loading" ref={gridRef}>
      <section
        className="rb-grid-motion-intro"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`
        }}
      >
        <div className="rb-grid-motion-gridMotion-container">
          {Array.from({ length: 4 }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="rb-grid-motion-row"
              ref={el => {
                rowRefs.current[rowIndex] = el;
              }}
            >
              {Array.from({ length: 7 }, (_, itemIndex) => {
                const content = combinedItems[rowIndex * 7 + itemIndex];
                return (
                  <div key={itemIndex} className="rb-grid-motion-row__item">
                    <div className="rb-grid-motion-row__item-inner" style={{ backgroundColor: '#111' }}>
                      {typeof content === 'string' && content.startsWith('http') ? (
                        <div
                          className="rb-grid-motion-row__item-img"
                          style={{
                            backgroundImage: `url(${content})`
                          }}
                        ></div>
                      ) : (
                        <div className="rb-grid-motion-row__item-content">{content}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="rb-grid-motion-fullview"></div>
      </section>
    </div>
  )}
    </>
  )
};

export default RbGridMotion;
