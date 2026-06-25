// Generates public/og-default.png (1200×630) from a branded SVG using sharp.
// Run with: pnpm og
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const out = fileURLToPath(new URL("../public/og-default.png", import.meta.url));

const jewels = [
  "#6A2A55", "#21458F", "#1C7A4E", "#8A3A6E", "#117E8B", "#2E6BC6",
  "#4E8B3E", "#D49A2F", "#6A2A55", "#2E6BC6", "#1C7A4E", "#21458F",
];
const paneW = 1200 / jewels.length;
const panes = jewels
  .map(
    (c, i) =>
      `<rect x="${i * paneW}" y="0" width="${paneW - 4}" height="200" fill="${c}"/>`,
  )
  .join("");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#16121A"/>
  <g>${panes}</g>
  <rect x="0" y="200" width="1200" height="430" fill="#F6F1E6"/>
  <text x="80" y="360" font-family="Georgia, serif" font-size="86" font-weight="700" fill="#241D26">Garden Lodge</text>
  <text x="80" y="430" font-family="Helvetica, Arial, sans-serif" font-size="34" fill="#5C5650">We tend gardens the way you tend soil.</text>
  <text x="80" y="486" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#6A2A55">A community garden in Hamburg · sprints · a trilingual learning library</text>
  <rect x="80" y="540" width="220" height="8" rx="4" fill="#D49A2F"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log("Wrote", out);
