import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import testService from "../../../../test/service/testService";
import { IntakePreview } from "./IntakePreview";
import { Intake } from "../../../../../shared/types/intake";
import { mockUseDayEdit } from "../../../../test/service/mockService";
import calorieUtilService from "../../../services/calorieUtil/calorieUtilService";
import { DayData } from "../../../../../shared/types/dayData";
import { ToggledElement } from "./DayEditContext";

vi.mock("./DayEditContext");

describe("Intake Preview", () => {
  const intake = testService.createIntake({}) as Intake;

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render intake preview", () => {
    mockUseDayEdit({});
    render(<IntakePreview intake={intake} />);
    expect(screen.getByTestId("intake-preview")).toBeInTheDocument();
  });

  it("should render intake items", () => {
    mockUseDayEdit({});
    render(<IntakePreview intake={intake} />);

    const items = screen.getAllByTestId("intake-preview-item");
    expect(items.length).toBe(intake.items.length);
  });

  it("should render total calories", () => {
    mockUseDayEdit({});
    render(<IntakePreview intake={intake} />);

    const totalCalories = screen.getByText(
      `total calories: ${calorieUtilService.getTotalCalories(intake)}`
    );
    expect(totalCalories).toBeInTheDocument();
  });

  it("should open modal on delete btn click", () => {
    mockUseDayEdit({});
    render(
      <div id="app">
        <IntakePreview intake={intake} />
      </div>
    );

    const deleteBtn = screen.getByText("Delete");
    fireEvent.click(deleteBtn);
    const modalEl = screen.getByTestId("modal-window");
    expect(modalEl).toBeInTheDocument();
  });

  it("should close modal on cancel btn click", () => {
    mockUseDayEdit({});
    render(
      <div id="app">
        <IntakePreview intake={intake} />
      </div>
    );

    const deleteBtn = screen.getByText("Delete");
    fireEvent.click(deleteBtn);
    const cancelBtn = screen.getByText("Cancel");
    fireEvent.click(cancelBtn);
    const modalEl = screen.queryByTestId("modal-window");
    expect(modalEl).not.toBeInTheDocument();
  });

  it("should call deleteIntake on delete btn click", () => {
    const dailyData: DayData = {
      ...testService.createDailyData(),
      intakes: [intake, { ...intake, id: "intake2" }],
    };

    const { updateDailyData } = mockUseDayEdit({ dailyData });
    render(
      <div id="app">
        <IntakePreview intake={intake} />
      </div>
    );

    const deleteBtn = screen.getByText("Delete");
    fireEvent.click(deleteBtn);
    const confirmBtn = screen.getAllByText("Delete");
    fireEvent.click(confirmBtn[1]);
    expect(updateDailyData).toHaveBeenCalledTimes(1);
    expect(updateDailyData).toHaveBeenCalledWith({
      ...dailyData,
      intakes: [{ ...intake, id: "intake2" }],
    });
  });

  it("should render edit & duplicate button where opened element = IntakeList", () => {
    mockUseDayEdit({ openedElement: ToggledElement.IntakeList });
    render(<IntakePreview intake={intake} />);

    const editBtn = screen.getByText("Edit");
    const duplicateBtn = screen.getByText("duplicate");
    const saveBtn = screen.queryByText("Save");

    expect(editBtn).toBeInTheDocument();
    expect(duplicateBtn).toBeInTheDocument();
    expect(saveBtn).not.toBeInTheDocument();
  });

  it("should render save button where opened element = UnRecordedIntakeList", () => {
    mockUseDayEdit({ openedElement: ToggledElement.UnRecordedIntakeList });
    render(<IntakePreview intake={intake} />);

    const editBtn = screen.queryByText("Edit");
    const duplicateBtn = screen.queryByText("duplicate");
    const saveBtn = screen.getByText("Save");

    expect(editBtn).not.toBeInTheDocument();
    expect(duplicateBtn).not.toBeInTheDocument();
    expect(saveBtn).toBeInTheDocument();
  });

  it("should call handleEditBtnClick on edit btn click", () => {
    const { setIntake, setOpenedElement } = mockUseDayEdit({
      openedElement: ToggledElement.IntakeList,
    });
    render(<IntakePreview intake={intake} />);

    const editBtn = screen.getByText("Edit");
    fireEvent.click(editBtn);

    expect(setIntake).toHaveBeenCalledTimes(1);
    expect(setIntake).toHaveBeenCalledWith(intake);
    expect(setOpenedElement).toHaveBeenCalledTimes(1);
    expect(setOpenedElement).toHaveBeenCalledWith(ToggledElement.IntakeEdit);
  });

  it("should call handleDuplicateBtnClick on duplicate btn click", () => {
    const dailyData = { ...testService.createDailyData(), intakes: [intake] };
    const { updateDailyData } = mockUseDayEdit({
      dailyData,
      openedElement: ToggledElement.IntakeList,
    });
    render(<IntakePreview intake={intake} />);

    const duplicateBtn = screen.getByText("duplicate");
    fireEvent.click(duplicateBtn);

    expect(updateDailyData).toHaveBeenCalledTimes(1);

    const arg = updateDailyData.mock.calls[0][0];
    const { intakes } = arg as DayData;
    expect(intakes.length).toBe(2);
    const [a, b] = intakes;
    expect(a).toEqual(intake);
    expect(b.id).not.toBe(intake.id);
    expect(b.recordedAt).toBeInstanceOf(Date);
    const [itemsA, itemsB] = [a.items, b.items];
    expect(itemsA.length).toBe(itemsB.length);
    itemsA.forEach((item, i) => {
      expect(item).toEqual(itemsB[i]);
    });
  });

  it("should call handleSaveBtnClick on save btn click", () => {
    const dailyData = { ...testService.createDailyData(), intakes: [intake] };
    const { updateDailyData } = mockUseDayEdit({
      dailyData,
      openedElement: ToggledElement.UnRecordedIntakeList,
    });
    render(<IntakePreview intake={intake} />);

    const saveBtn = screen.getByText("Save");
    fireEvent.click(saveBtn);

    expect(updateDailyData).toHaveBeenCalledTimes(1);

    const arg = updateDailyData.mock.calls[0][0];
    const { intakes } = arg as DayData;
    expect(intakes.length).toBe(1);
    const [a] = intakes;
    expect(a).toEqual({ ...intake, isRecorded: true, recordedAt: expect.any(Date) });
  });
});
