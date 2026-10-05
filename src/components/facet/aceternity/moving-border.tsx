"use client";
import React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useId, useRef } from "react";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        "relative h-16 w-40 overflow-hidden bg-transparent p-[1px] text-xl",
        containerClassName,
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 bg-[radial-gradient(#0ea5e9_40%,transparent_60%)] opacity-[0.8]",
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900/[0.8] text-sm text-white antialiased backdrop-blur-xl",
          className,
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  pathLength,
  pathOpacity,
  gradientClassName,
  borderWidth = 1,
  borderColor = "#a78bfa",
  colorFrom = "#7c3aed",
  colorTo = "#c026d3",
  anchor = 10,
  size = 140,
  disabled,
  as: Component = "div",
  className,
  containerClassName,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  pathLength?: number;
  pathOpacity?: number;
  gradientClassName?: string;
  borderWidth?: number;
  borderColor?: string;
  colorFrom?: string;
  colorTo?: string;
  anchor?: number;
  size?: number;
  disabled?: boolean;
  as?: any;
  className?: string;
  containerClassName?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<any>(undefined);
  const gradientId = `moving-border-gradient-${useId()}`;
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x,
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y,
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <Component
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full",
          containerClassName,
          className,
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute h-full w-full"
          width="100%"
          height="100%"
          {...otherProps}
        >
          <defs>
            <linearGradient
              id={gradientId}
              className={gradientClassName}
              gradientTransform={`rotate(${anchor})`}
            >
              <stop offset="0%" stopColor={colorFrom} />
              <stop offset="100%" stopColor={colorTo} />
            </linearGradient>
          </defs>
          <rect
            fill="none"
            strokeWidth={disabled ? 0 : borderWidth}
            stroke={`url(#${gradientId})`}
            width={
              size
                ? `${(Number(anchor) / 100) * size}%`
                : "calc(100% - 16px)"
            }
            height={
              size
                ? `${(Number(anchor) / 100) * size}%`
                : "calc(100% - 16px)"
            }
            x="50%"
            y="50%"
            rx={rx}
            ry={ry}
            strokeOpacity={pathOpacity}
            fillOpacity={0}
            strokeDasharray="0"
            strokeDashoffset="0"
            pathLength={pathLength}
            ref={pathRef}
          />
        </svg>
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "inline-block",
            transform,
          }}
        >
          {children}
        </motion.div>
      </Component>
    </>
  );
};
