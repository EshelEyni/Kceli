import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {
  mockUseGetTodayData,
  mockUseGetWorkout,
  mockUseNavigate,
  mockUseParams,
  mockUseUpdateTodayData,
} from "../../../test/service/mockService";
import { WorkoutProvider, useWorkout } from "./WorkoutContext";
import testService from "../../../test/service/testService";
import workoutUtilService from "../../services/workout/workoutUtilService";

vi.mock("react-router-dom");
vi.mock("../../hooks/useGetWorkout");
vi.mock("../../hooks/useGetTodayData");
vi.mock("../../hooks/useUpdateTodayData");

describe("WorkoutContext", () => {
  beforeEach(() => {
    const workout = testService.createWorkout({});
    const dailyData = testService.createDailyData({ workouts: [workout] });
    mockUseNavigate();
    mockUseParams({ id: workout.id });
    mockUseGetWorkout({});
    mockUseGetTodayData({ dailyData });
    mockUseUpdateTodayData({});
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should provide proper workout data", async () => {
    const workout = testService.createWorkout({});
    workout.description = "Test";
    const TestComponent = () => {
      const { workout, isLoading, isSuccess, isError } = useWorkout();
      return (
        <>
          <div>{workout?.description}</div>
          <div>isLoading: {isLoading.toString()}</div>
          <div>isSuccess: {isSuccess.toString()}</div>
          <div>isError: {isError.toString()}</div>
        </>
      );
    };

    mockUseGetWorkout({ workout });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("isLoading: false")).toBeInTheDocument();
    expect(screen.getByText("isSuccess: true")).toBeInTheDocument();
    expect(screen.getByText("isError: false")).toBeInTheDocument();
  });

  it("should proper navigate to workout details", async () => {
    const navigate = mockUseNavigate();
    const TestComponent = () => {
      const { navigate } = useWorkout();
      return <div onClick={() => navigate("/workout/1")}>Test</div>;
    };

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    fireEvent.click(screen.getByText("Test"));

    expect(navigate).toHaveBeenCalledWith("/workout/1");
  });

  it("should provide proper duration", async () => {
    const workout = testService.createWorkout({});
    const expectedDuration = workoutUtilService.calcWorkoutDuration({ workout });

    const TestComponent = () => {
      const { duration } = useWorkout();
      return <div>{duration}</div>;
    };

    mockUseGetWorkout({ workout });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    expect(screen.getByText(expectedDuration)).toBeInTheDocument();
  });

  it("should provide proper completed duration", async () => {
    const workout = testService.createWorkout({
      items: [
        testService.createAerobicWorkoutItem({ isCompleted: true, durationInMin: 15 }),
        testService.createAerobicWorkoutItem({ isCompleted: false, durationInMin: 10 }),
      ],
    });
    const dailyData = testService.createDailyData({ workouts: [workout] });
    const expectedCompletedDuration = workoutUtilService.calcWorkoutDuration({
      workout,
      type: "completed",
    });

    const TestComponent = () => {
      const { completedDuration } = useWorkout();
      return <div>{completedDuration}</div>;
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    expect(screen.getByText(expectedCompletedDuration)).toBeInTheDocument();
  });

  it("should provide proper remaining duration", async () => {
    const workout = testService.createWorkout({
      items: [
        testService.createAerobicWorkoutItem({ isCompleted: true, durationInMin: 15 }),
        testService.createAerobicWorkoutItem({ isCompleted: false, durationInMin: 10 }),
      ],
    });
    const dailyData = testService.createDailyData({ workouts: [workout] });
    const expectedRemainingDuration = workoutUtilService.calcWorkoutDuration({
      workout,
      type: "remaining",
    });

    const TestComponent = () => {
      const { remainingDuration } = useWorkout();
      return <div>{remainingDuration}</div>;
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    expect(screen.getByText(expectedRemainingDuration)).toBeInTheDocument();
  });

  it("should provide proper current  (first uncompleted item)", async () => {
    const workout = testService.createWorkout({
      items: [
        testService.createAerobicWorkoutItem({ isCompleted: true, durationInMin: 15 }),
        testService.createAerobicWorkoutItem({ isCompleted: false, durationInMin: 10 }),
      ],
    });
    const dailyData = testService.createDailyData({ workouts: [workout] });

    const TestComponent = () => {
      const { currItem } = useWorkout();
      return <div>{currItem?.id}</div>;
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    expect(screen.getByText(workout.items[1].id)).toBeInTheDocument();
  });

  it("should provide proper setCurrentItem", async () => {
    const workout = testService.createWorkout({
      items: [
        testService.createAerobicWorkoutItem({ isCompleted: true, durationInMin: 15 }),
        testService.createAerobicWorkoutItem({ isCompleted: false, durationInMin: 10 }),
      ],
    });
    const dailyData = testService.createDailyData({ workouts: [workout] });

    const TestComponent = () => {
      const { currItem, setCurrItem } = useWorkout();
      return (
        <>
          <div>{currItem?.id}</div>
          <div onClick={() => setCurrItem(workout.items[0])}>Test</div>
        </>
      );
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    fireEvent.click(screen.getByText("Test"));

    expect(screen.getByText(workout.items[0].id)).toBeInTheDocument();
  });

  it("should provide proper time", async () => {
    const workout = testService.createWorkout({
      items: [
        testService.createAerobicWorkoutItem({ isCompleted: true, durationInMin: 15 }),
        testService.createAerobicWorkoutItem({ isCompleted: false, durationInMin: 10 }),
      ],
    });
    const dailyData = testService.createDailyData({ workouts: [workout] });

    const TestComponent = () => {
      const { time } = useWorkout();
      return <div>{time}</div>;
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    expect(screen.getByText("600")).toBeInTheDocument();
  });

  it("should provide proper setTime", async () => {
    const workout = testService.createWorkout({
      items: [
        testService.createAerobicWorkoutItem({ isCompleted: true, durationInMin: 15 }),
        testService.createAerobicWorkoutItem({ isCompleted: false, durationInMin: 10 }),
      ],
    });

    const TestComponent = () => {
      const { time, setTime } = useWorkout();
      return (
        <>
          <div>{time}</div>
          <div onClick={() => setTime(100)}>Test</div>
        </>
      );
    };

    mockUseGetWorkout({ workout });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    fireEvent.click(screen.getByText("Test"));

    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("should provide proper initialTime", async () => {
    const workout = testService.createWorkout({
      items: [
        testService.createAerobicWorkoutItem({ isCompleted: true, durationInMin: 15 }),
        testService.createAerobicWorkoutItem({ isCompleted: false, durationInMin: 10 }),
      ],
    });
    const dailyData = testService.createDailyData({ workouts: [workout] });

    const TestComponent = () => {
      const { initialTime } = useWorkout();
      return <div>{initialTime}</div>;
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    expect(screen.getByText("600")).toBeInTheDocument();
  });

  it("should provide proper setInitialTime", async () => {
    const workout = testService.createWorkout({
      items: [
        testService.createAerobicWorkoutItem({ isCompleted: true, durationInMin: 15 }),
        testService.createAerobicWorkoutItem({ isCompleted: false, durationInMin: 10 }),
      ],
    });

    const TestComponent = () => {
      const { initialTime, setInitialTime } = useWorkout();
      return (
        <>
          <div>{initialTime}</div>
          <div onClick={() => setInitialTime(100)}>Test</div>
        </>
      );
    };

    mockUseGetWorkout({ workout });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    fireEvent.click(screen.getByText("Test"));

    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("should provide proper isRunning", async () => {
    const workout = testService.createWorkout({});
    const dailyData = testService.createDailyData({ workouts: [workout] });

    const TestComponent = () => {
      const { isRunning } = useWorkout();
      return <div>{isRunning.toString()}</div>;
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    expect(screen.getByText("false")).toBeInTheDocument();
  });

  it("should provide proper setIsRunning", async () => {
    const workout = testService.createWorkout({});

    const TestComponent = () => {
      const { isRunning, setIsRunning } = useWorkout();
      return (
        <>
          <div>{isRunning.toString()}</div>
          <div onClick={() => setIsRunning(true)}>Test</div>
        </>
      );
    };

    mockUseGetWorkout({ workout });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    fireEvent.click(screen.getByText("Test"));

    expect(screen.getByText("true")).toBeInTheDocument();
  });

  it("should provide proper isWorkoutStarted", async () => {
    const workout = testService.createWorkout({});
    const dailyData = testService.createDailyData({ workouts: [workout] });

    const TestComponent = () => {
      const { isWorkoutStarted } = useWorkout();
      return <div>{isWorkoutStarted.toString()}</div>;
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    expect(screen.getByText("false")).toBeInTheDocument();
  });

  it("should provide proper uncompeted items", async () => {
    const workout = testService.createWorkout({
      items: [
        testService.createAerobicWorkoutItem({ isCompleted: true }),
        testService.createAerobicWorkoutItem({ isCompleted: false }),
      ],
    });
    const dailyData = testService.createDailyData({ workouts: [workout] });

    const TestComponent = () => {
      const { unCompletedItems } = useWorkout();
      return (
        <>
          {unCompletedItems.map(item => (
            <div key={item.id}>{item.id}</div>
          ))}
        </>
      );
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    workout.items.forEach(item => {
      if (!item.isCompleted) expect(screen.getByText(item.id)).toBeInTheDocument();
    });
  });

  it("should provide proper completed items", async () => {
    const workout = testService.createWorkout({
      items: [
        testService.createAerobicWorkoutItem({ isCompleted: true }),
        testService.createAerobicWorkoutItem({ isCompleted: false }),
      ],
    });
    const dailyData = testService.createDailyData({ workouts: [workout] });

    const TestComponent = () => {
      const { completedItems } = useWorkout();
      return (
        <>
          {completedItems.map(item => (
            <div key={item.id}>{item.id}</div>
          ))}
        </>
      );
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    workout.items.forEach(item => {
      if (item.isCompleted) expect(screen.getByText(item.id)).toBeInTheDocument();
    });
  });

  it("should handle onStart", async () => {
    const workout = testService.createWorkout({});
    const dailyData = testService.createDailyData({ workouts: [] });
    const { updateDailyData } = mockUseUpdateTodayData({});

    const play = vi.fn();
    window.HTMLMediaElement.prototype.play = play;

    const TestComponent = () => {
      const { onStart, isWorkoutStarted } = useWorkout();
      return (
        <>
          <div>{isWorkoutStarted.toString()}</div>
          <div onClick={onStart}>Test</div>
        </>
      );
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    expect(screen.getByText("false")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Test"));
    expect(updateDailyData).toHaveBeenCalled();
    expect(updateDailyData).toHaveBeenCalledWith(
      expect.objectContaining({
        workouts: expect.arrayContaining([
          expect.objectContaining({
            id: workout.id,
          }),
        ]),
      })
    );
    expect(screen.getByText("true")).toBeInTheDocument();
    expect(play).toHaveBeenCalled();
  });

  it("should not add workout to daily data if it already exists", async () => {
    const workout = testService.createWorkout({});
    const dailyData = testService.createDailyData({ workouts: [workout] });
    const { updateDailyData } = mockUseUpdateTodayData({});

    const play = vi.fn();
    window.HTMLMediaElement.prototype.play = play;

    const TestComponent = () => {
      const { onStart, isWorkoutStarted } = useWorkout();
      return (
        <>
          <div>{isWorkoutStarted.toString()}</div>
          <div onClick={onStart}>Test</div>
        </>
      );
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    expect(screen.getByText("false")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Test"));
    expect(updateDailyData).not.toHaveBeenCalled();
    expect(screen.getByText("true")).toBeInTheDocument();
    expect(play).toHaveBeenCalled();
  });

  it("should handle onStartItem", async () => {
    const workout = testService.createWorkout({});
    const dailyData = testService.createDailyData({ workouts: [workout] });
    const { updateDailyData } = mockUseUpdateTodayData({});

    const TestComponent = () => {
      const { onStartItem } = useWorkout();
      return <div onClick={() => onStartItem(workout.items[0])}>Test</div>;
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    fireEvent.click(screen.getByText("Test"));
    expect(updateDailyData).toHaveBeenCalled();
    const arg = updateDailyData.mock.calls[0][0];
    expect(arg.workouts[0].items[0].isStarted).toBe(true);
  });

  it("should call onStartTimer when item is aerobic when onStartitem is called", async () => {
    const workout = testService.createWorkout({
      items: [testService.createAerobicWorkoutItem({})],
    });
    const dailyData = testService.createDailyData({ workouts: [workout] });
    const { updateDailyData } = mockUseUpdateTodayData({});

    const TestComponent = () => {
      const { onStartItem, isRunning } = useWorkout();
      return (
        <>
          <div>{isRunning.toString()}</div>
          <div onClick={() => onStartItem(workout.items[0])}>Test</div>
        </>
      );
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    expect(screen.getByText("false")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Test"));
    expect(updateDailyData).toHaveBeenCalled();
    expect(screen.getByText("true")).toBeInTheDocument();
  });

  it("should not call onStartTimer when item is not aerobic when onStartitem is called", async () => {
    const workout = testService.createWorkout({
      items: [testService.createAnaerobicWorkoutItem({})],
    });
    const dailyData = testService.createDailyData({ workouts: [workout] });
    const { updateDailyData } = mockUseUpdateTodayData({});

    const TestComponent = () => {
      const { onStartItem, isRunning } = useWorkout();
      return (
        <>
          <div>{isRunning.toString()}</div>
          <div onClick={() => onStartItem(workout.items[0])}>Test</div>
        </>
      );
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );
    expect(screen.getByText("false")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Test"));
    expect(updateDailyData).toHaveBeenCalled();
    expect(screen.getByText("false")).toBeInTheDocument();
  });

  it("should handle onCompleteItem", async () => {
    const workout = testService.createWorkout({});
    const dailyData = testService.createDailyData({ workouts: [workout] });
    const { updateDailyData } = mockUseUpdateTodayData({});

    const TestComponent = () => {
      const { onCompleteItem } = useWorkout();
      return <div onClick={() => onCompleteItem(workout.items[0])}>Test</div>;
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );
    fireEvent.click(screen.getByText("Test"));
    expect(updateDailyData).toHaveBeenCalled();
    const arg = updateDailyData.mock.calls[0][0];
    expect(arg.workouts[0].items[0].isCompleted).toBe(true);
  });

  it("should call onCompletedTimer when item is aerobic when onCompleteItem is called", async () => {
    const workout = testService.createWorkout({
      items: [
        testService.createAerobicWorkoutItem({ id: "1", durationInMin: 10 }),
        testService.createAerobicWorkoutItem({ id: "2", durationInMin: 20 }),
      ],
    });
    const dailyData = testService.createDailyData({ workouts: [workout] });
    const { updateDailyData } = mockUseUpdateTodayData({});

    const TestComponent = () => {
      const { onCompleteItem, time } = useWorkout();
      return (
        <>
          <div>{time}</div>
          <div onClick={() => onCompleteItem(workout.items[0])}>Test</div>
        </>
      );
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    expect(screen.getByText("600")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Test"));
    expect(updateDailyData).toHaveBeenCalled();
    expect(screen.getByText("1200")).toBeInTheDocument();
  });

  it("should handle onResetTimer", async () => {
    const workout = testService.createWorkout({
      items: [testService.createAerobicWorkoutItem({ durationInMin: 10 })],
    });
    const dailyData = testService.createDailyData({ workouts: [workout] });

    const TestComponent = () => {
      const { onResetTimer, setTime, time } = useWorkout();
      return (
        <>
          <div>{time}</div>
          <div
            onClick={() => {
              setTime(100);
            }}
          >
            setTime
          </div>
          <div onClick={onResetTimer}>Reset</div>
        </>
      );
    };

    mockUseGetWorkout({ workout });
    mockUseGetTodayData({ dailyData });
    mockUseParams({ id: workout.id });

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    expect(screen.getByText("600")).toBeInTheDocument();

    fireEvent.click(screen.getByText("setTime"));
    expect(screen.getByText("100")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByText("600")).toBeInTheDocument();
  });
});
