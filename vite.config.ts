import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx, ManifestV3Export } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [
    react(),
    crx({
      manifest: manifest as ManifestV3Export, // Explicit type assertion
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: "src/popup/index.html",
        options: "src/options/index.html",
      },
    },
  },
});
