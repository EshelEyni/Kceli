import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react({ fastRefresh: false })], test: {
  environment: "jsdom", setupFiles: ["test/redesign/setup.ts"],
  include: ["src/pages/Home/DayEdit/foodEstimateEditing.test.tsx", "src/pages/Home/DayEdit/QuickFoodLog.test.tsx", "src/services/nutrition/foodEstimateApi.test.ts", "src/services/http/foodEstimateHttp.test.ts"], threads: false,
} });
