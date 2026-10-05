"use client";

/* Facet / motion3d — IsoStage, TiltCard, Ribbon, OrbitCam
   OrbitCam is the hero object: content-free glass cube, one glyph at most. */

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHOTOS } from "@/lib/media";

/* ── IsoStage ──────────────────────────────────────────────── */
export function IsoStage({ variant = "slab", label = "ui" }: { variant?: string; label?: string }) {
  const cluster = variant === "cluster";
  const units = cluster
    ? [
        { x: 0, y: 0, w: 64, label: "01" },
        { x: 78, y: 18, w: 52, label: "02" },
        { x: 30, y: 64, w: 44, label: "03" },
      ]
    : [{ x: 0, y: 0, w: 84, label }];
  return (
    <div className="flex w-full items-center justify-center py-8">
      <div className="relative" style={{ width: cluster ? 160 : 110, height: cluster ? 150 : 96 }}>
        {units.map((u, i) => (
          <IsoSlab key={i} {...u} />
        ))}
      </div>
    </div>
  );
}

function IsoSlab({ x, y, w, label }: { x: number; y: number; w: number; label: string }) {
  const h = w * 0.86;
  return (
    <svg
      viewBox="0 0 40 35"
      className="iso-slab absolute"
      style={{ left: x, top: y, width: w }}
    >
      <g className="iso-back">
        <path
          d="M38.6 5.3C38.9 5.8 39 6.4 39 7v23c0 2.2-1.8 4-4 4H7c-.8 0-1.5-.2-2.1-.6C2.7 32 1.5 29 1.5 29L3 29.9V7C3 4.8 4.8 3 7 3h27.7L34.5 1.5c0 0 3.3 1.9 4.1 3.8Z"
          fill="#101016"
          stroke="rgba(255,255,255,.22)"
          strokeWidth="0.8"
        />
        <path d="M35.7 25.5L38.9 28M35.7 23.2L39 26" stroke="rgba(255,255,255,.22)" strokeWidth="0.8" />
      </g>
      <g className="iso-front">
        <rect x="0.5" y="0.5" width="35" height="30" rx="3.5" fill="#15151f" stroke="rgba(167,139,250,.5)" strokeWidth="1" />
        <foreignObject x="0.5" y="0.5" width="35" height="30">
          <div className="flex h-full w-full items-center justify-center">
            <span className="select-none text-center text-[5px] font-semibold uppercase tracking-widest text-neutral-200">
              {label}
            </span>
          </div>
        </foreignObject>
      </g>
      <style>{`
        .iso-back { transition: opacity .12s ease; }
        .iso-front { transition: transform .15s cubic-bezier(.34,1.56,.64,1); }
        .iso-slab:hover .iso-back, .iso-slab:active .iso-back { opacity: 0; }
        .iso-slab:hover .iso-front, .iso-slab:active .iso-front { transform: translate(3.5px, 3.5px); }
      `}</style>
    </svg>
  );
}

/* ── TiltCard ──────────────────────────────────────────────── */
/* A real product card, not a specimen: photography, a price,
   actions — content a user would actually see. The 3D recipe
   stacks depth on the Z axis: media floats highest (100), body
   mid (60), title (50), actions barely off the glass (20). */
export function TiltCard({ variant = "badge", title }: { variant?: string; title?: string }) {
  const layered = variant !== "flat";
  const z = (v: number): React.CSSProperties =>
    layered ? { transform: `translateZ(${v}px)`, transformStyle: "preserve-3d" } : {};
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 260, damping: 22 });
  const sry = useSpring(ry, { stiffness: 260, damping: 22 });
  const gx = useTransform(sry, [-8, 8], ["32%", "68%"]);
  const gy = useTransform(srx, [-8, 8], ["68%", "32%"]);
  const glowBg = useTransform(
    [gx, gy],
    ([x, y]) => `radial-gradient(300px circle at ${x} ${y}, rgba(139,92,246,.18), transparent 60%)`,
  );

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(Math.max(-8, Math.min(8, px * 16)));
    rx.set(Math.max(-8, Math.min(8, -py * 16)));
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="group/tilt flex w-full items-center justify-center py-8" style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        tabIndex={0}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "relative flex w-full max-w-80 flex-col rounded-xl bg-[#0b0b10] p-5",
          "ring-1 ring-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60",
        )}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl opacity-70" style={{ background: glowBg }} />
        {/* route line — the eyebrow */}
        <div className="relative z-10 flex items-center justify-between" style={z(50)}>
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
            <MapPin className="size-3 text-violet-300" />
            {title ?? "valais · swiss alps"}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-neutral-300">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            4.9
          </span>
        </div>
        {/* the media plane — highest Z, catches the most parallax */}
        <div className="relative z-10 mt-3 overflow-hidden rounded-lg" style={z(100)}>
          <img
            src={PHOTOS.ridge}
            alt="Alpine ridgeline at first light"
            width={640}
            height={360}
            loading="lazy"
            className="h-40 w-full object-cover transition-shadow duration-300 group-hover/tilt:shadow-[0_24px_48px_-16px_rgba(139,92,246,.45)]"
          />
          <span className="absolute inset-0 ring-1 ring-inset ring-white/15" />
        </div>
        {/* body copy */}
        <div className="relative z-10 mt-4" style={z(60)}>
          <p className="text-lg font-semibold leading-tight tracking-tight text-neutral-100">
            Four days above the treeline
          </p>
          <p className="mt-1 text-sm leading-relaxed text-neutral-400">
            A hut-to-hut traverse with two guides, morning starts, and no phone signal for the middle two days.
          </p>
        </div>
        {/* actions — barely off the glass */}
        <div className="relative z-10 mt-5 flex items-center justify-between" style={z(20)}>
          <span className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-semibold tracking-tight text-neutral-50">$1,240</span>
            <span className="text-xs text-neutral-500">per person</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors group-hover/tilt:text-neutral-100">
              Route
            </span>
            <span className="rounded-lg bg-neutral-100 px-3.5 py-1.5 text-xs font-semibold text-neutral-900 transition-shadow group-hover/tilt:shadow-[0_8px_20px_-6px_rgba(255,255,255,.4)]">
              Book
            </span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Ribbon ────────────────────────────────────────────────── */
export function Ribbon({ variant = "still" }: { variant?: string }) {
  const spin = variant === "spin";
  const segs = 11;
  return (
    <div className="flex w-full items-center justify-center overflow-hidden py-10" style={{ perspective: 900 }}>
      <div
        className="flex gap-1"
        style={{
          transformStyle: "preserve-3d",
          animation: spin
            ? "facet-rib-spin 24s linear infinite"
            : "facet-rib-float 7s ease-in-out infinite",
        }}
      >
        {Array.from({ length: segs }).map((_, i) => (
          <div
            key={i}
            className="h-16 w-9 rounded-[3px]"
            style={{
              background:
                i % 2 === 0
                  ? "linear-gradient(160deg, rgba(139,92,246,.85), rgba(139,92,246,.25))"
                  : "linear-gradient(160deg, rgba(232,121,249,.7), rgba(232,121,249,.18))",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,.14)",
              transform: `rotateX(${i % 2 === 0 ? 18 : -18}deg)`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes facet-rib-float { 0%,100%{ transform: translateY(-4px) rotateX(12deg);} 50%{ transform: translateY(8px) rotateX(12deg);} }
        @keyframes facet-rib-spin { from { transform: rotateY(0) rotateX(14deg);} to { transform: rotateY(-360deg) rotateX(14deg);} }
      `}</style>
    </div>
  );
}

/* ── OrbitCam — the clean hero cube ─────────────────────────── */
export function OrbitCam({
  variant = "mark",
  size = 168,
  speed = 26,
}: {
  variant?: string;
  size?: number;
  speed?: number;
}) {
  const marked = variant === "mark";
  const half = size / 2;
  const face: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: 18,
    background:
      "linear-gradient(135deg, rgba(24,24,34,.92), rgba(12,12,18,.88))",
    boxShadow:
      "inset 0 0 0 1px rgba(255,255,255,.16), inset 0 0 26px rgba(139,92,246,.14)",
    backfaceVisibility: "hidden",
  };
  const markStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
  };
  return (
    <div
      className="relative select-none"
      style={{ width: size, height: size, perspective: 1100 }}
      aria-label="Rotating cube — the Facet mark"
      role="img"
    >
      {/* outer float wrapper (keeps float off the rotation transform) */}
      <div style={{ animation: `facet-float 6s ease-in-out infinite`, width: size, height: size }}>
        {/* fixed viewing tilt — then a single-axis spin for maximum smoothness */}
        <div style={{ width: size, height: size, transform: "rotateX(-24deg)", transformStyle: "preserve-3d" }}>
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        >
          {/* front — carries the single glyph */}
          <div style={{ ...face, transform: `translateZ(${half}px)` }}>
            {marked && (
              <span style={markStyle}>
                <span
                  className="facet-grad font-semibold"
                  style={{ fontSize: size * 0.34, lineHeight: 1, letterSpacing: "-0.04em" }}
                >
                  a
                </span>
              </span>
            )}
          </div>
          {/* back — a single dot */}
          <div style={{ ...face, transform: `rotateY(180deg) translateZ(${half}px)` }}>
            <span style={markStyle}>
              <span
                style={{
                  width: size * 0.09,
                  height: size * 0.09,
                  borderRadius: 999,
                  background: "rgba(232,121,249,.9)",
                  boxShadow: "0 0 18px rgba(232,121,249,.8)",
                }}
              />
            </span>
          </div>
          {/* right — single tick */}
          <div style={{ ...face, transform: `rotateY(90deg) translateZ(${half}px)` }}>
            <span style={markStyle}>
              <span
                style={{
                  width: size * 0.28,
                  height: 2,
                  background: "linear-gradient(90deg, transparent, rgba(167,139,250,.9), transparent)",
                }}
              />
            </span>
          </div>
          {/* left — single tick */}
          <div style={{ ...face, transform: `rotateY(-90deg) translateZ(${half}px)` }}>
            <span style={markStyle}>
              <span
                style={{
                  width: 2,
                  height: size * 0.28,
                  background: "linear-gradient(180deg, transparent, rgba(45,212,191,.8), transparent)",
                }}
              />
            </span>
          </div>
          {/* top — hairline grid */}
          <div style={{ ...face, transform: `rotateX(90deg) translateZ(${half}px)`, borderRadius: 18 }}>
            <span style={markStyle}>
              <span
                style={{
                  width: size * 0.4,
                  height: size * 0.4,
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
                  backgroundSize: `${size * 0.133}px ${size * 0.133}px`,
                  borderRadius: 4,
                  opacity: 0.5,
                }}
              />
            </span>
          </div>
          {/* bottom — plain glass */}
          <div style={{ ...face, transform: `rotateX(-90deg) translateZ(${half}px)` }} />
        </motion.div>
        </div>
      </div>
    </div>
  );
}
