import { afterEach, expect, it, vi } from "vitest";
vi.mock("axios", () => ({ default: vi.fn().mockRejectedValue(new Error("network failure")) }));
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
it("does not swallow production save failures", async () => {
  vi.stubEnv("NODE_ENV", "production");
  const { default: http } = await import("./httpService");
  await expect(http.patch("day/123", { intakes: [] })).rejects.toThrow("network failure");
});
