/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { IntakeItemEditManualInputs } from "./IntakeItemEditManualInputs";
import { mockUseIntakeItemEdit } from "../../../../test/service/mockService";
import testService from "../../../../test/service/testService";

vi.mock("./IntakeItemEditContext");

describe("IntakeItemEditManualInputs", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render inputs", () => {
    mockUseIntakeItemEdit({});
    render(<IntakeItemEditManualInputs />);

    expect(screen.getAllByRole("spinbutton")).toHaveLength(2);
  });

  it("should have correct values", () => {
    const { intakeItem } = mockUseIntakeItemEdit({
      intakeItem: {
        ...testService.createIntakeItem({}),
        calories: 100,
        caloriesPer100g: 200,
      },
    });

    render(<IntakeItemEditManualInputs />);
    const inputs = screen.getAllByRole("spinbutton");

    expect(inputs[0]).toHaveValue(intakeItem!.calories);
    expect(inputs[1]).toHaveValue(intakeItem!.caloriesPer100g);
  });

  it("should call handleInputChange on change", () => {
    const { handleInputChange } = mockUseIntakeItemEdit({});

    render(<IntakeItemEditManualInputs />);

    fireEvent.change(screen.getAllByRole("spinbutton")[0], { target: { value: "test1" } });

    expect(handleInputChange).toHaveBeenCalled();

    fireEvent.change(screen.getAllByRole("spinbutton")[1], { target: { value: "test2" } });

    expect(handleInputChange).toHaveBeenCalled();
  });

  it("should call setInputFaded on click", () => {
    const { setInputFaded } = mockUseIntakeItemEdit({
      inputFaded: "calories",
    });

    render(<IntakeItemEditManualInputs />);

    fireEvent.click(screen.getAllByRole("spinbutton")[0]);

    expect(setInputFaded).toHaveBeenCalledWith("");
  });

  it("should not call setInputFaded on click when inputFaded is not equal to inputName", () => {
    const { setInputFaded } = mockUseIntakeItemEdit({
      inputFaded: "calories",
    });

    render(<IntakeItemEditManualInputs />);

    fireEvent.click(screen.getAllByRole("spinbutton")[1]);

    expect(setInputFaded).not.toHaveBeenCalled();
  });
});
