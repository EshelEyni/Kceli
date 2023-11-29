import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Kceli",
        short_name: "Kceli",
        start_url: "/",
        scope: ".",
        display: "standalone",
        background_color: "#fff",
        theme_color: "#005FB3",
        description: "Kceli is a web app that helps you to watch your nutrition and health",
        dir: "ltr",
        orientation: "portrait-primary",
        publicPath: "/",
        icons: [
          {
            src: "/assets/images/pwa-48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/assets/images/pwa-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/assets/images/pwa-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/assets/images/pwa-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/assets/images/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/assets/images/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
