"use client";

/* Facet / landing — GalleryHero
 *
 * canvas-ui's landing puts a live canvas effect in the hero rather than a
 * gradient, so the first thing you see is the thing being sold. Same move
 * here: CxFrost (vendored from DavidHDev/canvas-ui) frosts a real specimen
 * card, which proves the primitive works before you scroll.
 *
 * Two things had to be earned rather than copied:
 *   - The hero effect needs a GPU context at first paint, which competes with
 *     the gallery below it. It is gated on the same reduced-motion flag and
 *     only mounts once, so it never queues behind the tile semaphore.
 *   - CxFrost reads its children out of the DOM, so the content has to exist
 *     in the server HTML. It is not a client-only island.
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CxFrost } from "@/components/facet/canvas/frost";
import { StageBoundary } from "./boundary";

const EASE = [0.22, 1, 0.36, 1] as const;

export function GalleryHero({
  eyebrow = "Open source · MIT",
  headline = "Copy the effect,",
  accent = "not the screenshot.",
  body = "A library of canvas and shader primitives for React. Every one is a file you can open, read and paste into your project — WebGL and WebGPU builds, no account, no watermark.",
  primary = { label: "Browse the library", href: "/library" },
  secondary = { label: "Read the docs", href: "/docs" },
}: {
  eyebrow?: string;
  headline?: string;
  accent?: string;
  body?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden">
      <div className="facet-stage pointer-events-none absolute inset-0 -z-10">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% -8%, color-mix(in oklab, var(--facet-violet) 26%, transparent), transparent 68%)",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16 sm:pt-24 lg:pt-28">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
          <div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex items-center gap-2.5"
            >
              <Circle aria-hidden className="size-1.5 fill-[var(--facet-teal)] text-[var(--facet-teal)]" />
              <span className="facet-label text-neutral-400">{eyebrow}</span>
            </motion.div>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
              className="mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.035em] text-neutral-50 sm:text-6xl lg:text-[4.25rem]"
            >
              {headline}{" "}
              <span className="bg-gradient-to-r from-[var(--facet-iris)] via-[var(--facet-violet)] to-[var(--facet-fuchsia)] bg-clip-text text-transparent">
                {accent}
              </span>
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-neutral-400 sm:text-lg"
            >
              {body}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.18 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <a
                href={primary.href}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full bg-neutral-50 px-5 py-2.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-white",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--facet-violet)]",
                )}
              >
                {primary.label}
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5"
                />
              </a>
              <a
                href={secondary.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-neutral-300 ring-1 ring-white/12 transition-colors hover:bg-white/5 hover:text-neutral-100",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--facet-violet)]",
                )}
              >
                {secondary.label}
              </a>
            </motion.div>
          </div>

          <Specimen reduce={!!reduce} />
        </div>
      </div>
    </section>
  );
}

/* live specimen — the hero's proof, not decoration */
function Specimen({ reduce }: { reduce: boolean }) {
  return (
    <motion.figure
      initial={reduce ? false : { opacity: 0, y: 22, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
      className="relative"
    >
      <StageBoundary label="CxFrost">
        <CxFrost
          className="block"
          strength={0.55}
          crispness={0.6}
          tintThick={[0.55, 0.42, 0.95]}
          tintStrength={0.5}
          refraction={0.35}
          textureScale={1.4}
          style={{ borderRadius: 20, overflow: "hidden" }}
        >
          <div className="flex min-h-72 flex-col justify-between gap-10 bg-[var(--facet-panel)] p-7">
            <div className="flex items-center justify-between">
              <span className="facet-label text-muted-foreground">specimen</span>
              <span className="rounded-full bg-foreground/8 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                frost
              </span>
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-[-0.03em] text-foreground">
                CxFrost
              </p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                A refractive ice pane. Real refraction, real sparkle, one file —
                and it degrades to flat markup when the browser cannot do it.
              </p>
            </div>
          </div>
        </CxFrost>
      </StageBoundary>
      <figcaption className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
        live · not a recording
      </figcaption>
    </motion.figure>
  );
}

export default GalleryHero;