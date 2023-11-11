import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { mockUseAuth, mockUseDayEdit } from "../../../../test/service/mockService";
import { DayWorkouts } from "./DayWorkouts";

vi.mock("./DayEditContext");
vi.mock("../../../hooks/useAuth");
vi.mock("../../../components/Workout/WorkoutPreview/WorkoutPreview", () => ({
  WorkoutPreview: () => <div data-testid="workout-preview" />,
}));

describe("DayWorkouts", () => {
  beforeEach(() => {
    mockUseDayEdit({});
    mockUseAuth({});
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render null when dailyData is undefined", () => {
    mockUseDayEdit({ dailyData: null });
    const { container } = render(<DayWorkouts />);
    expect(container.firstChild).toBeNull();
  });

  it("should render spinner loader when isLoadingUpdate is true", () => {
    mockUseDayEdit({ isLoadingUpdate: true });
    render(<DayWorkouts />);
    expect(screen.getByTestId("spinner-loader")).toBeInTheDocument();
  });

  it("should render day workouts", () => {
    render(<DayWorkouts />);
    expect(screen.getByTestId("day-workouts")).toBeInTheDocument();
  });

  it("should render add quick workout button", () => {
    render(<DayWorkouts />);
    expect(screen.getByText("add quick workout")).toBeInTheDocument();
  });

  it("should render workouts list", () => {
    render(<DayWorkouts />);
    expect(screen.getByTestId("workouts-list")).toBeInTheDocument();
  });

  it("should handle add quick workout button click", () => {
    render(<DayWorkouts />);
    fireEvent.click(screen.getByText("add quick workout"));
    expect(screen.getByTestId("quick-workout-form")).toBeInTheDocument();
  });

  it("should handle cancel button click", () => {
    render(<DayWorkouts />);
    fireEvent.click(screen.getByText("add quick workout"));
    fireEvent.click(screen.getByText("cancel"));
    expect(screen.queryByTestId("quick-workout-form")).not.toBeInTheDocument();
  });

  it("should handle save button click", async () => {
    vi.useFakeTimers();
    const { updateDailyData, dailyData } = mockUseDayEdit({});
    mockUseAuth({ id: "1" });
    const { rerender } = render(<DayWorkouts />);
    fireEvent.click(screen.getByText("add quick workout"));
    fireEvent.change(screen.getByLabelText("description:"), { target: { value: "new desc" } });
    vi.advanceTimersByTime(1250);
    expect(screen.getByDisplayValue("new desc"));
    rerender(<DayWorkouts />);
    fireEvent.change(screen.getByLabelText("duration:"), { target: { value: "200" } });
    vi.advanceTimersByTime(250);
    expect(screen.getByDisplayValue("200"));
    fireEvent.click(screen.getByText("FBW"));
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText("save"));
    expect(updateDailyData).toHaveBeenCalledTimes(1);
    const arg = updateDailyData.mock.calls[0][0];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(arg.workouts.length).toBe(dailyData!.workouts.length + 1);
    const addedItem = arg.workouts[arg.workouts.length - 1];
    expect(addedItem.userId).toBe("1");
    expect(addedItem.type).toBe("anaerobic");
    expect(addedItem.description).toBe("new desc");
    expect(addedItem.durationInMin).toBe(200);
    expect(addedItem.split).toBe("A");
    expect(screen.queryByTestId("quick-workout-form")).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
