import path from "path";
const projectRoot = path.resolve(process.cwd());
import svgr from "vite-plugin-svgr";

import { configDefaults, defineConfig } from "vitest/config";

const root = "src/pages/home/DayEdit";

export default defineConfig({
  plugins: [svgr()],

  test: {
    environment: "jsdom",
    coverage: {
      exclude: ["packages/template/*"],
    },
    root,
    include: ["IntakeItemEditBtns.test.tsx"],
    exclude: [...configDefaults.exclude, "packages/template/*"],
    outputFile: "test-results.html",
    cache: {
      dir: path.join(projectRoot, "test/testCache"),
    },
  },
});
