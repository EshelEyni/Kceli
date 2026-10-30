import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
export default defineConfig({ plugins: [react({ fastRefresh: false }), svgr()], test: {
  environment: "jsdom", setupFiles: ["test/redesign/setup.ts"],
  include: ["src/pages/Home/DayEdit/NutritionQuery*.test.tsx"], threads: false,
} });
