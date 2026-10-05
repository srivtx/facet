"use client";

/* Facet / inputs — GooSearch, TypeDeck */

import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── GooSearch ─────────────────────────────────────────────── */
export function GooSearch({ variant = "bar" }: { variant?: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const modal = variant === "modal";
  const inputRef = useRef<HTMLInputElement>(null);
  const body = (
    <div className="relative w-full max-w-md">
      {/* goo filter def */}
      <svg aria-hidden className="absolute h-0 w-0">
        <defs>
          <filter id="facet-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation={open ? 4 : 0} result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
          </filter>
        </defs>
      </svg>
      <div
        className={cn(
          "relative flex items-center gap-3 rounded-2xl px-4 transition-all duration-300",
          open ? "h-14" : "h-11",
        )}
        style={{
          background: "linear-gradient(135deg, rgba(139,92,246,.55), rgba(232,121,249,.4))",
          filter: "url(#facet-goo)",
          boxShadow: open
            ? "0 18px 44px -14px rgba(139,92,246,.6)"
            : "0 8px 24px -12px rgba(139,92,246,.45)",
        }}
      >
        <Search className="size-4 shrink-0 text-white" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => !q && setOpen(false)}
          placeholder="Search primitives…"
          aria-label="Search primitives"
          className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/70"
        />
        <AnimatePresence>
          {q && (
            <motion.button
              type="button"
              initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
              onClick={() => {
                setQ("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="grid size-5 shrink-0 place-items-center rounded-full bg-white/25 text-white hover:bg-white/40"
            >
              <X className="size-3" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-3 text-center text-xs text-neutral-500">
        {q ? `${34} primitives · filtering “${q}”` : "focus the field to watch it melt"}
      </p>
    </div>
  );
  return (
    <div className="flex w-full items-center justify-center py-10">
      {modal ? (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-3 rounded-lg bg-[#10101a] px-4 py-2.5 text-sm text-neutral-300 ring-1 ring-white/12 transition-colors hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"
          >
            <Search className="size-4" />
            Command…
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400">⌘K</kbd>
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 grid place-items-center bg-black/70 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 10 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="rounded-xl bg-[#0b0b10] p-4 ring-1 ring-white/12">{body}</div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        body
      )}
    </div>
  );
}

/* ── TypeDeck ──────────────────────────────────────────────── */
const ROWS: string[][] = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
];

export function TypeDeck({ variant = "live" }: { variant?: string }) {
  const [lit, setLit] = useState<string | null>(null);
  const [ghost, setGhost] = useState("");
  const ghostRef = useRef(0);
  const live = variant === "live";

  useEffect(() => {
    if (!live) {
      const phrase = "the quick brown fox";
      let i = 0;
      const t = setInterval(() => {
        i = (i + 1) % (phrase.length + 18);
        const shown = phrase.slice(Math.max(0, i - 18), i);
        setGhost(shown);
        const ch = phrase[i - 1];
        if (ch && ch !== " ") {
          setLit(ch);
          window.setTimeout(() => setLit(null), 160);
        }
        ghostRef.current = i;
      }, 150);
      return () => clearInterval(t);
    }
  }, [live]);

  useEffect(() => {
    if (!live) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        setLit(e.key.toLowerCase());
        window.setTimeout(() => setLit((cur) => (cur === e.key.toLowerCase() ? null : cur)), 160);
        setGhost((g) => (g + e.key).slice(-18));
      }
      if (e.key === "Backspace") setGhost((g) => g.slice(0, -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [live]);

  return (
    <div className="flex w-full flex-col items-center gap-4 py-8">
      <div className="flex h-8 w-full max-w-72 items-center rounded-lg bg-[#0b0b10] px-3 font-mono text-sm text-violet-300 ring-1 ring-white/10">
        <span className="truncate">{ghost || (live ? "type anywhere…" : "")}</span>
        <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-violet-300/80" />
      </div>
      <div className="flex flex-col gap-1.5">
        {ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1.5" style={{ paddingLeft: ri * 10 }}>
            {row.map((k) => {
              const engaged = lit === k;
              return (
                <span
                  key={k}
                  className={cn(
                    "grid size-8 place-items-center rounded-md bg-[#12121a] font-mono text-xs text-neutral-300 ring-1 ring-white/8 transition-all duration-100",
                    engaged && "bg-violet-500/70 text-white ring-violet-300",
                  )}
                  style={{
                    transform: engaged ? "translateY(2px)" : undefined,
                    boxShadow: engaged ? "0 0 18px rgba(139,92,246,.6)" : undefined,
                  }}
                >
                  {k}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
