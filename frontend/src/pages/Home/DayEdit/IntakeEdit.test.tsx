import { it, describe, expect, afterEach, vi, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {
  mockUseAddFavoriteIntake,
  mockUseDayEdit,
  mockUseGetColorByCalories,
  mockUseUpdateFavoriteIntake,
} from "../../../../test/service/mockService";
import { IntakeEdit } from "./IntakeEdit";
import testService from "../../../../test/service/testService";
import { assertNewIntake } from "../../../../test/service/testAssertionService";
import toast from "react-hot-toast";

vi.mock("./DayEditContext");
vi.mock("react-hot-toast");
vi.mock("../../../hooks/useAddFavoriteIntake");
vi.mock("../../../hooks/useUpdateFavoriteIntake");
vi.mock("../../../hooks/useGetColorByCalories");
vi.mock("nspell");

describe("conditional rendering", () => {
  beforeEach(() => {
    mockUseDayEdit({});
    mockUseAddFavoriteIntake({});
    mockUseUpdateFavoriteIntake({});
    mockUseGetColorByCalories({});
  });

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

  it("should render loader when isLoadingAddToFav is true", () => {
    mockUseAddFavoriteIntake({ isLoading: true });
    render(<IntakeEdit />);

    expect(screen.getByTestId("spinner-loader")).toBeInTheDocument();
  });

  it("should render loader when isLoadingUpdateFav is true", () => {
    mockUseUpdateFavoriteIntake({ isLoading: true });
    render(<IntakeEdit />);

    expect(screen.getByTestId("spinner-loader")).toBeInTheDocument();
  });

  it("should render intake item list and header when isLoading is false", () => {
    render(<IntakeEdit />);

    expect(screen.getByTestId("intake-edit-item-list")).toBeInTheDocument();
    expect(screen.getByTestId("intake-edit-header")).toBeInTheDocument();
  });

  it("should render info container and button container always", () => {
    const { rerender } = render(<IntakeEdit />);

    expect(screen.getByTestId("intake-edit-info-container")).toBeInTheDocument();
    expect(screen.getByTestId("intake-edit-btns-container")).toBeInTheDocument();

    mockUseDayEdit({ isLoading: true });
    rerender(<IntakeEdit />);

    expect(screen.getByTestId("intake-edit-info-container")).toBeInTheDocument();
    expect(screen.getByTestId("intake-edit-btns-container")).toBeInTheDocument();
  });
});

describe("Header", () => {
  beforeEach(() => {
    mockUseDayEdit({});
    mockUseAddFavoriteIntake({});
    mockUseUpdateFavoriteIntake({});
    mockUseGetColorByCalories({});
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render name input with intake name", () => {
    const { intake } = mockUseDayEdit({});
    render(<IntakeEdit />);

    const nameInput = screen.getByPlaceholderText("Name your intake") as HTMLInputElement;
    expect(nameInput.value).toBe(intake.name);
  });

  it("should render type button with intake type", () => {
    const { intake } = mockUseDayEdit({});
    render(<IntakeEdit />);

    const typeBtn = screen.getByText(intake.type);
    expect(typeBtn).toBeInTheDocument();
  });

  it("should render time input with intake recordedAt", () => {
    function toLocalTime(isoString: string) {
      const date = new Date(isoString);
      const timezoneOffsetMinutes = date.getTimezoneOffset();
      date.setMinutes(date.getMinutes() - timezoneOffsetMinutes);
      return date.toISOString().slice(11, 16);
    }

    const intake = testService.createIntake({ isRecorded: true, recordedAt: new Date() });
    mockUseDayEdit({ intake });
    render(<IntakeEdit />);

    const timeInput = screen.getByTestId("intake-edit-time-input") as HTMLInputElement;
    const expectedValue = toLocalTime(intake.recordedAt as string);
    expect(timeInput.value).toBe(expectedValue);
  });

  it("should not render time input when intake is not recorded", () => {
    const intake = testService.createIntake({ isRecorded: false });
    mockUseDayEdit({ intake });
    render(<IntakeEdit />);

    const timeInput = screen.queryByTestId("intake-edit-time-input");
    expect(timeInput).not.toBeInTheDocument();
  });

  it("should call handleIntakeNameInputChange when name input is changed", () => {
    const { setIntake, intake } = mockUseDayEdit({});
    render(<IntakeEdit />);
    fireEvent.change(screen.getByTestId("intake-edit-name-input"), { target: { value: "test2" } });

    expect(setIntake).toHaveBeenCalled();

    const firstCall = setIntake.mock.calls[0][0];
    expect(typeof firstCall).toBe("function");
    const result = firstCall({ ...intake, name: "test2" });
    expect(result).toEqual({
      ...intake,
      name: "test2",
    });
  });

  it("should call handleToggleIntakeType when type button is clicked", () => {
    const intake = testService.createIntake({ type: "food" });
    const setIntake = vi.fn();
    mockUseDayEdit({ intake, setIntake });
    const { rerender } = render(<IntakeEdit />);
    fireEvent.click(screen.getByText(intake.type));

    expect(setIntake).toHaveBeenCalled();

    const firstCall = setIntake.mock.calls[0][0];
    expect(typeof firstCall).toBe("function");
    const result = firstCall({ ...intake, type: "drink" });
    expect(result).toEqual({
      ...intake,
      type: "drink",
    });

    intake.type = "drink";
    mockUseDayEdit({ intake, setIntake });
    rerender(<IntakeEdit />);
    fireEvent.click(screen.getByText(intake.type));

    const secondCall = setIntake.mock.calls[1][0];
    expect(typeof secondCall).toBe("function");
    const result2 = secondCall({ ...intake, type: "food" });
    expect(result2).toEqual({
      ...intake,
      type: "food",
    });
  });

  it("should call handleTimeInputChange when time input is changed", () => {
    const intake = testService.createIntake({
      isRecorded: true,
      recordedAt: new Date("2021-01-01T10:00"),
    });
    const setIntake = vi.fn();
    mockUseDayEdit({ intake, setIntake });
    const { rerender } = render(<IntakeEdit />);
    const value = "12:00";
    const dateWithValue = new Date(intake.recordedAt as Date);
    dateWithValue.setHours(+value.split(":")[0]);
    fireEvent.change(screen.getByTestId("intake-edit-time-input"), { target: { value } });

    expect(setIntake).toHaveBeenCalled();

    const firstCall = setIntake.mock.calls[0][0];
    expect(typeof firstCall).toBe("function");
    const result = firstCall({ ...intake, recordedAt: dateWithValue });
    expect(result).toEqual({
      ...intake,
      recordedAt: dateWithValue,
    });

    intake.recordedAt = dateWithValue;
    mockUseDayEdit({ intake, setIntake });
    rerender(<IntakeEdit />);
    const value2 = "13:00";
    const dateWithValue2 = new Date(intake.recordedAt);
    dateWithValue2.setHours(+value2.split(":")[0]);

    fireEvent.change(screen.getByTestId("intake-edit-time-input"), {
      target: { value: value2 },
    });

    const secondCall = setIntake.mock.calls[1][0];
    expect(typeof secondCall).toBe("function");
    const result2 = secondCall({ ...intake, recordedAt: dateWithValue2 });
    expect(result2).toEqual({
      ...intake,
      recordedAt: dateWithValue2,
    });
  });
});

describe("Buttons Container", () => {
  beforeEach(() => {
    mockUseDayEdit({});
    mockUseAddFavoriteIntake({});
    mockUseUpdateFavoriteIntake({});
    mockUseGetColorByCalories({});
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should  call setIntake with default intake when clear button is clicked", () => {
    const { setIntake } = mockUseDayEdit({});
    render(<IntakeEdit />);

    const clearBtn = screen.getByText("clear");
    fireEvent.click(clearBtn);

    const result = setIntake.mock.calls[0][0];
    assertNewIntake(result);
  });

  describe("Save To Favorite Button", () => {
    beforeEach(() => {
      mockUseDayEdit({});
      mockUseAddFavoriteIntake({});
      mockUseUpdateFavoriteIntake({});
      mockUseGetColorByCalories({});
    });

    afterEach(() => {
      cleanup();
      vi.resetAllMocks();
    });

    it("should call addFavoriteIntake when intake is new", () => {
      const { intake } = mockUseDayEdit({});
      delete intake.userId;
      const { addFavoriteIntake } = mockUseAddFavoriteIntake({});
      render(<IntakeEdit />);

      const saveToFavBtn = screen.getByText("Save To Fav");
      fireEvent.click(saveToFavBtn);

      expect(addFavoriteIntake).toHaveBeenCalledWith(intake);
    });

    it("should call updateFavoriteIntake when intake is not new", () => {
      const intake = testService.createIntake({ userId: "1" });
      const { updateFavoriteIntake } = mockUseUpdateFavoriteIntake({});
      mockUseDayEdit({ intake });
      render(<IntakeEdit />);

      const saveToFavBtn = screen.getByText("Save To Fav");
      fireEvent.click(saveToFavBtn);

      expect(updateFavoriteIntake).toHaveBeenCalledWith(intake);
    });

    it("should call toast when intake is not new and userId is not defined", () => {
      const intake = testService.createIntake({});
      intake.items[0].name = "";
      const { updateFavoriteIntake } = mockUseUpdateFavoriteIntake({});
      mockUseDayEdit({ intake });
      render(<IntakeEdit />);

      const saveToFavBtn = screen.getByText("Save To Fav");
      fireEvent.click(saveToFavBtn);

      expect(updateFavoriteIntake).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalled();
    });

    it("should set recordedAt to null and isRevorded to false when intake is submitted", () => {
      const intake = testService.createIntake({});
      const { updateFavoriteIntake } = mockUseUpdateFavoriteIntake({});
      mockUseDayEdit({ intake });
      render(<IntakeEdit />);

      const saveToFavBtn = screen.getByText("Save To Fav");
      fireEvent.click(saveToFavBtn);

      const updatedIntake = updateFavoriteIntake.mock.calls[0][0];
      expect(updatedIntake.recordedAt).toBeNull();
      expect(updatedIntake.isRecorded).toBe(false);
    });
  });

  it("should call setIntake with and toggle isRecorded value when save later button is clicked", () => {
    const intake = testService.createIntake({ isRecorded: true });
    const setIntake = vi.fn();
    mockUseDayEdit({ setIntake, intake });
    const { rerender } = render(<IntakeEdit />);
    const saveLaterBtn = screen.getByText("Save Later");
    fireEvent.click(saveLaterBtn);

    const firstArg = setIntake.mock.calls[0][0];
    expect(typeof firstArg).toBe("function");
    const result = firstArg(intake);
    expect(result).toEqual({ ...intake, recordedAt: null, isRecorded: false });

    intake.isRecorded = false;
    mockUseDayEdit({ intake, setIntake });
    rerender(<IntakeEdit />);
    fireEvent.click(saveLaterBtn);

    const secondArg = setIntake.mock.calls[1][0];
    expect(typeof secondArg).toBe("function");
    const result2 = secondArg(intake);
    expect(result2).toEqual({ ...intake, recordedAt: expect.any(Date), isRecorded: true });
  });

  describe("Save Intake Button", () => {
    it("should submit intake when save intake button is clicked", () => {
      const dailyDatWithNoIntakes = { ...testService.createDailyData({}), intakes: [] };
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
      const dailyDatWithNoIntakes = { ...testService.createDailyData({}), intakes: [] };
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
      const dailyDatWithNoIntakes = { ...testService.createDailyData({}), intakes: [] };
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
      const dailyDatWithNoIntakes = { ...testService.createDailyData({}), intakes: [] };
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
      const dailyDataWithIntake = { ...testService.createDailyData({}), intakes: [intake] };

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
});
