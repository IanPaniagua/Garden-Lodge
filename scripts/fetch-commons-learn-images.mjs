import { access, mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

const targetDir = new URL("../src/assets/learn/", import.meta.url);
const creditsFile = new URL("../data/learn/image-credits.json", import.meta.url);

const cards = [
  { id: "hand-trowel", filename: "hand-trowel.jpg", query: 'garden hand trowel filetype:bitmap', required: ["trowel"] },
  { id: "garden-rake", filename: "garden-rake.jpg", query: 'garden rake tool filetype:bitmap', required: ["rake"] },
  { id: "hedge-trimmer", filename: "hedge-trimmer.jpg", query: 'hedge trimmer garden tool filetype:bitmap', required: ["hedge"] },
  { id: "lettuce-lollo-bionda", filename: "lettuce-lollo-bionda.jpg", query: 'Lactuca sativa lettuce filetype:bitmap', required: ["lettuce"] },
  { id: "lettuce-eichenlaub", filename: "lettuce-eichenlaub.jpg", query: 'Lactuca sativa lettuce leaves filetype:bitmap', required: ["lettuce"] },
  { id: "potato-bag", filename: "potato-bag.jpg", query: 'Solanum tuberosum potato plant filetype:bitmap', required: ["potato"] },
  { id: "marigold", filename: "marigold.jpg", query: 'Calendula officinalis flower filetype:bitmap', required: ["calendula"] },
  { id: "sunflower", filename: "sunflower.jpg", query: 'Helianthus annuus sunflower filetype:bitmap', required: ["sunflower"] },
  { id: "ladybug", filename: "ladybug.jpg", query: 'Coccinella septempunctata ladybird filetype:bitmap', required: ["coccinella"] },
  { id: "earthworm", filename: "earthworm.jpg", query: 'Lumbricus terrestris earthworm filetype:bitmap', required: ["lumbricus", "earthworm"] },
  { id: "aphid", filename: "aphid.jpg", query: 'aphid Aphidoidea filetype:bitmap', required: ["aphid"] },
];

const api = "https://commons.wikimedia.org/w/api.php";
const userAgent = "GardenLodgeSite/0.1 (educational garden cards)";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function text(meta, key) {
  return meta?.[key]?.value?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() ?? "";
}

function licenseCode(meta) {
  return text(meta, "LicenseShortName").toLowerCase();
}

function isAccepted(meta) {
  const code = licenseCode(meta);
  return (
    code.includes("cc0") ||
    code.includes("public domain") ||
    code === "pd" ||
    code.includes("cc by") ||
    code.includes("cc-by")
  );
}

function titleMatches(title, required) {
  const normalized = title.toLowerCase();
  return required.some((needle) => normalized.includes(needle));
}

async function commonsSearch(card) {
  const url = new URL(api);
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", "15");
  url.searchParams.set("gsrsearch", card.query);
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|mime|size|extmetadata");
  url.searchParams.set("iiurlwidth", "1200");

  let response;
  for (const wait of [0, 2000, 6000]) {
    if (wait) await sleep(wait);
    response = await fetch(url, { headers: { "user-agent": userAgent } });
    if (response.ok) break;
  }
  if (!response?.ok) throw new Error(`Commons search failed for ${card.id}: ${response?.status}`);
  const json = await response.json();
  const pages = Object.values(json.query?.pages ?? {});
  const candidates = pages
    .filter((page) => page.imageinfo?.[0]?.mime?.startsWith("image/"))
    .filter((page) => !page.imageinfo[0].mime.includes("svg"))
    .filter((page) => isAccepted(page.imageinfo[0].extmetadata))
    .sort((a, b) => {
      const titleA = titleMatches(a.title, card.required) ? 0 : 1;
      const titleB = titleMatches(b.title, card.required) ? 0 : 1;
      return titleA - titleB;
    });

  if (!candidates.length) throw new Error(`No open-license image found for ${card.id}`);
  return candidates[0];
}

async function download(url, destination) {
  let lastStatus = 0;
  for (const wait of [0, 1500, 4000]) {
    if (wait) await sleep(wait);
    const response = await fetch(url, { headers: { "user-agent": userAgent } });
    lastStatus = response.status;
    if (response.ok && response.body) {
      await pipeline(response.body, createWriteStream(destination));
      return;
    }
  }
  throw new Error(`Download failed: ${url} (${lastStatus})`);
}

async function exists(url) {
  try {
    await access(url);
    return true;
  } catch {
    return false;
  }
}

await mkdir(targetDir, { recursive: true });

const credits = {};
for (const card of cards) {
  const page = await commonsSearch(card);
  const info = page.imageinfo[0];
  const meta = info.extmetadata;
  const sourceUrl = info.descriptionurl;
  const thumbUrl = info.thumburl ?? info.url;
  const destination = new URL(card.filename, targetDir);

  if (!(await exists(destination))) {
    try {
      await download(thumbUrl, destination);
    } catch {
      await download(info.url, destination);
    }
  }

  credits[card.id] = {
    file: card.filename,
    commonsTitle: page.title,
    sourceUrl,
    author: text(meta, "Artist") || "Wikimedia Commons contributor",
    license: text(meta, "LicenseShortName") || text(meta, "UsageTerms"),
    licenseUrl: text(meta, "LicenseUrl"),
    objectName: text(meta, "ObjectName"),
  };

  console.log(`${card.id}: ${page.title}`);
  await sleep(800);
}

await writeFile(creditsFile, `${JSON.stringify(credits, null, 2)}\n`);
