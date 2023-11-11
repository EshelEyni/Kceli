/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { WorkoutEditProvider, useWorkoutEdit } from "./WorkoutEditContext";
import {
  mockUseGetWorkout,
  mockUseNavigate,
  mockUseParams,
  mockUseUpdateWorkout,
} from "../../../test/service/mockService";
import { FC } from "react";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { assertWorkoutItem, assetSupersetItem } from "../../../test/service/testAssertionService";
import testService from "../../../test/service/testService";

vi.mock("react-router-dom");
vi.mock("../../hooks/useGetWorkout");
vi.mock("../../hooks/useUpdateWorkout");

describe("WorkoutEditContext", () => {
  beforeEach(() => {
    mockUseParams({ workoutId: "mockWorkoutId" });
    mockUseGetWorkout({});
    mockUseUpdateWorkout({});
    mockUseNavigate();
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render correctly with children", () => {
    const childText = "Child Component";
    render(
      <WorkoutEditProvider>
        <div>{childText}</div>
      </WorkoutEditProvider>
    );

    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  it("should call updateWorkout with new item when addWorkoutItem is called", async () => {
    const { workout } = mockUseGetWorkout({});
    const { updateWorkout } = mockUseUpdateWorkout({});

    const TestComponent: FC = () => {
      const { updateWorkout } = useWorkoutEdit();

      function handleClick() {
        updateWorkout({ ...workout, description: "new description" });
      }

      return <button onClick={handleClick}>update</button>;
    };

    render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    fireEvent.click(screen.getByText("update"));

    expect(updateWorkout).toHaveBeenCalledTimes(1);
    expect(updateWorkout).toHaveBeenCalledWith({
      ...workout,
      description: "new description",
    });
  });

  it("should provide propder isLoadinUpdateWorkout as false when updateWorkout is not called", () => {
    mockUseUpdateWorkout({ isLoading: false });

    const TestComponent: FC = () => {
      const { isLoadingUpdateWorkout } = useWorkoutEdit();

      return <div>{isLoadingUpdateWorkout.toString()}</div>;
    };

    const { rerender } = render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    expect(screen.getByText("false")).toBeInTheDocument();

    mockUseUpdateWorkout({ isLoading: true });

    rerender(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    expect(screen.getByText("true")).toBeInTheDocument();
  });

  it("should provide proper workout", () => {
    const { workout } = mockUseGetWorkout({});

    const TestComponent: FC = () => {
      const { workout } = useWorkoutEdit();

      return <div>{workout?.description}</div>;
    };

    render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    expect(screen.getByText(workout.description)).toBeInTheDocument();
  });

  it("should provide proper isLoaing", () => {
    mockUseGetWorkout({ isLoading: true });

    const TestComponent: FC = () => {
      const { isLoading } = useWorkoutEdit();

      return <div>{isLoading.toString()}</div>;
    };

    render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    expect(screen.getByText("true")).toBeInTheDocument();
  });

  it("should provide proper isSuccess", () => {
    mockUseGetWorkout({ isSuccess: true });

    const TestComponent: FC = () => {
      const { isSuccess } = useWorkoutEdit();

      return <div>{isSuccess.toString()}</div>;
    };

    render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    expect(screen.getByText("true")).toBeInTheDocument();
  });

  it("should provide proper isError", () => {
    mockUseGetWorkout({ isError: true });

    const TestComponent: FC = () => {
      const { isError } = useWorkoutEdit();

      return <div>{isError.toString()}</div>;
    };

    render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    expect(screen.getByText("true")).toBeInTheDocument();
  });

  it("should provide proper params", () => {
    const params = mockUseParams({ workoutId: "mockWorkoutId" });

    const TestComponent: FC = () => {
      const { params } = useWorkoutEdit();

      return <div>{params.workoutId}</div>;
    };

    render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    expect(screen.getByText(params.workoutId)).toBeInTheDocument();
  });

  it("should provide proper navigate", () => {
    const navigate = mockUseNavigate();

    const TestComponent: FC = () => {
      const { navigate } = useWorkoutEdit();

      function handleClick() {
        navigate("/mockPath");
      }

      return <button onClick={handleClick}>navigate</button>;
    };

    render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    fireEvent.click(screen.getByText("navigate"));

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/mockPath");
  });

  it("should provide proper duration", () => {
    const { workout } = mockUseGetWorkout({});
    const duration = workoutUtilService.calcWorkoutDuration({ workout });

    const TestComponent: FC = () => {
      const { duration } = useWorkoutEdit();

      return <div>{duration}</div>;
    };

    render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    expect(screen.getByText(duration.toString())).toBeInTheDocument();
  });

  it("should provide proper currItemId", () => {
    const { workout } = mockUseGetWorkout({});
    const currItemId = workout.items[0].id;

    const TestComponent: FC = () => {
      const { currItemId } = useWorkoutEdit();

      return <div>{currItemId}</div>;
    };

    render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    expect(screen.getByText(currItemId)).toBeInTheDocument();
  });

  it("should provide proper setCurrItemId", () => {
    mockUseGetWorkout({});

    const TestComponent: FC = () => {
      const { setCurrItemId, currItemId } = useWorkoutEdit();

      function handleClick() {
        setCurrItemId("mockId");
      }

      return (
        <>
          <div>{currItemId}</div>
          <button onClick={handleClick}>setCurrItemId</button>;
        </>
      );
    };

    render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    fireEvent.click(screen.getByText("setCurrItemId"));

    expect(screen.getByText("mockId")).toBeInTheDocument();
  });

  it("should provide proper addWorkoutItem", () => {
    const { workout } = mockUseGetWorkout({});
    const { updateWorkout } = mockUseUpdateWorkout({});

    const TestComponent: FC = () => {
      const { addWorkoutItem } = useWorkoutEdit();

      return (
        <>
          <button onClick={() => addWorkoutItem("aerobic")}>aerobic</button>;
          <button onClick={() => addWorkoutItem("anaerobic")}>anaerobic</button>;
          <button onClick={() => addWorkoutItem("superset")}>superset</button>;
          <button onClick={() => addWorkoutItem("invalid" as any)}>invalid</button>;
        </>
      );
    };

    render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    fireEvent.click(screen.getByText("aerobic"));

    expect(updateWorkout).toHaveBeenCalled();
    const arg1 = updateWorkout.mock.calls[0][0];
    expect(arg1.items.length).toBe(workout.items.length + 1);
    arg1.items.forEach(assertWorkoutItem);

    updateWorkout.mockClear();

    fireEvent.click(screen.getByText("anaerobic"));
    expect(updateWorkout).toHaveBeenCalled();
    const arg2 = updateWorkout.mock.calls[0][0];
    expect(arg2.items.length).toBe(workout.items.length + 1);
    arg2.items.forEach(assertWorkoutItem);

    updateWorkout.mockClear();

    fireEvent.click(screen.getByText("superset"));
    expect(updateWorkout).toHaveBeenCalled();
    const arg3 = updateWorkout.mock.calls[0][0];
    expect(arg3.items.length).toBe(workout.items.length + 1);
    arg3.items.forEach(assertWorkoutItem);

    updateWorkout.mockClear();

    fireEvent.click(screen.getByText("invalid"));
    expect(updateWorkout).not.toHaveBeenCalled();
  });

  it("should provide proper removeWorkoutItem", () => {
    const mockWorkout = testService.createWorkout({
      items: [
        testService.createAerobicWorkoutItem({ id: "1" }),
        testService.createAerobicWorkoutItem({ id: "2" }),
        testService.createAerobicWorkoutItem({ id: "3" }),
        testService.createAerobicWorkoutItem({ id: "4" }),
        testService.createAerobicWorkoutItem({ id: "5" }),
      ],
    });

    const { workout } = mockUseGetWorkout({ workout: mockWorkout });
    const { updateWorkout } = mockUseUpdateWorkout({});

    const TestComponent: FC = () => {
      const { removeWorkoutItem, currItemId } = useWorkoutEdit();
      return (
        <>
          <div>currItemId: {currItemId}</div>
          <button onClick={() => removeWorkoutItem("1")}>1</button>
          <button onClick={() => removeWorkoutItem("2")}>2</button>
          <button onClick={() => removeWorkoutItem("3")}>3</button>
          <button onClick={() => removeWorkoutItem("4")}>4</button>
          <button onClick={() => removeWorkoutItem("5")}>5</button>
          <button onClick={() => removeWorkoutItem("invalid")}>invalid</button>
        </>
      );
    };

    const { rerender } = render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    expect(screen.getByText("currItemId: 1")).toBeInTheDocument();
    fireEvent.click(screen.getByText("5"));

    expect(updateWorkout).toHaveBeenCalled();
    const arg1 = updateWorkout.mock.calls[0][0];
    expect(arg1.items.length).toBe(workout.items.length - 1);
    arg1.items.forEach(assertWorkoutItem);
    expect(arg1.items.map((item: any) => item.id)).not.toContain("5");
    expect(screen.getByText("currItemId: 4")).toBeInTheDocument();

    updateWorkout.mockClear();
    mockUseGetWorkout({ workout: arg1 });

    rerender(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    fireEvent.click(screen.getByText("1"));
    expect(updateWorkout).toHaveBeenCalled();
    const arg2 = updateWorkout.mock.calls[0][0];
    expect(arg2.items.length).toBe(workout.items.length - 2);
    arg2.items.forEach(assertWorkoutItem);
    expect(arg2.items.map((item: any) => item.id)).not.toContain("1");
    expect(screen.getByText("currItemId: 2")).toBeInTheDocument();

    updateWorkout.mockClear();

    fireEvent.click(screen.getByText("invalid"));
    expect(updateWorkout).not.toHaveBeenCalled();
    expect(screen.getByText("currItemId: 2")).toBeInTheDocument();
  });

  it("should provide proper addWorkoutItemToSuperset", () => {
    const mockWorkout = testService.createWorkout({
      items: [testService.createSupersetWorkoutItem({ id: "1" })],
    });

    const { workout } = mockUseGetWorkout({ workout: mockWorkout });
    const { updateWorkout } = mockUseUpdateWorkout({});

    const TestComponent: FC = () => {
      const { addWorkoutItemToSuperset } = useWorkoutEdit();

      return (
        <>
          <button onClick={() => addWorkoutItemToSuperset(workout.items[0])}>add</button>
        </>
      );
    };

    render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    fireEvent.click(screen.getByText("add"));

    expect(updateWorkout).toHaveBeenCalled();
    const arg1 = updateWorkout.mock.calls[0][0];
    expect(arg1.items.length).toBe(workout.items.length);
    arg1.items.forEach(assertWorkoutItem);
    assertWorkoutItem(arg1.items[0]);
    expect(arg1.items[0].items.length).toBe(workout.items[0].items.length + 1);
    arg1.items[0].items.forEach(assetSupersetItem);
  });

  it("should provide proper removeWorkoutItemFromSuperset", () => {
    const mockWorkout = testService.createWorkout({
      items: [
        testService.createSupersetWorkoutItem({
          id: "1",
          items: [
            testService.createSupersetItem({ id: "1" }),
            testService.createSupersetItem({ id: "2" }),
            testService.createSupersetItem({ id: "3" }),
          ],
        }),
      ],
    });

    const { workout } = mockUseGetWorkout({ workout: mockWorkout });
    const { updateWorkout } = mockUseUpdateWorkout({});

    const TestComponent: FC = () => {
      const { removeWorkoutItemFromSuperset } = useWorkoutEdit();

      return (
        <>
          <button onClick={() => removeWorkoutItemFromSuperset(workout.items[0].id, "1")}>
            remove
          </button>
        </>
      );
    };

    render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    fireEvent.click(screen.getByText("remove"));

    expect(updateWorkout).toHaveBeenCalled();
    const arg1 = updateWorkout.mock.calls[0][0];
    expect(arg1.items.length).toBe(workout.items.length);
    arg1.items.forEach(assertWorkoutItem);
    assertWorkoutItem(arg1.items[0]);
    expect(arg1.items[0].items.length).toBe(workout.items[0].items.length - 1);
  });

  it("should set currItemId to first item id when workout is loaded", () => {
    const mockWorkout = testService.createWorkout({
      items: [
        testService.createSupersetWorkoutItem({
          id: "1",
          items: [
            testService.createSupersetItem({ id: "1" }),
            testService.createSupersetItem({ id: "2" }),
            testService.createSupersetItem({ id: "3" }),
          ],
        }),
      ],
    });

    mockUseGetWorkout({ workout: mockWorkout });

    const TestComponent: FC = () => {
      const { currItemId } = useWorkoutEdit();

      return <div>{currItemId}</div>;
    };

    render(
      <WorkoutEditProvider>
        <TestComponent />
      </WorkoutEditProvider>
    );

    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
