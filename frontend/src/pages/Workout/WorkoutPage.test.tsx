import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { mockUseDispatch, mockUseWorkouts } from "../../../test/service/mockService";
import WorkoutPage from "./WorkoutPage";

vi.mock("./WorkoutsContext");
vi.mock("react-redux");

describe("WorkoutsContext", () => {
  beforeEach(() => {
    mockUseWorkouts({});
    mockUseDispatch();
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render workout schedule", () => {
    render(<WorkoutPage />);
    expect(screen.getByTestId("workout-schedule")).toBeInTheDocument();
  });

  it("should render create workout button", () => {
    render(<WorkoutPage />);
    expect(screen.getByText("add new workout")).toBeInTheDocument();
  });

  it("should call createWorkout when create workout button is clicked", () => {
    const createWorkout = vi.fn();
    mockUseWorkouts({ createWorkout });
    render(<WorkoutPage />);
    fireEvent.click(screen.getByText("add new workout"));
    expect(createWorkout).toHaveBeenCalled();
  });

  it("should render spinner loader when is loading", () => {
    mockUseWorkouts({ isLoadingCreateWorkout: true });
    render(<WorkoutPage />);
    expect(screen.getByTestId("spinner-loader")).toBeInTheDocument();
  });

  it("should render workout list when is loading is false", () => {
    render(<WorkoutPage />);
    expect(screen.getByTestId("workout-list")).toBeInTheDocument();
  });
});
