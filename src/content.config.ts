import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { createAdminClient } from "@insforge/sdk";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/* -------------------------------------------------------------------------
   Progress Log — markdown collection (authored in /content/progress-log)
   ------------------------------------------------------------------------- */
const progress = defineCollection({
  loader: glob({ pattern: "*.md", base: "./content/progress-log" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    sprint: z.string(),
    status: z.enum(["planned", "in_progress", "completed"]).default("completed"),
    cover: z.string(),
    summary: z.string(),
    goal: z.object({
      problem: z.string(),
      context: z.string(),
      plannedSolution: z.string(),
    }),
    learn: z.object({
      learnings: z.array(z.string()).default([]),
      research: z.array(z.string()).default([]),
      strategy: z.string(),
    }),
    apply: z.object({
      text: z.string(),
      photos: z
        .array(z.object({ src: z.string(), alt: z.string(), caption: z.string() }))
        .default([]),
    }),
    leaveBetter: z.object({
      text: z.string(),
      result: z.string(),
      photos: z
        .array(z.object({ src: z.string(), alt: z.string(), caption: z.string() }))
        .default([]),
    }),
    next: z.array(z.string()).default([]),
  }),
});

/* -------------------------------------------------------------------------
   Marketing markdown pages (vision-mission, how-we-work)
   ------------------------------------------------------------------------- */
const pages = defineCollection({
  loader: glob({
    pattern: ["vision-mission.md", "how-we-work.md"],
    base: "./content",
  }),
  schema: z.object({
    section: z.string(),
    title: z.string(),
    intro: z.string().optional(),
  }),
});

/* -------------------------------------------------------------------------
   Learning library — data collection with a discriminated-union schema.
   A malformed entry fails the build loudly (brief §5).
   ------------------------------------------------------------------------- */
const i18n = z.object({ en: z.string(), es: z.string(), de: z.string() });

const sun = z.enum(["full_sun", "partial_sun", "shade"]);
const water = z.enum(["low", "medium", "high"]);
const soil = z.enum(["well_drained", "loose", "rich"]);
const difficulty = z.enum(["easy", "medium", "hard"]);
const role = z.enum(["beneficial", "pest", "neutral"]);
const ownOrRent = z.enum(["own", "rent"]);
const months = z.array(z.number().int().min(1).max(12));

const learnBase = {
  id: z.string(),
  name: i18n,
  image: z.string(),
  summary: i18n,
  tags: z.array(z.string()).default([]),
  region: z.string().default("hamburg"),
  scientificName: z.string().optional(),
  imageSource: z.string().optional(),
  imageCredit: z.string().optional(),
  imageLicense: z.string().optional(),
};

// vegetable & flower share the same plant data shape
const plantData = z.object({
  sun,
  water,
  sowMonths: months,
  harvestMonths: months,
  sowDepthCm: z.number(),
  spacingCm: z.number(),
  soil,
  difficulty,
  companions: z.array(z.string()).default([]),
  tips: i18n,
});

const learnEntry = z.discriminatedUnion("category", [
  z.object({ ...learnBase, category: z.literal("vegetable"), data: plantData }),
  z.object({ ...learnBase, category: z.literal("flower"), data: plantData }),
  z.object({
    ...learnBase,
    category: z.literal("tool"),
    data: z.object({
      use: i18n,
      whenToUse: i18n,
      care: i18n,
      ownOrRent,
      powered: z.boolean(),
    }),
  }),
  z.object({
    ...learnBase,
    category: z.literal("fauna"),
    data: z.object({
      role,
      affects: z.array(z.string()).default([]),
      season: months,
      howTo: i18n,
    }),
  }),
]);

export type LearnEntry = z.infer<typeof learnEntry>;

// Custom loader: reads Hamburg cards from Insforge when configured, otherwise
// uses /data/learn as local seed/fallback data. Every entry is validated here.
const learnFiles = ["tools", "vegetables", "flowers", "fauna"];

type RawLearnEntry = z.input<typeof learnEntry>;
type ImageCredit = Pick<
  RawLearnEntry,
  "imageSource" | "imageCredit" | "imageLicense"
>;

async function loadImageCredits(logger: { warn: (message: string) => void }) {
  const url = new URL("../data/learn/image-credits.json", import.meta.url);
  try {
    const raw = await readFile(fileURLToPath(url), "utf-8");
    return JSON.parse(raw) as Record<string, ImageCredit>;
  } catch {
    logger.warn("learn: image-credits.json not found — skipping image attribution");
    return {};
  }
}

async function loadSeedLearnEntries(logger: { warn: (message: string) => void }) {
  const all: RawLearnEntry[] = [];
  const credits = await loadImageCredits(logger);
  for (const file of learnFiles) {
    const url = new URL(`../data/learn/${file}.json`, import.meta.url);
    let raw: string;
    try {
      raw = await readFile(fileURLToPath(url), "utf-8");
    } catch {
      logger.warn(`learn: ${file}.json not found — skipping`);
      continue;
    }
    const entries = JSON.parse(raw);
    if (!Array.isArray(entries)) {
      throw new Error(`learn: ${file}.json must be a JSON array`);
    }
    all.push(
      ...entries.map((entry) => ({
        ...credits[entry.id],
        ...entry,
      })),
    );
  }
  return all;
}

async function loadInsforgeLearnEntries(logger: { warn: (message: string) => void }) {
  const baseUrl = process.env.INSFORGE_URL;
  const apiKey = process.env.INSFORGE_API_KEY;
  const region = process.env.INSFORGE_LEARN_REGION ?? "hamburg";

  if (!baseUrl || !apiKey) return null;

  const admin = createAdminClient({ baseUrl, apiKey });
  const { data, error } = await admin.database
    .from("learn_cards")
    .select(
      "id,category,name,image,summary,tags,region,scientific_name,image_source,image_credit,image_license,data",
    )
    .eq("region", region);

  if (error) {
    if (process.env.INSFORGE_STRICT === "true") {
      throw new Error(`learn: Insforge query failed: ${error.message}`);
    }
    logger.warn(`learn: Insforge query failed — using local seed (${error.message})`);
    return null;
  }

  if (!Array.isArray(data)) return [];

  return data.map((row: any) => ({
    id: row.id,
    category: row.category,
    name: row.name,
    image: row.image,
    summary: row.summary,
    tags: row.tags ?? [],
    region: row.region ?? region,
    scientificName: row.scientific_name ?? undefined,
    imageSource: row.image_source ?? undefined,
    imageCredit: row.image_credit ?? undefined,
    imageLicense: row.image_license ?? undefined,
    data: row.data,
  })) satisfies RawLearnEntry[];
}

const learn = defineCollection({
  loader: {
    name: "garden-learn-loader",
    async load({ store, parseData, logger }) {
      store.clear();
      const entries =
        (await loadInsforgeLearnEntries(logger)) ?? (await loadSeedLearnEntries(logger));

      for (const entry of entries) {
        if (!entry?.id) {
          throw new Error("learn: an entry is missing \"id\"");
        }
        const data = await parseData({ id: entry.id, data: entry });
        store.set({ id: entry.id, data });
      }
    },
  },
  schema: learnEntry,
});

export const collections = { progress, pages, learn };
