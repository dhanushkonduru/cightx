import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// three.js and R3F are reached only through the lazily imported hero scene,
// so Rollup keeps them out of the entry chunk on its own.
export default defineConfig({
  plugins: [react()],
  server: { port: 5190 },
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 900,
  },
});
