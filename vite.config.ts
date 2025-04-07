import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx, ManifestV3Export } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    crx({
      manifest: manifest as ManifestV3Export,
      contentScripts: {
        hmrTimeout: 3000, // Timeout for hot module reloading in milliseconds
        injectCss: true, // Allow CSS injection
      },
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
