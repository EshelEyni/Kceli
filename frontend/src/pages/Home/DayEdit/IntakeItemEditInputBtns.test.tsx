/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { mockUseIntakeItemEdit } from "../../../../test/service/mockService";
import { IntakeItemEditInputBtns } from "./IntakeItemEditInputBtns";

vi.mock("./IntakeItemEditContext");

describe("IntakeItemEditInputBtns", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render quantity input", () => {
    mockUseIntakeItemEdit({});

    render(<IntakeItemEditInputBtns />);

    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("should render correct quantity", () => {
    const { intakeItem } = mockUseIntakeItemEdit({});

    render(<IntakeItemEditInputBtns />);

    expect(screen.getByRole("spinbutton")).toHaveValue(intakeItem!.quantity);
  });

  it("should call handleInputChange on change", () => {
    const { handleInputChange } = mockUseIntakeItemEdit({});

    render(<IntakeItemEditInputBtns />);

    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: 200 } });

    expect(handleInputChange).toHaveBeenCalled();
  });

  it("should call decreaseQuantity on click", () => {
    const { decreaseQuantity } = mockUseIntakeItemEdit({});

    render(<IntakeItemEditInputBtns />);

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(decreaseQuantity).toHaveBeenCalled();
  });

  it("should call increaseQuantity on click", () => {
    const { increaseQuantity } = mockUseIntakeItemEdit({});

    render(<IntakeItemEditInputBtns />);

    fireEvent.click(screen.getAllByRole("button")[1]);

    expect(increaseQuantity).toHaveBeenCalled();
  });

  it("should render correct unit", () => {
    const { intakeItem } = mockUseIntakeItemEdit({});

    render(<IntakeItemEditInputBtns />);

    expect(screen.getAllByRole("button")[2]).toHaveTextContent(intakeItem!.unit);
  });

  it("should call handleUnitBtnClick on click", () => {
    const { handleUnitBtnClick } = mockUseIntakeItemEdit({});

    render(<IntakeItemEditInputBtns />);

    fireEvent.click(screen.getAllByRole("button")[2]);

    expect(handleUnitBtnClick).toHaveBeenCalled();
  });

  it("should render correct manual/auto", () => {
    const { isManual } = mockUseIntakeItemEdit({});

    render(<IntakeItemEditInputBtns />);

    expect(screen.getAllByRole("button")[3]).toHaveTextContent(isManual ? "Manual" : "Auto");
  });

  it("should call handleToggleManual on click", () => {
    const { handleToggleManual } = mockUseIntakeItemEdit({});

    render(<IntakeItemEditInputBtns />);

    fireEvent.click(screen.getAllByRole("button")[3]);

    expect(handleToggleManual).toHaveBeenCalled();
  });

  it("should render calc button", () => {
    mockUseIntakeItemEdit({});

    render(<IntakeItemEditInputBtns />);

    expect(screen.getAllByRole("button")[4]).toHaveTextContent("calc");
  });

  it("should call handleCalcBtnClick on click", () => {
    const { handleCalcBtnClick } = mockUseIntakeItemEdit({});

    render(<IntakeItemEditInputBtns />);

    fireEvent.click(screen.getAllByRole("button")[4]);

    expect(handleCalcBtnClick).toHaveBeenCalled();
  });

  it("should render spinner if isLoadingCal is true", () => {
    mockUseIntakeItemEdit({ isLoadingCal: true });

    render(<IntakeItemEditInputBtns />);

    expect(screen.getByTestId("spinner-loader")).toBeInTheDocument();
  });

  it("should not render spinner if isLoadingCal is false", () => {
    mockUseIntakeItemEdit({ isLoadingCal: false });

    render(<IntakeItemEditInputBtns />);

    expect(screen.queryByTestId("spinner-loader")).not.toBeInTheDocument();
  });
});
