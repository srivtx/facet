import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COUNTS, FAMILIES, familyPath } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Docs — getting started with Facet | Facet",
  description:
    "Setup, the three laws of the library, and how the primitives are organised. Copy a component into your project and ship.",
};

const STEPS: { n: string; title: string; body: React.ReactNode }[] = [
  {
    n: "01",
    title: "Clone the repo",
    body: (
      <>
        The library ships as source, not as a package — every primitive is
        plain TSX you can read in one sitting.{" "}
        <code className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[12px] font-medium text-foreground ring-1 ring-border">
          git clone github.com/srivtx/facet
        </code>{" "}
        then copy what you need. Nothing installs, nothing updates under you.
      </>
    ),
  },
  {
    n: "02",
    title: "Bring the tokens",
    body: (
      <>
        Primitives read from a small set of custom properties defined in{" "}
        <code className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[12px] font-medium text-foreground ring-1 ring-border">
          globals.css
        </code>{" "}
        — surfaces, ink, the violet-to-fuchsia accent band, durations and
        easings. Copy the token block once and every component lands in your
        theme, light or dark, no per-component tuning.
      </>
    ),
  },
  {
    n: "03",
    title: "Copy the primitive",
    body: (
      <>
        Each entry page shows the exact import line for its file. The
        primitives are self-contained: Tailwind classes, a little CSS, and
        framer-motion where physics earns it. Dependencies you already run:
        Tailwind v4, React 19, framer-motion 12.
      </>
    ),
  },
  {
    n: "04",
    title: "Respect the motion budget",
    body: (
      <>
        One ambient loop and one 200ms affordance per surface — that is the
        whole budget. If a page feels noisy, it is spending over the limit
        somewhere. The fix is always deletion, never another layer.
      </>
    ),
  },
];

const LAWS = [
  {
    title: "Motion budget",
    body: "Each surface may spend one ambient loop and one 200ms affordance. When a demo feels cheap, it is almost always overspending this budget — the fix is deletion, not addition.",
  },
  {
    title: "Contrast floor",
    body: "Text over any animated background holds 4.5:1 against the worst-case frame, not the pretty one. Glows are capped at 16% opacity so the aurora can never eat a headline.",
  },
  {
    title: "Borrow the physics",
    body: "Every effect decomposes into primitives you already own: custom properties, offset-path, preserve-3d, conic gradients. Take the technique — it composes with your system.",
  },
];

const TOKENS = [
  { name: "--background", light: "#fafafa", dark: "#050507", note: "page paper" },
  { name: "--foreground", light: "#17171c", dark: "#f5f5f7", note: "ink" },
  { name: "--primary", light: "#7c3aed", dark: "#a78bfa", note: "accent, 600-band" },
  { name: "--card", light: "#ffffff", dark: "#0a0a0e", note: "surfaces" },
  { name: "--border", light: "#e4e4e9", dark: "#1c1c22", note: "hairlines" },
  { name: "--ring", light: "#8b5cf6", dark: "#8b5cf6", note: "focus" },
];

export default function DocsPage() {
  return (
    <main aria-label="Documentation" className="flex flex-1 flex-col pt-16">
      <div className="mx-auto w-full max-w-3xl px-5 pb-24 pt-14 sm:px-6 sm:pt-20">
        {/* head */}
        <header className="flex flex-col gap-4">
          <p className="facet-eyebrow text-primary">
            documentation
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
            Four steps, three laws, <span className="facet-grad">zero packages</span>.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Facet is a source library. You read it, you take from it, it never
            takes from you. {COUNTS.entries} primitives across {COUNTS.families}{" "}
            families, all rendered live on this site — the docs are the product.
          </p>
        </header>

        {/* steps */}
        <section className="mt-14 flex flex-col gap-2">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex gap-5 rounded-2xl bg-card p-6 ring-1 ring-border transition-colors hover:ring-ring/40 sm:p-7"
            >
              <span className="flex h-6 shrink-0 items-center rounded-md bg-primary/10 px-2 facet-label tabular-nums text-primary ring-1 ring-primary/20">
                {s.n}
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* laws */}
        <section id="laws" className="mt-16 scroll-mt-24">
          <p className="facet-eyebrow text-primary">
            the three laws
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            What keeps it <span className="facet-grad">from becoming slop</span>.
          </h2>
          <div className="mt-8 flex flex-col divide-y divide-border rounded-2xl bg-card ring-1 ring-border">
            {LAWS.map((l, i) => (
              <div key={l.title} className="flex flex-col gap-2 p-6 sm:flex-row sm:gap-6">
                <span className="facet-label text-muted-foreground sm:w-24 sm:shrink-0">
                  law {i + 1}
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                    {l.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {l.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* tokens */}
        <section id="stack" className="mt-16 scroll-mt-24">
          <p className="facet-eyebrow text-primary">
            tokens
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            One token block, <span className="facet-grad">both themes</span>.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Copy these custom properties and every primitive lands in your
            theme. The site you are reading runs exactly this table — flip the
            toggle in the nav to audit both sides.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-border">
            <table className="w-full border-collapse bg-card text-left text-sm">
              <thead>
                <tr className="border-b border-border facet-label text-muted-foreground">
                  <th className="px-4 py-3 font-medium">token</th>
                  <th className="px-4 py-3 font-medium">light</th>
                  <th className="px-4 py-3 font-medium">dark</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">role</th>
                </tr>
              </thead>
              <tbody>
                {TOKENS.map((t) => (
                  <tr key={t.name} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-[12px] text-foreground">
                      {t.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <span
                          className="size-3.5 rounded ring-1 ring-border"
                          style={{ background: t.light }}
                          aria-hidden
                        />
                        <span className="font-mono text-[12px] text-muted-foreground">
                          {t.light}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <span
                          className="size-3.5 rounded ring-1 ring-border"
                          style={{ background: t.dark }}
                          aria-hidden
                        />
                        <span className="font-mono text-[12px] text-muted-foreground">
                          {t.dark}
                        </span>
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {t.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* families index */}
        <section className="mt-16">
          <p className="facet-eyebrow text-primary">
            the families
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {FAMILIES.map((f) => (
              <Link
                key={f.id}
                href={familyPath(f.id)}
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-medium tracking-tight text-foreground/75 ring-1 ring-border transition-all duration-200 hover:bg-accent hover:text-foreground hover:ring-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {f.label}
                <ArrowRight className="size-3 text-muted-foreground/60" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
