import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import WorkoutEdit from "./WorkoutEdit";
import { mockUseDispatch, mockUseWorkoutEdit } from "../../../test/service/mockService";
import workoutUtilService from "../../services/workout/workoutUtilService";

vi.mock("./WorkoutEditContext");
vi.mock("react-redux");

describe("WorkoutEdit", () => {
  beforeEach(() => {
    mockUseWorkoutEdit({});
    mockUseDispatch();
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render spinner loader when isLoading is true", () => {
    mockUseWorkoutEdit({ isLoading: true });
    render(<WorkoutEdit />);
    expect(screen.getByTestId("spinner-loader")).toBeInTheDocument();
  });

  it("should render error message when isError is true", () => {
    mockUseWorkoutEdit({ isError: true });
    render(<WorkoutEdit />);
    expect(screen.getByTestId("error-msg")).toBeInTheDocument();
  });

  it("should render null when isSuccess is false", () => {
    mockUseWorkoutEdit({ isSuccess: false });
    const { container } = render(<WorkoutEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null when workout is falsey", () => {
    mockUseWorkoutEdit({ workout: null });
    const { container } = render(<WorkoutEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("should render workout edit page when isSuccess is true and workout is truthy", () => {
    mockUseWorkoutEdit({ isSuccess: true });
    render(<WorkoutEdit />);
    expect(screen.getByTestId("workout-edit-page")).toBeInTheDocument();
  });

  it("should render workout edit main inputs", () => {
    mockUseWorkoutEdit({});
    render(<WorkoutEdit />);
    expect(screen.getByText("description:")).toBeInTheDocument();
    expect(screen.getByText("workout type:")).toBeInTheDocument();
  });

  it("should render duration", () => {
    const { workout } = mockUseWorkoutEdit({});
    const duration = workoutUtilService.calcWorkoutDuration(workout);
    render(<WorkoutEdit />);
    expect(screen.getByText(`${duration} minutes`)).toBeInTheDocument();
  });

  it("should render buttons", () => {
    mockUseWorkoutEdit({});
    render(<WorkoutEdit />);
    expect(screen.getByText("add cardio")).toBeInTheDocument();
    expect(screen.getByText("add set")).toBeInTheDocument();
    expect(screen.getByText("add superset")).toBeInTheDocument();
  });

  it("should render empty msg when items is empty", () => {
    mockUseWorkoutEdit({ workout: { items: [] } });
    render(<WorkoutEdit />);
    expect(screen.getByTestId("empty-msg")).toBeInTheDocument();
  });

  it("should render workout items", () => {
    mockUseWorkoutEdit({});
    render(<WorkoutEdit />);
    expect(screen.getByTestId("workout-edit-items-list-container")).toBeInTheDocument();
  });

  it("should render workout edit footer", () => {
    mockUseWorkoutEdit({});
    render(<WorkoutEdit />);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should render open button in footer", () => {
    mockUseWorkoutEdit({});
    render(<WorkoutEdit />);
    expect(screen.getByText("open")).toBeInTheDocument();
  });

  it("should handle add cardio click", () => {
    const { addWorkoutItem } = mockUseWorkoutEdit({});
    render(<WorkoutEdit />);
    fireEvent.click(screen.getByText("add cardio"));
    expect(addWorkoutItem).toHaveBeenCalledWith("aerobic");
  });

  it("should handle add set click", () => {
    const { addWorkoutItem } = mockUseWorkoutEdit({});
    render(<WorkoutEdit />);
    fireEvent.click(screen.getByText("add set"));
    expect(addWorkoutItem).toHaveBeenCalledWith("anaerobic");
  });

  it("should handle add superset click", () => {
    const { addWorkoutItem } = mockUseWorkoutEdit({});
    render(<WorkoutEdit />);
    fireEvent.click(screen.getByText("add superset"));
    expect(addWorkoutItem).toHaveBeenCalledWith("superset");
  });

  it("should handle open button click", () => {
    const { navigate, workout } = mockUseWorkoutEdit({});
    render(<WorkoutEdit />);
    fireEvent.click(screen.getByText("open"));
    expect(navigate).toHaveBeenCalledWith(`/workouts/details/${workout.id}`);
  });
});
