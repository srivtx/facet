"use client";

/* Facet / cards — PointerCard, HaloCard, StackDeck, VoiceCard.
   Every surface carries real product content: photography, prices,
   flight data, review metrics. The motion is the component; the
   content is what makes it read as shipped UI. */

import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ArrowRight, GitBranch, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHOTOS, FACES, PEOPLE, QUOTE } from "@/lib/media";

/* ── PointerCard ───────────────────────────────────────────── */
/* A stay card: lake photography, location, price. The spotlight
   and the border ignition track the cursor across the media. */
export function PointerCard({ variant = "spotlight", title = "Stay" }: { variant?: string; title?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const edge = variant === "edge";
  const onMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", `${e.clientX - r.left}px`);
    el.style.setProperty("--py", `${e.clientY - r.top}px`);
  }, []);
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      tabIndex={0}
      className={cn(
        "pc-card group relative h-64 w-full max-w-72 overflow-hidden rounded-xl bg-[#0b0b10] p-5",
        "ring-1 ring-white/10 transition-shadow duration-300 hover:shadow-[0_20px_60px_-24px_rgba(139,92,246,.35)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background: edge
            ? "radial-gradient(340px circle at var(--px) var(--py), rgba(139,92,246,.2), transparent 45%)"
            : "radial-gradient(180px circle at var(--px) var(--py), rgba(255,255,255,.14), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          padding: "1px",
          background: edge
            ? "radial-gradient(220px circle at var(--px) var(--py), rgba(167,139,250,.9), transparent 55%)"
            : "radial-gradient(160px circle at var(--px) var(--py), rgba(255,255,255,.5), transparent 60%)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          borderRadius: "inherit",
        }}
      />
      <div className="relative z-10 flex h-full flex-col">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={PHOTOS.lake}
            alt="Still water at dawn, South Tyrol"
            width={640}
            height={280}
            loading="lazy"
            className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span className="absolute inset-0 ring-1 ring-inset ring-white/15" />
          <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur-sm">
            {title}
          </span>
        </div>
        <div className="mt-3.5">
          <p className="flex items-center justify-between text-[15px] font-semibold tracking-tight text-neutral-100">
            Lago di Braies, IT
            <span className="flex items-center gap-1 text-xs font-medium text-neutral-300">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              4.8
            </span>
          </p>
          <p className="mt-1 text-sm leading-relaxed text-neutral-400">
            Lakeside room, breakfast on the dock, rowboats included before nine.
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-semibold tracking-tight text-neutral-50">$184</span>
            <span className="text-xs text-neutral-500">per night</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-neutral-200 ring-1 ring-white/15 transition-colors group-hover:bg-white/15 group-hover:text-white">
            Reserve
            <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── HaloCard ──────────────────────────────────────────────── */
/* A deploy card: repo, short commit, checks, promotion action.
   The beam rides the outline on its clock. */
export function HaloCard({ variant = "orbit", title = "Deploy" }: { variant?: string; title?: string }) {
  const hoverOnly = variant === "hover";
  return (
    <div className="relative w-full max-w-72 overflow-hidden rounded-xl bg-[#0b0b10] ring-1 ring-white/10">
      {!hoverOnly && (
        <span aria-hidden className="facet-beam rounded-xl" style={{ "--beam-dur": "6s" } as React.CSSProperties} />
      )}
      <div
        className={cn(
          "group relative z-10 flex h-64 flex-col p-5",
          hoverOnly && "transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(167,139,250,.4)]",
        )}
      >
        {hoverOnly && (
          <span aria-hidden className="facet-beam opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl" style={{ "--beam-dur": "3s" } as React.CSSProperties} />
        )}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
            <GitBranch className="size-3 text-violet-300" />
            Facet / {title.toLowerCase()}
          </span>
          <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/25">
            8f3a21c
          </span>
        </div>
        <div className="mt-4">
          <p className="text-[15px] font-semibold leading-tight tracking-tight text-neutral-100">
            Stage deploy · 12 checks passing
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">
            Bundle down 8%, zero regressions on the visual suite. Ready to promote.
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-neutral-500">
            <CheckCircle2 className="size-3.5 text-emerald-400" />
            deployed 2m ago
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 px-3.5 py-1.5 text-xs font-semibold text-neutral-900 transition-shadow group-hover:shadow-[0_8px_20px_-6px_rgba(255,255,255,.4)]">
            Promote
            <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── StackDeck ─────────────────────────────────────────────── */
/* avatars: real portrait photography in a hover-fan stack.
   tickets: boarding passes with live route data. */
const SPRING = "linear(0, 0.79 14.4%, 1.026 22.4%, 1.164 31.2%, 1.207 38.2%, 1.208 46.2%, 1.033 80%, 1)";

const AVATARS = [
  { src: FACES.a, name: "Mara" },
  { src: FACES.b, name: "Theo" },
  { src: FACES.c, name: "Ines" },
  { src: FACES.d, name: "Dev" },
  { src: FACES.e, name: "Jun" },
];

const FLIGHTS = [
  { from: "ZRH", to: "NRT", no: "LX 160" },
  { from: "SFO", to: "HND", no: "UA 875" },
  { from: "CDG", to: "ICN", no: "AF 268" },
  { from: "MUC", to: "SIN", no: "LH 742" },
  { from: "AMS", to: "HKG", no: "KL 885" },
];

export function StackDeck({ variant = "avatars" }: { variant?: string }) {
  const tickets = variant === "tickets";
  const [hovered, setHovered] = useState<number | null>(null);
  const items = tickets ? FLIGHTS : AVATARS;
  const push = 16;
  return (
    <div
      className="flex w-full items-center justify-center py-10"
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((it, i) => {
        const engaged = hovered === i;
        const dx =
          hovered === null ? 0 : i === hovered ? 0 : i > hovered ? Math.min(push * (items.length - i - 1), 24) : -Math.min(push * i, 24);
        return (
          <div
            key={tickets ? it.no : it.name}
            onMouseEnter={() => setHovered(i)}
            onFocus={() => setHovered(i)}
            tabIndex={0}
            aria-label={tickets ? `${it.from} to ${it.to}` : it.name}
            className={cn(
              "relative flex items-center justify-center isolate transition-all duration-700",
              tickets
                ? "h-20 w-16 overflow-hidden rounded-lg bg-[#14141b] ring-1 ring-white/15"
                : "size-14 overflow-hidden rounded-full ring-2 ring-[#050507]",
            )}
            style={{
              marginLeft: i === 0 ? 0 : tickets ? -12 : -18,
              transform: `translateX(${dx}px) scale(${engaged ? 1.22 : 1})`,
              transitionTimingFunction: SPRING,
              zIndex: engaged ? 40 : i,
              boxShadow: engaged
                ? "0 16px 40px -16px rgba(139,92,246,.7)"
                : undefined,
              filter: engaged ? "none" : "saturate(.85) brightness(.9)",
            }}
          >
            {tickets ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-b from-[#1a1a26] to-[#14141b] px-1.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-violet-300/80">{it.no}</span>
                <span className="text-sm font-semibold tracking-tight text-neutral-100">
                  {it.from}
                  <span className="mx-1 text-[10px] text-violet-300">→</span>
                  {it.to}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500">b12 · 14:20</span>
              </div>
            ) : (
              <img
                src={it.src}
                alt=""
                width={96}
                height={96}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── VoiceCard ─────────────────────────────────────────────── */
/* metric: a live uptime figure with the team behind it.
   quote: a real review with a real face. */
export function VoiceCard({ variant = "metric" }: { variant?: string }) {
  const metric = variant === "metric";
  return (
    <div className="relative w-full max-w-80 overflow-hidden rounded-xl bg-[#0b0b10] ring-1 ring-white/10">
      <span aria-hidden className="facet-beam rounded-xl" style={{ "--beam-dur": "9s" } as React.CSSProperties} />
      <div className="relative z-10 flex h-64 flex-col justify-between p-6">
        {metric ? (
          <>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">service · uptime</span>
              <div className="flex -space-x-2.5">
                {AVATARS.slice(0, 3).map((a) => (
                  <img
                    key={a.name}
                    src={a.src}
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                    className="size-6 rounded-full object-cover ring-2 ring-[#0b0b10]"
                  />
                ))}
              </div>
            </div>
            <motion.div
              className="flex items-baseline gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="text-5xl font-semibold tracking-tighter text-neutral-50 tabular-nums">99.98</span>
              <span className="text-xl text-violet-300">%</span>
            </motion.div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.3 }}
                >
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                </motion.span>
              ))}
              <span className="ml-2 text-xs text-neutral-400">uptime, 12 months running</span>
            </div>
          </>
        ) : (
          <>
            <Quote className="size-5 text-violet-300/70" />
            <p className="text-[15px] leading-relaxed text-neutral-200">
              “{QUOTE}”
            </p>
            <div className="flex items-center gap-3">
              <img
                src={PEOPLE[0].img}
                alt=""
                width={72}
                height={72}
                loading="lazy"
                className="size-9 rounded-full object-cover ring-1 ring-white/20"
              />
              <div>
                <p className="text-sm font-medium text-neutral-100">{PEOPLE[0].name}</p>
                <p className="text-xs text-neutral-500">{PEOPLE[0].role}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
