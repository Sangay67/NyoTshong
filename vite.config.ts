import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Add this block – it works for both dev and preview
  server: {
    allowedHosts: ["nyotshong.onrender.com"],
  },
});
