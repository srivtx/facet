"use client";

/* Facet / ambience — Corona, Flux, TraceGrid, BeamLines, AuroraVeil */

import React from "react";
import { cn } from "@/lib/utils";

/* ── Corona ────────────────────────────────────────────────── */
export function Corona({
  variant = "mono",
  className,
  quiet = false,
}: {
  variant?: string;
  className?: string;
  quiet?: boolean;
}) {
  const violet = variant === "violet";
  return (
    <div className={cn("facet-noise relative overflow-hidden rounded-xl ring-1 ring-white/10", className)}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background: violet
            ? "conic-gradient(from 0deg at 50% 55%, transparent 0deg, rgba(139,92,246,.32) 14deg, transparent 28deg, transparent 90deg, rgba(232,121,249,.22) 104deg, transparent 118deg, transparent 190deg, rgba(167,139,250,.25) 205deg, transparent 219deg, transparent 300deg, rgba(139,92,246,.18) 314deg, transparent 328deg)"
            : "conic-gradient(from 0deg at 50% 55%, transparent 0deg, rgba(255,255,255,.16) 14deg, transparent 28deg, transparent 90deg, rgba(255,255,255,.1) 104deg, transparent 118deg, transparent 190deg, rgba(255,255,255,.14) 205deg, transparent 219deg, transparent 300deg, rgba(255,255,255,.1) 314deg, transparent 328deg)",
          animation: "facet-spin-slow 46s linear infinite",
          filter: "blur(2px)",
          maskImage: "radial-gradient(circle at 50% 55%, black 20%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 55%, black 20%, transparent 72%)",
        }}
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-[55%] size-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: violet
            ? "radial-gradient(circle, rgba(232,121,249,.85), rgba(139,92,246,.4) 55%, transparent 70%)"
            : "radial-gradient(circle, rgba(255,255,255,.8), rgba(255,255,255,.2) 55%, transparent 70%)",
          filter: "blur(10px)",
        }}
      />
      {!quiet && (
        <div className="relative z-10 flex h-full min-h-40 items-center justify-center">
          <span className="rounded-full bg-black/50 px-4 py-1.5 text-xs font-medium tracking-wide text-neutral-300 backdrop-blur">
            {violet ? "Facet · primary light" : "Facet · quiet light"}
          </span>
        </div>
      )}
      <style>{`@keyframes facet-spin-slow { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Flux ──────────────────────────────────────────────────── */
export function Flux({
  variant = "dusk",
  className,
  quiet = false,
}: {
  variant?: string;
  className?: string;
  quiet?: boolean;
}) {
  const ember = variant === "ember";
  return (
    <div className={cn("facet-noise relative overflow-hidden rounded-xl ring-1 ring-white/10", className)}>
      {[
        { c: ember ? "rgba(251,191,36,.5)" : "rgba(139,92,246,.5)", s: "38%", x: "18%", y: "28%", t: 30, k: "a" },
        { c: ember ? "rgba(244,63,94,.4)" : "rgba(232,121,249,.4)", s: "30%", x: "64%", y: "18%", t: 40, k: "b" },
        { c: ember ? "rgba(253,186,116,.32)" : "rgba(45,212,191,.28)", s: "26%", x: "40%", y: "66%", t: 24, k: "c" },
        { c: "rgba(255,255,255,.14)", s: "22%", x: "72%", y: "58%", t: 36, k: "d" },
      ].map((b) => (
        <div
          key={b.k}
          aria-hidden
          className="absolute rounded-full"
          style={{
            width: b.s,
            height: b.s,
            left: b.x,
            top: b.y,
            background: `radial-gradient(circle, ${b.c}, transparent 70%)`,
            filter: "blur(42px)",
            animation: `facet-drift-${b.k} ${b.t}s ease-in-out infinite alternate`,
          }}
        />
      ))}
      {!quiet && (
        <div className="relative z-10 flex h-full min-h-40 items-center justify-center">
          <span className="text-sm font-medium tracking-tight text-neutral-200">
            {ember ? "ember drift" : "dusk drift"}
          </span>
        </div>
      )}
      <style>{`
        @keyframes facet-drift-a { to { transform: translate(60px, 40px) scale(1.15); } }
        @keyframes facet-drift-b { to { transform: translate(-70px, 50px) scale(.9); } }
        @keyframes facet-drift-c { to { transform: translate(50px, -40px) scale(1.1); } }
        @keyframes facet-drift-d { to { transform: translate(-40px, -56px) scale(1.2); } }
      `}</style>
    </div>
  );
}

/* ── TraceGrid ─────────────────────────────────────────────── */
export function TraceGrid({
  variant = "wide",
  className,
  quiet = false,
}: {
  variant?: string;
  className?: string;
  quiet?: boolean;
}) {
  const macro = variant === "macro";
  return (
    <div className={cn("facet-noise relative overflow-hidden rounded-xl ring-1 ring-white/10", className)}>
      <svg
        viewBox="0 0 700 300"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <g
          transform={macro ? "scale(1.9) translate(-140,-70)" : ""}
          stroke="rgba(255,255,255,.35)"
          strokeWidth="0.6"
          fill="none"
          className="tg-path"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
            const x = 20 + i * 82;
            return (
              <g key={i}>
                <path d={`M${x} 40 L${x + 246} 182`} />
                <path d={`M${x + 246} 40 L${x} 182`} />
              </g>
            );
          })}
          <path d="M20 40 L466 40 L670 182 L224 182 Z" />
        </g>
        <style>{`
          .tg-path { stroke-dasharray: 6000; stroke-dashoffset: 6000; animation: tg-draw 2.2s ease-out .4s forwards; }
          @keyframes tg-draw { to { stroke-dashoffset: 0; } }
        `}</style>
      </svg>
      {!quiet && (
        <div className="relative z-10 flex h-full min-h-40 items-end justify-start p-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-400">
            trace · {macro ? "macro" : "wide"}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── BeamLines ─────────────────────────────────────────────── */
export function BeamLines({
  variant = "single",
  className,
  quiet = false,
}: {
  variant?: string;
  className?: string;
  quiet?: boolean;
}) {
  const duo = variant === "duo";
  return (
    <div className={cn("facet-noise relative overflow-hidden rounded-xl bg-[#07070a] ring-1 ring-white/10", className)}>
      {!quiet && (
        <div className="relative z-10 flex h-full min-h-40 flex-col items-center justify-center gap-3 text-neutral-300">
          <span className="text-sm font-medium tracking-tight">section body</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-500">
            edges carry the light
          </span>
        </div>
      )}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px overflow-visible">
        <span
          className="absolute top-0 h-px w-40"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(167,139,250,.9), transparent)",
            animation: "facet-linetravel 9s linear infinite",
          }}
        />
        {duo && (
          <span
            className="absolute top-0 h-px w-24"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(232,121,249,.7), transparent)",
              animation: "facet-linetravel 9s linear infinite",
              animationDelay: "0s",
              left: "-24%",
            }}
          />
        )}
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px overflow-visible">
        <span
          className="absolute top-0 h-px w-40"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(45,212,191,.7), transparent)",
            animation: duo ? "facet-linetravel 9s linear reverse infinite" : "facet-linetravel 11s linear infinite",
          }}
        />
      </div>
      <style>{`@keyframes facet-linetravel { 0% { left: -15%; } 100% { left: 105%; } }`}</style>
    </div>
  );
}

/* ── AuroraVeil ────────────────────────────────────────────── */
export function AuroraVeil({
  variant = "standard",
  className,
  quiet = false,
}: {
  variant?: string;
  className?: string;
  quiet?: boolean;
}) {
  const polar = variant === "polar";
  return (
    <div className={cn("facet-noise relative overflow-hidden rounded-xl ring-1 ring-white/10", className)}>
      <div
        aria-hidden
        className="absolute left-1/2 top-[-45%] size-[520px] -translate-x-1/2 rounded-full"
        style={{
          background: polar
            ? "radial-gradient(circle, rgba(45,212,191,.22), transparent 65%)"
            : "radial-gradient(circle, rgba(139,92,246,.2), transparent 65%)",
          filter: "blur(60px)",
          animation: "facet-veil-a 26s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-[-50%] left-[24%] size-[420px] rounded-full"
        style={{
          background: polar
            ? "radial-gradient(circle, rgba(139,92,246,.16), transparent 65%)"
            : "radial-gradient(circle, rgba(232,121,249,.13), transparent 65%)",
          filter: "blur(60px)",
          animation: "facet-veil-b 34s ease-in-out infinite",
        }}
      />
      {!quiet && (
        <div className="relative z-10 flex h-full min-h-40 items-center justify-center">
          <span className="text-lg font-medium tracking-tight text-neutral-100">
            {polar ? "polar wash" : "signature wash"}
          </span>
        </div>
      )}
      <style>{`
        @keyframes facet-veil-a { 0%,100%{ transform: translate(-50%,0) scale(1);} 50%{ transform: translate(-46%,-30px) scale(1.14);} }
        @keyframes facet-veil-b { 0%,100%{ transform: translate(0,0) scale(1);} 50%{ transform: translate(46px,26px) scale(1.18);} }
      `}</style>
    </div>
  );
}
