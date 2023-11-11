import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { mockUseWorkout } from "../../../../test/service/mockService";
import { SecondsCircle } from "./SecondsCircle";

vi.mock("../WorkoutContext");

describe("SecondsCircle", () => {
  beforeEach(() => {
    mockUseWorkout({});
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render correctly with children", () => {
    const childText = "Child Component";
    render(
      <SecondsCircle>
        <div>{childText}</div>
      </SecondsCircle>
    );

    expect(screen.getByText(childText)).toBeInTheDocument();
  });
});

//  can't test styles in vitest, therefore we can't test the background gradient
