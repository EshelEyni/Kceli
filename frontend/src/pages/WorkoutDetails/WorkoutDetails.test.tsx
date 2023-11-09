import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { mockUseWorkout } from "../../../test/service/mockService";
import WorkoutDetails from "./WorkoutDetails";
import testService from "../../../test/service/testService";

vi.mock("./WorkoutContext");

describe("WorkoutDetails", () => {
  beforeEach(() => {
    mockUseWorkout({});
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render spinner loader when loading", () => {
    mockUseWorkout({ isLoading: true });
    render(<WorkoutDetails />);
    expect(screen.getByTestId("spinner-loader")).toBeInTheDocument();
  });

  it("should render error msg when error", () => {
    mockUseWorkout({ isError: true });
    render(<WorkoutDetails />);
    expect(screen.getByTestId("error-msg")).toBeInTheDocument();
  });

  it("should render null when not success", () => {
    mockUseWorkout({ isSuccess: false });
    render(<WorkoutDetails />);
    expect(screen.queryByTestId("workout-details")).not.toBeInTheDocument();
  });

  it("should render workout details", () => {
    mockUseWorkout({ isSuccess: true });
    render(<WorkoutDetails />);
    expect(screen.getByTestId("workout-details")).toBeInTheDocument();
  });

  it("should render workout description", () => {
    const { workout } = mockUseWorkout({ isSuccess: true });
    render(<WorkoutDetails />);
    expect(screen.getByText("description:")).toBeInTheDocument();
    expect(screen.getByText(workout.description)).toBeInTheDocument();
  });

  it("should render workout duration", () => {
    const { duration } = mockUseWorkout({ isSuccess: true });
    render(<WorkoutDetails />);
    expect(screen.getByText("duration:")).toBeInTheDocument();
    expect(screen.getByText(`${duration} min`)).toBeInTheDocument();
  });

  it("should render workout type", () => {
    const { workout } = mockUseWorkout({ isSuccess: true });
    render(<WorkoutDetails />);
    expect(screen.getByText("type:")).toBeInTheDocument();
    expect(screen.getByText(workout.type)).toBeInTheDocument();
  });

  it("should render split in anaerobic workout", () => {
    const anaerobicWorkout = testService.createWorkout({ type: "anaerobic", split: "FBW" });
    const { workout } = mockUseWorkout({ isSuccess: true, workout: anaerobicWorkout });
    render(<WorkoutDetails />);
    expect(screen.getByText("split:")).toBeInTheDocument();
    expect(screen.getByText(workout.split)).toBeInTheDocument();
  });

  it("should render start button when workout is not started", () => {
    mockUseWorkout({ isSuccess: true, isWorkoutStarted: false });
    const { rerender } = render(<WorkoutDetails />);
    expect(screen.getByText("Start")).toBeInTheDocument();

    mockUseWorkout({ isSuccess: true, isWorkoutStarted: true });
    rerender(<WorkoutDetails />);
    expect(screen.queryByText("Start")).not.toBeInTheDocument();
  });

  it("should render workout items when workout is not started", () => {
    mockUseWorkout({ isSuccess: true, isWorkoutStarted: false });
    render(<WorkoutDetails />);
    expect(screen.getByText("items:")).toBeInTheDocument();
    expect(screen.getByTestId("workout-items-list")).toBeInTheDocument();
  });

  it("should render timer when workout is started", () => {
    mockUseWorkout({ isSuccess: true, isWorkoutStarted: true });
    render(<WorkoutDetails />);
    expect(screen.getByTestId("timer")).toBeInTheDocument();
  });

  it("should render uncompleted items when workout is started", () => {
    mockUseWorkout({ isSuccess: true, isWorkoutStarted: true });
    render(<WorkoutDetails />);
    expect(screen.getByTestId("workout-uncompleted-items-list")).toBeInTheDocument();
  });

  it("should render completed items when workout is started", () => {
    mockUseWorkout({
      completedItems: [testService.createAerobicWorkoutItem({ isCompleted: true })],
      isSuccess: true,
      isWorkoutStarted: true,
    });
    render(<WorkoutDetails />);
    expect(screen.getByTestId("workout-completed-items-list")).toBeInTheDocument();
  });
});
