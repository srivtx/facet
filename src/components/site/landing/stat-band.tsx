"use client";

/* Facet / landing — StatBand
 *
 * The count-up band under the gallery. Lifted out of the earlier blocks/
 * draft: that file also held a SignalHero, a PriceGrid, a QuoteMarquee and a
 * FaqList, all of which either had no route or duplicated what landing/ already
 * does. Six components with nothing importing them is dead weight, and dead
 * weight in a component library is worse than a missing feature.
 *
 * The count-up is real motion rather than a decorative loop — it runs once on
 * view, and resolves straight to its final value under reduced motion.
 */

import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/* ── StatBand ──────────────────────────────────────────────── */
function CountUp({
  to,
  suffix = "",
  reduce,
}: {
  to: number;
  suffix?: string;
  reduce: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  // Reduced motion resolves to the final value at init; the effect below never
  // needs to set it, which keeps it free of synchronous setState.
  const [val, setVal] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      // cubic ease-out
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  );
}

export function StatBand({
  stats = [
    { value: 38, suffix: "", label: "live primitives" },
    { value: 76, suffix: "", label: "variant forms" },
    { value: 10, suffix: "", label: "families" },
    { value: 0, suffix: "", label: "screenshots" },
  ],
}: {
  stats?: { value: number; suffix?: string; label: string }[];
}) {
  const reduce = useReducedMotion();
  return (
    <section className="facet-band border-y" aria-label="Library at a glance">
      <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px px-6 sm:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="px-2 py-8 sm:py-10">
            <dd className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
              <CountUp to={s.value} suffix={s.suffix ?? ""} reduce={!!reduce} />
            </dd>
            <dt className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {s.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}