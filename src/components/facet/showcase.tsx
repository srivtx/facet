"use client";

/* Facet / showcase — PlayerDeck, OrbitSystem, PeekFolder */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHOTOS, RAIL } from "@/lib/media";

/* ── PlayerDeck ────────────────────────────────────────────── */
/* A real listening surface: album art, artist, elapsed time. */
export function PlayerDeck({ variant = "rest" }: { variant?: string }) {
  const [playing, setPlaying] = useState(variant === "play");
  const [t, setT] = useState(38);
  const DUR = 184;
  return (
    <div className="flex w-full max-w-80 flex-col gap-4 rounded-2xl bg-[#0b0b10] p-5 ring-1 ring-white/10">
      <div className="flex items-center gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
          <img
            src={PHOTOS.night}
            alt="Album cover — night over the ridgeline"
            width={160}
            height={160}
            loading="lazy"
            className={cn("h-full w-full object-cover", playing && "animate-[facet-pulse-art_3.2s_ease-in-out_infinite]")}
          />
          <span className="absolute inset-0 ring-1 ring-inset ring-white/20" />
          <span
            aria-hidden
            className="absolute inset-0 rounded-lg"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,.25), transparent 55%)" }}
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-neutral-100">First Light (Arpette)</p>
          <p className="truncate text-xs text-neutral-500">noe alvarez · field recordings</p>
          <div className="mt-2 flex items-end gap-[3px]" aria-hidden>
            {[7, 12, 5, 14, 9, 11, 6].map((h, i) => (
              <span
                key={i}
                className="w-[3px] rounded-sm bg-violet-400/70"
                style={{
                  height: playing ? h : 3,
                  animation: playing ? `facet-eq .8s ease-in-out ${i * 0.11}s infinite alternate` : undefined,
                  transition: "height .3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="relative h-1.5 w-full rounded-full bg-white/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
            style={{ width: `${(t / DUR) * 100}%` }}
          />
          <span
            className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-white shadow"
            style={{ left: `calc(${(t / DUR) * 100}% - 6px)` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-neutral-500">
          <span>
            {Math.floor(t / 60)}:{String(t % 60).padStart(2, "0")}
          </span>
          <span>
            {Math.floor(DUR / 60)}:{String(DUR % 60).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-5">
        <button type="button" aria-label="Previous" className="text-neutral-400 transition-colors hover:text-neutral-100">
          <SkipBack className="size-4" />
        </button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          className="grid size-11 place-items-center rounded-full text-white"
          style={{
            background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
            boxShadow: "0 10px 26px -10px rgba(139,92,246,.8)",
          }}
        >
          {playing ? <Pause className="size-4" /> : <Play className="ml-0.5 size-4" />}
        </motion.button>
        <button type="button" aria-label="Next" className="text-neutral-400 transition-colors hover:text-neutral-100">
          <SkipForward className="size-4" />
        </button>
        <Volume2 className="ml-2 size-4 text-neutral-500" />
      </div>
      <style>{`
        @keyframes facet-pulse-art { 0%,100%{ filter: brightness(1) saturate(1);} 50%{ filter: brightness(1.14) saturate(1.18);} }
        @keyframes facet-eq { from { transform: scaleY(.4);} to { transform: scaleY(1);} }
      `}</style>
    </div>
  );
}

/* ── OrbitSystem ───────────────────────────────────────────── */
const BODIES = [
  { r: 34, p: 3.2, c: "#e879f9", s: 5, label: "core" },
  { r: 60, p: 6.5, c: "#a78bfa", s: 4, label: "near" },
  { r: 88, p: 10.8, c: "#8b5cf6", s: 6, label: "mid" },
  { r: 116, p: 16.4, c: "#2dd4bf", s: 5, label: "far" },
  { r: 144, p: 23.1, c: "#fbbf24", s: 3, label: "edge" },
];

export function OrbitSystem({ variant = "five" }: { variant?: string }) {
  const bodies = variant === "three" ? BODIES.slice(0, 3) : BODIES;
  const [frozen, setFrozen] = useState<string | null>(null);
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden">
      <div
        className="relative"
        style={{ transform: "rotateX(18deg)", transformStyle: "preserve-3d" }}
        onMouseLeave={() => setFrozen(null)}
      >
        {bodies.map((b) => {
          const run = frozen === null || frozen === b.label;
          return (
            <div key={b.label} className="absolute left-1/2 top-1/2">
              <span
                className="absolute block rounded-full ring-1 ring-white/10"
                style={{
                  width: b.r * 2,
                  height: b.r * 2,
                  left: -b.r,
                  top: -b.r,
                }}
              />
              <div
                className="absolute left-0 top-0"
                style={{
                  animation: run ? `facet-orb ${b.p}s linear infinite` : undefined,
                  animationPlayState: "running",
                }}
                onMouseEnter={() => setFrozen(b.label)}
              >
                <span
                  tabIndex={0}
                  aria-label={`${b.label} body`}
                  className="absolute block rounded-full"
                  style={{
                    width: b.s * 2,
                    height: b.s * 2,
                    left: b.r - b.s,
                    top: -b.s,
                    background: b.c,
                    boxShadow: `0 0 16px ${b.c}`,
                  }}
                />
              </div>
            </div>
          );
        })}
        <span className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_26px_rgba(255,255,255,.9)]" />
        <span className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(232,121,249,.24), transparent 65%)" }} />
      </div>
      <span className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-500">
        {frozen ? `holding · ${frozen}` : "period ∝ radius"}
      </span>
      <style>{`@keyframes facet-orb { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── PeekFolder ────────────────────────────────────────────── */
/* A camera roll: the folder fans its latest frames on hover. */
export function PeekFolder({ variant = "sheets" }: { variant?: string }) {
  const [open, setOpen] = useState(false);
  const tabs = variant === "tabs";
  const sheets = [0, 1, 2, 3];
  return (
    <div className="flex h-72 w-full items-center justify-center">
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {/* fanned frames — real photography, tucked into the roll */}
        {sheets.map((i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: 44,
              top: 6,
              width: 116,
              height: 84,
              zIndex: 10 + i,
            }}
            animate={{
              x: open ? -30 + i * 22 : -12 + i * 6,
              y: open ? -34 - i * 16 : -6 - i * 4,
              rotate: open ? -18 + i * 9 : -4 + i * 2,
            }}
            transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 24 }}
          >
            <div
              className={cn(
                "h-full w-full overflow-hidden rounded-md",
                tabs ? "bg-[#14141b]" : "bg-[#101014]",
              )}
              style={{
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,.14), 0 12px 28px -12px rgba(0,0,0,.8)",
              }}
            >
              {tabs ? (
                <span className="flex h-full w-full flex-col gap-1 p-1.5">
                  <span
                    className="h-2.5 w-10 rounded-sm"
                    style={{ background: `rgba(${150 + i * 25},${120 + i * 25},220,.85)` }}
                  />
                  <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500">
                    dsc_{4200 + i * 37}
                  </span>
                  <span className="mt-auto h-px w-full bg-white/10" />
                </span>
              ) : (
                <img
                  src={RAIL[i % RAIL.length]}
                  alt=""
                  width={232}
                  height={168}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </motion.div>
        ))}
        {/* folder body */}
        <div
          className="relative h-24 w-52 rounded-b-xl rounded-t-lg"
          style={{
            background: "linear-gradient(180deg, #171722, #101016)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.14), 0 20px 40px -18px rgba(0,0,0,.9)",
            zIndex: 20,
          }}
        >
          <span
            className="absolute -top-3 left-5 h-5 w-24 rounded-t-lg"
            style={{ background: "#1d1d29", boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)" }}
          />
          <div className="flex h-full items-end gap-2 px-5 pb-3">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-500">
              {open ? "24 frames" : "camera roll"}
            </span>
            <span className="mb-0.5 size-1 rounded-full bg-violet-400/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
