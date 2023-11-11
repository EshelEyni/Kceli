import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { mockUseWorkout } from "../../../../test/service/mockService";
import { ItemDurationCircle } from "./ItemDurationCircle";

vi.mock("../WorkoutContext");

describe("ItemDurationCircle", () => {
  const mockInitialTime = 60;
  const mockTime = 30;
  const isRunning = true;

  beforeEach(() => {
    mockUseWorkout({
      initialTime: mockInitialTime,
      time: mockTime,
      isRunning: isRunning,
    });
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("renders correctly with children", () => {
    const childText = "Child Component";
    render(
      <ItemDurationCircle>
        <div>{childText}</div>
      </ItemDurationCircle>
    );

    expect(screen.getByText(childText)).toBeInTheDocument();
  });
});

//  can't test styles in vitest, therefore we can't test the background gradient
