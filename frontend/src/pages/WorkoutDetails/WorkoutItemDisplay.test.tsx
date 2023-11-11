import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { WorkoutItemDisplay } from "./WorkoutItemDisplay";
import testService from "../../../test/service/testService";
import { mockUseWorkout } from "../../../test/service/mockService";

vi.mock("./WorkoutContext");

describe("WorkoutItemDisplay", () => {
  beforeEach(() => {
    mockUseWorkout({});
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render workout item info", () => {
    const item = testService.createAerobicWorkoutItem({});
    render(<WorkoutItemDisplay item={item} />);
    expect(screen.getByTestId("workout-item-display-info")).toBeInTheDocument();
  });

  it("should render workout item info title", () => {
    const item = testService.createAerobicWorkoutItem({});
    render(<WorkoutItemDisplay item={item} />);
    expect(screen.getByTestId("workout-item-display-info-title")).toBeInTheDocument();
  });

  it("should render superset item list", () => {
    const item = testService.createSupersetWorkoutItem({});
    render(<WorkoutItemDisplay item={item} />);
    expect(screen.getByTestId("workout-item-display-info-superset-set-list")).toBeInTheDocument();
  });

  it("should render buttons when workout item === currItem and isWorkoutStarted is true", () => {
    const item = testService.createAerobicWorkoutItem({});
    mockUseWorkout({ currItem: item, isWorkoutStarted: true });

    render(<WorkoutItemDisplay item={item} />);
    expect(screen.getByTestId("workout-item-display-btns-container")).toBeInTheDocument();
  });

  it("should render start button when workout item is not started", () => {
    const item = testService.createAerobicWorkoutItem({});
    mockUseWorkout({ currItem: item, isWorkoutStarted: true });

    render(<WorkoutItemDisplay item={item} />);
    expect(screen.getByText("start")).toBeInTheDocument();
  });

  it("should render complete button when workout item is started and not completed", () => {
    const item = testService.createAerobicWorkoutItem({ isStarted: true, isCompleted: false });
    mockUseWorkout({ currItem: item, isWorkoutStarted: true });

    render(<WorkoutItemDisplay item={item} />);
    expect(screen.getByText("complete")).toBeInTheDocument();
  });
});
