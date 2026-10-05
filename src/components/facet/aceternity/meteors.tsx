"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = new Array(number || 20).fill(true);
  // Deterministic per-index pseudo-random. Math.random() during render emits one
  // set of delays on the server and a different set on the client, which React
  // reports as a hydration mismatch. This is an integer hash rather than a
  // transcendental (Math.sin) because transcendentals differ in the last ULP
  // across JS engines, which is by itself enough to trip the mismatch.
  const rand = (seed: number) => {
    let x = Math.imul(seed + 1, 2654435761);
    x ^= x >>> 15;
    x = Math.imul(x, 2246822519);
    x ^= x >>> 13;
    return (x >>> 0) / 4294967296;
  };
  return (
    <div>
      {meteors.map((el, idx) => {
        const meteorCount = number || 20;
        // Calculate position to evenly distribute meteors across container width
        const position = idx * (800 / meteorCount) - 400; // Spread across 800px range, centered

        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-ax-ac-meteor absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
              "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
              className,
            )}
            style={{
              top: "-40px", // Start above the container
              left: position + "px",
              animationDelay: rand(idx) * 5 + "s",
              animationDuration: Math.floor(rand(idx + 101) * 5 + 5) + "s",
            }}
          ></span>
        );
      })}
    </div>
  );
};
