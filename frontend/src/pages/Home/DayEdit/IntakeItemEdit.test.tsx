import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { IntakeItemEdit } from "./IntakeItemEdit";
import { mockUseIntakeItemEdit } from "../../../../test/service/mockService";

vi.mock("./IntakeItemEditContext");

describe("DayDetails", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render intake item edit", () => {
    mockUseIntakeItemEdit({});
    render(<IntakeItemEdit />);
    expect(screen.getByTestId("intake-item-edit")).toBeInTheDocument();
  });

  it("should always render input name and inputs buttons", () => {
    mockUseIntakeItemEdit({});
    render(<IntakeItemEdit />);
    expect(screen.getByPlaceholderText("Enter food name")).toBeInTheDocument();
    expect(screen.getByTestId("intake-item-edit-inputs-btns")).toBeInTheDocument();
  });

  it("should render spelling suggestion list if isSuggestionListShown is true", () => {
    mockUseIntakeItemEdit({ isSuggestionListShown: true });
    render(<IntakeItemEdit />);
    expect(screen.getByTestId("spelling-suggestion-list")).toBeInTheDocument();
  });

  it("should render manual inputs if isManual is true", () => {
    mockUseIntakeItemEdit({ isManual: true });
    render(<IntakeItemEdit />);
    expect(screen.getByTestId("intake-item-edit-manuall-calorie-edit")).toBeInTheDocument();
  });

  it("should render intake item edit buttons if isCurrIntakeItem is true", () => {
    mockUseIntakeItemEdit({ isCurrIntakeItem: true });
    render(<IntakeItemEdit />);
    expect(screen.getByTestId("intake-item-edit-btns")).toBeInTheDocument();
  });
});
