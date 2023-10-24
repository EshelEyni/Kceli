import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { DayEditFilter } from "./Filter";
import { mockUseDayEdit } from "../../../../test/service/mockService";
import { ToggledElement } from "./DayEditContext";
import testService from "../../../../test/service/testService";

vi.mock("./DayEditContext");

describe("Day Edit Filter", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render all filter buttons where isShown prop is not provided", () => {
    const dailyData = {
      ...testService.createDailyData(),
      intakes: [],
      workouts: [],
    };
    mockUseDayEdit({ dailyData });
    render(<DayEditFilter />);

    const expectedBtnNames = ["add", "water", "weight", "query"];

    for (const btnName of expectedBtnNames) {
      expect(screen.getByText(btnName)).toBeInTheDocument();
    }
  });

  it("should render intakes button if there are recorded intakes", () => {
    const dailyData = {
      ...testService.createDailyData(),
      intakes: [testService.createIntake({ isRecorded: true })],
      workouts: [],
    };

    mockUseDayEdit({ dailyData });
    render(<DayEditFilter />);

    expect(screen.getByText("intakes")).toBeInTheDocument();
  });

  it("should render unrecorded button if there are unrecorded intakes", () => {
    const dailyData = {
      ...testService.createDailyData(),
      intakes: [testService.createIntake({ isRecorded: false })],
      workouts: [],
    };

    mockUseDayEdit({ dailyData });
    render(<DayEditFilter />);

    expect(screen.getByText("unrecorded")).toBeInTheDocument();
  });

  it("should render workouts button if there are workouts", () => {
    const dailyData = {
      ...testService.createDailyData(),
      intakes: [],
      workouts: [testService.createWorkout()],
    };

    mockUseDayEdit({ dailyData });
    render(<DayEditFilter />);

    expect(screen.getByText("workouts")).toBeInTheDocument();
  });

  it("should call setOpenedElement with proper value on button click", () => {
    const dailyData = {
      ...testService.createDailyData(),
      intakes: [
        testService.createIntake({ isRecorded: true }),
        testService.createIntake({ isRecorded: false }),
      ],
      workouts: [testService.createWorkout()],
    };

    const { setOpenedElement } = mockUseDayEdit({ dailyData });
    render(<DayEditFilter />);

    const filterEl = screen.getByTestId("day-edit-filter");
    const btns = filterEl.getElementsByTagName("button");
    const toggledElementValues = Object.values(ToggledElement);

    for (let i = 0; i < btns.length; i++) {
      const btn = btns[i];
      const toggledElement = toggledElementValues[i];
      fireEvent.click(btn);
      expect(setOpenedElement).toHaveBeenCalledWith(toggledElement);
    }
  });
});
