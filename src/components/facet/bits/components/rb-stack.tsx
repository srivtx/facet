"use client";
/* Vendored from DavidHDev/react-bits — Components/Stack/Stack.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import { motion, useMotionValue, useTransform, type PanInfo } from 'motion/react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const RB_STACK_CSS = `
.rb-stack-stack-container {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 600px;
}

.rb-stack-card-rotate {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: grab;
}

.rb-stack-card-rotate-disabled {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.rb-stack-card {
  border-radius: 1rem;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rb-stack-card img {
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.rb-stack-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

`;

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableDrag?: boolean;
}

function CardRotate({ children, onSendToBack, sensitivity, disableDrag = false }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  if (disableDrag) {
    return (
      <motion.div className={cn("rb-stack-card-rotate-disabled")} style={{ x: 0, y: 0 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn("rb-stack-card-rotate")}
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  cards?: React.ReactNode[];
  animationConfig?: { stiffness: number; damping: number };
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  mobileClickOnly?: boolean;
  mobileBreakpoint?: number;
}

/* Math.random() during render makes the server and the client compute different
   rotateZ values, which React reports as a hydration mismatch. A hash of the card
   index gives the same jitter on both sides. */
const rotationJitter = (id: number): number => {
  const h = Math.sin(id * 12.9898) * 43758.5453;
  return (h - Math.floor(h) - 0.5) * 10;
};

function RbStack({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768
}: StackProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  const shouldDisableDrag = mobileClickOnly && isMobile;
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;

  const [stack, setStack] = useState<{ id: number; content: React.ReactNode }[]>(() => {
    if (cards.length) {
      return cards.map((content, index) => ({ id: index + 1, content }));
    } else {
      return [
        {
          id: 1,
          content: (
            <img
              src="/photos/vendor/uns-1480074568708-e7b720bb3f09.jpg"
              alt="card-1"
              className={cn("rb-stack-card-image")}
            />
          )
        },
        {
          id: 2,
          content: (
            <img
              src="/photos/vendor/uns-1449844908441-8829872d2607.jpg"
              alt="card-2"
              className={cn("rb-stack-card-image")}
            />
          )
        },
        {
          id: 3,
          content: (
            <img
              src="/photos/vendor/uns-1452626212852-811d58933cae.jpg"
              alt="card-3"
              className={cn("rb-stack-card-image")}
            />
          )
        },
        {
          id: 4,
          content: (
            <img
              src="/photos/vendor/uns-1572120360610-d971b9d7767c.jpg"
              alt="card-4"
              className={cn("rb-stack-card-image")}
            />
          )
        }
      ];
    }
  });

  useEffect(() => {
    if (cards.length) {
      setStack(cards.map((content, index) => ({ id: index + 1, content })));
    }
  }, [cards]);

  const sendToBack = (id: number) => {
    setStack(prev => {
      const newStack = [...prev];
      const index = newStack.findIndex(card => card.id === id);
      const [card] = newStack.splice(index, 1);
      newStack.unshift(card);
      return newStack;
    });
  };

  useEffect(() => {
    if (autoplay && stack.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        const topCardId = stack[stack.length - 1].id;
        sendToBack(topCardId);
      }, autoplayDelay);

      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayDelay, stack, isPaused]);

  return (
    <>
          <style href="rb-stack" precedence="rb">{RB_STACK_CSS}</style>
          <div
      className={cn("rb-stack-stack-container")}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {stack.map((card, index) => {
        const randomRotate = randomRotation ? rotationJitter(card.id) : 0;
        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableDrag={shouldDisableDrag}
          >
            <motion.div
              className={cn("rb-stack-card")}
              onClick={() => shouldEnableClick && sendToBack(card.id)}
              animate={{
                rotateZ: (stack.length - index - 1) * 4 + randomRotate,
                scale: 1 + index * 0.06 - stack.length * 0.06,
                transformOrigin: '90% 90%'
              }}
              initial={false}
              transition={{
                type: 'spring',
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping
              }}
            >
              {card.content}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
        </>
  );
}

export { RbStack };
export default RbStack;
