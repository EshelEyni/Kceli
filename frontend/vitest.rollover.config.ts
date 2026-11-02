import { defineConfig } from "vitest/config";
import base from "./vitest.redesign.config";
export default defineConfig({
  ...base,
  cacheDir: ".cache/rollover-vite",
  test: {
    ...base.test,
    cache: { dir: ".cache/rollover-vitest" },
    include: [...base.test!.include!, "src/pages/Home/Home.test.tsx"],
  },
});
