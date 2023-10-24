import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { mockUseDayEdit } from "../../../../test/service/mockService";
import { IntakeEdit } from "./IntakeEdit";
import testService from "../../../../test/service/testService";
import { assertNewIntake } from "../../../../test/service/testAssertionService";
import toast from "react-hot-toast";

vi.mock("./DayEditContext");
vi.mock("react-hot-toast");
vi.mock("nspell");

describe("Intake Edit", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render loader when isLoading is true", () => {
    mockUseDayEdit({ isLoading: true });
    render(<IntakeEdit />);

    expect(screen.getByTestId("spinner-loader")).toBeInTheDocument();
  });

  it("should render loader when isLoadingUpdate is true", () => {
    mockUseDayEdit({ isLoadingUpdate: true });
    render(<IntakeEdit />);

    expect(screen.getByTestId("spinner-loader")).toBeInTheDocument();
  });

  it("should render intake item list message when isEditShown is true", () => {
    mockUseDayEdit({});
    render(<IntakeEdit />);

    expect(screen.getByTestId("intake-edit-item-list")).toBeInTheDocument();
  });

  it("should render intake review list when isReviewOpen is true", () => {
    mockUseDayEdit({});
    render(<IntakeEdit />);
    const toggleReviewBtn = screen.getByText("Review");
    fireEvent.click(toggleReviewBtn);

    expect(screen.getByTestId("intake-edit-review-list")).toBeInTheDocument();
  });

  it("should call setIntake with default intake when save later button is clicked", () => {
    const { setIntake, intake } = mockUseDayEdit({});
    render(<IntakeEdit />);
    const saveLaterBtn = screen.getByText("Save Later");
    fireEvent.click(saveLaterBtn);

    const firstArg = setIntake.mock.calls[0][0];

    expect(typeof firstArg).toBe("function");

    const result = firstArg(intake);
    expect(result).toEqual({
      ...intake,
      recordedAt: null,
      isRecorded: false,
    });
  });

  it("should call toggle review when review button is clicked", () => {
    mockUseDayEdit({});
    render(<IntakeEdit />);
    const reviewBtn = screen.getByText("Review");

    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();

    fireEvent.click(reviewBtn);

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.queryByText("Review")).not.toBeInTheDocument();

    fireEvent.click(reviewBtn);

    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it.only("should submit intake when save intake button is clicked", () => {
    const dailyDatWithNoIntakes = { ...testService.createDailyData(), intakes: [] };
    const intake = testService.createIntake({});

    const { dailyData, updateDailyData, setIntake } = mockUseDayEdit({
      dailyData: dailyDatWithNoIntakes,
      intake,
    });

    render(<IntakeEdit />);
    const saveIntakeBtn = screen.getByText("Save Intake");
    fireEvent.click(saveIntakeBtn);

    expect(updateDailyData).toHaveBeenCalledWith({
      ...dailyData,
      intakes: [intake],
    });

    const setIntakeArg = setIntake.mock.calls[0][0];
    assertNewIntake(setIntakeArg);
  });

  it("should not submit intake when dailyData is falsey", () => {
    const { updateDailyData, setIntake } = mockUseDayEdit({
      dailyData: null,
    });

    render(<IntakeEdit />);
    const saveIntakeBtn = screen.getByText("Save Intake");
    fireEvent.click(saveIntakeBtn);

    expect(updateDailyData).not.toHaveBeenCalled();
    expect(setIntake).not.toHaveBeenCalled();
  });

  it("should not submit intake when one of the intake items is invalid and call toast", () => {
    const dailyDatWithNoIntakes = { ...testService.createDailyData(), intakes: [] };
    const intake = testService.createIntake({});
    intake.items[0].name = "";

    const { updateDailyData, setIntake } = mockUseDayEdit({
      dailyData: dailyDatWithNoIntakes,
      intake,
    });

    render(<IntakeEdit />);
    const saveIntakeBtn = screen.getByText("Save Intake");
    fireEvent.click(saveIntakeBtn);

    expect(updateDailyData).not.toHaveBeenCalled();
    expect(setIntake).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });

  it("should set recordedAt to new Date when intake is submitted", () => {
    const dailyDatWithNoIntakes = { ...testService.createDailyData(), intakes: [] };
    const intake = testService.createIntake({});
    intake.recordedAt = null;

    const { updateDailyData } = mockUseDayEdit({
      dailyData: dailyDatWithNoIntakes,
      intake,
    });

    render(<IntakeEdit />);
    const saveIntakeBtn = screen.getByText("Save Intake");
    fireEvent.click(saveIntakeBtn);

    const updatedDailyData = updateDailyData.mock.calls[0][0];
    expect(updatedDailyData.intakes[0].recordedAt).toEqual(expect.any(Date));
  });

  it("should add intake if it is new", () => {
    const dailyDatWithNoIntakes = { ...testService.createDailyData(), intakes: [] };
    const intake = testService.createIntake({});

    const { updateDailyData } = mockUseDayEdit({
      dailyData: dailyDatWithNoIntakes,
      intake,
    });

    render(<IntakeEdit />);
    const saveIntakeBtn = screen.getByText("Save Intake");
    fireEvent.click(saveIntakeBtn);

    const updatedDailyData = updateDailyData.mock.calls[0][0];
    expect(updatedDailyData.intakes.length).toBe(1);
  });

  it("should update intake if it is not new", () => {
    const intake = testService.createIntake({});
    const dailyDataWithIntake = { ...testService.createDailyData(), intakes: [intake] };

    const { updateDailyData } = mockUseDayEdit({
      dailyData: dailyDataWithIntake,
      intake,
    });

    render(<IntakeEdit />);
    const saveIntakeBtn = screen.getByText("Save Intake");
    fireEvent.click(saveIntakeBtn);

    const updatedDailyData = updateDailyData.mock.calls[0][0];
    expect(updatedDailyData.intakes.length).toBe(1);
  });
});
