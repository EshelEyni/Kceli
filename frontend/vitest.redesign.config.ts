import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react({ fastRefresh: false }), svgr()],
  test: {
    environment: "jsdom",
    setupFiles: ["test/redesign/setup.ts"],
    include: [
      "test/redesign/**/*.test.tsx",
      "src/pages/Home/DayEdit/Filter.test.tsx",
      "src/components/App/Button/Button.test.tsx",
    ],
    threads: false,
  },
});
