/* eslint-disable @typescript-eslint/no-explicit-any */
import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useCreateDay } from "../../hooks/useCreateDay";
import Homepage from "./Home";
import {
  mockUseAuth,
  mockUseCreateDay,
  mockUseGetTodayData,
} from "../../../test/service/mockService";

vi.mock("./DayEdit/DayEdit", () => ({
  DayEdit: () => <div data-testid="day-edit" />,
}));

vi.mock("../../components/Msg/LoginSignupMsg/LoginSignupMsg", () => ({
  LoginSignupMsg: () => <div data-testid="login-signup-msg" />,
}));

vi.mock("./DayEdit/DayEditContext", () => ({
  DayEditProvider: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../hooks/usePageLoaded");
vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn().mockReturnValue({
    loggedInUser: {},
  }),
}));

vi.mock("../../hooks/useGetTodayData", () => ({
  useGetTodayData: vi.fn().mockReturnValue({
    dailyData: {},
  }),
}));

vi.mock("../../hooks/useCreateDay", () => ({
  useCreateDay: vi.fn().mockReturnValue({
    createDay: vi.fn(),
    isLoading: false,
  }),
}));

describe("Home Page", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should render LoginSignupMsg if user is not logged in", () => {
    mockUseAuth(null);

    render(<Homepage />);

    expect(screen.getByTestId("login-signup-msg")).toBeInTheDocument();
  });

  it("should render DayEdit if user is logged in and isLoadingCreateDay is false", () => {
    mockUseAuth({
      loggedInUser: {},
    });

    mockUseCreateDay({
      createDay: vi.fn(),
      isLoading: false,
    });

    mockUseGetTodayData({});

    render(<Homepage />);

    // Assuming DayEdit has a test-id or some text that can be queried
    expect(screen.getByTestId("day-edit")).toBeInTheDocument();
  });

  it("should render SpinnerLoader if isLoadingCreateDay is true", () => {
    mockUseAuth({
      loggedInUser: {},
    });

    mockUseCreateDay({
      createDay: vi.fn(),
      isLoading: true,
    });

    render(<Homepage />);

    // Assuming SpinnerLoader has a test-id that can be queried
    expect(screen.getByTestId("spinner-loader")).toBeInTheDocument();
  });

  it("should render 'start a new day' button and modal when isCreateDayBtnShown is true", () => {
    const currDay = new Date();
    const prevDay = new Date(currDay.setDate(currDay.getDate() - 1));
    mockUseAuth({ loggedInUser: {} });
    mockUseCreateDay({ createDay: vi.fn(), isLoading: false });
    mockUseGetTodayData({ dailyData: { date: prevDay } });

    render(<Homepage />);

    // Assuming the button or modal has a specific text or test-id that can be queried
    expect(screen.getByText("start a new day")).toBeInTheDocument();
  });

  it("should not render 'start a new day' button and modal when loggedInUser is null", () => {
    const currDay = new Date();
    mockUseAuth({ loggedInUser: null });
    mockUseCreateDay({ createDay: vi.fn(), isLoading: false });
    mockUseGetTodayData({ dailyData: { date: currDay.toDateString() } });

    render(<Homepage />);

    expect(screen.queryByText("start a new day")).not.toBeInTheDocument();
  });

  it("should not render 'start a new day' button and modal when dayilData is null", () => {
    mockUseAuth({ loggedInUser: {} });
    mockUseCreateDay({ createDay: vi.fn(), isLoading: false });
    mockUseGetTodayData({ dailyData: null });

    render(<Homepage />);

    expect(screen.queryByText("start a new day")).not.toBeInTheDocument();
  });

  it("should not render 'start a new day' button and modal when day date is today", () => {
    const currDay = new Date();

    mockUseAuth({ loggedInUser: {} });
    mockUseCreateDay({ createDay: vi.fn(), isLoading: false });
    mockUseGetTodayData({ dailyData: { date: currDay.toDateString() } });

    render(<Homepage />);

    expect(screen.queryByText("start a new day")).not.toBeInTheDocument();
  });

  it("should open modal when 'start a new day' button is clicked", () => {
    const currDay = new Date();
    const prevDay = new Date(currDay.setDate(currDay.getDate() - 1));
    mockUseAuth({ loggedInUser: {} });
    mockUseCreateDay({ createDay: vi.fn(), isLoading: false });
    mockUseGetTodayData({ dailyData: { date: prevDay } });

    render(
      <div id="app">
        <Homepage />
      </div>
    );

    const createNewDayBtn = screen.getByTestId("create-day-open-modal-btn");
    fireEvent.click(createNewDayBtn);

    expect(screen.getByTestId("modal-window")).toBeInTheDocument();
  });

  it("should close modal when 'cancel' button is clicked", () => {
    const currDay = new Date();
    const prevDay = new Date(currDay.setDate(currDay.getDate() - 1));
    mockUseAuth({ loggedInUser: {} });
    mockUseCreateDay({ createDay: vi.fn(), isLoading: false });
    mockUseGetTodayData({ dailyData: { date: prevDay } });

    render(
      <div id="app">
        <Homepage />
      </div>
    );

    const createNewDayBtn = screen.getByTestId("create-day-open-modal-btn");
    fireEvent.click(createNewDayBtn);

    expect(screen.getByTestId("modal-window")).toBeInTheDocument();

    const cancelBtn = screen.getByText("cancel");
    fireEvent.click(cancelBtn);

    expect(screen.queryByTestId("modal-window")).not.toBeInTheDocument();
  });

  it("should close modal and call createDay when 'start a new day' button is clicked", () => {
    const currDay = new Date();
    const prevDay = new Date(currDay.setDate(currDay.getDate() - 1));
    mockUseAuth({ loggedInUser: {} });
    mockUseCreateDay({ createDay: vi.fn(), isLoading: false });
    mockUseGetTodayData({ dailyData: { date: prevDay } });

    render(
      <div id="app">
        <Homepage />
      </div>
    );

    const createNewDayBtn = screen.getByTestId("create-day-open-modal-btn");
    fireEvent.click(createNewDayBtn);

    expect(screen.getByTestId("modal-window")).toBeInTheDocument();

    const createBtn = screen.getByTestId("create-day-modal-btn");
    fireEvent.click(createBtn);

    expect(screen.queryByTestId("modal-window")).not.toBeInTheDocument();
    expect(useCreateDay).toHaveBeenCalled();
  });
});
