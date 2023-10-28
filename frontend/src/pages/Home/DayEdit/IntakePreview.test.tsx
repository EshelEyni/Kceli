/* eslint-disable @typescript-eslint/no-explicit-any */
import { it, describe, expect, afterEach, vi, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import testService from "../../../../test/service/testService";
import { IntakePreview } from "./IntakePreview";
import { Intake } from "../../../../../shared/types/intake";
import {
  mockUseAddFavoriteIntake,
  mockUseDayEdit,
  mockUseDeleteFavoriteIntake,
} from "../../../../test/service/mockService";
import calorieUtilService from "../../../services/calorieUtil/calorieUtilService";
import { DayData } from "../../../../../shared/types/dayData";
import { DayEditTab } from "./DayEditContext";

vi.mock("./DayEditContext");
vi.mock("../../../hooks/useAddFavoriteIntake");
vi.mock("../../../hooks/useDeleteFavoriteIntake");

describe("Conditional rendering", () => {
  const intake = testService.createIntake({}) as Intake;

  beforeEach(() => {
    mockUseDeleteFavoriteIntake({});
    mockUseAddFavoriteIntake({});
    mockUseDayEdit({});
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render intake preview", () => {
    render(<IntakePreview intake={intake} />);
    expect(screen.getByTestId("intake-preview")).toBeInTheDocument();
  });

  it("should render intake items", () => {
    render(<IntakePreview intake={intake} />);

    const items = screen.getAllByTestId("intake-preview-item");
    expect(items.length).toBe(intake.items.length);
  });

  it("should render total calories", () => {
    render(<IntakePreview intake={intake} />);

    const totalCalories = screen.getByText(
      `total calories: ${calorieUtilService.getTotalCalories(intake)}`
    );
    expect(totalCalories).toBeInTheDocument();
  });

  it("should render delete button", () => {
    render(<IntakePreview intake={intake} />);

    const deleteBtn = screen.getByText("Delete");
    expect(deleteBtn).toBeInTheDocument();
  });

  it("should render edit button when openedTab = FavoriteIntake", () => {
    mockUseDayEdit({ openedTab: DayEditTab.FavoriteIntake });

    render(<IntakePreview intake={intake} />);

    const editBtn = screen.getByText("Edit");
    expect(editBtn).toBeInTheDocument();
  });

  it("should render edit and duplicate button when openedTab = IntakeList", () => {
    mockUseDayEdit({ openedTab: DayEditTab.IntakeList });
    render(<IntakePreview intake={intake} />);

    const editBtn = screen.getByText("Edit");
    const duplicateBtn = screen.getByText("duplicate");
    expect(editBtn).toBeInTheDocument();
    expect(duplicateBtn).toBeInTheDocument();
  });

  it("should render save button when openedTab = UnRecordedIntakeList or FavoriteIntake", () => {
    mockUseDayEdit({ openedTab: DayEditTab.UnRecordedIntakeList });

    const { rerender } = render(<IntakePreview intake={intake} />);
    expect(screen.getByText("Save")).toBeInTheDocument();

    mockUseDayEdit({ openedTab: DayEditTab.FavoriteIntake });
    rerender(<IntakePreview intake={intake} />);

    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("should render add to favorite button when openedTab != FavoriteIntake", () => {
    mockUseDayEdit({ openedTab: DayEditTab.IntakeList });
    render(<IntakePreview intake={intake} />);

    const addToFavBtn = screen.getByText("add to fav");
    expect(addToFavBtn).toBeInTheDocument();
  });
});

describe("Intake Preview", () => {
  const intake = testService.createIntake({}) as Intake;

  beforeEach(() => {
    mockUseDeleteFavoriteIntake({});
    mockUseAddFavoriteIntake({});
    mockUseDayEdit({});
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render intake name in title if exists in favorite intake", () => {
    mockUseDayEdit({ openedTab: DayEditTab.FavoriteIntake });
    render(<IntakePreview intake={intake} />);

    expect(screen.getByTestId("intake-title")).toHaveTextContent(intake.name);
  });

  it("should render items name in title if intake name doesn't exist in favorite intake", () => {
    const intake = testService.createIntake({}) as Intake;
    intake.name = "";
    mockUseDayEdit({ openedTab: DayEditTab.FavoriteIntake });
    render(<IntakePreview intake={intake} />);

    const itemsNames = intake.items.map((item: any) => item.name);
    expect(screen.getByTestId("intake-title")).toHaveTextContent(itemsNames.join(", "));
  });
});

describe("Buttons Container", () => {
  const intake = testService.createIntake({}) as Intake;

  beforeEach(() => {
    mockUseDeleteFavoriteIntake({});
    mockUseAddFavoriteIntake({});
    mockUseDayEdit({});
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should open modal on delete btn click", () => {
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
      ...testService.createDailyData({}),
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

  it("should call handleEditBtnClick on edit btn click", () => {
    const { setIntake, setOpenedTab } = mockUseDayEdit({
      openedTab: DayEditTab.IntakeList,
    });
    render(<IntakePreview intake={intake} />);

    const editBtn = screen.getByText("Edit");
    fireEvent.click(editBtn);

    expect(setIntake).toHaveBeenCalledTimes(1);
    expect(setIntake).toHaveBeenCalledWith(intake);
    expect(setOpenedTab).toHaveBeenCalledTimes(1);
    expect(setOpenedTab).toHaveBeenCalledWith(DayEditTab.IntakeEdit);
  });

  it("should call handleDuplicateBtnClick on duplicate btn click", () => {
    const dailyData = { ...testService.createDailyData({}), intakes: [intake] };
    const { updateDailyData } = mockUseDayEdit({
      dailyData,
      openedTab: DayEditTab.IntakeList,
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
    const dailyData = { ...testService.createDailyData({}), intakes: [intake] };
    const { updateDailyData } = mockUseDayEdit({
      dailyData,
      openedTab: DayEditTab.UnRecordedIntakeList,
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

  it("should call handleAddToFavBtnClick on add to fav btn click", () => {
    mockUseDayEdit({ openedTab: DayEditTab.IntakeList });

    const { addFavoriteIntake } = mockUseAddFavoriteIntake({});

    render(<IntakePreview intake={intake} />);

    const addToFavBtn = screen.getByText("add to fav");
    fireEvent.click(addToFavBtn);

    expect(addFavoriteIntake).toHaveBeenCalledTimes(1);
    expect(addFavoriteIntake).toHaveBeenCalledWith(intake);
  });
});
