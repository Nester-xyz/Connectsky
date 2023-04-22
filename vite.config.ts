import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        welcome: "public/welcome.tsx",
        background: "public/background.tsx",
        main: resolve(__dirname, "index.html"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].[hash].js",
        format: "esm",
        dir: "dist",
      },
    },
  },
});
