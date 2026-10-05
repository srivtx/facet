"use client";

/* Facet / textfx — FlipCycle, MorphStream, Cascade, Glitch, RollDigits */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── FlipCycle ─────────────────────────────────────────────── */
export function FlipCycle({
  variant = "fast",
  text = "precision in motion",
}: {
  variant?: string;
  text?: string;
}) {
  const fast = variant === "fast";
  const words = useMemo(() => text.split(" "), [text]);
  const total = text.length;
  const dur = fast ? 1.2 : 2.4;
  const starts = words.map((_, i) => words.slice(0, i).reduce((s, w) => s + w.length + 1, 0));
  return (
    <div
      className="inline-block text-3xl font-semibold tracking-tight text-neutral-100"
      style={{ perspective: "1000px" }}
      aria-label={text}
    >
      {words.map((word, wi) => {
        const wordStart = starts[wi];
        return (
          <span key={wi} className="mr-[0.3em] inline-block whitespace-nowrap" style={{ transformStyle: "preserve-3d" }}>
            {word.split("").map((char, ci) => {
              const gi = wordStart + ci;
              // Quantised to 1ms: Math.sin is not bit-identical across JS engines, so the
              // raw float serialises differently on the server and in the browser
              // and React reports a hydration mismatch.
              const delay = Math.round(((Math.sin((gi / total) * (Math.PI / 2)) * dur) / 4) * 1000) / 1000;
              return (
                <span
                  key={ci}
                  className="inline-block"
                  style={{
                    animation: `facet-flip ${dur}s cubic-bezier(.6,.05,.3,1) ${delay}s infinite`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
      <style>{`
        @keyframes facet-flip {
          0%   { transform: rotateX(0deg); }
          40%  { transform: rotateX(90deg); opacity: .25; }
          50%  { transform: rotateX(-90deg); opacity: .25; }
          90%  { transform: rotateX(0deg); }
          100% { transform: rotateX(0deg); }
        }
      `}</style>
    </div>
  );
}

/* ── MorphStream ───────────────────────────────────────────── */
export function MorphStream({
  variant = "verbs",
  words,
}: {
  variant?: string;
  words?: string[];
}) {
  const list =
    words ??
    (variant === "nouns" ? ["primitives", "habitats", "stages", "systems"] : ["ship", "craft", "polish", "repeat"]);
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % list.length), 2600);
    return () => clearInterval(t);
  }, [list.length]);
  return (
    <span className="inline-flex h-[1.2em] items-center text-3xl font-semibold tracking-tight">
      <AnimatePresence mode="wait">
        <motion.span
          key={list[i]}
          className="facet-grad"
          initial={{ filter: "blur(10px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          exit={{ filter: "blur(10px)", opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {list[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ── Cascade ───────────────────────────────────────────────── */
export function Cascade({
  variant = "load",
  text = "Interfaces that feel machined, not assembled.",
}: {
  variant?: string;
  text?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: variant === "load" });
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (variant === "loop") {
      const t = setInterval(() => setCycle((c) => c + 1), 6200);
      return () => clearInterval(t);
    }
  }, [variant]);
  const words = text.split(" ");
  return (
    <span ref={ref} className="text-2xl font-medium leading-snug tracking-tight text-neutral-200">
      {words.map((w, i) => (
        <motion.span
          key={`${cycle}-${i}`}
          className="inline-block will-change-transform"
          initial={{ opacity: 0, y: 8, filter: "blur(10px)" }}
          animate={inView || variant === "loop" ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Glitch ────────────────────────────────────────────────── */
export function Glitch({
  variant = "pulse",
  text = "SYSTEM ONLINE",
}: {
  variant?: string;
  text?: string;
}) {
  const hover = variant === "hover";
  return (
    <span className="relative inline-block font-mono text-2xl font-semibold tracking-widest text-neutral-100">
      <span aria-hidden className="gl-layer gl-red" data-text={text} />
      <span aria-hidden className="gl-layer gl-cyan" data-text={text} />
      <span className="relative">{text}</span>
      <style>{`
        .gl-layer { position:absolute; inset:0; opacity:0; pointer-events:none; }
        .gl-red { color:#f87171; }
        .gl-cyan { color:#22d3ee; }
        .gl-red::before, .gl-cyan::before { content:attr(data-text); }
        .gl-red::before { transform:translate(-2px,0); }
        .gl-cyan::before { transform:translate(2px,1px); }
        ${hover ? "" : "@media (prefers-reduced-motion: no-preference) {"}
        ${hover ? "" : `  .gl-red, .gl-cyan { animation: gl-pulse 5s steps(1) infinite; }`}
        ${hover ? "" : "}"}
        .gl-host:hover .gl-red, .gl-host:hover .gl-cyan,
        .gl-host:focus-visible .gl-red, .gl-host:focus-visible .gl-cyan { opacity:1; animation: gl-shudder .3s steps(2) infinite; }
        @keyframes gl-pulse { 0%,88%,100%{opacity:0} 90%,94%{opacity:.85} 92%{opacity:0} }
        @keyframes gl-shudder { 0%{transform:translate(0)} 50%{transform:translate(-2px,1px)} 100%{transform:translate(2px,-1px)} }
      `}</style>
      {/* Decorative only: no handlers, no content, no role — just a positioning
         hook that lets the CSS above drive the RGB-split layers off :hover and
         :focus-visible. So aria-hidden is right, but tabIndex={0} put a stop in
         the tab order for something a screen reader will never announce.
         tabIndex={-1} keeps it out of the tab order while leaving the
         :focus-visible rule reachable for programmatic focus. */}
      <span className="gl-host absolute inset-0" tabIndex={-1} aria-hidden />
    </span>
  );
}

/* ── RollDigits ────────────────────────────────────────────── */
export function RollDigits({
  variant = "stat",
  value,
  suffix,
  label,
}: {
  variant?: string;
  value?: number;
  suffix?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const target = value ?? (variant === "metric" ? 12480 : 68);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const run = (t: number) => {
      const p = Math.min((t - t0) / 900, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);
  const digits = n.toLocaleString("en-US").split("");
  return (
    <div ref={ref} className="flex flex-col items-start gap-1">
      <div className="flex items-baseline text-4xl font-semibold tracking-tight text-neutral-50 tabular-nums">
        <span className="flex overflow-hidden">
          {digits.map((d, i) => (
            <motion.span
              key={`${i}-${d}`}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.03 }}
              className="inline-block"
            >
              {d}
            </motion.span>
          ))}
        </span>
        {suffix && <span className="ml-1 text-2xl text-violet-300">{suffix}</span>}
      </div>
      {label && (
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
          {label}
        </span>
      )}
    </div>
  );
}
