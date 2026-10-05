import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailView } from "@/components/site/detail-view";
import { ENTRIES } from "@/lib/registry";

export function generateStaticParams() {
  return ENTRIES.map((e) => ({ family: e.family, id: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ family: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = ENTRIES.find((e) => e.id === id);
  if (!entry) return { title: "Library | Facet" };
  return {
    title: `${entry.name} — ${entry.tagline} | Facet`,
    description: entry.description,
    openGraph: {
      title: `${entry.name} | Facet`,
      description: entry.tagline,
    },
  };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ family: string; id: string }>;
}) {
  const { family, id } = await params;
  const entry = ENTRIES.find((e) => e.id === id && e.family === family);
  if (!entry) notFound();
  return (
    <main aria-label="Primitive detail" className="flex flex-1 flex-col pt-16">
      <DetailView entry={entry} />
    </main>
  );
}
