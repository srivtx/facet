"use client";
/* Vendored from DavidHDev/react-bits — Components/Carousel/Carousel.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, type PanInfo, useMotionValue, useTransform } from 'motion/react';
// replace icons with your own if needed
import { FiCircle, FiCode, FiFileText, FiLayers, FiLayout } from 'react-icons/fi';
import { cn } from '@/lib/utils';

const RB_CAROUSEL_CSS = `
.rb-carousel-carousel-container {
  position: relative;
  overflow: hidden;
  border: 1px solid #555;
  border-radius: 24px;
  padding: 16px;
  --outer-r: 24px;
  --p-distance: 12px;
}

.rb-carousel-carousel-track {
  display: flex;
}

.rb-carousel-carousel-item {
  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  border: 1px solid #555;
  border-radius: calc(var(--outer-r) - var(--p-distance));
  background-color: #0d0d0d;
  overflow: hidden;
  cursor: grab;
}

.rb-carousel-carousel-item:active {
  cursor: grabbing;
}

.rb-carousel-carousel-container.rb-carousel-round {
  border: 1px solid #555;
}

.rb-carousel-carousel-item.rb-carousel-round {
  background-color: #0d0d0d;
  position: relative;
  bottom: 0.1em;
  border: 1px solid #555;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.rb-carousel-carousel-item-header.rb-carousel-round {
  padding: 0;
  margin: 0;
}

.rb-carousel-carousel-indicators-container.rb-carousel-round {
  position: absolute;
  z-index: 2;
  bottom: 3em;
  left: 50%;
  transform: translateX(-50%);
}

.rb-carousel-carousel-indicator.rb-carousel-active {
  background-color: #333333;
}

.rb-carousel-carousel-indicator.rb-carousel-inactive {
  background-color: rgba(51, 51, 51, 0.4);
}

.rb-carousel-carousel-item-header {
  margin-bottom: 16px;
  padding: 20px;
  padding-top: 20px;
}

.rb-carousel-carousel-icon-container {
  display: flex;
  height: 28px;
  width: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #fff;
}

.rb-carousel-carousel-icon {
  height: 16px;
  width: 16px;
  color: #120F17;
}

.rb-carousel-carousel-item-content {
  padding: 20px;
  padding-bottom: 20px;
}

.rb-carousel-carousel-item-title {
  margin-bottom: 4px;
  font-weight: 900;
  font-size: 18px;
  color: #fff;
}

.rb-carousel-carousel-item-description {
  font-size: 14px;
  color: #fff;
}

.rb-carousel-carousel-indicators-container {
  display: flex;
  width: 100%;
  justify-content: center;
}

.rb-carousel-carousel-indicators {
  margin-top: 16px;
  display: flex;
  width: 150px;
  justify-content: space-between;
  padding: 0 32px;
}

.rb-carousel-carousel-indicator {
  height: 8px;
  width: 8px;
  border: none;
  padding: 0;
  appearance: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 150ms;
}

.rb-carousel-carousel-indicator:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.rb-carousel-carousel-indicator.rb-carousel-active {
  background-color: #fff;
}

.rb-carousel-carousel-indicator.rb-carousel-inactive {
  background-color: #555;
}

`;

export interface CarouselItem {
  title: string;
  description: string;
  id: number;
  icon: React.ReactElement;
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

const DEFAULT_ITEMS: CarouselItem[] = [
  {
    title: 'Text Animations',
    description: 'Cool text animations for your projects.',
    id: 1,
    icon: <FiFileText className={cn("rb-carousel-carousel-icon")} />
  },
  {
    title: 'Animations',
    description: 'Smooth animations for your projects.',
    id: 2,
    icon: <FiCircle className={cn("rb-carousel-carousel-icon")} />
  },
  {
    title: 'Components',
    description: 'Reusable components for your projects.',
    id: 3,
    icon: <FiLayers className={cn("rb-carousel-carousel-icon")} />
  },
  {
    title: 'Backgrounds',
    description: 'Beautiful backgrounds and patterns for your projects.',
    id: 4,
    icon: <FiLayout className={cn("rb-carousel-carousel-icon")} />
  },
  {
    title: 'Common UI',
    description: 'Common UI components are coming soon!',
    id: 5,
    icon: <FiCode className={cn("rb-carousel-carousel-icon")} />
  }
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

interface CarouselItemProps {
  item: CarouselItem;
  index: number;
  itemWidth: number;
  round: boolean;
  trackItemOffset: number;
  x: any;
  transition: any;
}

function CarouselItem({ item, index, itemWidth, round, trackItemOffset, x, transition }: CarouselItemProps) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <motion.div
      key={`${item?.id ?? index}-${index}`}
      className={cn("rb-carousel-carousel-item", round ? "rb-carousel-round" : '')}
      style={{
        width: itemWidth,
        height: round ? itemWidth : '100%',
        rotateY: rotateY,
        ...(round && { borderRadius: '50%' })
      }}
      transition={transition}
    >
      <div className={cn("rb-carousel-carousel-item-header", round ? "rb-carousel-round" : '')}>
        <span className={cn("rb-carousel-carousel-icon-container")}>{item.icon}</span>
      </div>
      <div className={cn("rb-carousel-carousel-item-content")}>
        <div className={cn("rb-carousel-carousel-item-title")}>{item.title}</div>
        <p className={cn("rb-carousel-carousel-item-description")}>{item.description}</p>
      </div>
    </motion.div>
  );
}

function RbCarousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false
}: CarouselProps): React.JSX.Element {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;
  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState<number>(loop ? 1 : 0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined;
    if (pauseOnHover && isHovered) return undefined;

    const timer = setInterval(() => {
      setPosition(prev => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1));
    }
  }, [itemsForRender.length, loop, position]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }
    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;

    setPosition(prev => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0
        }
      };

  const activeIndex =
    items.length === 0 ? 0 : loop ? (position - 1 + items.length) % items.length : Math.min(position, items.length - 1);

  return (
    <>
          <style href="rb-carousel" precedence="rb">{RB_CAROUSEL_CSS}</style>
          <div
      ref={containerRef}
      className={cn("rb-carousel-carousel-container", round ? "rb-carousel-round" : '')}
      style={{
        width: `${baseWidth}px`,
        ...(round && { height: `${baseWidth}px`, borderRadius: '50%' })
      }}
    >
      <motion.div
        className={cn("rb-carousel-carousel-track")}
        drag={isAnimating ? false : 'x'}
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
          x
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem
            key={`${item?.id ?? index}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            round={round}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
          />
        ))}
      </motion.div>
      <div className={cn("rb-carousel-carousel-indicators-container", round ? "rb-carousel-round" : '')}>
        <div className={cn("rb-carousel-carousel-indicators")}>
          {items.map((_, index) => (
            <motion.button
              type="button"
              key={index}
              className={cn("rb-carousel-carousel-indicator", activeIndex === index ? "rb-carousel-active" : "rb-carousel-inactive")}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeIndex === index}
              animate={{
                scale: activeIndex === index ? 1.2 : 1
              }}
              onClick={() => setPosition(loop ? index + 1 : index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
        </>
  );
}

export { RbCarousel };
export default RbCarousel;
