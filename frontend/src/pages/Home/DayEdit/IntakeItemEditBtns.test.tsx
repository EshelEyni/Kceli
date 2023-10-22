/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { IntakeItemEditBtns } from "./IntakeItemEditBtns";
import { mockUseIntakeItemEdit } from "../../../../test/service/mockService";

vi.mock("./IntakeItemEditContext");

describe("IntakeItemEditBtns", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render two buttons when isOneItem is false", () => {
    mockUseIntakeItemEdit({ isOneItem: false });
    render(<IntakeItemEditBtns />);

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("should render one button when isOneItem is true", () => {
    mockUseIntakeItemEdit({ isOneItem: true });
    render(<IntakeItemEditBtns />);

    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("should call handleAddButtonClick on click", () => {
    const { handleAddButtonClick } = mockUseIntakeItemEdit({});
    render(<IntakeItemEditBtns />);

    fireEvent.click(screen.getByText("add item"));

    expect(handleAddButtonClick).toHaveBeenCalled();
  });

  it("should call handleRemoveButtonClick on click", () => {
    const { handleRemoveButtonClick } = mockUseIntakeItemEdit({ isOneItem: false });
    render(<IntakeItemEditBtns />);

    fireEvent.click(screen.getByText("remove item"));

    expect(handleRemoveButtonClick).toHaveBeenCalled();
  });
});
