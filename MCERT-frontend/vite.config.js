import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      src: path.resolve(__dirname, "./src"),
      components: path.resolve(__dirname, "./src/components"),
      assets: path.resolve(__dirname, "./src/assets"),
      contexts: path.resolve(__dirname, "./src/contexts"),
      layouts: path.resolve(__dirname, "./src/layouts"),
      views: path.resolve(__dirname, "./src/views"),
      services: path.resolve(__dirname, "./src/services"),
      utils: path.resolve(__dirname, "./src/utils"),
      middleware: path.resolve(__dirname, "./src/middleware"),
      constants: path.resolve(__dirname, "./src/constants"),
      variables: path.resolve(__dirname, "./src/variables"),
      models: path.resolve(__dirname, "./src/models"),
      routes: path.resolve(__dirname, "./src/routes.jsx"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
    sourcemap: true,
  },
});
