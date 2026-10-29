import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react({ fastRefresh: false }), svgr()],
  test: {
    environment: "jsdom",
    include: [
      "test/redesign/**/*.test.tsx",
      "src/pages/Home/DayEdit/Filter.test.tsx",
      "src/pages/Home/DayEdit/WaterEdit.test.tsx",
      "src/components/App/Button/Button.test.tsx",
    ],
    threads: false,
  },
});
