import { createAdminClient } from "@insforge/sdk";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const files = ["tools", "vegetables", "flowers", "fauna"];
const region = process.env.INSFORGE_LEARN_REGION ?? "hamburg";
const baseUrl = process.env.INSFORGE_URL;
const apiKey = process.env.INSFORGE_API_KEY;

if (!baseUrl || !apiKey) {
  console.error("Missing INSFORGE_URL or INSFORGE_API_KEY.");
  process.exit(1);
}

const entries = [];
const creditsUrl = new URL("../data/learn/image-credits.json", import.meta.url);
const credits = JSON.parse(await readFile(fileURLToPath(creditsUrl), "utf-8"));

for (const file of files) {
  const url = new URL(`../data/learn/${file}.json`, import.meta.url);
  const raw = await readFile(fileURLToPath(url), "utf-8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`data/learn/${file}.json must be a JSON array`);
  }
  entries.push(
    ...parsed.map((entry) => ({
      ...credits[entry.id],
      ...entry,
    })),
  );
}

const rows = entries.map((entry) => ({
  id: entry.id,
  region: entry.region ?? region,
  category: entry.category,
  name: entry.name,
  image: entry.image,
  summary: entry.summary,
  tags: entry.tags ?? [],
  scientific_name: entry.scientificName ?? null,
  image_source: entry.imageSource ?? null,
  image_credit: entry.imageCredit ?? null,
  image_license: entry.imageLicense ?? null,
  data: entry.data,
  updated_at: new Date().toISOString(),
}));

const admin = createAdminClient({ baseUrl, apiKey });
const { error } = await admin.database
  .from("learn_cards")
  .upsert(rows, { onConflict: "id" });

if (error) {
  console.error(error);
  process.exit(1);
}

console.log(`Seeded ${rows.length} learn cards to Insforge region "${region}".`);
