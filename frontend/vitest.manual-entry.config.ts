import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({ cacheDir: ".cache/manual-entry", plugins: [react({ fastRefresh: false })], test: {
 cache: { dir: ".cache/manual-entry-tests" }, environment: "jsdom", setupFiles: ["test/redesign/setup.ts"], threads: false,
 include: ["src/pages/Home/DayEdit/Filter.test.tsx", "src/pages/Home/DayEdit/QuickFoodLog.test.tsx", "src/pages/Home/DayEdit/foodEstimateEditing.test.tsx", "src/services/nutrition/foodEstimateApi.test.ts", "src/services/http/foodEstimateHttp.test.ts", "src/pages/Home/DayEdit/IntakeItemEdit.test.tsx", "src/pages/Home/DayEdit/IntakeItemEditManualInputs.test.tsx", "src/pages/Home/DayEdit/IntakeEdit.test.tsx", "src/pages/Home/DayEdit/FoodScanner.test.tsx"],
} });
