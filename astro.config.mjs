// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

// Update `site` to the final production URL before deploying so the sitemap
// and canonical/OG URLs are correct.
export default defineConfig({
  site: "https://garden-lodge.pages.dev",
  output: "static",
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare()
});