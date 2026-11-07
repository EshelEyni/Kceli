import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUpdateTodayData } from "../../src/hooks/useUpdateTodayData";
import dayDataApiService from "../../src/services/dayData/dayDataApiService";
import { createFixtures } from "./fixtures";
vi.mock("../../src/services/dayData/dayDataApiService", () => ({ default: { update: vi.fn() } }));
let client: QueryClient;
beforeEach(() => {
  client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
});
afterEach(() => {
  cleanup();
  client.clear();
  vi.clearAllMocks();
});
function mount() {
  return renderHook(() => useUpdateTodayData(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}
it.each([1800, 1200, 0])(
  "publishes a saved food total of %s without waiting for refetch",
  async calories => {
    const day = createFixtures().today;
    const key = ["today", day.userId, "date"];
    client.setQueryData(key, day);
    const saved = {
      ...day,
      intakes: calories
        ? [{ ...day.intakes[0], items: [{ ...day.intakes[0].items[0], calories }] }]
        : [],
    };
    vi.mocked(dayDataApiService.update).mockResolvedValue(saved);
    const { result } = mount();
    act(() => result.current.updateDailyData({ id: day.id, data: { intakes: saved.intakes } }));
    await waitFor(() => expect(client.getQueryData(key)).toEqual(saved));
  }
);
it("does not replace the new day when an earlier save completes after midnight", async () => {
  const day = createFixtures().today;
  const next = { ...day, id: "next-day", intakes: [] };
  const key = ["today", day.userId, "next-date"];
  client.setQueryData(key, next);
  vi.mocked(dayDataApiService.update).mockResolvedValue(day);
  const { result } = mount();
  act(() => result.current.updateDailyData({ id: day.id, data: { intakes: day.intakes } }));
  await waitFor(() => expect(dayDataApiService.update).toHaveBeenCalled());
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(client.getQueryData(key)).toEqual(next);
});
