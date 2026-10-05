import type { Metadata } from "next";

import VendoredIndex from "@/components/site/vendored/index-grid";

export const metadata: Metadata = {
  title: "Vendored — Facet",
  description:
    "Every component pulled in from canvas-ui and react-bits, swept in a real browser before listing.",
  alternates: { canonical: "/library/vendored" },
};

export default function VendoredPage() {
  return (
    <main id="top" aria-label="Vendored components" className="flex flex-1 flex-col">
      <VendoredIndex />
    </main>
  );
}