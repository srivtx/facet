"use client";

/* Facet / detail view — the dedicated component page. Real URL,
   shareable, keyboard-first: Esc returns to the catalogue, arrows
   walk the index. The stage stays a dark island in both themes. */

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Layers,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoStage, StageTicks } from "@/components/facet/stage";
import {
  entryPath,
  familyLabel,
  familyPath,
  importPath,
  neighbours,
  related,
  type AxiomEntry,
} from "@/lib/registry";

export function DetailView({
  entry,
  initialVariant,
}: {
  entry: AxiomEntry;
  initialVariant?: string;
}) {
  const router = useRouter();
  const valid = entry.variants.some((v) => v.id === initialVariant);
  const [variant, setVariant] = useState(
    valid && initialVariant ? initialVariant : entry.variants[0].id,
  );
  const { prev, next } = neighbours(entry.id);
  const rel = related(entry.id);

  /* adopt a deep-linked variant (?v=) after hydration — keeps the
     route statically rendered while still honoring shareable URLs */
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("v");
    if (!v || !entry.variants.some((x) => x.id === v)) return;
    const t = setTimeout(() => setVariant(v), 0);
    return () => clearTimeout(t);
  }, [entry]);

  /* keyboard: Esc → catalogue, arrows → prev/next entry */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/library");
      if (e.key === "ArrowRight" && next) router.push(entryPath(next));
      if (e.key === "ArrowLeft" && prev) router.push(entryPath(prev));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, next, prev]);

  /* keep the URL in sync without re-rendering the route */
  const pick = useCallback(
    (v: string) => {
      setVariant(v);
      window.history.replaceState(null, "", `?v=${v}`);
    },
    [],
  );

  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      {/* ambient field behind the article */}
      <div aria-hidden className="facet-noise pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--primary) 9%, transparent), transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.21, 0.6, 0.35, 1] }}
        className="relative mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12"
      >
        <article
          className="overflow-hidden rounded-2xl bg-popover ring-1 ring-border
          shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.05),0_24px_56px_-20px_rgba(0,0,0,0.16)]
          dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_24px_64px_-24px_rgba(0,0,0,0.9)]"
        >
          {/* header */}
          <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
            <div className="min-w-0">
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 facet-label text-muted-foreground"
              >
                <Link
                  href="/library"
                  className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  library
                </Link>
                <span aria-hidden className="text-muted-foreground/40">/</span>
                <Link
                  href={familyPath(entry.family)}
                  className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {entry.family}
                </Link>
                <span aria-hidden className="text-muted-foreground/40">/</span>
                <span className="text-primary">{entry.id}</span>
              </nav>
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {entry.name}
                </h1>
                {entry.isNew && (
                  <span className="rounded-md bg-violet-500/10 px-2 py-1 facet-label text-violet-500 ring-1 ring-violet-500/30 dark:text-violet-300">
                    new
                  </span>
                )}
                <span className="rounded-md bg-primary/10 px-2 py-1 facet-label text-primary ring-1 ring-primary/30">
                  {familyLabel(entry.family)}
                </span>
                <span className="facet-label text-muted-foreground">
                  {entry.variants.length} forms
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{entry.tagline}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <Link
                href="/library"
                aria-label="Back to the library (Esc)"
                className="grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground ring-1 ring-border transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" />
              </Link>
              <span className="hidden items-center gap-1 text-[10px] text-muted-foreground/60 sm:flex">
                <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[9px] leading-none text-muted-foreground">esc</kbd>
              </span>
            </div>
          </div>

          {/* browser-chrome stage — dark island in both themes */}
          <div className="p-4 pb-0 sm:p-6 sm:pb-0">
            <div className="overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10">
              <div className="flex h-11 items-center gap-3 border-b border-white/[0.06] bg-[#0c0c11] px-4">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="size-2.5 rounded-full bg-white/15" />
                  ))}
                </div>
                <span className="flex h-6 min-w-0 flex-1 items-center truncate rounded-md bg-white/[0.04] px-3 font-mono text-[11px] leading-none text-neutral-400">
                  Facet://library/{entry.family}/{entry.id}?v={variant}
                </span>
                <span className="hidden items-center gap-1.5 facet-label text-white/50 sm:flex">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-400/70" />
                  live
                </span>
              </div>
              <div className="facet-stage relative flex min-h-[22rem] items-center justify-center p-5 sm:min-h-[30rem] sm:p-8">
                <div aria-hidden className="facet-dots absolute inset-0 opacity-60" />
                <StageTicks />
                {/* stage volume — the same bloom the home rows seat
                    behind their clusters; without it the stage is a
                    surface, with it the stage is a lit space */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-3xl"
                  style={{ background: "radial-gradient(circle, var(--facet-glow-a), transparent 62%)" }}
                />
                <div className="relative z-10 flex w-full items-center justify-center">
                  <DemoStage comp={entry.id} variant={variant} big />
                </div>
                {/* corner chrome — same instrument language as the home rows */}
                <span className="absolute bottom-6 left-6 flex h-4 items-center facet-label text-white/55">
                  {entry.family} / {entry.id}
                </span>
                <span className="absolute bottom-6 right-6 flex h-4 items-center gap-2 facet-label text-white/55">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-400/70" />
                  live
                </span>
              </div>
            </div>
          </div>

          {/* variant tabs */}
          <div className="flex flex-col gap-2.5 px-4 pt-5 sm:px-6 sm:pt-6 md:flex-row md:items-center md:gap-4">
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Variant forms">
              {entry.variants.map((v) => {
                const engaged = variant === v.id;
                return (
                  <button
                    key={v.id}
                    role="tab"
                    aria-selected={engaged}
                    type="button"
                    onClick={() => pick(v.id)}
                    title={v.hint}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-medium tracking-tight transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      engaged
                        ? "bg-foreground text-background"
                        : "bg-secondary text-foreground/75 ring-1 ring-border hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>
            <span className="text-xs text-muted-foreground md:ml-1">
              {entry.variants.find((v) => v.id === variant)?.hint}
            </span>
          </div>

          {/* description + install */}
          <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
            <div className="flex flex-col gap-4">
              <p className="max-w-2xl text-sm leading-relaxed text-foreground/85">
                {entry.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium tracking-tight text-foreground/70 ring-1 ring-border"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {/* related */}
              <div className="mt-2">
                <p className="facet-label text-muted-foreground">pairs with</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {rel.map((r) => (
                    <Link
                      key={r.id}
                      href={entryPath(r)}
                      className="group/rel inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-medium tracking-tight text-foreground/75 ring-1 ring-border transition-all duration-200 hover:bg-accent hover:text-foreground hover:ring-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {r.name}
                      <ArrowUpRight className="size-3 text-muted-foreground/60 transition-colors duration-200 group-hover/rel:text-primary" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* install card */}
            <aside className="flex flex-col gap-3 rounded-xl bg-secondary p-4 ring-1 ring-border lg:mt-0">
              <p className="facet-label text-muted-foreground">use it</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Copy the primitive into your project — it is self-contained.
                Reads tokens from the stylesheet, no asset files.
              </p>
              <div className="flex items-center gap-2 rounded-lg bg-popover p-2.5 ring-1 ring-border">
                <code
                  title={`import { ${entry.name.replace(/\s+/g, "")} } from "${importPath(entry.id)}";`}
                  className="min-w-0 flex-1 truncate font-mono text-[11px] font-medium text-foreground/90"
                >
                  {`import { ${entry.name.replace(/\s+/g, "")} } from "${importPath(entry.id)}"`}
                </code>
                <CopyButton
                  text={`import { ${entry.name.replace(/\s+/g, "")} } from "${importPath(entry.id)}";`}
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["tailwind v4", "css @property", "no deps"].map((d) => (
                  <span
                    key={d}
                    className="rounded-full bg-popover px-2 py-0.5 text-[10px] font-medium tracking-tight text-muted-foreground ring-1 ring-border"
                  >
                    {d}
                  </span>
                ))}
              </div>
              <Link
                href="/docs"
                className="mt-1 inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-primary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Read the setup notes
                <ArrowRight className="size-3.5" />
              </Link>
            </aside>
          </div>

          {/* prev / next — two-line steps, arrow keys walk them */}
          <div className="flex items-stretch justify-between gap-3 border-t border-border p-4">
            <StepLink dir="prev" target={prev} />
            <StepLink dir="next" target={next} />
          </div>
        </article>
      </motion.div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy import statement"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {
          /* clipboard unavailable — ignore */
        }
      }}
      className="grid size-7 shrink-0 place-items-center rounded-md bg-secondary text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {done ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
    </button>
  );
}

function StepLink({ dir, target }: { dir: "prev" | "next"; target: AxiomEntry | null }) {
  const isPrev = dir === "prev";
  if (!target) {
    return (
      <span className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground/40">
        {isPrev && <ArrowLeft className="size-4 shrink-0" />}
        <span className="truncate">{isPrev ? "start of index" : "end of index"}</span>
        {!isPrev && <ArrowRight className="size-4 shrink-0" />}
      </span>
    );
  }
  return (
    <Link
      href={entryPath(target)}
      className="group/step flex min-w-0 flex-1 flex-col gap-1 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
    >
      <span className="flex items-center gap-1.5 facet-label text-muted-foreground/70">
        {isPrev ? <ArrowLeft className="size-3" /> : null}
        {dir}
        <span className="hidden rounded border border-border px-1 py-px font-mono text-[9px] leading-none text-muted-foreground/60 group-hover/step:border-ring/50 md:inline">
          {isPrev ? "←" : "→"}
        </span>
        {!isPrev && <ArrowRight className="size-3" />}
      </span>
      <span
        className={cn(
          "truncate text-sm font-medium text-foreground/80 transition-colors group-hover/step:text-foreground",
          !isPrev && "text-right",
        )}
      >
        {target.name}
      </span>
    </Link>
  );
}
