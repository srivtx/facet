"use client";

/* Facet / rows — the catalogue: one alternating
   left/right split per family. Text column always leads the DOM;
   the demo column flips sides every row via order utilities.
   Mobile: demo stacks above the copy. Desktop: 2fr / 3fr grid. */

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoStage, StageTicks } from "@/components/facet/stage";
import { ENTRIES, FAMILIES, COUNTS, entryPath, familyPath, type FamilyId } from "@/lib/registry";
import { PHOTOS } from "@/lib/media";

/* one demo composition per family — two or three live primitives
   share the stage so the family reads as a family, not a lone prop.
   Headlines stay solid — one gradient per page, on the section
   header only; density here reads as noise. */
const ROWS: {
  family: FamilyId;
  headline: React.ReactNode;
  demos: { comp: string; variant: string }[];
  big?: boolean;
}[] = [
  {
    family: "ambience",
    headline: <>Backgrounds that breathe, not loop.</>,
    demos: [{ comp: "corona", variant: "violet" }],
    big: true,
  },
  {
    family: "buttons",
    headline: <>Controls with a physical response.</>,
    demos: [{ comp: "checkout", variant: "violet" }],
  },
  {
    family: "cards",
    headline: <>Surfaces that react to the pointer.</>,
    demos: [
      { comp: "halocard", variant: "orbit" },
      { comp: "pointercard", variant: "spotlight" },
    ],
  },
  {
    family: "textfx",
    headline: <>Type that moves with intent.</>,
    demos: [{ comp: "flipcycle", variant: "slow" }],
  },
  {
    family: "motion3d",
    headline: <>Depth is a material, not a gimmick.</>,
    demos: [
      { comp: "isostage", variant: "cluster" },
      { comp: "orbitcam", variant: "blank" },
    ],
  },
  {
    family: "galleries",
    headline: <>Motion you can browse.</>,
    demos: [{ comp: "orbitgal", variant: "auto" }],
  },
  {
    family: "navigation",
    headline: <>Wayfinding with muscle memory.</>,
    demos: [
      { comp: "notchbar", variant: "labels" },
      { comp: "spotbar", variant: "underline" },
    ],
  },
  {
    family: "loaders",
    headline: <>Waiting states worth watching.</>,
    demos: [
      { comp: "kinetic", variant: "word" },
      { comp: "orbitdot", variant: "trio" },
    ],
  },
  {
    family: "inputs",
    headline: <>Fields with character.</>,
    demos: [{ comp: "goosearch", variant: "modal" }],
  },
  {
    family: "showcase",
    headline: <>Habitats, not screenshots.</>,
    demos: [{ comp: "playerdeck", variant: "play" }],
  },
];

const rise = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export function FamilyRows({ families }: { families?: FamilyId[] }) {
  const rows = families ? ROWS.filter((r) => families.includes(r.family)) : ROWS;
  return (
    <section id="families" className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 md:py-24 lg:px-10">
      {/* section header — the four-part section header */}
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="facet-eyebrow text-primary">
            the catalogue · {COUNTS.families} families
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
            Each family gets <span className="facet-grad">its own stage</span>.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            One alternating pass per family — copy on one side, the live
            primitives on the other. Every stage is the component itself, not
            a recording of it.
          </p>
        </div>
        <Link
          href="/library"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-md text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Browse the full index
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </header>

      {/* the alternating rows */}
      <div className="mt-14 flex flex-col gap-16 md:mt-20 md:gap-24">
        {rows.map((row, i) => {
          const fam = FAMILIES.find((f) => f.id === row.family)!;
          const entries = ENTRIES.filter((e) => e.family === row.family);
          const flip = i % 2 === 1;
          const lead = entries.find((e) => e.featured) ?? entries[0];
          return (
            <article
              key={row.family}
              id={row.family}
              className="grid grid-cols-1 scroll-mt-28 items-center gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12 lg:gap-16"
            >
              {/* ── text column (DOM-first) ─────────────────── */}
              <motion.div
                {...rise}
                transition={{ duration: 0.5, delay: flip ? 0.08 : 0, ease: "easeOut" }}
                className={cn("flex flex-col gap-5", flip && "md:order-last")}
              >
                <div className="flex items-center gap-3">
                  <p className="inline-flex items-center gap-2.5 rounded-full bg-secondary px-3.5 py-1.5 facet-label text-muted-foreground ring-1 ring-border">
                    {fam.label}
                    <span className="h-3 w-px bg-border" aria-hidden />
                    <span className="tabular-nums text-foreground/70">{entries.length}</span>
                  </p>
                </div>

                <h3 className="text-balance text-2xl font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-[1.75rem]">
                  {row.headline}
                </h3>

                <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                  {fam.blurb} Open any primitive for its page, variant forms
                  and the notes behind the motion.
                </p>

                {/* every entry in the family, one tap away — all chips
                    share one fixed geometry so wrapped rows stay rhythmic */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {entries.map((e) => (
                    <Link
                      key={e.id}
                      href={entryPath(e)}
                      className="group/chip inline-flex h-8 items-center gap-1.5 rounded-full bg-secondary px-3.5 text-xs font-medium tracking-tight text-foreground/75 ring-1 ring-border transition-all duration-200 hover:bg-accent hover:text-foreground hover:ring-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {e.name}
                      <ArrowUpRight className="size-3 text-muted-foreground/60 transition-colors duration-200 group-hover/chip:text-primary" />
                    </Link>
                  ))}
                  <Link
                    href={familyPath(row.family)}
                    className="group/more inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium tracking-tight text-primary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    all {entries.length}
                    <ArrowRight className="size-3 transition-transform duration-200 group-hover/more:translate-x-0.5" />
                  </Link>
                </div>
              </motion.div>

              {/* ── demo column — the dark island stage ──────── */}
              <motion.div
                {...rise}
                transition={{ duration: 0.55, delay: flip ? 0 : 0.08, ease: "easeOut" }}
                className={cn(
                  "group relative rounded-2xl",
                  flip ? "order-first" : "order-first md:order-none",
                )}
              >
                <Link
                  href={entryPath(lead)}
                  aria-label={`Open the ${lead.name} page`}
                  className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                {/* the dark island — seat shadow lives on this element so it
                    is never clipped by an ancestor's overflow-hidden.
                    Hover brightens the rim and the corner chrome —
                    no scale-press, the stage is a surface, not a button. */}
                <div className="facet-stage facet-seat relative flex min-h-[19rem] items-center justify-center overflow-hidden rounded-2xl p-5 sm:min-h-[22rem] md:min-h-[24rem] md:p-8">
                  <div aria-hidden className="facet-dots absolute inset-0 opacity-40" />
                  <StageTicks />
                  {/* stage volume — a bloom behind the demo cluster so the
                      surface reads as lit space around the specimens */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-3xl"
                    style={{ background: "radial-gradient(circle, var(--facet-halo-a), transparent 62%)" }}
                  />
                  <div className="relative z-10 flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-8">
                    {row.demos.map((d) => (
                      <DemoStage key={d.comp} comp={d.comp} variant={d.variant} big={row.big} />
                    ))}
                  </div>
                  {/* ambience rows get a subject: a wallpaper preview seated
                      on the background, so the glow frames real content */}
                  {row.family === "ambience" && (
                    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                      <span className="relative block h-24 w-40 overflow-hidden rounded-xl shadow-[0_24px_48px_-16px_rgba(0,0,0,.8)] ring-1 ring-white/25">
                        <img
                          src={PHOTOS.coast}
                          alt=""
                          width={320}
                          height={192}
                          loading="lazy"
                          draggable={false}
                          className="h-full w-full object-cover"
                        />
                      </span>
                    </div>
                  )}
                  {/* corner chrome — island-local, stays light-on-dark;
                      both corners seat on the same fixed height */}
                  <span className="absolute left-6 top-6 flex h-4 items-center facet-label text-white/60 transition-colors duration-500 group-hover:text-white/80">
                    {row.family} / {lead.id}
                  </span>
                  <span className="absolute right-6 top-6 flex h-4 items-center gap-2 facet-label text-white/60">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-400/70" />
                    live
                  </span>
                  <span className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/85 ring-1 ring-white/15 backdrop-blur-sm">
                      Open {lead.name} →
                    </span>
                  </span>
                </div>
                </Link>
              </motion.div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
