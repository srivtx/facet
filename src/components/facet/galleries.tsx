"use client";

/* Facet / galleries — OrbitGallery, DiagonalRail, CursorTrail */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { RAIL } from "@/lib/media";

/* ── OrbitGallery ──────────────────────────────────────────── */
/* Landscape photography on an elliptical orbit — depth fog and
   scale sell the z-axis; drag to spin, auto otherwise. */
const ORBIT_ITEMS = RAIL;

export function OrbitGallery({ variant = "auto" }: { variant?: string }) {
  const auto = variant === "auto";
  const [angle, setAngle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    if (auto) {
      const t = setInterval(() => setAngle((a) => a + 0.4), 16);
      return () => clearInterval(t);
    }
  }, [auto]);

  const onDown = useCallback((e: React.PointerEvent) => {
    setDragging(true);
    last.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);
  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      setAngle((a) => a + (e.clientX - last.current) * 0.35);
      last.current = e.clientX;
    },
    [dragging],
  );
  const onUp = useCallback(() => setDragging(false), []);

  const R = 128;
  /* emit values the browser's CSSOM will serialize identically:
     calc reorders percentages first and trims to ~6 significant digits. */
  const sig = (n: number) => Number(n.toPrecision(6));
  return (
    <div
      className={cn(
        "relative flex h-72 w-full items-center justify-center touch-none select-none",
        !auto && "cursor-grab active:cursor-grabbing",
      )}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div className="absolute rounded-full ring-1 ring-white/8" style={{ width: R * 2, height: R * 2 }} />
      <div className="absolute size-2 rounded-full bg-violet-400 shadow-[0_0_16px_rgba(139,92,246,.8)]" />
      {ORBIT_ITEMS.map((src, i) => {
        const theta = angle * (Math.PI / 180) + (i / ORBIT_ITEMS.length) * Math.PI * 2;
        const x = sig(Math.cos(theta) * R);
        const y = sig(Math.sin(theta) * R * 0.32);
        const depth = (Math.sin(theta) + 1) / 2; // 0 rear, 1 front
        const scale = sig(0.8 + depth * 0.3);
        const opacity = sig(0.45 + depth * 0.55);
        const blur = sig((1 - depth) * 1.6);
        const fx = x >= 0 ? `calc(-50% + ${Math.abs(x)}px)` : `calc(-50% - ${Math.abs(x)}px)`;
        const fy = y >= 0 ? `calc(-50% + ${Math.abs(y)}px)` : `calc(-50% - ${Math.abs(y)}px)`;
        return (
          <div
            key={i}
            className="absolute"
            style={{
              transform: `translate(${fx}, ${fy}) scale(${scale})`,
              zIndex: Math.round(depth * 100),
              opacity,
              filter: `blur(${blur}px)`,
            }}
          >
            <span className="relative block h-14 w-28 overflow-hidden rounded-lg shadow-lg ring-1 ring-white/20">
              <img
                src={src}
                alt=""
                width={224}
                height={112}
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover"
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}


/* ── DiagonalRail ──────────────────────────────────────────── */
/* A skewed double rail of photography — the archive wall. */
export function DiagonalRail({ variant = "pair" }: { variant?: string }) {
  const solo = variant === "solo";
  return (
    <div className="facet-marquee-host relative w-full overflow-hidden py-10">
      <div
        style={{
          transform: solo ? "skewY(-18deg) scale(1.18)" : "skewY(-12deg)",
        }}
        className="flex flex-col gap-4"
      >
        {[false, true].slice(0, solo ? 1 : 2).map((rev, rowIdx) => (
          <div key={rowIdx} className="facet-marquee-host flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
            <div className={cn("flex w-max gap-4 pr-4", rev ? "facet-marquee-rev" : "facet-marquee")}>
              {[...RAIL, ...RAIL].map((src, i) => (
                <span
                  key={`${rowIdx}-${i}`}
                  className="relative block h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/15"
                >
                  <img
                    src={src}
                    alt=""
                    width={192}
                    height={128}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── CursorTrail ───────────────────────────────────────────── */
const GLYPHS = ["◦", "✳", "◇", "▲", "∴", "∿"];

export function CursorTrail({ variant = "glyphs" }: { variant?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [sprites, setSprites] = useState<{ id: number; x: number; y: number; g: string }[]>([]);
  const idRef = useRef(0);
  const lastPos = useRef({ x: 0, y: 0, t: 0 });

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      const host = hostRef.current;
      if (!host) return;
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const now = performance.now();
      const dt = now - lastPos.current.t;
      if (dt > 90) {
        const dx = x - lastPos.current.x;
        const dy = y - lastPos.current.y;
        const speed = Math.hypot(dx, dy) / (dt || 1);
        if (speed > 0.35) {
          const id = idRef.current++;
          const g = GLYPHS[id % GLYPHS.length];
          setSprites((s) => [...s.slice(-11), { id, x, y, g }]);
          window.setTimeout(() => {
            setSprites((s) => s.filter((sp) => sp.id !== id));
          }, 900);
        }
        lastPos.current = { x, y, t: now };
      }
    },
    [],
  );

  return (
    <div
      ref={hostRef}
      onPointerMove={onMove}
      className="facet-dots relative flex h-72 w-full cursor-crosshair touch-none items-center justify-center overflow-hidden rounded-xl bg-[#08080b] ring-1 ring-white/10"
    >
      <span className="pointer-events-none text-sm font-medium tracking-tight text-neutral-500">
        move fast across this area
      </span>
      <AnimatePresence>
        {sprites.map((sp) => (
          <motion.span
            key={sp.id}
            className="pointer-events-none absolute grid place-items-center"
            style={{ left: sp.x - 16, top: sp.y - 16 }}
            initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
            animate={{ scale: 1.15, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.6, opacity: 0, y: -24 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {variant === "covers" ? (
              <span
                className="block size-8 rounded-md"
                style={{
                  background:
                    sp.id % 2 === 0
                      ? "linear-gradient(135deg, rgba(139,92,246,.9), rgba(232,121,249,.6))"
                      : "linear-gradient(135deg, rgba(45,212,191,.8), rgba(139,92,246,.5))",
                  boxShadow: "0 8px 24px -8px rgba(139,92,246,.6)",
                }}
              />
            ) : (
              <span className="text-2xl leading-none text-violet-300/90 drop-shadow-[0_0_8px_rgba(139,92,246,.5)]">
                {sp.g}
              </span>
            )}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
