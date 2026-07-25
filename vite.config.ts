import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const rawPort = process.env.PORT || "5173";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const githubRepo = process.env.GITHUB_REPOSITORY ?? "";
const [owner = "", repo = ""] = githubRepo.split("/");
const isUserSite = repo.toLowerCase().endsWith(".github.io") && owner.toLowerCase() === repo.replace(/\.github\.io$/i, "");
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const base = isGitHubPages ? (isUserSite ? "/" : `/${repo}/`) : "/";

export default defineConfig({
  base,
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
