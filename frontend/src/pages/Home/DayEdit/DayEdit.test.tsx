import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {
  mockUseDayEdit,
  mockUseDeleteWorkout,
  mockUseNavigate,
} from "../../../../test/service/mockService";
import { DayEdit } from "./DayEdit";
import testService from "../../../../test/service/testService";

vi.mock("./DayEditContext");
vi.mock("../../../hooks/useDeleteWorkout");
vi.mock("react-router-dom");
vi.mock("nspell");

describe("Day Edit", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render loader when isLoading is true", () => {
    mockUseDayEdit({ isLoading: true });
    render(<DayEdit />);

    expect(screen.getByTestId("spinner-loader")).toBeInTheDocument();
  });

  it("should render error msg when isError is true", () => {
    mockUseDayEdit({ isError: true });
    render(<DayEdit />);

    expect(screen.getByTestId("error-msg")).toBeInTheDocument();
  });

  it("should render content when showContent is true", () => {
    mockUseDayEdit({
      isSuccess: true,
      dailyData: testService.createDailyData({}),
      isLoadingUpdate: false,
    });

    render(<DayEdit />);

    expect(screen.getByTestId("day-edit-header")).toBeInTheDocument();
  });

  it("should render weight waist input when openedTab is WeightWaistInput", () => {
    mockUseDayEdit({
      isSuccess: true,
      dailyData: testService.createDailyData({}),
      isLoadingUpdate: false,
      openedTab: "WeightWaistInput",
    });

    render(<DayEdit />);

    expect(screen.getByTestId("weight-waist-details")).toBeInTheDocument();
  });

  it("should render intake edit when openedTab is IntakeEdit", () => {
    mockUseDayEdit({
      isSuccess: true,
      dailyData: testService.createDailyData({}),
      isLoadingUpdate: false,
      openedTab: "IntakeEdit",
    });

    render(<DayEdit />);

    expect(screen.getByTestId("intake-edit")).toBeInTheDocument();
  });

  it("should render workout list when openedTab is Workouts", () => {
    mockUseDeleteWorkout({});
    mockUseNavigate();
    mockUseDayEdit({
      isSuccess: true,
      dailyData: testService.createDailyData({}),
      isLoadingUpdate: false,
      openedTab: "Workouts",
    });

    render(<DayEdit />);
    const workoutPreviews = screen.getAllByTestId("workout-preview");
    expect(workoutPreviews.length).toBeGreaterThan(0);
  });

  it("should render intake list when openedTab is IntakeList", () => {
    mockUseDayEdit({
      isSuccess: true,
      dailyData: testService.createDailyData({}),
      isLoadingUpdate: false,
      openedTab: "IntakeList",
    });

    render(<DayEdit />);

    expect(screen.getByTestId("intake-list-header")).toBeInTheDocument();
  });

  it("should render unrecorded intake list when openedTab is UnRecordedIntakeList", () => {
    mockUseDayEdit({
      isSuccess: true,
      dailyData: testService.createDailyData({}),
      isLoadingUpdate: false,
      openedTab: "UnRecordedIntakeList",
    });

    render(<DayEdit />);

    expect(screen.getByTestId("intake-list-header")).toBeInTheDocument();
  });

  it("should render favorite intake list when openedTab is FavoriteIntakeList", () => {
    mockUseDayEdit({
      isSuccess: true,
      dailyData: testService.createDailyData({}),
      isLoadingUpdate: false,
      openedTab: "FavoriteIntake",
    });

    render(<DayEdit />);

    expect(screen.getByTestId("day-edit-favorite-intakes")).toBeInTheDocument();
  });

  it("should render nutrition query when openedTab is Query", () => {
    mockUseDayEdit({
      isSuccess: true,
      dailyData: testService.createDailyData({}),
      isLoadingUpdate: false,
      openedTab: "Query",
    });

    render(<DayEdit />);

    expect(screen.getByTestId("nutrition-query")).toBeInTheDocument();
  });

  it("should render water edit when openedTab is Water", () => {
    mockUseDayEdit({
      isSuccess: true,
      dailyData: testService.createDailyData({}),
      isLoadingUpdate: false,
      openedTab: "Water",
    });

    render(<DayEdit />);

    expect(screen.getByTestId("water-edit")).toBeInTheDocument();
  });
});
