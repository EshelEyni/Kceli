import { it, describe, expect, afterEach, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useDeleteWorkout } from "../../../hooks/useDeleteWorkout";
import { WorkoutPreview } from "./WorkoutPreview";
import testService from "../../../../test/service/testService";
import { WorkoutAnaerobic } from "../../../../../shared/types/workout";
import workoutUtilService from "../../../services/workout/workoutUtilService";
import {
  mockUseDeleteWorkout,
  mockUseGetTodayData,
  mockUseNavigate,
  mockUseUpdateTodayData,
} from "../../../../test/service/mockService";

vi.mock("react-router-dom");
vi.mock("../../../hooks/useDeleteWorkout");
vi.mock("../../../hooks/useGetTodayData");
vi.mock("../../../hooks/useUpdateTodayData");

describe("Workout Preview", () => {
  beforeEach(() => {
    mockUseDeleteWorkout({});
    mockUseGetTodayData({});
    mockUseUpdateTodayData({});
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render workout preview", () => {
    const mockWorkout = {
      ...testService.createWorkout({}),
      type: "anaerobic",
      split: "FBW",
    } as WorkoutAnaerobic;

    const duration = workoutUtilService.calcWorkoutDuration({ workout: mockWorkout });
    render(<WorkoutPreview workout={mockWorkout} />);

    expect(screen.getByTestId("workout-preview")).toBeInTheDocument();
    expect(screen.getByText(`description: ${mockWorkout.description}`)).toBeInTheDocument();
    expect(screen.getByText(`duration (in min): ${duration}`)).toBeInTheDocument();
    expect(screen.getByText(`type: ${mockWorkout.type}`)).toBeInTheDocument();
    expect(screen.getByText(`split: ${mockWorkout.split}`)).toBeInTheDocument();
    expect(screen.getByText("delete")).toBeInTheDocument();
    expect(screen.getByText("edit")).toBeInTheDocument();
    expect(screen.getByText("open")).toBeInTheDocument();
  });

  it("should render workout preview without split if workout is aerobic", () => {
    const mockWorkout = testService.createWorkout({});

    render(<WorkoutPreview workout={mockWorkout} />);

    expect(screen.getByTestId("workout-preview")).toBeInTheDocument();
    expect(screen.queryByText(`split:`)).not.toBeInTheDocument();
  });

  it("should render workout preview without delete and edit buttons if isDayEdit is true", () => {
    const mockWorkout = testService.createWorkout({});

    render(<WorkoutPreview workout={mockWorkout} />);

    expect(screen.getByTestId("workout-preview")).toBeInTheDocument();
    expect(screen.queryByText("delete")).toBeInTheDocument();
    expect(screen.queryByText("edit")).not.toBeInTheDocument();
  });

  it("should call removeWorkout on delete button click when isDayEdit is falsey", () => {
    const mockWorkout = testService.createWorkout({});
    const { removeWorkout } = useDeleteWorkout();

    render(<WorkoutPreview workout={mockWorkout} />);

    screen.getByText("delete").click();

    expect(removeWorkout).toHaveBeenCalledTimes(1);
    expect(removeWorkout).toHaveBeenCalledWith(mockWorkout.id);
  });

  it("should call updateDailyData on delete button click when isDayEdit is truthy", () => {
    const mockWorkout = testService.createWorkout({});
    const { dailyData } = mockUseGetTodayData({});
    const { updateDailyData } = mockUseUpdateTodayData({});

    render(<WorkoutPreview workout={mockWorkout} />);

    screen.getByText("delete").click();

    expect(updateDailyData).toHaveBeenCalledTimes(1);
    expect(updateDailyData).toHaveBeenCalledWith({
      ...dailyData,
      workouts: [],
    });
  });

  it("should call navigate on edit button click", () => {
    const mockWorkout = testService.createWorkout({});
    const navigate = mockUseNavigate();
    render(<WorkoutPreview workout={mockWorkout} />);

    screen.getByText("edit").click();

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(`/workouts/edit/${mockWorkout.id}`);
  });

  it("should call navigate on open button click", () => {
    const mockWorkout = testService.createWorkout({});
    const navigate = mockUseNavigate();

    render(<WorkoutPreview workout={mockWorkout} />);

    screen.getByText("open").click();

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(`/workouts/details/${mockWorkout.id}`);
  });
});
