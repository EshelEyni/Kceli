import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import auth from "../../src/store/slices/authSlice";
import system from "../../src/store/slices/systemSlice";
import { DayDashboard } from "../../src/pages/Home/DayEdit/DayDashboard";
import { DayEdit } from "../../src/pages/Home/DayEdit/DayEdit";
import { DayEditFilter } from "../../src/pages/Home/DayEdit/Filter";
import { DayEditProvider } from "../../src/pages/Home/DayEdit/DayEditContext";
import { WorkoutsProvider } from "../../src/pages/Workout/WorkoutsContext";
import WorkoutPage from "../../src/pages/Workout/WorkoutPage";
import { ProfileProvider } from "../../src/pages/ProfileDetails/ProfileContext";
import ProfileDetails from "../../src/pages/ProfileDetails/ProfileDetails";
import { ScheduleProvider } from "../../src/pages/Schedule/ScheduleContext";
import Schedule from "../../src/pages/Schedule/Schedule";
import { AppHeader } from "../../src/components/App/AppHeader/AppHeader";
import { Routes, Route } from "react-router-dom";
import { installReviewApi } from "./mockApi";

let api: ReturnType<typeof installReviewApi>;
let client: QueryClient;
beforeEach(() => {
  api = installReviewApi();
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: 0 }, mutations: { retry: false } },
  });
  Element.prototype.scrollIntoView = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});
afterEach(() => {
  cleanup();
  client.clear();
  api.mock.restore();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function mount(element: React.ReactNode, path = "/home", loggedIn = true) {
  const store = configureStore({
    reducer: { auth, system },
    preloadedState: { auth: { loggedInUser: loggedIn ? api.fixtures.user : null } },
  });
  render(
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[path]}>
          <div className="app">{element}</div>
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
  return store;
}

describe("Approved redesign with real providers and mocked transport", () => {
  it("keeps the daily journal without the removed insights section", async () => {
    mount(
      <DayEditProvider>
        <DayEdit />
      </DayEditProvider>
    );
    await screen.findByRole("heading", { name: "Your daily journal", exact: true });
    expect(screen.queryByText("More daily insights")).not.toBeInTheDocument();
    expect(screen.queryByTestId("day-edit-header")).not.toBeInTheDocument();
    expect(screen.getByText(/Greek yogurt & berry bowl -/)).toBeInTheDocument();
  });
  it.each(["Water", "Workouts", "HungerMeter"])(
    "falls back to the diary for the retired %s Home tab",
    async tab => {
      mount(
        <DayEditProvider>
          <DayDashboard>
            <DayEditFilter />
          </DayDashboard>
        </DayEditProvider>,
        `/home?tab=${tab}`
      );
      await screen.findByRole("heading", { name: "Good to see you, Alex." });
      expect(screen.getByRole("button", { name: "Diary", exact: true })).toHaveAttribute(
        "aria-pressed",
        "true"
      );
      expect(screen.queryByRole("heading", { name: "Stay hydrated" })).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /water|hunger|workouts/i })
      ).not.toBeInTheDocument();
      expect(api.mock.history.patch).toHaveLength(0);
    }
  );

  it("does not quick-log today's activities into an older saved day", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    api.fixtures.today.date = yesterday;
    mount(
      <DayEditProvider>
        <DayDashboard>
          <p>Daily tools</p>
        </DayDashboard>
      </DayEditProvider>
    );
    await screen.findByText(/Viewing your saved day:/);
    expect(screen.queryByRole("button", { name: "Log a meal", exact: true })).not.toBeInTheDocument();
    expect(api.mock.history.patch).toHaveLength(0);
  });

  it("offers mobile scheduling, persists once and avoids duplicate routines", async () => {
    const store = mount(
      <WorkoutsProvider>
        <WorkoutPage />
      </WorkoutsProvider>,
      "/workouts"
    );
    const select = await screen.findByLabelText("Schedule Easy outdoor run");
    fireEvent.change(select, { target: { value: "mon" } });
    await waitFor(() =>
      expect(
        store
          .getState()
          .auth.loggedInUser?.workoutSchedule.find(d => d.name === "mon")
          ?.workouts.some(w => w.id === "cardio-a")
      ).toBe(true)
    );
    expect(api.mock.history.patch.filter(r => r.url?.endsWith("user/loggedInUser"))).toHaveLength(
      1
    );
    fireEvent.change(select, { target: { value: "mon" } });
    expect(api.mock.history.patch.filter(r => r.url?.endsWith("user/loggedInUser"))).toHaveLength(
      1
    );
    expect(
      api.fixtures.user.workoutSchedule
        .find(d => d.name === "mon")
        ?.workouts.filter(w => w.id === "cardio-a")
    ).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Cardio", exact: true }));
    expect(screen.queryByLabelText("Schedule Full body strength")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Schedule Easy outdoor run")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Remove Easy outdoor run from mon", exact: true })
    );
    await waitFor(() =>
      expect(
        store
          .getState()
          .auth.loggedInUser?.workoutSchedule.find(d => d.name === "mon")
          ?.workouts.some(w => w.id === "cardio-a")
      ).toBe(false)
    );
  });

  it("keeps the saved weekly plan when a schedule request fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    api.mock.onPatch(/user\/loggedInUser$/).reply(503, { status: "error" });
    const store = mount(
      <WorkoutsProvider>
        <WorkoutPage />
      </WorkoutsProvider>,
      "/workouts"
    );
    fireEvent.change(await screen.findByLabelText("Schedule Easy outdoor run"), {
      target: { value: "mon" },
    });
    await waitFor(() => expect(api.mock.history.patch).toHaveLength(1));
    await waitFor(() =>
      expect(screen.getByLabelText("Schedule Easy outdoor run")).not.toBeDisabled()
    );
    expect(
      store
        .getState()
        .auth.loggedInUser?.workoutSchedule.find(d => d.name === "mon")
        ?.workouts.some(w => w.id === "cardio-a")
    ).toBe(false);
  });

  it("edits the profile through the existing API and updates the shared account state", async () => {
    const store = mount(
      <Routes>
        <Route
          path="/profile/:id"
          element={
            <ProfileProvider>
              <ProfileDetails />
            </ProfileProvider>
          }
        />
      </Routes>,
      "/profile/review-user"
    );
    await screen.findByRole("button", { name: "Edit", exact: true });
    fireEvent.click(screen.getByRole("button", { name: "Edit", exact: true }));
    fireEvent.change(screen.getByLabelText("full name:"), { target: { value: "Alex Taylor" } });
    fireEvent.click(screen.getByRole("button", { name: "update", exact: true }));
    await screen.findByRole("heading", { name: "Alex Taylor", exact: true });
    expect(store.getState().auth.loggedInUser?.fullname).toBe("Alex Taylor");
  });

  it("exposes keyboard-accessible dates and moves calendar selection into the new month", async () => {
    mount(
      <ScheduleProvider>
        <Schedule />
      </ScheduleProvider>,
      "/schedule"
    );
    await screen.findByRole("region", { name: "Calendar" });
    const pressed = within(screen.getByRole("region", { name: "Calendar" })).getAllByRole(
      "button",
      { pressed: true }
    );
    expect(pressed.length).toBeGreaterThan(0);
    const before = pressed[0].getAttribute("aria-label");
    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    await waitFor(() => {
      const selected = within(screen.getByRole("region", { name: "Calendar" })).getAllByRole(
        "button",
        { pressed: true }
      );
      expect(selected[0].getAttribute("aria-label")).not.toBe(before);
    });
    fireEvent.click(screen.getByRole("button", { name: "week", exact: true }));
    expect(screen.getByRole("button", { name: "week", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("keeps all four destinations labelled and sends signed-out Profile to login", () => {
    mount(<AppHeader />, "/home", false);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).getAllByRole("link")).toHaveLength(4);
    expect(within(nav).getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/login");
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });
});
