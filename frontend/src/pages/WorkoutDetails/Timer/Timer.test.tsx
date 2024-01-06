/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Timer } from "./Timer";
import { mockUseWorkout } from "../../../../test/service/mockService";
import { getTimeCount } from "../../../services/util/utilService";

vi.mock("../WorkoutContext");

describe("WorkoutItemDisplay", () => {
  beforeEach(() => {
    mockUseWorkout({});
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render", () => {
    render(<Timer />);
    expect(screen.getByTestId("timer")).toBeInTheDocument();
  });

  it("should toggle isRunning state when the play/pause button is clicked", () => {
    const { setIsRunning: setIsRunning1 } = mockUseWorkout({ isRunning: false });
    const { rerender } = render(<Timer />);

    expect(screen.getByTestId("play-icon")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("play-icon"));
    expect(setIsRunning1).toHaveBeenCalled();

    const { setIsRunning: setIsRunning2 } = mockUseWorkout({ isRunning: true });

    rerender(<Timer />);
    expect(screen.getByTestId("pause-icon")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("pause-icon"));
    expect(setIsRunning2).toHaveBeenCalled();
  });

  it("should reset timer when the clear button is clicked", () => {
    const { setInitialTime, setTime, setIsRunning } = mockUseWorkout({ initialTime: 0 });
    render(<Timer />);

    fireEvent.click(screen.getByTestId("clear-icon"));
    expect(setInitialTime).toHaveBeenCalledWith(0);
    expect(setTime).toHaveBeenCalledWith(0);
    expect(setIsRunning).toHaveBeenCalledWith(false);
  });

  it("should increment timer when the increment button is clicked", () => {
    const { setTime, setInitialTime } = mockUseWorkout({ time: 0, initialTime: 0 });
    render(<Timer />);

    fireEvent.click(screen.getByTestId("increment-icon"));
    expect(setTime).toHaveBeenCalled();
    expect(setInitialTime).toHaveBeenCalled();
  });

  it("should reset timer when the reset button is clicked", () => {
    const { onResetTimer } = mockUseWorkout({ time: 0, initialTime: 0 });
    render(<Timer />);

    fireEvent.click(screen.getByTestId("reset-icon"));
    expect(onResetTimer).toHaveBeenCalled();
  });

  it("should display the correct time", () => {
    const { time } = mockUseWorkout({ time: 10 });
    const expectedTime = getTimeCount(time!);
    render(<Timer />);

    expect(screen.getByText(expectedTime)).toBeInTheDocument();
  });

  it("should display the correct time when time is less than 0", () => {
    const { time } = mockUseWorkout({ time: -9 });
    const expectedTime = getTimeCount(time!);
    render(<Timer />);

    expect(screen.getByText(expectedTime)).toBeInTheDocument();
  });

  it("should handle useEffect correctly", () => {
    const play = vi.fn();
    window.HTMLMediaElement.prototype.play = play;
    vi.useFakeTimers();
    const { setTime: setTime1 } = mockUseWorkout({ isRunning: true });

    const { rerender } = render(<Timer />);

    vi.advanceTimersByTime(10);
    expect(setTime1).toHaveBeenCalledWith(expect.any(Function));

    const { setTime: setTime2, setIsRunning } = mockUseWorkout({ isRunning: true, time: 0 });
    rerender(<Timer />);
    vi.advanceTimersByTime(20);
    expect(setTime2).toHaveBeenCalled();
    const fnCall = setTime2.mock.calls[0][0];
    fnCall();
    expect(setIsRunning).toHaveBeenCalledWith(false);
    expect(play).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
