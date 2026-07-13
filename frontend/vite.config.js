import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Birthday Memory Book",
        short_name: "MemoryBook",
        description: "A private digital birthday scrapbook",
        theme_color: "#7c3aed",
        background_color: "#0f0620",
        display: "standalone",
        // Add real icon-192.png / icon-512.png files to /public and list them
        // here once you have branded app icons. Omitted for now so the build
        // doesn't reference missing files.
        icons: [],
      },

    }),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
