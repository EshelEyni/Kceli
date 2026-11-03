import { afterEach, expect, it, vi } from "vitest";
import { estimateMeal } from "./foodEstimateApi";
afterEach(() => { vi.unstubAllGlobals(); });
it("rejects successful HTTP responses containing invalid estimates", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ status: "success", data: { calories: "100", assumptions: "guess" } }) }));
  await expect(estimateMeal("banana", new AbortController().signal)).rejects.toThrow("Could not read");
});
it("reports HTML gateway errors without a JSON syntax exception", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => { throw new Error("Unexpected token"); } }));
  await expect(estimateMeal("banana", new AbortController().signal)).rejects.toThrow("Could not read");
});
