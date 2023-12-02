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
      injectRegister: "auto",
      registerType: "autoUpdate",
      strategies: "generateSW",
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
        "assets/sounds/*.mp3",
        "assets/images/*.png",
        "assets/fonts/**/*.ttf",
      ],
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
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/api\/.*/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24,
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|tiff|ttf|woff|woff2|eot)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "static-resources",
            },
          },
        ],
        navigateFallback: "/offline.html",
      },
    }),
  ],
});
