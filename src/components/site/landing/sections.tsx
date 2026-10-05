"use client";

/* Facet / landing — HowItWorks, Frameworks, Faq, CtaBand
 *
 * The middle of the canvas-ui landing: prove the claim is cheap, name what
 * runs underneath, take the questions, close. Each section earns its place —
 * no filler band, no "trusted by" logo wall nobody can click.
 */

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Minus, Plus, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── HowItWorks ────────────────────────────────────────────── */
const STEPS = [
  {
    n: "01",
    title: "Add the registry",
    body: "One entry in components.json points the shadcn CLI at the registry. No global install, no config file to hand-maintain.",
    code: `{
  "registries": {
    "@Facet": "https://Facet.dev/r/{name}.json"
  }
}`,
  },
  {
    n: "02",
    title: "Name the primitive",
    body: "Install one component, or the whole family. The CLI writes the source straight into your tree — no runtime package.",
    code: `npx shadcn@latest add @Facet/frost
npx shadcn@latest add @Facet/aurora`,
  },
  {
    n: "03",
    title: "Own the file",
    body: "It lands in components/ as plain source. Edit it, delete the credit, fork it. There is nothing behind a paywall and nothing to upgrade away from.",
    code: `components/
  frost.tsx      ← yours
  aurora.tsx     ← yours`,
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <section className="facet-band border-y">
      <div className="mx-auto w-full max-w-6xl px-6 py-24">
        <header className="max-w-2xl">
          <span className="facet-label text-muted-foreground">how it works</span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
            Three commands, then it is your code.
          </h2>
        </header>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
          <ol className="space-y-px">
            {STEPS.map((s, i) => (
              <li key={s.n}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={i === active}
                  className={cn(
                    "w-full rounded-xl px-5 py-5 text-left transition-colors",
                    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--facet-violet)]",
                    i === active
                      ? "bg-[var(--facet-panel)]"
                      : "hover:bg-foreground/[0.04]",
                  )}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {s.n}
                    </span>
                    <span className="text-[15px] font-medium text-foreground">
                      {s.title}
                    </span>
                  </span>
                  <AnimatePresence initial={false}>
                    {i === active && (
                      <motion.span
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.28, ease: EASE },
                          opacity: { duration: 0.2 },
                        }}
                        className="block overflow-hidden"
                      >
                        <span className="mt-3 block max-w-prose text-sm leading-relaxed text-muted-foreground">
                          {s.body}
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            ))}
          </ol>

          <div className="relative overflow-hidden rounded-2xl bg-[#0b0b10] p-6 ring-1 ring-white/10">
            <div className="flex items-center gap-2 pb-4">
              <Terminal aria-hidden className="size-3.5 text-neutral-400" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                {step.n}
              </span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.pre
                key={step.n}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: EASE }}
                className="overflow-x-auto font-mono text-[12.5px] leading-relaxed text-neutral-300"
              >
                {step.code}
              </motion.pre>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Frameworks ────────────────────────────────────────────── */
export function Frameworks() {
  const items = [
    { k: "React", v: "19 · App Router" },
    { k: "Next.js", v: "16" },
    { k: "Tailwind", v: "v4 · CSS-first" },
    { k: "WebGL", v: "two.js · three · ogl" },
    { k: "WebGPU", v: "vgpu" },
    { k: "Motion", v: "framer-motion · gsap" },
  ];
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24">
      <header className="max-w-2xl">
        <span className="facet-label text-muted-foreground">under the hood</span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
          Plain source, real renderers.
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          No wrapper runtime between you and the graphics API. Each primitive
          imports the library it actually needs.
        </p>
      </header>

      <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl ring-1 ring-border sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.k} className="bg-[var(--facet-panel)] p-6">
            <dt className="text-sm font-medium text-foreground">{it.k}</dt>
            <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {it.v}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── Faq ───────────────────────────────────────────────────── */
export function Faq({
  items = [
    {
      q: "Is it really free?",
      a: "Yes. MIT licensed, no account, no watermark, no upgrade path. Everything on this page is in the public library.",
    },
    {
      q: "Do the effects need WebGL?",
      a: "Most of them do, and all of them have a plain-markup fallback. If a browser cannot give the component a graphics context, it renders as static styled markup rather than an empty box.",
    },
    {
      q: "Why does the gallery cap how many effects run at once?",
      a: "Browsers allow roughly sixteen live WebGL contexts per page and kill the oldest when you exceed it. The gallery holds six at a time and queues the rest, so scrolling the wall does not make the top of it go blank.",
    },
    {
      q: "Can I use these commercially?",
      a: "Yes for embedding in your product. The vendored upstream families carry their own terms — check the attribution file shipped next to each family before you republish anything.",
    },
    {
      q: "Does it respect reduced motion?",
      a: "Every entrance animation checks prefers-reduced-motion before it starts, and continuous loops opt out entirely when the user asks them to.",
    },
  ],
}: {
  items?: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24">
      <header className="max-w-2xl">
        <span className="facet-label text-muted-foreground">questions</span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
          The short answers.
        </h2>
      </header>

      <div className="mt-12 max-w-2xl divide-y divide-border border-y border-border">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={it.q}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left text-[15px] font-medium text-foreground transition-colors hover:text-foreground/80 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--facet-violet)]"
                >
                  {it.q}
                  <span className="grid size-7 shrink-0 place-items-center rounded-full ring-1 ring-border">
                    {isOpen ? (
                      <Minus aria-hidden className="size-3.5 text-muted-foreground" />
                    ) : (
                      <Plus aria-hidden className="size-3.5 text-muted-foreground" />
                    )}
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.28, ease: EASE },
                      opacity: { duration: 0.2 },
                    }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pr-12 text-sm leading-relaxed text-muted-foreground">
                      {it.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Cta ───────────────────────────────────────────────────── */
export function LandingCta({
  title = "Take the whole library.",
  body = "Thirty-five canvas engines and two hundred and thirteen shader primitives. Paste whichever ones you need.",
  action = { label: "Browse the library", href: "/library" },
  points = ["MIT licensed", "No account", "Plain source files"],
}: {
  title?: string;
  body?: string;
  action?: { label: string; href: string };
  points?: string[];
}) {
  return (
    <section className="facet-band border-y">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-24 text-center">
        <h2 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl">
          {title}
        </h2>
        <p className="mt-5 max-w-xl text-pretty text-muted-foreground">{body}</p>
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check aria-hidden className="size-3.5 text-[var(--facet-teal)]" />
              {p}
            </li>
          ))}
        </ul>
        <a
          href={action.href}
          className={cn(
            "group relative mt-9 inline-flex items-center gap-2 overflow-hidden rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background",
            "transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.02]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--facet-violet)]",
          )}
        >
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-full motion-reduce:hidden"
          />
          <span className="relative">{action.label}</span>
        </a>
      </div>
    </section>
  );
}