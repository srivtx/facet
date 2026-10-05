"use client";

/* Facet / buttons — Sheen, Sweep, Halo, Notch, Pop, Candy
   Tactile controls rewritten from borrowed techniques, extended with variants. */

import React, { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Sheen ─────────────────────────────────────────────────── */
export function Sheen({
  variant = "light",
  children = "Deploy",
}: {
  variant?: string;
  children?: React.ReactNode;
}) {
  const violet = variant === "violet";
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
      className={cn(
        "group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-lg px-7",
        "text-sm font-medium tracking-tight transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        violet
          ? "bg-white text-neutral-950 [--shine:rgba(167,139,250,.9)]"
          : "bg-neutral-950 text-neutral-100 ring-1 ring-white/15 [--shine:rgba(255,255,255,.7)]",
      )}
    >
      <motion.span
        className="relative z-10 flex items-center gap-2"
        initial={{ "--mx": "120%" } as never}
        animate={{ "--mx": "-120%" } as never}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear", repeatDelay: 1.4 }}
        style={
          {
            WebkitMaskImage:
              "linear-gradient(-75deg, white calc(var(--mx) + 20%), transparent calc(var(--mx) + 30%), white calc(var(--mx) + 100%))",
            maskImage:
              "linear-gradient(-75deg, white calc(var(--mx) + 20%), transparent calc(var(--mx) + 30%), white calc(var(--mx) + 100%))",
          } as React.CSSProperties
        }
      >
        {violet && <Sparkles className="size-3.5" />}
        {children}
      </motion.span>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-lg p-px opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          "bg-[linear-gradient(-75deg,transparent_30%,var(--shine)_50%,transparent_70%)] bg-[length:200%_100%]",
        )}
        style={{
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          animation: "facet-sheen-pos 1.6s linear infinite",
        }}
      />
      <style>{`@keyframes facet-sheen-pos { 0%{background-position:200% 0} 100%{background-position:-100% 0} }`}</style>
    </motion.button>
  );
}

/* ── Sweep ─────────────────────────────────────────────────── */
export function Sweep({
  variant = "standard",
  children = "Read the docs",
}: {
  variant?: string;
  children?: React.ReactNode;
}) {
  const wide = variant === "wide";
  return (
    <button
      type="button"
      className={cn(
        "group relative cursor-pointer overflow-hidden p-2 text-center font-semibold",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        wide ? "rounded-full px-8 py-3 text-base" : "rounded-full px-6 py-2 text-sm",
        "bg-neutral-950 ring-1 ring-white/15 hover:ring-white/30",
      )}
    >
      <span className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-violet-400 transition-transform duration-300 group-hover:scale-125" />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </span>
      <span className="absolute inset-0 z-10 flex translate-x-12 items-center justify-center gap-2 text-fuchsia-200 opacity-0 transition-all duration-300 group-hover:-translate-x-4 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight className="size-4" />
      </span>
    </button>
  );
}

/* ── Halo ──────────────────────────────────────────────────── */
export function Halo({
  variant = "iris",
  children = "Get started",
}: {
  variant?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--hx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--hy", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);
  const tracking = variant === "iris";
  return (
    <button
      ref={ref}
      type="button"
      onPointerMove={tracking ? onMove : undefined}
      className={cn(
        "relative inline-flex h-11 min-w-40 cursor-pointer items-center justify-center rounded-lg text-sm font-medium",
        "text-neutral-100 transition-shadow duration-300",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      )}
      style={
        {
          "--hx": "50%",
          "--hy": "50%",
          background: tracking
            ? "radial-gradient(220px circle at var(--hx) var(--hy), rgba(139,92,246,.55), rgba(24,24,33,.9) 60%)"
            : "radial-gradient(circle at 50% 50%, rgba(139,92,246,.5), rgba(24,24,33,.92) 70%)",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,.14), inset 0 0 14px rgba(139,92,246,.25), 0 8px 24px -12px rgba(139,92,246,.5)",
        } as React.CSSProperties
      }
    >
      <span className="relative z-10 flex items-center gap-2">
        <Zap className="size-3.5 text-violet-300" />
        {children}
      </span>
    </button>
  );
}

/* ── Notch ─────────────────────────────────────────────────── */
export function Notch({
  variant = "tl",
  children = "Continue",
}: {
  variant?: string;
  children?: React.ReactNode;
}) {
  const clip =
    variant === "br"
      ? "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)"
      : "polygon(14px 0, 100% 0, 100% 100%, 0 100%, 0 14px)";
  return (
    <button
      type="button"
      className="group relative inline-flex h-11 items-center justify-center bg-neutral-950 px-7 text-sm font-medium text-neutral-100 transition-colors duration-200 hover:text-white focus-visible:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      style={{ clipPath: clip }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "linear-gradient(120deg, rgba(139,92,246,.16), transparent 60%)" }}
      />
      <span
        aria-hidden
        className="facet-beam"
        style={{ "--beam-dur": "6s" } as React.CSSProperties}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}

/* ── Pop ───────────────────────────────────────────────────── */
export function Pop({
  variant = "chip",
  children = "Run",
  label,
}: {
  variant?: string;
  children?: React.ReactNode;
  /** Accessible name for the icon-only variant. Defaults to `children`. */
  label?: string;
}) {
  const full = variant === "full";
  // The chip variant paints only a Sparkles glyph, so the button had no
  // accessible name at all. The rest of this family names its buttons with
  // `children`, so reuse that here rather than inventing a second convention;
  // `label` is there for callers passing an icon or element as children.
  const textChild = typeof children === "string" ? children.trim() : "";
  const iconLabel = label?.trim() || textChild || "Run";
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 17 }}
      aria-label={full ? undefined : iconLabel}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white text-neutral-950",
        "font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70",
        full ? "h-11 px-7 text-sm" : "size-11",
      )}
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,.4), 0 12px 28px -12px rgba(139,92,246,.45)" }}
    >
      {full ? (
        <>
          <Sparkles className="size-4" />
          {children}
        </>
      ) : (
        <Sparkles className="size-4" />
      )}
    </motion.button>
  );
}

/* ── Candy ─────────────────────────────────────────────────── */
export function Candy({
  variant = "grape",
  children = "Confirm",
}: {
  variant?: string;
  children?: React.ReactNode;
}) {
  const grape = variant === "grape";
  return (
    <button
      type="button"
      className={cn(
        "group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full px-8 text-sm font-semibold",
        "transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      )}
      style={
        grape
          ? {
              background: "linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,.45), inset 0 -2px 4px rgba(0,0,0,.35), 0 6px 20px -8px rgba(139,92,246,.7)",
              color: "#fff",
            }
          : {
              background: "linear-gradient(180deg, #fdfcfb 0%, #e7e5ee 100%)",
              boxShadow:
                "inset 0 1px 0 #ffffff, inset 0 -2px 4px rgba(0,0,0,.12), 0 6px 20px -10px rgba(0,0,0,.6)",
              color: "#1a1a24",
            }
      }
    >
      <span
        aria-hidden
        className="absolute inset-x-3 top-[3px] h-1/3 rounded-full bg-white/40 blur-[6px] transition-transform duration-300 group-hover:translate-y-[2px]"
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}

/* ── CheckoutBench — the family in context ───────────────
   Buttons do not float alone on a stage; they act inside a
   surface. A release panel: build status, changelog rows, the
   family's controls as its real actions. */
const RELEASE_ROWS = [
  { k: "motion tokens", v: "12 changed" },
  { k: "stage lighting", v: "retuned" },
  { k: "focus audit", v: "clean" },
];

export function CheckoutBench({ variant = "violet" }: { variant?: string }) {
  return (
    <div className="facet-glass relative w-80 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
          release · v3.1.0
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/25">
          <Check className="size-3" />
          checks 12/12
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-2.5">
        {RELEASE_ROWS.map((r) => (
          <div key={r.k} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-neutral-300">
              <Check className="size-3.5 text-violet-300" />
              {r.k}
            </span>
            <span className="font-mono text-[11px] text-neutral-500">{r.v}</span>
          </div>
        ))}
      </div>
      <div className="my-4 h-px bg-white/10" />
      <div className="flex items-center gap-3">
        <Sheen variant={variant}>Ship 3.1.0</Sheen>
        <Halo variant="iris">Preview</Halo>
      </div>
    </div>
  );
}
