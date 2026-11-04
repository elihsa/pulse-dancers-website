import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      fastRefresh: false,
    }),
    tailwindcss()
  ],
  server: {
    host: "0.0.0.0",
    port: 4000,
    strictPort: true,
    hmr: {
      port: 4000,
      overlay: false,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
