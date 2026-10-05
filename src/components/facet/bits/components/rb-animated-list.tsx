"use client";
/* Vendored from DavidHDev/react-bits — Components/AnimatedList/AnimatedList.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type MouseEventHandler,
  type UIEvent
} from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '@/lib/utils';

const RB_ANIMATED_LIST_CSS = `
.rb-animated-list-scroll-list-container {
  position: relative;
  width: 500px;
}

.rb-animated-list-scroll-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
}

/* The pane is focusable now, so it needs a visible focus ring of its own. */
.rb-animated-list-scroll-list:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: -2px;
}

.rb-animated-list-scroll-list::-webkit-scrollbar {
  width: 8px;
}

.rb-animated-list-scroll-list::-webkit-scrollbar-track {
  background: #060606;
}

.rb-animated-list-scroll-list::-webkit-scrollbar-thumb {
  background: #222;
  border-radius: 4px;
}

.rb-animated-list-no-scrollbar::-webkit-scrollbar {
  display: none;
}

.rb-animated-list-no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.rb-animated-list-item {
  padding: 16px;
  background-color: #111;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.rb-animated-list-item.rb-animated-list-selected {
  background-color: #222;
}

.rb-animated-list-item-text {
  color: white;
  margin: 0;
}

.rb-animated-list-top-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(to bottom, #120F17, transparent);
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.rb-animated-list-bottom-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, #120F17, transparent);
  pointer-events: none;
  transition: opacity 0.3s ease;
}

`;

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      style={{ marginBottom: '1rem', cursor: 'pointer' }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  items?: string[];
  onItemSelect?: (item: string, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
}

const RbAnimatedList: React.FC<AnimatedListProps> = ({
  items = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
    'Item 7',
    'Item 8',
    'Item 9',
    'Item 10',
    'Item 11',
    'Item 12',
    'Item 13',
    'Item 14',
    'Item 15'
  ],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);

  const handleItemMouseEnter = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleItemClick = useCallback(
    (item: string, index: number) => {
      setSelectedIndex(index);
      if (onItemSelect) {
        onItemSelect(item, index);
      }
    },
    [onItemSelect]
  );

  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  }, []);

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth'
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <>
          <style href="rb-animated-list" precedence="rb">{RB_ANIMATED_LIST_CSS}</style>
          <div className={cn("rb-animated-list-scroll-list-container", className)}>
      {/* This pane scrolls but none of the rows are focusable, so a keyboard user had
          no way to scroll it. tabindex makes the scroll container itself
          reachable and scrollable with the arrow keys; role=region plus the
          label is what makes that reachable thing announce itself. */}
      <div ref={listRef} tabIndex={0} role="region" aria-label="Animated item list" className={cn("rb-animated-list-scroll-list", !displayScrollbar ? "rb-animated-list-no-scrollbar" : '')} onScroll={handleScroll}>
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            delay={0.1}
            index={index}
            onMouseEnter={() => handleItemMouseEnter(index)}
            onClick={() => handleItemClick(item, index)}
          >
            <div className={cn("rb-animated-list-item", selectedIndex === index ? "rb-animated-list-selected" : '', itemClassName)}>
              <p className={cn("rb-animated-list-item-text")}>{item}</p>
            </div>
          </AnimatedItem>
        ))}
      </div>
      {showGradients && (
        <>
          <div className={cn("rb-animated-list-top-gradient")} style={{ opacity: topGradientOpacity }}></div>
          <div className={cn("rb-animated-list-bottom-gradient")} style={{ opacity: bottomGradientOpacity }}></div>
        </>
      )}
    </div>
        </>
  );
};

export { RbAnimatedList };
export default RbAnimatedList;
