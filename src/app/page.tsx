/* Facet — home.
   Canvas-ui's landing is a funnel: hero with a live effect, the wall of
   components, how it installs, what it runs on, questions, close. The full
   catalogue lives at /library; this page only has to make someone want it. */

import type { Metadata } from "next";

import { GalleryHero } from "@/components/site/landing/hero";
import { ComponentGallery } from "@/components/site/landing/gallery";
import {
  Faq,
  Frameworks,
  HowItWorks,
  LandingCta,
} from "@/components/site/landing/sections";
import { StatBand } from "@/components/site/landing/stat-band";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "Facet",
  description:
    "An open source library of canvas and shader primitives for React. Every effect is a plain source file you can read, copy and own.",
  programmingLanguage: "TypeScript",
  license: "https://opensource.org/licenses/MIT",
};

const htmlSafeJsonStringify = (obj: unknown): string =>
  JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: htmlSafeJsonStringify(JSON_LD) }}
      />
      <main id="top" className="flex flex-1 flex-col">
        <GalleryHero />
        <ComponentGallery />
        <StatBand
          stats={[
            { value: 35, label: "canvas engines" },
            { value: 213, label: "shader primitives" },
            { value: 38, label: "own primitives" },
            { value: 286, label: "total" },
          ]}
        />
        <HowItWorks />
        <Frameworks />
        <Faq />
        <LandingCta />
      </main>
    </>
  );
}