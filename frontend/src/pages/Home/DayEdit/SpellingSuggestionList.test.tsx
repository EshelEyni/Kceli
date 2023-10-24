import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { SpellingSuggestionList } from "./SpellingSuggestionList";
import { mockUseIntakeItemEdit } from "../../../../test/service/mockService";
import testService from "../../../../test/service/testService";

vi.mock("./IntakeItemEditContext");

describe("SpellingSuggestionList", () => {
  const suggestions = [
    testService.createSpellingSuggestion(),
    testService.createSpellingSuggestion(),
    testService.createSpellingSuggestion(),
    testService.createSpellingSuggestion(),
  ];

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render list", () => {
    mockUseIntakeItemEdit({ suggestions });

    render(<SpellingSuggestionList />);

    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("should render correct number of items", () => {
    mockUseIntakeItemEdit({ suggestions });

    render(<SpellingSuggestionList />);

    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("should render correct number of suggestions", () => {
    mockUseIntakeItemEdit({ suggestions });
    const numberOfSuggestions = suggestions.reduce((acc, curr) => acc + curr.suggestions.length, 0);
    render(<SpellingSuggestionList />);

    expect(screen.getAllByTestId("spelling-suggestion-list-btn")).toHaveLength(numberOfSuggestions);
  });

  it("should call handleSuggestionClick on click", () => {
    const { handleSuggestionClick } = mockUseIntakeItemEdit({ suggestions });

    render(<SpellingSuggestionList />);

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(handleSuggestionClick).toHaveBeenCalled();
  });

  it("should call handleIgnoreSuggestionClick on click", () => {
    const { handleIgnoreSuggestionClick } = mockUseIntakeItemEdit({ suggestions });

    render(<SpellingSuggestionList />);

    const btn = screen.getAllByTestId("ignore-suggestion-btn")[0];
    fireEvent.click(btn);

    expect(handleIgnoreSuggestionClick).toHaveBeenCalled();
  });
});
