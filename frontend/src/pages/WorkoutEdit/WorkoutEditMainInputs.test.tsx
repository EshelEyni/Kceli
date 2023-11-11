import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { WorkoutEditMainInputs } from "./WorkoutEditMainInputs";
import testService from "../../../test/service/testService";
import { WorkoutAnaerobic } from "../../../../shared/types/workout";

describe("WorkoutEditMainInputs", () => {
  const mockWorkout = testService.createWorkout({});
  const mockHandleTypeSelectChange = vi.fn();
  const mockHandleDurationInputChange = vi.fn();
  const mockHandleDescInputChange = vi.fn();
  const mockHandleSplitSelectChange = vi.fn();

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render workout edit main inputs", () => {
    render(
      <WorkoutEditMainInputs
        workout={mockWorkout}
        handleTypeSelectChange={mockHandleTypeSelectChange}
        handleDescInputChange={mockHandleDescInputChange}
        handleSplitSelectChange={mockHandleSplitSelectChange}
      />
    );
    expect(screen.getByText("description:")).toBeInTheDocument();
    expect(screen.getByText("workout type:")).toBeInTheDocument();
  });

  it("should render duration input if handleDurationInputChange is passed", () => {
    render(
      <WorkoutEditMainInputs
        workout={mockWorkout}
        handleTypeSelectChange={mockHandleTypeSelectChange}
        handleDurationInputChange={mockHandleDurationInputChange}
        handleDescInputChange={mockHandleDescInputChange}
        handleSplitSelectChange={mockHandleSplitSelectChange}
      />
    );
    expect(screen.getByText("duration:")).toBeInTheDocument();
  });

  it("should render split select if workout type is anaerobic", () => {
    const mockWorkout = testService.createWorkout({ type: "anaerobic" });
    render(
      <WorkoutEditMainInputs
        workout={mockWorkout}
        handleTypeSelectChange={mockHandleTypeSelectChange}
        handleDescInputChange={mockHandleDescInputChange}
        handleSplitSelectChange={mockHandleSplitSelectChange}
      />
    );
    expect(screen.getByText("split:")).toBeInTheDocument();
  });

  it("should not render split select if workout type is aerobic", () => {
    const mockWorkout = testService.createWorkout({ type: "aerobic" });
    render(
      <WorkoutEditMainInputs
        workout={mockWorkout}
        handleTypeSelectChange={mockHandleTypeSelectChange}
        handleDescInputChange={mockHandleDescInputChange}
        handleSplitSelectChange={mockHandleSplitSelectChange}
      />
    );
    expect(screen.queryByText("split:")).not.toBeInTheDocument();
  });

  it("should call handleDescInputChange when workout type is changed", () => {
    vi.useFakeTimers();
    const mockWorkout = testService.createWorkout({ type: "aerobic" });
    render(
      <WorkoutEditMainInputs
        workout={mockWorkout}
        handleTypeSelectChange={mockHandleTypeSelectChange}
        handleDescInputChange={mockHandleDescInputChange}
        handleSplitSelectChange={mockHandleSplitSelectChange}
      />
    );
    fireEvent.change(screen.getByLabelText("description:"), { target: { value: "test1" } });
    vi.advanceTimersByTime(500);
    expect(mockHandleDescInputChange).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("should call handleDurationInputChange when workout type is changed", () => {
    vi.useFakeTimers();
    const mockWorkout = testService.createWorkout({ type: "aerobic" });
    render(
      <WorkoutEditMainInputs
        workout={mockWorkout}
        handleTypeSelectChange={mockHandleTypeSelectChange}
        handleDurationInputChange={mockHandleDurationInputChange}
        handleDescInputChange={mockHandleDescInputChange}
        handleSplitSelectChange={mockHandleSplitSelectChange}
      />
    );
    fireEvent.change(screen.getByLabelText("duration:"), { target: { value: 10 } });
    vi.advanceTimersByTime(500);
    expect(mockHandleDurationInputChange).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("should call handleTypeSelectChange when workout type is changed", () => {
    const mockWorkout = testService.createWorkout({ type: "aerobic" });
    render(
      <WorkoutEditMainInputs
        workout={mockWorkout}
        handleTypeSelectChange={mockHandleTypeSelectChange}
        handleDescInputChange={mockHandleDescInputChange}
        handleSplitSelectChange={mockHandleSplitSelectChange}
      />
    );
    fireEvent.click(screen.getByText("aerobic"));
    fireEvent.click(screen.getByText("anaerobic"));
    expect(mockHandleTypeSelectChange).toHaveBeenCalledTimes(1);
  });

  it("should call handleSplitSelectChange when workout type is changed", () => {
    const mockWorkout = testService.createWorkout({
      type: "anaerobic",
      split: "FBW",
    }) as WorkoutAnaerobic;

    render(
      <WorkoutEditMainInputs
        workout={mockWorkout}
        handleTypeSelectChange={mockHandleTypeSelectChange}
        handleDescInputChange={mockHandleDescInputChange}
        handleSplitSelectChange={mockHandleSplitSelectChange}
      />
    );
    fireEvent.click(screen.getByText(mockWorkout.split));
    fireEvent.click(screen.getByText("A"));
    expect(mockHandleSplitSelectChange).toHaveBeenCalledTimes(1);
  });
});
