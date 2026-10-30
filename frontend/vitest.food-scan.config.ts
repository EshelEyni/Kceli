import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react({ fastRefresh: false })], test: {
  environment: "jsdom", setupFiles: ["test/redesign/setup.ts"],
  include: ["src/pages/Home/DayEdit/FoodScanner.test.tsx", "src/services/http/httpService.test.ts"], threads: false,
} });
