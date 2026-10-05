"use client";

/* Facet / loaders — Kinetic, Shutter, OrbitDot */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Kinetic ───────────────────────────────────────────────── */
export function Kinetic({ variant = "word", text = "Facet" }: { variant?: string; text?: string }) {
  const letters = text.split("");
  const tight = variant === "mono";
  return (
    <div className="flex w-full items-center justify-center py-12">
      <div className="relative scale-75 md:scale-90">
        <span
          className="absolute z-10 left-[calc(50%+2.9em)] top-[2.1em] size-1.5 rounded-full bg-violet-300"
          style={{
            boxShadow: "0 0 12px rgba(167,139,250,.9)",
            animation:
              "ktl-dot 1800ms cubic-bezier(.25,.25,.75,.75) infinite",
          }}
        />
        <p
          className={cn("relative m-0 whitespace-nowrap text-6xl font-light text-neutral-100", tight ? "tracking-[2px]" : "tracking-[10px]")}
          aria-label={text}
        >
          {letters.map((char, index) => {
            const stretch =
              index === 2
                ? "animation: ktl-stretch 1800ms cubic-bezier(.25,.23,.73,.75) infinite"
                : undefined;
            return (
              <span
                key={index}
                className="inline-block"
                style={stretch ? { animation: "ktl-stretch 1800ms cubic-bezier(.25,.23,.73,.75) infinite" } : undefined}
              >
                {char}
              </span>
            );
          })}
        </p>
      </div>
      <style>{`
        @keyframes ktl-dot {
          0%, 100% { transform: rotate(180deg) translate(-52px, -14px) rotate(-180deg); }
          50% { transform: rotate(0deg) translate(-54px, 14px) rotate(0deg); }
        }
        @keyframes ktl-stretch {
          0%, 100% { transform: scale(1, 0.35); transform-origin: 100% 75%; }
          8%, 28% { transform: scale(1, 1.4); transform-origin: 100% 67%; }
          37% { transform: scale(1, 0.875); transform-origin: 100% 75%; }
          46% { transform: scale(1, 1.03); transform-origin: 100% 75%; }
          50%, 97% { transform: scale(1); transform-origin: 100% 75%; }
        }
      `}</style>
    </div>
  );
}

/* ── Shutter ───────────────────────────────────────────────── */
export function Shutter({ variant = "once" }: { variant?: string }) {
  const loop = variant === "loop";
  const [closed, setClosed] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t1 = window.setTimeout(() => setClosed(true), 700);
    const t2 = window.setTimeout(() => {
      setClosed(false);
      setTick((v) => v + 1);
    }, 1750);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [tick, loop]);
  useEffect(() => {
    if (loop) {
      const t = window.setTimeout(() => setTick((v) => v + 1), 3400);
      return () => window.clearTimeout(t);
    }
  }, [loop, tick]);
  return (
    <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-xl bg-[#08080b] ring-1 ring-white/10">
      <div key={tick} className="relative z-10 p-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="text-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            cycle {tick + 1}
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-neutral-100">
            content swaps behind the blades
          </p>
        </motion.div>
      </div>
      {/* blades */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 origin-top"
        style={{ background: "linear-gradient(180deg, rgba(139,92,246,.4), rgba(10,10,14,.94))" }}
        animate={{ height: closed ? "50%" : "0%" }}
        transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 origin-bottom"
        style={{ background: "linear-gradient(0deg, rgba(232,121,249,.3), rgba(10,10,14,.94))" }}
        animate={{ height: closed ? "50%" : "0%" }}
        transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
      />
    </div>
  );
}

/* ── OrbitDot ──────────────────────────────────────────────── */
export function OrbitDot({ variant = "trio" }: { variant?: string }) {
  const trio = variant === "trio";
  return (
    <div className="flex h-64 w-full items-center justify-center py-12">
      <div className="relative size-40">
        <span className="absolute inset-0 rounded-full ring-1 ring-white/10" />
        <span className="absolute inset-6 rounded-full ring-1 ring-white/8" />
        {[0, 1, 2].slice(0, trio ? 3 : 2).map((i) => (
          <span key={i} className="orbit-dot absolute inset-0" style={{ animationDelay: `${i * -0.46}s` }}>
            <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: i === 0 ? "#a78bfa" : i === 1 ? "#e879f9" : "#2dd4bf", boxShadow: `0 0 14px currentColor` }} />
          </span>
        ))}
      </div>
      <style>{`
        .orbit-dot { animation: orb 1.4s cubic-bezier(.45,.05,.55,.95) infinite; }
        @keyframes orb {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(.62); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `}</style>
    </div>
  );
}
