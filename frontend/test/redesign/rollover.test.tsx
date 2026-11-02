import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetTodayData } from "../../src/hooks/useGetTodayData";
import dayDataApiService from "../../src/services/dayData/dayDataApiService";
vi.mock("../../src/hooks/useAuth", () => ({ useAuth: () => ({ loggedInUser: { id: "user" } }) }));
vi.mock("../../src/services/dayData/dayDataApiService", () => ({ default: { getToday: vi.fn() } }));
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 2, 23, 59, 59));
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.clearAllMocks();
});
function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, ...renderHook(() => useGetTodayData(), { wrapper }) };
}
it("opens a different query at local midnight without displaying yesterday", async () => {
  vi.mocked(dayDataApiService.getToday).mockResolvedValue({ id: "yesterday" } as never);
  const { client, result } = mount();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(10);
  });
  expect(result.current.dailyData?.id).toBe("yesterday");
  vi.mocked(dayDataApiService.getToday).mockReturnValue(new Promise(() => {}));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1000);
  });
  expect(dayDataApiService.getToday).toHaveBeenCalledTimes(2);
  expect(result.current.dailyData).toBeUndefined();
  client.clear();
});
it("detects several missed days immediately on resume", async () => {
  vi.mocked(dayDataApiService.getToday).mockResolvedValue({ id: "day" } as never);
  const { client } = mount();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(10);
  });
  vi.setSystemTime(new Date(2026, 10, 8, 9));
  await act(async () => {
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(dayDataApiService.getToday).toHaveBeenCalledTimes(2);
  client.clear();
});
