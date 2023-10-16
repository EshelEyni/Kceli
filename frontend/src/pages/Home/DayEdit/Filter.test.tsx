import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { DayEditFilter } from "./Filter";
import { mockUseDayEdit } from "../../../../test/service/mockService";
import { ToggledElement } from "./DayEditContext";

vi.mock("./DayEditContext");

describe("Day Edit Filter", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render date", () => {
    const { setOpenedElement } = mockUseDayEdit({});
    render(<DayEditFilter />);

    const filterEl = screen.getByTestId("day-edit-filter");
    const btns = filterEl.getElementsByTagName("button");
    const toggledElementValues = Object.values(ToggledElement);

    for (let i = 0; i < btns.length; i++) {
      const btn = btns[i];
      const toggledElement = toggledElementValues[i];
      fireEvent.click(btn);
      expect(setOpenedElement).toHaveBeenCalledWith(toggledElement);
    }
  });
});
