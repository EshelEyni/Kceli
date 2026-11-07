import React, { useState } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { IntakeEdit } from "./IntakeEdit";
import intakeUtilService from "../../../services/intake/intakeUtilService";
const state = vi.hoisted(() => ({ current: {} as any, save: vi.fn() }));
vi.mock("./DayEditContext", () => ({ useDayEdit: () => state.current }));
vi.mock("./FoodScanner", () => ({ FoodScanner: ({ onManualEntry }: any) => <button onClick={onManualEntry}>Scan fallback</button> }));
vi.mock("nspell", () => ({ default: class { suggest() { return []; } } }));
function Harness({ initial = intakeUtilService.getDefaultIntake(), existing = [] }: any) {
 const [intake, setIntake] = useState(initial);
 state.current = { intake, setIntake, currIntakeItemId: intake.items[0].id, setCurrIntakeItemId: vi.fn(),
 dailyData: { id: "day", intakes: existing }, updateDailyData: state.save };
 return <IntakeEdit />;
}
beforeEach(() => { vi.clearAllMocks(); });
afterEach(cleanup);
test("manual fallback needs only food and calories and retains the draft until save succeeds", () => {
 render(<Harness />);
 expect(screen.queryByRole("textbox")).toBeNull();
 fireEvent.click(screen.getByText("Enter manually"));
 expect(screen.getAllByRole("textbox")).toHaveLength(1);
 expect(screen.getAllByRole("spinbutton")).toHaveLength(1);
 fireEvent.change(screen.getByLabelText("Food name"), { target: { value: "Apple" } });
 fireEvent.change(screen.getByLabelText("Calories"), { target: { value: "95" } });
 fireEvent.submit(screen.getByText("Save Intake").closest("form")!);
 const payload = state.save.mock.calls[0][0].data.intakes[0];
 expect(payload.items[0]).toMatchObject({ name: "Apple", calories: 95, quantity: 1, unit: "unit" });
 expect(payload.recordedAt).toBeInstanceOf(Date);
 expect((screen.getByLabelText("Food name") as HTMLInputElement).value).toBe("Apple");
});
test("cleared calories cannot silently save as zero; explicit zero is accepted", () => {
 render(<Harness />);
 fireEvent.click(screen.getByText("Scan fallback"));
 fireEvent.change(screen.getByLabelText("Food name"), { target: { value: "Water" } });
 fireEvent.change(screen.getByLabelText("Calories"), { target: { value: "30" } });
 fireEvent.change(screen.getByLabelText("Calories"), { target: { value: "" } });
 fireEvent.submit(screen.getByText("Save Intake").closest("form")!);
 expect(state.save).not.toHaveBeenCalled();
 fireEvent.change(screen.getByLabelText("Calories"), { target: { value: "0" } });
 fireEvent.submit(screen.getByText("Save Intake").closest("form")!);
 expect(state.save.mock.calls[0][0].data.intakes[0].items[0].calories).toBe(0);
});
test("editing historical food preserves hidden metadata and other meals", () => {
 const initial = { ...intakeUtilService.getDefaultIntake(), name: "Lunch", type: "drink", recordedAt: "2026-11-01T12:00:00Z" };
 initial.items[0] = { ...initial.items[0], name: "Soup", calories: 80, quantity: 250, unit: "ml", caloriesPer100g: 32 } as any;
 const other = { ...initial, id: "other" };
 render(<Harness initial={initial} existing={[initial, other]} />);
 fireEvent.submit(screen.getByText("Save Intake").closest("form")!);
 const saved = state.save.mock.calls[0][0].data.intakes;
 expect(saved).toHaveLength(2);
 expect(saved[1]).toEqual(other);
 expect(saved[0]).toMatchObject({ name: "Lunch", type: "drink", recordedAt: initial.recordedAt });
 expect(saved[0].items[0]).toMatchObject({ name: "Soup", quantity: 250, unit: "ml", caloriesPer100g: 32, calories: 80 });
});
