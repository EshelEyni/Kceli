import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { mockUseDayEdit } from "../../../../test/service/mockService";
import { WaterEdit, waterEditBtns } from "./WaterEdit";
import { MeasurementUnit } from "../../../../../shared/types/intake";
import { DayData } from "../../../../../shared/types/dayData";
import testService from "../../../../test/service/testService";

vi.mock("./DayEditContext");

describe("Water Edit", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render water edit", () => {
    mockUseDayEdit({});
    render(<WaterEdit />);
    expect(screen.getByTestId("water-edit")).toBeInTheDocument();
  });

  it("should render water edit title", () => {
    const { recommendedWaterIntake } = mockUseDayEdit({});
    render(<WaterEdit />);

    expect(
      screen.getByText(`Recommended water intake: ${recommendedWaterIntake} ml`)
    ).toBeInTheDocument();
  });

  it("should render water edit buttons", () => {
    mockUseDayEdit({});
    render(<WaterEdit />);

    waterEditBtns.forEach(i => {
      expect(screen.getByText(i.name)).toBeInTheDocument();
    });
  });

  it("should change classNames when button is clicked", () => {
    mockUseDayEdit({});
    render(<WaterEdit />);

    for (const btn of waterEditBtns) {
      const btnEl = screen.getByText(btn.name);
      expect(btnEl).toHaveClass("btn");

      fireEvent.click(btnEl);
      expect(btnEl).toHaveClass("btn-selected");
    }
  });

  it("should render save button", () => {
    mockUseDayEdit({});
    render(<WaterEdit />);

    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("should call updateDailyData when save button is clicked", async () => {
    const { dailyData, updateDailyData } = mockUseDayEdit({});
    if (!dailyData) throw new Error("dailyData is undefined");

    render(<WaterEdit />);

    for (let i = 0; i < waterEditBtns.length; i++) {
      const btnEl = screen.getByText(waterEditBtns[i].name);
      fireEvent.click(btnEl);

      await testService.waitForTick();

      fireEvent.click(screen.getByText("Save"));

      expect(updateDailyData).toHaveBeenCalled();

      const arg = updateDailyData.mock.calls[i][0] as DayData;
      expect(arg.intakes.length).toBe(dailyData.intakes.length + 1);
      const lastIntake = arg.intakes[arg.intakes.length - 1];

      expect(lastIntake.items[0].quantity).toBe(waterEditBtns[i].value);
      expect(lastIntake.items[0].unit).toBe(MeasurementUnit.MILLILITER);
      expect(lastIntake.items[0].name).toBe("water");
    }
  });
});
