import React from "react";
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
const state = vi.hoisted(() => ({ item: { name: "Apple", calories: 0 }, change: vi.fn(), remove: vi.fn(), single: true }));
vi.mock("./IntakeItemEditContext", () => ({ useIntakeItemEdit: () => ({ intakeItem: state.item,
 handleInputChange: state.change, handleNameInputClick: vi.fn(), isOneItem: state.single, handleRemoveButtonClick: state.remove }) }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });
import { IntakeItemEditManualInputs } from "./IntakeItemEditManualInputs";
test("shows zero calories and allows editing the total only", () => {
 render(<IntakeItemEditManualInputs />);
 const input = screen.getByRole("spinbutton") as HTMLInputElement;
 expect(input.value).toBe("0");
 expect(screen.queryByLabelText("Calories per 100g")).toBeNull();
 fireEvent.change(input, { target: { value: "95" } });
 expect(state.change).toHaveBeenCalledOnce();
});
