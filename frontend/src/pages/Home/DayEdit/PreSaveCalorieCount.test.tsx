import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { PreSaveCalorieCount } from "./PreSaveCalorieCount";
import testService from "../../../../test/service/testService";
import { mockUseDayEdit } from "../../../../test/service/mockService";

vi.mock("./DayEditContext");

describe("Pre Save Calorie Count", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render nothing when intake is empty", () => {
    mockUseDayEdit({ intake: null });
    const { container } = render(<PreSaveCalorieCount />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render nothing when intake is not recorded", () => {
    const intake = testService.createIntake({ isRecorded: false });
    mockUseDayEdit({ intake });
    const { container } = render(<PreSaveCalorieCount />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render nothing when the intake total calorie is equal or less than zero", () => {
    const intake = testService.createIntake({
      items: [testService.createIntakeItem({ calories: 0 })],
    });
    mockUseDayEdit({ intake });
    const { container } = render(<PreSaveCalorieCount />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render pre save calorie count when intake is not empty", () => {
    const intake = testService.createIntake({ items: [testService.createIntakeItem({})] });
    const dailyData = testService.createDailyData({ intakes: [intake] });

    mockUseDayEdit({ dailyData });
    render(<PreSaveCalorieCount />);

    expect(screen.getByText("Total:")).toBeInTheDocument();
    expect(screen.getByText("Consumed:")).toBeInTheDocument();
    expect(screen.getByText("Remaining:")).toBeInTheDocument();
  });
});
