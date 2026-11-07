import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react({ fastRefresh: false })], cacheDir: ".cache/motivation-vite", test: {
 environment: "jsdom", setupFiles: ["test/redesign/setup.ts"], threads: false, cache: { dir: ".cache/motivation-tests" },
 include: ["src/hooks/useDailyMotivation.test.tsx", "src/pages/ProfileDetails/dailyMotivationSettings.test.tsx"],
} });
