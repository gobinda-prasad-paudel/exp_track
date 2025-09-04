import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"), // adjust if shared code lives outside client
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
  server: {
    port: 5173, // frontend dev server
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // your backend Express server
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
