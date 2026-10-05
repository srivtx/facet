#!/usr/bin/env node
/**
 * Syncs every `registry:ui` primitive from the Aceternity UI public registry
 * into src/components/facet/aceternity/ (namespaced, so it never clobbers the
 * hand-maintained shadcn primitives in src/components/ui/).
 *
 *   node scripts/sync-aceternity.mjs           # add/update missing components
 *   node scripts/sync-aceternity.mjs --force   # re-fetch, overwrite local edits
 *
 * Idempotent: existing files with identical content are left untouched.
 */

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const REGISTRY = "https://ui.aceternity.com/registry";
const OUT_DIR = "src/components/facet/aceternity";
const FORCE = process.argv.includes("--force");
const CONCURRENCY = 12;

/** Names that already exist as shadcn primitives in src/components/ui. */
const RESERVED = new Set(
  (await readdir("src/components/ui").catch(() => [])).map((f) =>
    f.replace(/\.tsx$/, ""),
  ),
);

async function getJSON(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return await res.json();
    } catch (err) {
      if (i === tries - 1) throw err;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
}

async function pool(items, worker) {
  const results = [];
  let cursor = 0;
  const runners = Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      try {
        results[index] = await worker(items[index]);
      } catch (err) {
        results[index] = { error: err };
      }
    }
  });
  await Promise.all(runners);
  return results;
}

const index = await getJSON(`${REGISTRY}/index.json`);
const targets = index.items.filter((i) => i.type === "registry:ui");
console.log(`registry: ${index.items.length} items -> ${targets.length} ui primitives`);

const fetched = await pool(targets, async (item) => {
  const data = await getJSON(`${REGISTRY}/${item.name}.json`);
  return { item, data };
});

await mkdir(OUT_DIR, { recursive: true });

const written = [];
const skipped = [];
const failed = [];
const deps = new Set();

for (const result of fetched) {
  if (result?.error) {
    failed.push(result.error.message);
    continue;
  }
  const { item, data } = result;
  for (const dep of data.dependencies ?? []) deps.add(dep);
  for (const dep of item.dependencies ?? []) deps.add(dep);

  for (const file of data.files ?? []) {
    const base = path.basename(file.path);
    const dest = path.join(OUT_DIR, base);
    if (!file.content) continue;

    const exists = existsSync(dest);
    if (exists && !FORCE) {
      const current = await readFile(dest, "utf8");
      if (current === file.content) {
        skipped.push(base);
        continue;
      }
      // Keep local edits unless --force.
      skipped.push(`${base} (local edit kept)`);
      continue;
    }
    await writeFile(dest, file.content, "utf8");
    written.push(base);
  }
}

console.log(`\nwritten: ${written.length}`);
console.log(`skipped: ${skipped.length}`);
if (failed.length) {
  console.log(`\nfailed: ${failed.length}`);
  for (const f of failed.slice(0, 10)) console.log(`  - ${f}`);
}

const depList = [...deps].sort();
console.log(`\ndependencies (${depList.length}):`);
console.log(depList.join(" "));

await writeFile(
  "scripts/.aceternity-deps.txt",
  depList.join("\n") + "\n",
  "utf8",
);
console.log(`\nreserved shadcn names (not overwritten): ${[...RESERVED].length}`);