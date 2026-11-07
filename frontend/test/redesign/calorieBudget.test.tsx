import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { CalorieBudget } from "../../src/pages/Home/DayEdit/CalorieBudget";
import { getBudgetTarget, getCalorieBudget } from "../../src/pages/Home/DayEdit/calorieBudgetModel";
import i18n from "../../src/i18n";
afterEach(() => {
  cleanup();
  i18n.changeLanguage("en");
});
it.each([
  [0, "green"],
  [79, "green"],
  [79.99, "green"],
  [80, "yellow"],
  [99, "yellow"],
  [99.99, "yellow"],
  [100, "red"],
  [120, "red"],
])("uses the correct state at %s percent", (percent, state) => {
  const budget = getCalorieBudget(Number(percent) * 20, 2000);
  expect(budget.state).toBe(state);
  expect(budget.percentage).toBeLessThanOrEqual(100);
});
it.each([0, -1, NaN, Infinity, undefined])("handles invalid target %s", target => {
  render(<CalorieBudget consumed={500} target={target as number} />);
  expect(screen.queryByRole("progressbar")).toBeNull();
  expect(screen.getByRole("status")).toHaveTextContent("Set a daily calorie target");
});
it("updates counts and accessible states as food totals and targets change", () => {
  const { rerender } = render(<CalorieBudget consumed={1580} target={2000} />);
  expect(screen.getByRole("status")).toHaveTextContent("420 calories remaining");
  rerender(<CalorieBudget consumed={1600} target={2000} />);
  expect(screen.getByRole("status")).toHaveTextContent("Approaching the daily target — 400");
  rerender(<CalorieBudget consumed={2000} target={2000} />);
  expect(screen.getByRole("status")).toHaveTextContent("You’ve reached");
  rerender(<CalorieBudget consumed={2250} target={2000} />);
  expect(screen.getByRole("status")).toHaveTextContent("250 calories above");
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2000");
  rerender(<CalorieBudget consumed={500} target={2000} />);
  expect(screen.getByRole("status")).toHaveTextContent("1,500 calories remaining");
  rerender(<CalorieBudget consumed={500} target={600} />);
  expect(screen.getByRole("status")).toHaveTextContent("Approaching the daily target — 100");
});
it("uses current guidance today and preserves historical targets", () => {
  expect(getBudgetTarget(new Date(), 2000, 2400)).toBe(2400);
  expect(getBudgetTarget("2020-01-01", 1800, 2400)).toBe(1800);
  expect(getBudgetTarget("2020-01-01", undefined, 2400)).toBe(0);
});
it("renders friendly Hebrew status", async () => {
  await i18n.changeLanguage("he");
  render(<CalorieBudget consumed={1760} target={2000} />);
  expect(screen.getByRole("status")).toHaveTextContent("מתקרבים ליעד היומי — נותרו 240 קלוריות");
});
