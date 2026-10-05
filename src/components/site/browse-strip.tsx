"use client";

/* Facet / browse strip — the quiet closer. One card, one link:
   the rest of the catalogue. No band, no confetti. */

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { COUNTS } from "@/lib/registry";

export function BrowseStrip() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-24 pt-2 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Link
          href="/library"
          className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-card p-6 ring-1 ring-border shadow-sm transition-all duration-200 hover:shadow-md hover:ring-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-7"
        >
          <div className="min-w-0">
            <p className="facet-label text-primary">
              the rest of the library
            </p>
            <h2 className="mt-2 text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {COUNTS.entries} primitives, {COUNTS.families} families,{" "}
              {COUNTS.variants} forms — all live.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Filter by family, search by feel, open any tile&apos;s page.
            </p>
          </div>
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-foreground ring-1 ring-border transition-all duration-200 group-hover:bg-primary/15 group-hover:text-primary group-hover:ring-ring/40">
            <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
