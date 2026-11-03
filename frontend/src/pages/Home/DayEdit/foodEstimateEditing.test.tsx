import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useState } from "react";
import { IntakeItemEditProvider, useIntakeItemEdit } from "./IntakeItemEditContext";
import { useDayEdit } from "./DayEditContext";
import calorieApiService from "../../../services/calorieApi/calorieApiService";
vi.mock("./DayEditContext", () => ({ useDayEdit: vi.fn() }));
vi.mock("nspell", () => ({ default: class { suggest() { return []; } } }));
vi.mock("../../../services/calorieApi/calorieApiService", () => ({ default: { getCaloriesForItem: vi.fn() } }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });
function Fields() {
  const c = useIntakeItemEdit();
  return <><input aria-label="Name" name="name" value={c.intakeItem.name} onChange={c.handleInputChange} />
    <button onClick={c.increaseQuantity}>More</button><button onClick={() => c.handleUnitChange("g" as any)}>Grams</button>
    <button onClick={c.handleCalcBtnClick}>Estimate</button><output>{String(c.intakeItem.calories)}</output></>;
}
function Harness() {
  const [intake, setIntake] = useState<any>({ items: [{ id: "food", name: "banana", quantity: 1, unit: "unit", calories: 100 }] });
  vi.mocked(useDayEdit).mockReturnValue({ intake, setIntake, currIntakeItemId: "food", setCurrIntakeItemId: vi.fn(), btnStyle: {} } as any);
  return <IntakeItemEditProvider intakeItem={intake.items[0]}><Fields /></IntakeItemEditProvider>;
}
it("scales calories with portion and clears them when units change", () => {
  render(<Harness />); fireEvent.click(screen.getByText("More"));
  expect(screen.getByRole("status").textContent).toBe("200");
  fireEvent.click(screen.getByText("Grams"));
  expect(screen.getByRole("status").textContent).toBe("undefined");
});
it("does not apply an in-flight result after the food has changed", async () => {
  let resolve: any;
  vi.mocked(calorieApiService.getCaloriesForItem).mockReturnValue(new Promise(r => { resolve = r; }));
  render(<Harness />); fireEvent.click(screen.getByText("Estimate"));
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "apple" } });
  await act(async () => resolve(105));
  expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("apple");
  expect(screen.getByRole("status").textContent).toBe("undefined");
});
