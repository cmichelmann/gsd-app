import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { readFileSync } from "node:fs";

// Single source of truth for app version: package.json.
const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

// On GitHub Pages the app lives under /<repo>/ — set BASE_PATH env var.
// Locally and on Vercel it stays "/".
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // We drive the update UX ourselves (banner + post-update changelog toast).
      registerType: "prompt",
      injectRegister: null,
      // Keep the existing hand-written public/manifest.json (already linked in index.html).
      manifest: false,
      workbox: {
        // Precache the whole shell so the app boots fully offline after one online launch.
        globPatterns: ["**/*.{js,css,html,woff2,png,jpg,jpeg,svg,json,ico}"],
        // Main bundle is ~850KB — lift the default 2MiB ceiling a touch for headroom.
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        // SPA: serve index.html for navigations when offline.
        navigateFallback: (process.env.BASE_PATH || "/") + "index.html",
      },
      includeAssets: ["fonts/*.woff2", "*.png", "*.jpeg", "*.jpg", "manifest.json"],
      devOptions: { enabled: false },
    }),
  ],
  base: process.env.BASE_PATH || "/",
  server: { host: true, port: 5173 },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
