import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { IntakeList } from "./IntakeList";
import { mockUseDayEdit } from "../../../../test/service/mockService";
import testService from "../../../../test/service/testService";
import { ToggledElement } from "./DayEditContext";
import calorieUtilService from "../../../services/calorieUtil/calorieUtilService";
import { DayData } from "../../../../../shared/types/dayData";
import { getCleanTime } from "../../../services/util/utilService";

vi.mock("./DayEditContext");

describe("Intake List", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render all intakes", () => {
    const recordedIntakes = [
      testService.createIntake({ isRecorded: true, recordedAt: new Date("2021-01-01") }),
      testService.createIntake({ isRecorded: true, recordedAt: new Date("2021-01-02") }),
      testService.createIntake({ isRecorded: true, recordedAt: new Date("2021-01-03") }),
    ];

    mockUseDayEdit({ recordedIntakes, openedElement: ToggledElement.IntakeList });
    render(<IntakeList />);

    expect(screen.getAllByTestId("intake-preview").length).toBe(3);
  });

  it("should render header", () => {
    const recordedIntakes = [
      testService.createIntake({ isRecorded: true, recordedAt: new Date("2021-01-01") }),
    ];

    const { dailyData: dailyData1 } = mockUseDayEdit({
      recordedIntakes,
      openedElement: ToggledElement.IntakeList,
    });

    const totalCalories1 = calorieUtilService.getTotalCaloriesFromDailyData({
      dailyData: dailyData1 as DayData,
      isRecorded: true,
    });

    const { rerender } = render(<IntakeList />);

    expect(screen.getByTestId("intake-list-header")).toBeInTheDocument();
    expect(screen.getByText("Recorded Intakes")).toBeInTheDocument();
    expect(screen.getByText(`total calories: ${totalCalories1}`)).toBeInTheDocument();

    const { dailyData: dailyData2 } = mockUseDayEdit({
      recordedIntakes,
      openedElement: ToggledElement.UnRecordedIntakeList,
    });

    const totalCalories2 = calorieUtilService.getTotalCaloriesFromDailyData({
      dailyData: dailyData2 as DayData,
      isRecorded: false,
    });

    rerender(<IntakeList />);

    expect(screen.getByTestId("intake-list-header")).toBeInTheDocument();
    expect(screen.getByText("Unrecorded Intakes")).toBeInTheDocument();
    expect(screen.getByText(`total calories: ${totalCalories2}`)).toBeInTheDocument();
  });

  it("should render spinner loader when isLoadingUpdate is true", () => {
    mockUseDayEdit({ isLoadingUpdate: true });
    render(<IntakeList />);

    expect(screen.getByTestId("spinner-loader")).toBeInTheDocument();
  });

  it("should sort intakes", () => {
    const recordedIntakes = [
      testService.createIntake({
        isRecorded: true,
        recordedAt: new Date("2021-01-01T05:00:00"),
      }),
      testService.createIntake({
        isRecorded: true,
        recordedAt: new Date("2021-01-02T06:00:00"),
      }),
      testService.createIntake({
        isRecorded: true,
        recordedAt: new Date("2021-01-03T07:00:00"),
      }),
    ];

    const sortedIntakes = recordedIntakes.sort((a, b) => {
      if (!a.recordedAt || !b.recordedAt) return 0;
      return new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime();
    });
    const sortedIntakeTitles = sortedIntakes.map(
      (intake, i) => `Intake ${i + 1}# - ${getCleanTime(intake.recordedAt as unknown as string)}`
    );

    mockUseDayEdit({ recordedIntakes, openedElement: ToggledElement.IntakeList });
    render(<IntakeList />);

    const elements = screen.getAllByText(/Intake \d+#/);
    expect(elements[0]).toHaveTextContent(sortedIntakeTitles[0]);
    expect(elements[1]).toHaveTextContent(sortedIntakeTitles[1]);
    expect(elements[2]).toHaveTextContent(sortedIntakeTitles[2]);
  });
});
