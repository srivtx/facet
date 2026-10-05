"use client";

/* Facet / hero — copy left, a floating instrument cluster right.
   No stage box: the cluster sits in open space on the page's own
   atmosphere. Every pane is glass with its own halo behind it, the
   whole field answers the pointer in depth, and each pane rides
   an idle float on its own clock. The FIELD tile reads the actual
   spring values driving the parallax — an instrument, not an
   ornament. Every pane is a real technique from the library; the
   hero demos the product. */

import React, { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, Github, Star } from "lucide-react";
import { TiltCard } from "@/components/facet/motion3d";
import { FlipCycle } from "@/components/facet/textfx";
import { COUNTS } from "@/lib/registry";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.21, 0.6, 0.35, 1] as const },
});

/* halo color passed to .facet-halo via --facet-halo */
const HALO_VIOLET = "var(--facet-halo-a)" as const;
const HALO_SKY = "var(--facet-halo-b)" as const;

export function Hero() {
  const reduce = useReducedMotion();

  /* ── pointer parallax rig ─────────────────────────────── */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 90, damping: 20, mass: 0.6 });

  const stageRef = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (reduce) return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  /* cluster tilt — subtle, capped at ±3.5deg */
  const cry = useTransform(sx, (v) => v * 3.5);
  const crx = useTransform(sy, (v) => -v * 3.5);

  /* the hero card barely moves under the pointer (9px) — the
     cluster tilt and the floor carry the depth instead */
  const cardX = useTransform(sx, (v) => v * 9);
  const cardY = useTransform(sy, (v) => v * 9);

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="facet-aurora" />
      <div aria-hidden className="facet-grid absolute inset-0 opacity-75 sm:opacity-100" />
      {/* horizon — a wide, low sky-tone light seated at the section
          foot. Fills the lower field with atmosphere, not content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-20%] bottom-[-14%] h-[42%] opacity-90 blur-3xl"
        style={{ background: "radial-gradient(ellipse 50% 100% at 50% 100%, var(--facet-glow-b), transparent 70%)" }}
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-12 px-5 pb-24 pt-20 sm:px-6 lg:grid-cols-[44%_56%] lg:gap-0 lg:pb-28 lg:px-10 lg:pt-24">
        {/* ── copy column ─────────────────────────────────── */}
        <div className="relative z-10 flex max-w-xl flex-col gap-6 sm:gap-7">
          <motion.div
            {...fade(0)}
            className="w-fit max-w-full"
          >
            <Link
              href="/changelog"
              className="group relative inline-flex w-fit max-w-full items-center gap-2.5 rounded-full bg-secondary py-1 pl-2 pr-4 ring-1 ring-border transition-colors hover:ring-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex h-6 shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary ring-1 ring-primary/25">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400/90" />
                v3
              </span>
              <span className="truncate text-xs font-medium tracking-tight text-muted-foreground">
                a page for every primitive
              </span>
              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.h1
            {...fade(0.08)}
            className="text-balance text-[2.35rem] font-semibold leading-[1.06] tracking-[-0.03em] text-foreground sm:text-5xl sm:leading-[1.04] xl:text-[3.4rem]"
          >
            Components that
            <br />
            <span className="facet-grad">demo themselves.</span>
          </motion.h1>

          <motion.p
            {...fade(0.16)}
            className="max-w-md text-pretty text-[15px] leading-relaxed tracking-tight text-muted-foreground dark:text-foreground/75"
          >
            {COUNTS.entries} motion-built React primitives. Every stage on this
            site is the real component — live, interactive, ready to ship. No
            screenshots, no mockups, nothing faked.
          </motion.p>

          <motion.div {...fade(0.24)} className="flex flex-wrap items-center gap-3">
            <Link
              href="/library"
              className="facet-sheen group inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-foreground px-6 text-[15px] font-semibold text-background shadow-lg shadow-foreground/20 transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] sm:w-auto"
            >
              Browse the library
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <a
              href="https://github.com/srivtx/Facet"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-secondary/80 px-6 text-[15px] font-semibold text-foreground ring-1 ring-border backdrop-blur-md transition-all duration-200 hover:bg-accent hover:ring-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] sm:w-auto"
            >
              <Github className="size-4" />
              View on GitHub
            </a>
          </motion.div>

          <motion.div
            {...fade(0.32)}
            className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-4 text-xs font-medium tracking-tight text-muted-foreground sm:gap-x-4"
          >
            <span className="flex items-center gap-1.5">
              <Star className="size-3.5 fill-amber-500 text-amber-500" />
              MIT licensed
            </span>
            <span className="hidden h-3.5 w-px bg-border sm:block" />
            <span>TypeScript strict</span>
            <span className="hidden h-3.5 w-px bg-border sm:block" />
            <span>Copy-paste ready</span>
          </motion.div>
        </div>

        {/* ── scene column — the open floating cluster ──── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.21, 0.6, 0.35, 1] }}
          className="relative h-[420px] sm:h-[500px] lg:h-[580px]"
          style={{ perspective: 1400 }}
        >
          <div
            ref={stageRef}
            onPointerMove={onMove}
            onPointerLeave={reset}
            className="absolute inset-0"
          >
            {/* ambient scene light — two large blooms owning the space,
                not any one pane. Violet above the cluster, sky below. */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[38%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-100 blur-3xl"
              style={{ background: "radial-gradient(circle, var(--facet-glow-a), transparent 60%)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-[2%] right-[6%] h-56 w-72 rounded-full opacity-90 blur-3xl"
              style={{ background: "radial-gradient(circle, var(--facet-glow-b), transparent 60%)" }}
            />

            {/* corner bloom — the upper-left field gets its own
                source so no quadrant of the canvas reads unlit */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-[10%] -top-[8%] h-80 w-80 rounded-full opacity-60 blur-3xl"
              style={{ background: "radial-gradient(circle, var(--facet-glow-a), transparent 65%)" }}
            />

            {/* studio floor — a perspective grid receding below the
                cluster. Grounds the float without boxing it in. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-[-30%] bottom-[-6%] h-[46%] opacity-80"
              style={{
                transform: "perspective(600px) rotateX(58deg)",
                transformOrigin: "50% 0%",
                maskImage: "linear-gradient(to bottom, transparent, black 16%, transparent 94%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 16%, transparent 94%)",
              }}
            >
              <div className="facet-gridlite absolute inset-0" />
            </div>

            <motion.div
              className="absolute inset-0"
              style={{ rotateX: crx, rotateY: cry, transformStyle: "preserve-3d" }}
            >
              {/* the hero object — one dominant product card in the
                  environment. Nothing competes with it: the blooms,
                  the floor and the parallax all serve the subject. */}
              <motion.div
                style={{ x: cardX, y: cardY }}
                className="absolute left-1/2 top-1/2 w-[84%] max-w-[400px] -translate-x-1/2 -translate-y-1/2"
              >
                <Float dur={10} amp={7} reduce={!!reduce}>
                  <div className="relative [filter:drop-shadow(0_28px_56px_rgba(0,0,0,0.45))]">
                    <span
                      aria-hidden
                      className="facet-halo"
                      style={{ "--facet-halo": HALO_VIOLET } as React.CSSProperties}
                    />
                    <div className="scale-[0.82] sm:scale-[0.92] lg:scale-105">
                      <TiltCard />
                    </div>
                  </div>
                </Float>
              </motion.div>
            </motion.div>

            {/* mobile row — two small demos under the card */}
            <div className="absolute inset-x-8 bottom-14 flex items-center justify-center gap-8 sm:hidden">
              <div className="scale-[0.55] origin-center overflow-hidden rounded-lg bg-[#0a0a11] p-2 ring-1 ring-white/10">
                <FlipCycle variant="slow" text="type" />
              </div>
              <FieldTile sx={sx} sy={sy} compact />
            </div>
          </div>
        </motion.div>
      </div>

      {/* vignette — the cinematic edge falloff. Lifting the center,
          seating the corners: the frame reads as filmed, not drawn. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 42%, transparent 55%, rgba(0,0,0,0.42) 100%)",
        }}
      />
    </section>
  );
}

/* ── field telemetry tile (mobile companion) ──────────────
   Renders the live spring inputs as tabular numerals — the hero
   answers the pointer, and the numbers prove it. */
function FieldTile({
  sx,
  sy,
  compact = false,
}: {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  compact?: boolean;
}) {
  const fmt = (v: number) =>
    `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(2)}`;
  const fx = useTransform(sx, fmt);
  const fy = useTransform(sy, fmt);
  return (
    <div className={`facet-glass ${compact ? "px-3.5 py-2.5" : "px-4 py-3.5"} rounded-xl`}>
      <p className="facet-label text-muted-foreground">field</p>
      <div className="mt-2 flex items-center justify-between gap-6 font-mono text-xs tabular-nums font-semibold leading-none">
        <span className="flex items-center gap-1.5">
          <span className="text-muted-foreground/80">x</span>
          <motion.span className="text-primary">{fx}</motion.span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-muted-foreground/80">y</span>
          <motion.span className="text-sky-500 dark:text-sky-400">{fy}</motion.span>
        </span>
      </div>
    </div>
  );
}

/* idle float on an independent clock, nested so it never fights
   the parallax translate on the parent */
function Float({
  dur,
  amp,
  reduce,
  children,
}: {
  dur: number;
  amp: number;
  reduce: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -amp, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
