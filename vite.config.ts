import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const rawPort = process.env.PORT || "5173";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath = process.env.BASE_PATH || (process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : "/");

export default defineConfig({
  base: basePath,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: false,
    host: "127.0.0.1",
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "127.0.0.1",
  },
});
