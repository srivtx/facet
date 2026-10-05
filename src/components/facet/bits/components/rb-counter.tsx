"use client";
/* Vendored from DavidHDev/react-bits — Components/Counter/Counter.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import { MotionValue, motion, useSpring, useTransform } from 'motion/react';
import type React from 'react';
import { useEffect } from 'react';

import { cn } from '@/lib/utils';

const RB_COUNTER_CSS = `
.rb-counter-counter-container {
  position: relative;
  display: inline-block;
}

.rb-counter-counter-counter {
  display: flex;
  overflow: hidden;
  line-height: 1;
}

.rb-counter-counter-digit {
  position: relative;
  width: 1ch;
  font-variant-numeric: tabular-nums;
}

.rb-counter-counter-number {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rb-counter-gradient-container {
  pointer-events: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.rb-counter-bottom-gradient {
  position: absolute;
  bottom: 0;
  width: 100%;
}

`;

type PlaceValue = number | '.';

interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
}

function Number({ mv, number, height }: NumberProps) {
  const y = useTransform(mv, latest => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });

  return (
    <motion.span className={cn("rb-counter-counter-number")} style={{ y }}>
      {number}
    </motion.span>
  );
}

function normalizeNearInteger(num: number): number {
  const nearest = Math.round(num);
  const tolerance = 1e-9 * Math.max(1, Math.abs(num));
  return Math.abs(num - nearest) < tolerance ? nearest : num;
}

function getValueRoundedToPlace(value: number, place: number): number {
  const scaled = value / place;
  return Math.floor(normalizeNearInteger(scaled));
}

interface DigitProps {
  place: PlaceValue;
  value: number;
  height: number;
  digitStyle?: React.CSSProperties;
}

function Digit({ place, value, height, digitStyle }: DigitProps) {
  /* Every hook below runs on every render, including when `place` is the decimal
   * separator. `place` flips between a number and '.' as `places` is derived from
   * the formatted value, and returning early above the hooks makes React throw
   * "Rendered fewer hooks than expected". */
  const numericPlace = typeof place === 'number' ? place : 0;
  const valueRoundedToPlace = getValueRoundedToPlace(value, numericPlace);
  const animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  if (place === '.') {
    return (
      <span className={cn("rb-counter-counter-digit")} style={{ height, ...digitStyle, width: 'fit-content' }}>
        .
      </span>
    );
  }

  return (
    <span className={cn("rb-counter-counter-digit")} style={{ height, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </span>
  );
}

interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  /**
   * An array of place values that determines which digit positions
   * should be displayed. For decimal places, use "." to represent
   * the decimal point. Leave this prop empty to enable automatic
   * detection based on the current value.
   */
  places?: PlaceValue[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: React.CSSProperties['fontWeight'];
  containerStyle?: React.CSSProperties;
  counterStyle?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientStyle?: React.CSSProperties;
  bottomGradientStyle?: React.CSSProperties;
}

function RbCounter({
  value = 0,
  fontSize = 100,
  padding = 0,
  places = [...value.toString()].map((ch, i, a) => {
    if (ch === '.') {
      return '.';
    }
    const dotIndex = a.indexOf('.');
    const isInteger = dotIndex === -1;

    const exponent = isInteger ? a.length - i - 1 : i < dotIndex ? dotIndex - i - 1 : -(i - dotIndex);

    return 10 ** exponent;
  }),
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = 'inherit',
  fontWeight = 'inherit',
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 16,
  gradientFrom = 'black',
  gradientTo = 'transparent',
  topGradientStyle,
  bottomGradientStyle
}: CounterProps) {
  const height = fontSize + padding;

  const defaultCounterStyle: React.CSSProperties = {
    fontSize,
    gap,
    borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    color: textColor,
    fontWeight,
    direction: "ltr"
  };

  const defaultTopGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`
  };

  const defaultBottomGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`
  };

  return (
    <>
          <style href="rb-counter" precedence="rb">{RB_COUNTER_CSS}</style>
          <span className={cn("rb-counter-counter-container")} style={containerStyle}>
      <span className={cn("rb-counter-counter-counter")} style={{ ...defaultCounterStyle, ...counterStyle }}>
        {places.map(place => (
          <Digit key={place} place={place} value={value} height={height} digitStyle={digitStyle} />
        ))}
      </span>
      <span className={cn("rb-counter-gradient-container")}>
        <span className={cn("rb-counter-top-gradient")} style={topGradientStyle ?? defaultTopGradientStyle} />
        <span className={cn("rb-counter-bottom-gradient")} style={bottomGradientStyle ?? defaultBottomGradientStyle} />
      </span>
    </span>
        </>
  );
}

export { RbCounter };
export default RbCounter;
