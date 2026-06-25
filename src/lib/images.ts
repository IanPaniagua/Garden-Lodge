import type { ImageMetadata } from "astro";

/*
 * Owner-supplied content images live under src/assets/{learn,progress,site}.
 * They are referenced by bare filename in the JSON/markdown (e.g.
 * "lettuce-lollo-bionda.jpg"). We glob them at build time so astro:assets can
 * optimise them (webp/avif + lazy-load). Any filename with no matching file
 * resolves to `undefined`, and the caller renders a graceful placeholder so the
 * build never breaks (brief §5).
 *
 * To add an image: drop the file into the matching folder and rebuild — no code
 * change needed.
 */

const learn = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/learn/*.{jpg,jpeg,png,webp,avif}",
  { eager: true },
);
const progress = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/progress/*.{jpg,jpeg,png,webp,avif}",
  { eager: true },
);
const site = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/site/*.{jpg,jpeg,png,webp,avif}",
  { eager: true },
);

function buildMap(
  records: Record<string, { default: ImageMetadata }>,
  dir: string,
): Map<string, ImageMetadata> {
  const map = new Map<string, ImageMetadata>();
  for (const [path, mod] of Object.entries(records)) {
    // strip any leading "progress/" etc. — match on the final filename only
    const filename = path.slice(path.lastIndexOf("/") + 1);
    map.set(filename, mod.default);
    map.set(`${dir}/${filename}`, mod.default);
  }
  return map;
}

const learnMap = buildMap(learn, "learn");
const progressMap = buildMap(progress, "progress");
const siteMap = buildMap(site, "site");

export type ImageDir = "learn" | "progress" | "site";

/** Resolve a referenced filename to optimisable image metadata, or undefined. */
export function resolveImage(
  dir: ImageDir,
  ref: string | undefined,
): ImageMetadata | undefined {
  if (!ref) return undefined;
  const name = ref.slice(ref.lastIndexOf("/") + 1);
  const map = dir === "learn" ? learnMap : dir === "progress" ? progressMap : siteMap;
  return map.get(name);
}
