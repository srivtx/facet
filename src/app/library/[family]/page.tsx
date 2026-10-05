import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalogue } from "@/components/site/catalogue";
import { FAMILIES, ENTRIES } from "@/lib/registry";

export function generateStaticParams() {
  return FAMILIES.map((f) => ({ family: f.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ family: string }>;
}): Promise<Metadata> {
  const { family } = await params;
  const fam = FAMILIES.find((f) => f.id === family);
  if (!fam) return { title: "Library | Facet" };
  const count = ENTRIES.filter((e) => e.family === fam.id).length;
  return {
    title: `${fam.label} primitives — ${count} live | Facet`,
    description: fam.blurb,
  };
}

export default async function FamilyPage({
  params,
}: {
  params: Promise<{ family: string }>;
}) {
  const { family } = await params;
  if (!FAMILIES.some((f) => f.id === family)) notFound();
  return (
    <main aria-label="Library family" className="flex flex-1 flex-col pt-16">
      <Catalogue initialFamily={family as (typeof FAMILIES)[number]["id"]} />
    </main>
  );
}
