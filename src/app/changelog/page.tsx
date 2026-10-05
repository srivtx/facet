import type { Metadata } from "next";
import Link from "next/link";
import { COUNTS } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Changelog | Facet",
  description:
    "Release notes for the Facet primitive library — engineering log, one entry per release.",
};

const RELEASES = [
  {
    version: "0.4.0",
    date: "2026-10-02",
    title: "Surface pass — one label language, real elevation",
    items: [
      "Micro-typography unified behind two classes (.facet-label / .facet-eyebrow): every mono eyebrow, corner tag and metadata badge now shares one size, weight and tracking. Seven ad-hoc tracking values retired.",
      "Fixed a cascade bug where the stage seat rule suppressed the tailwind ring chain — dark islands lost their rim and elevation in dark mode. The ring now lives inside the seat token for both themes.",
      "Layered elevation everywhere: seat shadows are three-deep (contact, mid, ambient), library tiles lift on hover with matching dark-mode depth, and stages gained an inset top light plus a violet ceiling bloom.",
      "Hero satellite swapped: the decorative orbit orb became a live FIELD tile that reads the actual spring inputs driving the pointer parallax. Satellites share one chrome recipe and a contact shadow.",
      "Density diet: gradient display text now appears once per page (hero/section headline only); family row headlines render solid. Tagline clamps, hash symbols and the emerald NEW badge were reworked into the brand violet.",
      "Mobile: CTAs go full-width at 15px, menu hits 44px, quiet labels gained a contrast step, and the family pill scroller got a scroll-edge fade.",
      "Production chrome: SVG favicon (identity tile) and a generated 1200×630 OG card; esc kbd hint and arrow-key hints on entry pages; prev/next resteps as two-line cards.",
    ],
  },
  {
    version: "0.3.0",
    date: "2026-10-02",
    title: "The library becomes a site",
    items: [
      "Dedicated routes for everything: /library catalogue with family sidebar and search, /library/[family] passes, and a page per primitive at /library/[family]/[id] with shareable variant URLs (?v=).",
      "Hero rebuilt as a living collage — the tilt specimen at center with satellites on independent float clocks, the whole field answering the pointer with depth parallax. Reduced-motion honoured.",
      "Home page tightened to one job: hero, stack marquee, four curated family passes, a single browse strip. The full index moved to its own page.",
      "Docs page: the four setup steps, the three laws, and the token table for both themes. Changelog page (this one).",
      "Nav is route-aware across pages with a proper mobile sheet menu; footer links now resolve to real routes.",
      `Six primitives flagged as fresh in the catalogue: Corona, Sheen, Pointer Card, FlipCycle, Tilt Card, Orbit Gallery.`,
    ],
  },
  {
    version: "0.2.0",
    date: "2026-09-27",
    title: "Alternating catalogue, dual theme, mobile hardening",
    items: [
      "Family showcase rebuilt as alternating left/right passes — text leads the DOM, the demo column flips sides each row.",
      "Full light theme on token level: every effect channel (grid, dots, rules, aurora, noise, scrollbar) re-tuned for paper; demo stages stay dark islands in both themes.",
      "Theme toggle with no-flash boot script; preference persists across reloads.",
      "360px viewport audited: implicit-grid overflow and shrink-to-fit sections fixed; stage heights re-cut for small screens.",
      "Detail overlay shipped with variant tabs, keyboard navigation and scroll lock.",
      "README rewritten with shields; MIT license added.",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-09-21",
    title: "First cut of the library",
    items: [
      `${COUNTS.entries} live primitives across ${COUNTS.families} families — buttons, kinetic type, ambience, dimension, galleries, navigation, loaders, inputs, cards, showcase.`,
      "Every demo is the real component rendered live; zero raster images ship with the site.",
      "Registry-driven architecture: one file describes every entry, variant and family; stages render from it.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main aria-label="Changelog" className="flex flex-1 flex-col pt-16">
      <div className="mx-auto w-full max-w-3xl px-5 pb-24 pt-14 sm:px-6 sm:pt-20">
        <header className="flex flex-col gap-4">
          <p className="facet-eyebrow text-primary">
            changelog
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
            Engineering log, <span className="facet-grad">one entry per release</span>.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            What shipped, why, and what it replaced — written the way we work.
          </p>
        </header>

        <ol className="mt-14 flex flex-col gap-10">
          {RELEASES.map((r) => (
            <li
              key={r.version}
              className="relative border-l border-border pl-6 sm:pl-8"
            >
              <span
                aria-hidden
                className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-background"
              />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-sm font-medium text-primary">
                  v{r.version}
                </span>
                <time className="font-mono text-[11px] text-muted-foreground">
                  {r.date}
                </time>
              </div>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                {r.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {r.items.map((it, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    {it}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="mt-16 rounded-2xl bg-card p-6 ring-1 ring-border sm:p-7">
          <p className="text-sm font-medium text-foreground">Next on the bench</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Per-family deep passes, more variant forms per primitive, and a
            copy-source view on every entry page. Track it in{" "}
            <Link
              href="https://github.com/srivtx/facet"
              target="_blank"
              rel="noreferrer"
              className="rounded-sm text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:text-foreground hover:decoration-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              the repo
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
