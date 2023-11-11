import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { mockUseWorkoutEdit } from "../../../test/service/mockService";
import { WorkoutItemEdit } from "./WorkoutItemEdit";
import testService from "../../../test/service/testService";
import { WeightUnit } from "../../../../shared/types/workout";

vi.mock("./WorkoutEditContext");
vi.mock("react-redux");

describe("WorkoutItemEdit", () => {
  const workoutItem = testService.createAerobicWorkoutItem({});

  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    mockUseWorkoutEdit({ currItemId: workoutItem.id });
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render mini workout item preview when item id is not currItemId", () => {
    mockUseWorkoutEdit({ currItemId: "notCurrItemId" });
    render(<WorkoutItemEdit item={workoutItem} />);
    expect(screen.getByTestId("mini-workout-item-preview")).toBeInTheDocument();
  });

  it("should call setCurrItemId when clicking on mini preview", () => {
    const { setCurrItemId } = mockUseWorkoutEdit({ currItemId: "notCurrItemId" });
    render(<WorkoutItemEdit item={workoutItem} />);
    fireEvent.click(screen.getByTestId("mini-workout-item-preview"));
    expect(setCurrItemId).toHaveBeenCalledWith(workoutItem.id);
  });

  it("should render workout item edit when item id is currItemId", () => {
    render(<WorkoutItemEdit item={workoutItem} />);
    expect(screen.getByTestId("workout-item-edit")).toBeInTheDocument();
  });

  it("should render workout item name input", () => {
    render(<WorkoutItemEdit item={workoutItem} />);
    expect(screen.getByTestId("workout-item-name-input")).toBeInTheDocument();
  });

  it("should render duration input if workout type is aerobic", () => {
    render(<WorkoutItemEdit item={workoutItem} />);
    expect(screen.getByText("Duration (in min):")).toBeInTheDocument();
  });

  it("should render sets and rest inputs if workout type is not aerobic", () => {
    const workoutItem = testService.createAnaerobicWorkoutItem({});
    render(<WorkoutItemEdit item={workoutItem} />);
    expect(screen.getByText("Sets:")).toBeInTheDocument();
    expect(screen.getByText("Rest (in sec):")).toBeInTheDocument();
  });

  it("should render reps, weight and weight unit inputs if workout type is anaerobic", () => {
    const workoutItem = testService.createAnaerobicWorkoutItem({});
    render(<WorkoutItemEdit item={workoutItem} />);
    expect(screen.getByText("reps:")).toBeInTheDocument();
    expect(screen.getByText("weight:")).toBeInTheDocument();
    expect(screen.getByText("weight unit:")).toBeInTheDocument();
  });

  it("should render superset item list", () => {
    const workoutItem = testService.createSupersetWorkoutItem({
      items: [
        testService.createSupersetItem({
          name: "test1",
          reps: 1,
          weight: 10,
          weightUnit: WeightUnit.KG,
        }),
        testService.createSupersetItem({
          name: "test2",
          reps: 2,
          weight: 20,
          weightUnit: WeightUnit.LBS,
        }),
      ],
    });
    render(<WorkoutItemEdit item={workoutItem} />);
    expect(screen.getByTestId("superset-item-list")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20")).toBeInTheDocument();
    expect(screen.getByText(WeightUnit.KG)).toBeInTheDocument();
    expect(screen.getByText(WeightUnit.LBS)).toBeInTheDocument();
    const deleteBtns = screen.getAllByTestId("delete-superset-item-btn");
    expect(deleteBtns).toHaveLength(2);
  });

  it("should render delete button", () => {
    render(<WorkoutItemEdit item={workoutItem} />);
    expect(screen.getByTestId("delete-workout-item-btn")).toBeInTheDocument();
  });

  it("should render add iten when item is superset type", () => {
    const workoutItem = testService.createSupersetWorkoutItem({});
    render(<WorkoutItemEdit item={workoutItem} />);
    expect(screen.getByTestId("add-superset-item-btn")).toBeInTheDocument();
  });

  it("should handle item name change", () => {
    const { updateWorkout } = mockUseWorkoutEdit({ currItemId: workoutItem.id });

    render(<WorkoutItemEdit item={workoutItem} />);
    fireEvent.change(screen.getByTestId("workout-item-name-input"), {
      target: { value: "new name" },
    });
    vi.advanceTimersByTime(250);
    expect(updateWorkout).toHaveBeenCalled();
    const arg = updateWorkout.mock.calls[0][0];
    expect(arg.items[0].name).toBe("new name");
  });

  it("should handle duration change", () => {
    const { updateWorkout } = mockUseWorkoutEdit({ currItemId: workoutItem.id });

    render(<WorkoutItemEdit item={workoutItem} />);
    fireEvent.change(screen.getByTestId("workout-item-duration-input"), {
      target: { value: "10" },
    });
    vi.advanceTimersByTime(250);
    expect(updateWorkout).toHaveBeenCalled();
    const arg = updateWorkout.mock.calls[0][0];
    expect(arg.items[0].durationInMin).toBe(10);
  });

  it("should handle sets change", () => {
    const workoutItem = testService.createAnaerobicWorkoutItem({});
    const { updateWorkout } = mockUseWorkoutEdit({ currItemId: workoutItem.id });

    render(<WorkoutItemEdit item={workoutItem} />);
    fireEvent.change(screen.getByTestId("workout-item-sets-input"), {
      target: { value: "10" },
    });
    vi.advanceTimersByTime(250);
    expect(updateWorkout).toHaveBeenCalled();
    const arg = updateWorkout.mock.calls[0][0];
    expect(arg.items[0].sets).toBe(10);
  });

  it("should handle rest change", () => {
    const workoutItem = testService.createAnaerobicWorkoutItem({});
    const { updateWorkout } = mockUseWorkoutEdit({ currItemId: workoutItem.id });

    render(<WorkoutItemEdit item={workoutItem} />);
    fireEvent.change(screen.getByTestId("workout-item-rest-input"), {
      target: { value: "10" },
    });
    vi.advanceTimersByTime(250);
    expect(updateWorkout).toHaveBeenCalled();
    const arg = updateWorkout.mock.calls[0][0];
    expect(arg.items[0].restInSec).toBe(10);
  });

  it("should handle reps change", () => {
    const workoutItem = testService.createAnaerobicWorkoutItem({});
    const { updateWorkout } = mockUseWorkoutEdit({ currItemId: workoutItem.id });

    render(<WorkoutItemEdit item={workoutItem} />);
    fireEvent.change(screen.getByTestId("workout-item-reps-input"), {
      target: { value: "10" },
    });
    vi.advanceTimersByTime(250);
    expect(updateWorkout).toHaveBeenCalled();
    const arg = updateWorkout.mock.calls[0][0];
    expect(arg.items[0].reps).toBe(10);
  });

  it("should handle weight change", () => {
    const workoutItem = testService.createAnaerobicWorkoutItem({});
    const { updateWorkout } = mockUseWorkoutEdit({ currItemId: workoutItem.id });

    render(<WorkoutItemEdit item={workoutItem} />);
    fireEvent.change(screen.getByTestId("workout-item-weight-input"), {
      target: { value: "10" },
    });
    vi.advanceTimersByTime(250);
    expect(updateWorkout).toHaveBeenCalled();
    const arg = updateWorkout.mock.calls[0][0];
    expect(arg.items[0].weight).toBe(10);
  });

  it("should handle weight unit change", () => {
    const workoutItem = testService.createAnaerobicWorkoutItem({
      weightUnit: WeightUnit.LBS,
    });
    const { updateWorkout } = mockUseWorkoutEdit({ currItemId: workoutItem.id });

    render(<WorkoutItemEdit item={workoutItem} />);
    fireEvent.click(screen.getByText(WeightUnit.LBS));
    fireEvent.click(screen.getByText(WeightUnit.KG));
    expect(updateWorkout).toHaveBeenCalled();
    const arg = updateWorkout.mock.calls[0][0];
    expect(arg.items[0].weightUnit).toBe(WeightUnit.KG);
  });

  it("should handle superset item name change", () => {
    const workoutItem = testService.createSupersetWorkoutItem({
      items: [testService.createSupersetItem({ name: "test" })],
    });
    const { updateWorkout } = mockUseWorkoutEdit({ currItemId: workoutItem.id });

    render(<WorkoutItemEdit item={workoutItem} />);
    fireEvent.change(screen.getByTestId("superset-item-name-input"), {
      target: { value: "new name" },
    });
    vi.advanceTimersByTime(250);
    expect(updateWorkout).toHaveBeenCalled();
    const arg = updateWorkout.mock.calls[0][0];
    expect(arg.items[0].items[0].name).toBe("new name");
  });

  it("should handle superset item reps change", () => {
    const workoutItem = testService.createSupersetWorkoutItem({
      items: [testService.createSupersetItem({ reps: 1 })],
    });
    const { updateWorkout } = mockUseWorkoutEdit({ currItemId: workoutItem.id });

    render(<WorkoutItemEdit item={workoutItem} />);
    fireEvent.change(screen.getByTestId("superset-item-reps-input"), {
      target: { value: "10" },
    });
    vi.advanceTimersByTime(250);
    expect(updateWorkout).toHaveBeenCalled();
    const arg = updateWorkout.mock.calls[0][0];
    expect(arg.items[0].items[0].reps).toBe(10);
  });

  it("should handle superset item weight change", () => {
    const workoutItem = testService.createSupersetWorkoutItem({
      items: [testService.createSupersetItem({ weight: 1 })],
    });
    const { updateWorkout } = mockUseWorkoutEdit({ currItemId: workoutItem.id });

    render(<WorkoutItemEdit item={workoutItem} />);
    fireEvent.change(screen.getByTestId("superset-item-weight-input"), {
      target: { value: "10" },
    });
    vi.advanceTimersByTime(250);
    expect(updateWorkout).toHaveBeenCalled();
    const arg = updateWorkout.mock.calls[0][0];
    expect(arg.items[0].items[0].weight).toBe(10);
  });

  it("should handle superset item weight unit change", () => {
    const workoutItem = testService.createSupersetWorkoutItem({
      items: [testService.createSupersetItem({ weightUnit: WeightUnit.LBS })],
    });
    const { updateWorkout } = mockUseWorkoutEdit({ currItemId: workoutItem.id });

    render(<WorkoutItemEdit item={workoutItem} />);

    fireEvent.click(screen.getByText(WeightUnit.LBS));
    fireEvent.click(screen.getByText(WeightUnit.KG));
    expect(updateWorkout).toHaveBeenCalled();
    const arg = updateWorkout.mock.calls[0][0];
    expect(arg.items[0].items[0].weightUnit).toBe(WeightUnit.KG);
  });

  it("should handle delete superset item", () => {
    const workoutItem = testService.createSupersetWorkoutItem({
      items: [
        testService.createSupersetItem({
          id: "item1",
        }),
      ],
    });
    const { removeWorkoutItemFromSuperset } = mockUseWorkoutEdit({ currItemId: workoutItem.id });

    render(<WorkoutItemEdit item={workoutItem} />);

    fireEvent.click(screen.getAllByTestId("delete-superset-item-btn")[0]);
    expect(removeWorkoutItemFromSuperset).toHaveBeenCalled();
    expect(removeWorkoutItemFromSuperset).toHaveBeenCalledWith(
      workoutItem.id,
      workoutItem.items[0].id
    );
  });

  it("should handle delete workout item", () => {
    const { removeWorkoutItem } = mockUseWorkoutEdit({ currItemId: workoutItem.id });

    render(<WorkoutItemEdit item={workoutItem} />);

    fireEvent.click(screen.getByTestId("delete-workout-item-btn"));
    expect(removeWorkoutItem).toHaveBeenCalled();
    expect(removeWorkoutItem).toHaveBeenCalledWith(workoutItem.id);
  });

  it("should handle add superset item", () => {
    const workoutItem = testService.createSupersetWorkoutItem({});
    const { addWorkoutItemToSuperset } = mockUseWorkoutEdit({ currItemId: workoutItem.id });

    render(<WorkoutItemEdit item={workoutItem} />);

    fireEvent.click(screen.getByTestId("add-superset-item-btn"));
    expect(addWorkoutItemToSuperset).toHaveBeenCalled();
    expect(addWorkoutItemToSuperset).toHaveBeenCalledWith(workoutItem);
  });
});
