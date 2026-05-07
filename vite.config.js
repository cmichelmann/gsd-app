import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";

// Single source of truth for app version: package.json.
const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

// On GitHub Pages the app lives under /<repo>/ — set BASE_PATH env var.
// Locally and on Vercel it stays "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || "/",
  server: { host: true, port: 5173 },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
