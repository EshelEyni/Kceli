import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { DayEditHeader } from "./Header";
import { mockUseDayEdit } from "../../../../test/service/mockService";
import testService from "../../../../test/service/testService";

vi.mock("./DayEditContext");

describe("Day Edit Header", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render date", () => {
    const date = new Date("2021-01-01");
    const expectedDateStr = new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }).format(date);

    mockUseDayEdit({
      dailyData: { ...testService.createDailyData({}), date },
    });
    render(<DayEditHeader />);

    const dateEl = screen.getByTestId("day-edit-header-date");
    expect(dateEl).toBeInTheDocument();
    expect(dateEl).toHaveTextContent(expectedDateStr);
  });

  it("should render remaining calories", () => {
    mockUseDayEdit({ remainingCalories: 1000 });
    const { rerender } = render(<DayEditHeader />);

    const remainingCaloriesEl = screen.getByTestId("day-edit-header-remaining-calories");
    expect(remainingCaloriesEl).toBeInTheDocument();
    expect(remainingCaloriesEl).toHaveTextContent("1000 calories remaining");

    mockUseDayEdit({ remainingCalories: -1000 });
    rerender(<DayEditHeader />);
    const remainingCaloriesEl2 = screen.getByTestId("day-edit-header-remaining-calories");
    expect(remainingCaloriesEl2).toHaveTextContent("1000 calories over your limit");
  });

  it("should render consumed calories", () => {
    mockUseDayEdit({ consumedCalories: 1000 });
    render(<DayEditHeader />);

    const consumedCaloriesEl = screen.getByTestId("day-edit-header-consumed-calories");
    expect(consumedCaloriesEl).toBeInTheDocument();
    expect(consumedCaloriesEl).toHaveTextContent("1000 calories consumed");
  });

  it("should render consumed percentage", () => {
    mockUseDayEdit({ calConsumedPct: 50 });
    render(<DayEditHeader />);

    const consumedCalPercentageEl = screen.getByTestId("day-edit-header-consumed-percentage");
    expect(consumedCalPercentageEl).toBeInTheDocument();
    expect(consumedCalPercentageEl).toHaveTextContent("50%");
  });

  it("should render remaining percentage", () => {
    mockUseDayEdit({ calRemainingPct: 50 });
    render(<DayEditHeader />);

    const remainingCalPercentageEl = screen.getByTestId("day-edit-header-remaining-percentage");
    expect(remainingCalPercentageEl).toBeInTheDocument();
    expect(remainingCalPercentageEl).toHaveTextContent("50%");
  });

  it("should render estimated kg change", () => {
    mockUseDayEdit({ estimatedKGChange: -1 });
    const { rerender } = render(<DayEditHeader />);

    const estimatedKgChangeEl = screen.getByTestId("day-edit-header-estimated-kg-change");
    expect(estimatedKgChangeEl).toHaveTextContent("estimated to lose 1 kg");

    mockUseDayEdit({ estimatedKGChange: 1 });
    rerender(<DayEditHeader />);

    const estimatedKgChangeEl2 = screen.getByTestId("day-edit-header-estimated-kg-change");
    expect(estimatedKgChangeEl2).toHaveTextContent("estimated to gain 1 kg");
  });
});
