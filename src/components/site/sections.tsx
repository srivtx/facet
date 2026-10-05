"use client";

/* Facet / chrome — nav + footer, shared by every route.
   Nav links are real routes now: Library, Docs, Changelog. Active
   route gets the ink; mobile gets a proper sheet menu. */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTS, FAMILIES, familyLabel, familyPath } from "@/lib/registry";
import { ModeToggle } from "@/components/site/theme-toggle";
import { FacetMark } from "@/components/site/mark";

const LINKS = [
  { href: "/library", label: "Library" },
  { href: "/library/vendored", label: "Vendored" },
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
];

/* ── nav ───────────────────────────────────────────────────── */
export function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menu, setMenu] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 h-16 transition-colors duration-300",
        scrolled || menu
          ? "border-b border-border bg-background/80 backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent",
      )}
    >
      <nav
        aria-label="Site"
        className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-10"
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <FacetMark size={28} />
          <span className="text-[15px] font-semibold tracking-tight text-foreground">Facet</span>
          <span className="hidden self-center rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-primary ring-1 ring-primary/20 sm:block">
            v3
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = path === l.href || path.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
                {active && (
                  <span className="mx-auto mt-0.5 block h-0.5 w-3.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <a
            href="https://github.com/srivtx/facet"
            target="_blank"
            rel="noreferrer"
            aria-label="View Facet on GitHub"
            className="hidden size-9 place-items-center rounded-full text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground hover:ring-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid"
          >
            <Github className="size-4" />
          </a>
          <Link
            href="/library"
            className="hidden h-9 items-center gap-1.5 rounded-lg bg-foreground px-4 text-[13px] font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex"
          >
            Browse
            <ArrowRight className="size-3.5" />
          </Link>
          {/* mobile menu — 44px hit area on touch */}
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            className="grid size-10 place-items-center rounded-full text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden md:size-9"
          >
            {menu ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* mobile sheet */}
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-5 pt-2">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenu(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-foreground/90 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {l.label}
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
              <a
                href="https://github.com/srivtx/facet"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenu(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium text-foreground/90 transition-colors hover:bg-secondary"
              >
                <Github className="size-4" />
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ── footer ────────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-14 sm:px-6 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr]">
          <div className="flex flex-col gap-3.5">
            <span className="flex items-center gap-2.5">
              <FacetMark size={28} />
              <span className="text-[15px] font-semibold tracking-tight text-foreground">Facet</span>
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {COUNTS.entries} live primitives across {COUNTS.families} families,
              rendered — never screenshotted.
            </p>
          </div>
          <FooterCol
            title="Library"
            links={FAMILIES.slice(0, 5).map((f) => ({
              label: familyLabel(f.id),
              href: familyPath(f.id),
            }))}
          />
          <FooterCol
            title="Project"
            links={[
              { label: "All primitives", href: "/library" },
              { label: "Docs", href: "/docs" },
              { label: "Changelog", href: "/changelog" },
              { label: "GitHub", href: "https://github.com/srivtx/facet" },
              { label: "License · MIT", href: "https://github.com/srivtx/facet#license" },
            ]}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          <span>© 2026 Facet — MIT licensed.</span>
          <span className="facet-label text-muted-foreground">no screenshots were harmed</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="mb-2 text-sm font-semibold tracking-tight text-foreground">{title}</p>
      {links.map((l) =>
        l.href.startsWith("http") ? (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="w-fit rounded-sm py-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {l.label}
          </a>
        ) : (
          <Link
            key={l.label}
            href={l.href}
            className="w-fit rounded-sm py-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {l.label}
          </Link>
        ),
      )}
    </div>
  );
}
