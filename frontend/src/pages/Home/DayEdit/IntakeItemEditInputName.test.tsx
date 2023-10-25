/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { IntakeItemEditInputName } from "./IntakeItemEditInputName";
import { mockUseIntakeItemEdit } from "../../../../test/service/mockService";

vi.mock("./IntakeItemEditContext");

describe("IntakeItenEditInputName", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render input", () => {
    mockUseIntakeItemEdit({});

    render(<IntakeItemEditInputName />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should have correct value", () => {
    const { intakeItem } = mockUseIntakeItemEdit({});

    render(<IntakeItemEditInputName />);

    expect(screen.getByRole("textbox")).toHaveValue(intakeItem!.name);
  });

  it("should call handleNameInputClick on click", () => {
    const { handleNameInputClick, intakeItem } = mockUseIntakeItemEdit({});

    render(<IntakeItemEditInputName />);

    fireEvent.click(screen.getByRole("textbox"));

    expect(handleNameInputClick).toHaveBeenCalledWith(intakeItem!.id);
  });

  it("should call handleInputChange on change", () => {
    const { handleInputChange } = mockUseIntakeItemEdit({});

    render(<IntakeItemEditInputName />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "test1" } });

    expect(handleInputChange).toHaveBeenCalled();
  });
});
