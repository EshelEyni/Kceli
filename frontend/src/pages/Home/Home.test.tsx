import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Homepage from "./Home";
import { useAuth } from "../../hooks/useAuth";
vi.mock("../../hooks/useAuth", () => ({ useAuth: vi.fn() }));
vi.mock("../../hooks/usePageLoaded", () => ({ usePageLoaded: vi.fn() }));
vi.mock("./DayEdit/DayEditContext", () => ({
  DayEditProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("./DayEdit/DayEdit", () => ({ DayEdit: () => <div data-testid="journal" /> }));
vi.mock("../../components/Msg/LoginSignupMsg/LoginSignupMsg", () => ({
  LoginSignupMsg: () => <div data-testid="login" />,
}));
afterEach(cleanup);
it("shows the automatic journal without a manual start button", () => {
  vi.mocked(useAuth).mockReturnValue({ loggedInUser: { id: "user" } as never });
  render(<Homepage />);
  expect(screen.queryByTestId("journal")).not.toBeNull();
  expect(screen.queryByTestId("create-day-open-modal-btn")).toBeNull();
});
it("asks signed-out users to log in", () => {
  vi.mocked(useAuth).mockReturnValue({ loggedInUser: null });
  render(<Homepage />);
  expect(screen.queryByTestId("login")).not.toBeNull();
  expect(screen.queryByTestId("journal")).toBeNull();
});
