import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { WorkoutsProvider, useWorkouts } from "./WorkoutsContext";
import {
  mockUseAuth,
  mockUseCreateWorkout,
  mockUseDeleteWorkout,
  mockUseGetWorkouts,
  mockUseNavigate,
} from "../../../test/service/mockService";
import testService from "../../../test/service/testService";

vi.mock("react-router-dom");
vi.mock("../../hooks/useAuth");
vi.mock("../../hooks/useCreateWorkout");
vi.mock("../../hooks/useDeleteWorkout");
vi.mock("../../hooks/useGetWorkouts");

describe("WorkoutsContext", () => {
  beforeEach(() => {
    mockUseAuth({});
    mockUseNavigate();
    mockUseGetWorkouts({});
    mockUseCreateWorkout({});
    mockUseDeleteWorkout({});
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it("should render children", () => {
    render(
      <WorkoutsProvider>
        <div>children</div>
      </WorkoutsProvider>
    );
    expect(screen.getByText("children")).toBeInTheDocument();
  });

  it("should provide proper logged in user", () => {
    const user = testService.createUser({});
    mockUseAuth(user);

    const TestComponent = () => {
      const { loggedInUser } = useWorkouts();
      return <div>{loggedInUser?.username}</div>;
    };

    render(
      <WorkoutsProvider>
        <TestComponent />
      </WorkoutsProvider>
    );

    expect(screen.getByText(user.username)).toBeInTheDocument();
  });

  it("should provide proper useGetWorkouts values", () => {
    const workouts = [testService.createWorkout({})];
    mockUseGetWorkouts({ workouts });

    const TestComponent = () => {
      const { workouts, isLoading, isSuccess, isError, isEmpty } = useWorkouts();
      if (!workouts) return <div>no workouts</div>;
      return (
        <div>
          <div>{workouts[0].description}</div>
          <div>isLoading: {isLoading.toString()}</div>
          <div>isSuccess: {isSuccess.toString()}</div>
          <div>isError: {isError.toString()}</div>
          <div>isEmpty: {isEmpty.toString()}</div>
        </div>
      );
    };

    render(
      <WorkoutsProvider>
        <TestComponent />
      </WorkoutsProvider>
    );

    expect(screen.getByText(workouts[0].description)).toBeInTheDocument();
    expect(screen.getByText("isLoading: false")).toBeInTheDocument();
    expect(screen.getByText("isSuccess: true")).toBeInTheDocument();
    expect(screen.getByText("isError: false")).toBeInTheDocument();
    expect(screen.getByText("isEmpty: false")).toBeInTheDocument();
  });

  it("should provide proper useCreateWorkout values", () => {
    const createWorkout = vi.fn();
    mockUseCreateWorkout({ createWorkout });

    const TestComponent = () => {
      const { createWorkout, isLoadingCreateWorkout } = useWorkouts();
      return (
        <div>
          <button onClick={createWorkout}>create workout</button>
          <div>isLoadingCreateWorkout: {isLoadingCreateWorkout.toString()}</div>
        </div>
      );
    };

    render(
      <WorkoutsProvider>
        <TestComponent />
      </WorkoutsProvider>
    );

    fireEvent.click(screen.getByText("create workout"));
    expect(createWorkout).toHaveBeenCalledTimes(1);
    expect(screen.getByText("isLoadingCreateWorkout: false")).toBeInTheDocument();
  });

  it("should provide proper useNavigate values", () => {
    const navigate = vi.fn();
    mockUseNavigate(navigate);

    const TestComponent = () => {
      const { navigate } = useWorkouts();
      return (
        <div>
          <button onClick={() => navigate("/test")}>navigate</button>
        </div>
      );
    };

    render(
      <WorkoutsProvider>
        <TestComponent />
      </WorkoutsProvider>
    );

    fireEvent.click(screen.getByText("navigate"));
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/test");
  });

  it("should provide proper useDeleteWorkout values", () => {
    const removeWorkout = vi.fn();
    mockUseDeleteWorkout({ removeWorkout });

    const TestComponent = () => {
      const { removeWorkout, isLoadingRemove } = useWorkouts();
      return (
        <div>
          <button onClick={() => removeWorkout("test")}>remove workout</button>
          <div>isLoadingRemove: {isLoadingRemove.toString()}</div>
        </div>
      );
    };

    render(
      <WorkoutsProvider>
        <TestComponent />
      </WorkoutsProvider>
    );

    fireEvent.click(screen.getByText("remove workout"));
    expect(removeWorkout).toHaveBeenCalledTimes(1);
    expect(removeWorkout).toHaveBeenCalledWith("test");
    expect(screen.getByText("isLoadingRemove: false")).toBeInTheDocument();
  });

  it("should provide proper workoutSchedule values", () => {
    const user = testService.createUser({});
    mockUseAuth(user);

    const TestComponent = () => {
      const { workoutSchedule, setWorkoutSchedule } = useWorkouts();
      return (
        <div>
          <div>{workoutSchedule?.[0].name}</div>
          <button onClick={() => setWorkoutSchedule(undefined)}>setWorkoutSchedule</button>
        </div>
      );
    };

    render(
      <WorkoutsProvider>
        <TestComponent />
      </WorkoutsProvider>
    );

    expect(screen.getByText(user.workoutSchedule[0].name)).toBeInTheDocument();
    fireEvent.click(screen.getByText("setWorkoutSchedule"));
    expect(screen.queryByText(user.workoutSchedule[0].name)).not.toBeInTheDocument();
  });
});
