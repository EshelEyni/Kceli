import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { mockUseDayEdit } from "../../../../test/service/mockService";
import { LastTimeYouAteTitle } from "./LastTimeYouAteTitle";
import testService from "../../../../test/service/testService";

vi.mock("./DayEditContext");

describe("Last Time You Ate Title", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render nothing when dailyData is not provided", () => {
    mockUseDayEdit({ dailyData: null });
    const { container } = render(<LastTimeYouAteTitle />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should render nothing when there are no recorded intakes", () => {
    const dailyData = testService.createDailyData({ intakes: [] });

    mockUseDayEdit({ dailyData });
    const { container } = render(<LastTimeYouAteTitle />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should render last time you ate title when there is a recorded intake", () => {
    const dailyData = testService.createDailyData({
      intakes: [testService.createIntake({ isRecorded: true })],
    });

    mockUseDayEdit({ dailyData });
    render(<LastTimeYouAteTitle />);

    expect(screen.getByText("Last time you ate: now")).toBeInTheDocument();
  });
});
