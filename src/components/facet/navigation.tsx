"use client";

/* Facet / navigation — NotchBar, SpotBar, GlassDock */

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Home, Compass, Layers, Sparkles, Search, Bell, Star, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── NotchBar ──────────────────────────────────────────────── */
export function NotchBar({ variant = "labels" }: { variant?: string }) {
  const icons = variant === "icons";
  const items = icons
    ? [
        { id: "h", label: "Home", icon: Home },
        { id: "c", label: "Explore", icon: Compass },
        { id: "l", label: "Library", icon: Layers },
        { id: "s", label: "Spark", icon: Sparkles },
      ]
    : [
        { id: "h", label: "Overview" },
        { id: "c", label: "Components" },
        { id: "l", label: "Sections" },
        { id: "s", label: "Pricing" },
      ];
  const [active, setActive] = useState("c");
  return (
    <div className="flex w-full items-center justify-center py-10">
      <nav
        aria-label="Notch navigation"
        className="flex items-center gap-1 rounded-2xl bg-[#0b0b10]/90 p-1.5 ring-1 ring-white/12 backdrop-blur"
      >
        {items.map((it) => {
          const engaged = active === it.id;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => setActive(it.id)}
              className={cn(
                "relative rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400/70",
                engaged ? "text-white" : "text-neutral-400 hover:text-neutral-200",
              )}
            >
              {engaged && (
                <motion.span
                  layoutId={icons ? "notch-pill-icons" : "notch-pill-labels"}
                  className="absolute inset-0 rounded-xl"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  style={{
                    background: "linear-gradient(135deg, rgba(139,92,246,.34), rgba(232,121,249,.22))",
                    boxShadow: "inset 0 0 0 1px rgba(167,139,250,.4)",
                  }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {"icon" in it && it.icon ? <it.icon className="size-4" /> : null}
                {icons ? null : it.label}
              </span>
              <span className="sr-only">{it.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* ── SpotBar ───────────────────────────────────────────────── */
export function SpotBar({ variant = "line" }: { variant?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
  }, []);
  const glow = variant === "glow";
  const links = ["Product", "Docs", "Changelog", "Company"];
  return (
    <div className="flex w-full justify-center py-10">
      <div
        ref={ref}
        onPointerMove={onMove}
        className="relative flex items-center gap-1 rounded-full px-2 py-1.5 ring-1 ring-white/10"
        style={{ "--sx": "50%" } as React.CSSProperties}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(140px circle at var(--sx) 50%, rgba(139,92,246,.22), transparent 70%)",
          }}
        />
        {links.map((l) => (
          <button
            key={l}
            type="button"
            className={cn(
              "group relative cursor-pointer px-4 py-1.5 text-sm font-medium text-neutral-400 transition-colors duration-200 hover:text-neutral-100",
              "rounded-full focus-visible:outline-none focus-visible:text-neutral-100 focus-visible:ring-1 focus-visible:ring-violet-400/70",
            )}
          >
            {l}
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-4 -bottom-px h-px origin-center scale-x-0 transition-transform duration-200",
                "group-hover:scale-x-100 group-focus-visible:scale-x-100",
                glow ? "invisible" : "bg-gradient-to-r from-transparent via-violet-300 to-transparent",
              )}
            />
            {glow && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{ background: "radial-gradient(70px circle at 50% 50%, rgba(139,92,246,.28), transparent 75%)" }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── GlassDock ─────────────────────────────────────────────── */
const DOCK_ICONS = [Home, Search, Layers, Star, Bell, User, Settings, Compass];

export function GlassDock({ variant = "std" }: { variant?: string }) {
  const icons = variant === "std" ? DOCK_ICONS : DOCK_ICONS.slice(0, 5);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="flex w-full items-center justify-center py-12">
      <div
        className="relative flex items-end gap-2 rounded-2xl px-3 pb-2.5 pt-2"
        onMouseLeave={() => setHover(null)}
        style={{
          background: "rgba(255,255,255,.06)",
          backdropFilter: "blur(18px)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,.14), inset 0 0 0 1px rgba(255,255,255,.08), 0 24px 48px -20px rgba(0,0,0,.8)",
        }}
      >
        {icons.map((Icon, i) => {
          const dist = hover === null ? 9 : Math.abs(i - hover);
          const scale = hover === i ? 1.5 : dist === 1 ? 1.18 : 1;
          return (
            <div key={i} className="relative flex flex-col items-center">
              {hover === i && (
                <motion.span
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute -top-9 whitespace-nowrap rounded-md bg-[#171721] px-2.5 py-1 text-[11px] font-medium text-neutral-100 ring-1 ring-white/15"
                >
                  {DOCK_LABELS[i]}
                </motion.span>
              )}
              <button
                type="button"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                aria-label={DOCK_LABELS[i]}
                className="grid size-11 place-items-center rounded-xl bg-[#10101a] text-neutral-300 ring-1 ring-white/10 transition-colors duration-150 hover:bg-[#15151f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"
                style={{
                  transform: `scale(${scale}) translateY(${hover === i ? -6 : 0}px)`,
                  transition: "transform .18s cubic-bezier(.34,1.56,.64,1), background-color .15s",
                }}
              >
                <Icon className="size-5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const DOCK_LABELS = ["Home", "Search", "Library", "Starred", "Alerts", "Account", "Settings", "Explore"];
