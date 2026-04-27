import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// On GitHub Pages the app lives under /<repo>/ — set BASE_PATH env var.
// Locally and on Vercel it stays "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || "/",
  server: { host: true, port: 5173 },
});
