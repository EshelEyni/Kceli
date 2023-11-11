import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { TotalDurationCircle } from "./TotalDurationCircle";
import { mockUseWorkout } from "../../../../test/service/mockService";

vi.mock("../WorkoutContext");

describe("TotalDurationCircle", () => {
  const mockDuration = 100;
  const mockCompletedDuration = 50;

  beforeEach(() => {
    mockUseWorkout({
      duration: mockDuration,
      completedDuration: mockCompletedDuration,
    });
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("renders correctly with children", () => {
    const childText = "Child Component";
    render(
      <TotalDurationCircle>
        <div>{childText}</div>
      </TotalDurationCircle>
    );

    expect(screen.getByText(childText)).toBeInTheDocument();
  });
});

//  can't test styles in vitest, therefore we can't test the background gradient
