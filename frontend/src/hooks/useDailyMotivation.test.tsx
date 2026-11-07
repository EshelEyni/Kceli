import React from "react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { useDailyMotivation } from "./useDailyMotivation";
import { DayDashboard } from "../pages/Home/DayEdit/DayDashboard";
const state = vi.hoisted(() => ({ user: {} as any }));
vi.mock("./useAuth", () => ({ useAuth: () => ({ loggedInUser: state.user }) }));
vi.mock("../pages/Home/DayEdit/DayEditContext", () => ({ useDayEdit: () => ({ dailyData: { id: "day", date: new Date(), workouts: [] }, consumedCalories: 0, remainingCalories: 1800, targetCaloricIntakePerDay: 1800 }) }));
vi.mock("../pages/Home/DayEdit/DayGoals", () => ({ DayGoals: () => null }));
vi.mock("../pages/Home/DayEdit/QuickFoodLog", () => ({ QuickFoodLog: () => <div>AI food input</div> }));
let client: QueryClient;
const localDate = () => { const date = new Date(); return [date.getFullYear(), String(date.getMonth()+1).padStart(2,"0"), String(date.getDate()).padStart(2,"0")].join("-"); };
const reply = (data: any) => ({ ok: true, json: async () => ({ status: "success", data }) });
const text = "Choose one small habit you can repeat today.";
function Harness({ user = state.user, active = true }: any) { const message = useDailyMotivation(user, active); return <p>{message || "Static fallback"}</p>; }
function wrap(child: React.ReactNode) { return <QueryClientProvider client={client}><MemoryRouter>{child}</MemoryRouter></QueryClientProvider>; }
beforeEach(() => {
 client = new QueryClient({ defaultOptions: { queries: { retry: false } }, logger: { log: console.log, warn: console.warn, error: () => {} } });
 state.user = { id: "user-a", fullname: "Demo", language: "en", dailyMotivationEnabled: true, workoutSchedule: [] };
 vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => reply({ localDate: localDate(), status: "ready", text })));
});
afterEach(() => { cleanup(); client.clear(); vi.useRealTimers(); vi.unstubAllGlobals(); });
test.each([false, undefined])("OFF leaves the greeting and static subtitle intact without fetching (%p)", async enabled => {
 state.user.dailyMotivationEnabled = enabled;
 render(wrap(<DayDashboard><div>Journal</div></DayDashboard>));
 expect(screen.getByRole("heading", { name: "Good to see you, Demo." })).toBeTruthy();
 expect(screen.getByText("Small steps today. A healthier you tomorrow.")).toBeTruthy();
 expect(screen.getByText("AI food input")).toBeTruthy(); expect(fetch).not.toHaveBeenCalled();
});
test("ON replaces only the subtitle and sends timezone without user-supplied identity", async () => {
 render(wrap(<DayDashboard><div>Journal</div></DayDashboard>));
 await screen.findByText(text); expect(screen.getByRole("heading", { name: "Good to see you, Demo." })).toBeTruthy();
 expect(screen.getByText("AI food input")).toBeTruthy();
 const options = vi.mocked(fetch).mock.calls[0][1]!;
 expect(JSON.parse(options.body as string)).toEqual({ timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
});
test.each(["failed", "disabled"])("server %s retains the static sentence", async status => {
 vi.mocked(fetch).mockResolvedValue(reply({ localDate: localDate(), status, text: null }) as any);
 render(wrap(<Harness />)); await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
 expect(screen.getByText("Static fallback")).toBeTruthy();
});
test("network failure falls back without automatic retries", async () => {
 vi.mocked(fetch).mockRejectedValue(new Error("offline")); render(wrap(<Harness />));
 await waitFor(() => expect(client.getQueryCache().getAll()[0].state.status).toBe("error"));
 expect(screen.getByText("Static fallback")).toBeTruthy(); expect(fetch).toHaveBeenCalledTimes(1);
});
test("opting out immediately hides cached output and late results", async () => {
 const view = render(wrap(<Harness />)); await screen.findByText(text);
 view.rerender(wrap(<Harness user={{ ...state.user, dailyMotivationEnabled: false }} />));
 expect(screen.getByText("Static fallback")).toBeTruthy();
});
test("another account does not see the previous user's message", async () => {
 const view = render(wrap(<Harness />)); await screen.findByText(text);
 vi.mocked(fetch).mockImplementation(() => new Promise<Response>(() => {}));
 view.rerender(wrap(<Harness user={{ ...state.user, id: "user-b" }} />));
 expect(screen.getByText("Static fallback")).toBeTruthy();
});
test("historical journal does not trigger daily generation", () => {
 render(wrap(<Harness active={false} />)); expect(fetch).not.toHaveBeenCalled();
});
test("local midnight switches query date and never displays yesterday's text", async () => {
 vi.useFakeTimers(); vi.setSystemTime(new Date(2026, 10, 7, 23, 59, 59));
 render(wrap(<Harness />));
 await act(async () => { await vi.advanceTimersByTimeAsync(10); });
 expect(fetch).toHaveBeenCalledTimes(1);
 await act(async () => { await vi.advanceTimersByTimeAsync(1100); });
 expect(fetch).toHaveBeenCalledTimes(2);
 const dates = client.getQueryCache().getAll().map(q => q.queryKey[3]);
 expect(dates).toContain("2026-11-08");
});
test("pending reservation polls for completion, then stops", async () => {
 vi.useFakeTimers();
 vi.mocked(fetch).mockResolvedValueOnce(reply({ localDate: localDate(), status: "pending", text: null }) as any);
 render(wrap(<Harness />));
 await act(async () => { await vi.advanceTimersByTimeAsync(2100); });
 expect(fetch).toHaveBeenCalledTimes(2);
 await act(async () => { await vi.advanceTimersByTimeAsync(5000); });
 expect(fetch).toHaveBeenCalledTimes(2);
});
