"use client";

/* Facet / catalogue — the library index page. Sticky family sidebar
   on desktop, pill scroller on mobile, live-tile grid, URL-synced
   filters (?f=, ?q=). Every tile is the component itself. */

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoStage } from "@/components/facet/stage";
import { RAIL } from "@/lib/media";
import {
  ENTRIES,
  FAMILIES,
  COUNTS,
  entryPath,
  familyBlurb,
  familyPath,
  type FamilyId,
} from "@/lib/registry";

export function Catalogue({
  initialFamily = "all",
}: {
  initialFamily?: FamilyId | "all";
}) {
  const [family, setFamily] = useState<FamilyId | "all">(initialFamily);
  const [q, setQ] = useState("");

  const list = useMemo(
    () =>
      ENTRIES.filter((e) => {
        const fam = family === "all" || e.family === family;
        const needle = q.trim().toLowerCase();
        const hit =
          !needle ||
          e.name.toLowerCase().includes(needle) ||
          e.tagline.toLowerCase().includes(needle) ||
          e.tags.some((t) => t.includes(needle));
        return fam && hit;
      }),
    [family, q],
  );

  const activeBlurb = family === "all" ? null : familyBlurb(family);

  const pick = (f: FamilyId | "all") => {
    setFamily(f);
    window.history.replaceState(null, "", f === "all" ? "/library" : familyPath(f));
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-24 pt-10 sm:px-6 sm:pt-14 lg:px-10">
      {/* page header */}
      <header className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="facet-eyebrow text-primary">the library</p>
            <h1 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
              Every tile is the <span className="facet-grad">component itself</span>.
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {COUNTS.entries} live primitives across {COUNTS.families} families and{" "}
              {COUNTS.variants} variant forms. No thumbnails, no recordings —
              open any tile for its page.
            </p>
          </div>
          <label className="facet-glass group flex h-11 w-full max-w-xs items-center gap-2.5 rounded-xl px-4 transition-[box-shadow] focus-within:ring-2 focus-within:ring-ring sm:w-72">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter primitives…"
              aria-label="Filter primitives"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Clear filter"
                className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-3.5" />
              </button>
            )}
          </label>
        </div>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        {/* ── sidebar (desktop) / pills (mobile) ─────────────── */}
        <nav aria-label="Families" className="lg:sticky lg:top-24 lg:self-start">
          {/* mobile: horizontal pills with a trailing fade hinting
              at more content off-screen */}
          <div className="relative -mx-1 lg:hidden" role="tablist">
            <div className="facet-scroll flex gap-2 overflow-x-auto px-1 pb-1">
              {[{ id: "all" as const, label: `All · ${ENTRIES.length}` }, ...FAMILIES.map((f) => ({ id: f.id, label: f.label }))].map(
                (f) => {
                  const engaged = family === f.id;
                  return (
                    <button
                      key={f.id}
                      role="tab"
                      aria-selected={engaged}
                      type="button"
                      onClick={() => pick(f.id)}
                      className={cn(
                        "shrink-0 rounded-full px-4 py-2 text-xs font-medium tracking-tight transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        engaged
                          ? "bg-foreground text-background"
                          : "bg-secondary text-muted-foreground ring-1 ring-border hover:text-foreground",
                      )}
                    >
                      {f.label}
                    </button>
                  );
                },
              )}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-background via-background/80 to-transparent"
            />
          </div>

          {/* desktop: vertical tree */}
          <ul className="hidden flex-col gap-0.5 lg:flex">
            <li>
              <SideItem
                engaged={family === "all"}
                label="All primitives"
                count={ENTRIES.length}
                onClick={() => pick("all")}
                href="/library"
              />
            </li>
            {FAMILIES.map((f) => (
              <li key={f.id}>
                <SideItem
                  engaged={family === f.id}
                  label={f.label}
                  count={ENTRIES.filter((e) => e.family === f.id).length}
                  onClick={() => pick(f.id)}
                  href={familyPath(f.id)}
                />
              </li>
            ))}
          </ul>

          {/* active family blurb — desktop only quiet note */}
          {activeBlurb && (
            <p className="mt-4 hidden border-l-2 border-primary/40 pl-3 text-xs leading-relaxed text-muted-foreground lg:block">
              {activeBlurb}
            </p>
          )}
        </nav>

        {/* ── the grid ───────────────────────────────────────── */}
        <div>
          {activeBlurb && (
            <p className="mb-6 border-l-2 border-primary/40 pl-3 text-xs leading-relaxed text-muted-foreground lg:hidden">
              {activeBlurb}
            </p>
          )}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Link
                  href={entryPath(e)}
                  onMouseMove={(ev) => {
                    /* feed the spotlight its cursor position */
                    const r = ev.currentTarget.getBoundingClientRect();
                    ev.currentTarget.style.setProperty("--mx", `${ev.clientX - r.left}px`);
                    ev.currentTarget.style.setProperty("--my", `${ev.clientY - r.top}px`);
                  }}
                  className={cn(
                    "facet-spot facet-hairline group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card text-left",
                    "transition-all duration-200",
                    "hover:-translate-y-1",
                    "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_16px_40px_-16px_rgba(0,0,0,0.14)]",
                    "dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_16px_48px_-20px_rgba(0,0,0,0.8)] dark:hover:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_24px_64px_-24px_rgba(0,0,0,0.95)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  {/* demo viewport — the dark island */}
                  <div className="facet-stage relative flex h-56 items-center justify-center overflow-hidden rounded-t-2xl p-4 sm:h-60">
                    <div aria-hidden className="facet-dots absolute inset-0 opacity-55" />
                    {e.family === "ambience" ? (
                      /* ambience demos are backgrounds — seat a wallpaper
                         preview on them so the tile reads as a scene */
                      <>
                        <DemoStage comp={e.id} variant={e.variants[0].id} tile />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="relative block h-[5.5rem] w-40 overflow-hidden rounded-xl shadow-[0_24px_48px_-16px_rgba(0,0,0,.8)] ring-1 ring-white/25">
                            <img
                              src={RAIL[i % RAIL.length]}
                              alt=""
                              width={320}
                              height={220}
                              loading="lazy"
                              draggable={false}
                              className="h-full w-full object-cover"
                            />
                            <span className="absolute inset-x-0 bottom-0 bg-black/55 py-1 text-center facet-label text-white/85 backdrop-blur-sm">
                              {e.name}
                            </span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="relative z-10 flex w-full items-center justify-center">
                        <DemoStage comp={e.id} variant={e.variants[0].id} />
                      </div>
                    )}
                    {e.isNew && (
                      <span className="absolute left-4 top-4 rounded-md bg-indigo-500/15 px-2 py-1 facet-label text-indigo-300 ring-1 ring-indigo-400/30 backdrop-blur-sm">
                        new
                      </span>
                    )}
                  </div>
                  {/* footer */}
                  <div className="flex flex-1 items-start justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <p className="facet-label text-muted-foreground dark:text-foreground/60">{e.family}</p>
                      <h2 className="mt-2 text-[15px] font-semibold tracking-tight text-foreground">
                        {e.name}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-normal text-muted-foreground">
                        {e.tagline}
                      </p>
                    </div>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary/60 text-muted-foreground ring-1 ring-border/60 transition-all duration-200 group-hover:bg-primary/15 group-hover:text-primary group-hover:ring-ring/40">
                      <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {list.length === 0 && (
            <div className="mt-16 flex flex-col items-center gap-3 text-muted-foreground">
              <Search className="size-6" />
              <p className="text-sm">Nothing matches “{q}”.</p>
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  pick("all");
                }}
                className="rounded-lg bg-secondary px-4 py-2 text-xs font-medium ring-1 ring-border transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SideItem({
  engaged,
  label,
  count,
  onClick,
  href,
}: {
  engaged: boolean;
  label: string;
  count: number;
  onClick: () => void;
  href: string;
}) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        /* same-route clicks handled client-side to avoid full nav */
        if (window.location.pathname === href) {
          e.preventDefault();
          onClick();
        } else {
          onClick();
        }
      }}
      aria-current={engaged ? "page" : undefined}
      className={cn(
        "group/side relative flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        engaged
          ? "bg-primary/15 font-medium text-foreground ring-1 ring-primary/25"
          : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
      )}
    >
      {engaged && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary"
        />
      )}
      <span className="min-w-0 truncate tracking-tight">{label}</span>
      <span className="font-mono text-[10px] tabular-nums leading-none text-muted-foreground">
        {count}
      </span>
    </Link>
  );
}
