import React from "react";
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
const state = vi.hoisted(() => ({ item: { name: "Apple", calories: 0 }, change: vi.fn(), remove: vi.fn(), single: true }));
vi.mock("./IntakeItemEditContext", () => ({ useIntakeItemEdit: () => ({ intakeItem: state.item,
 handleInputChange: state.change, handleNameInputClick: vi.fn(), isOneItem: state.single, handleRemoveButtonClick: state.remove }) }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });
import { IntakeItemEdit } from "./IntakeItemEdit";
test("a single manual item has only name and calories", () => {
 state.single = true;
 render(<IntakeItemEdit />);
 expect(screen.getAllByRole("textbox")).toHaveLength(1);
 expect(screen.getAllByRole("spinbutton")).toHaveLength(1);
 expect(screen.queryByRole("button")).toBeNull();
});
test("multiple existing items can still be removed", () => {
 state.single = false;
 render(<IntakeItemEdit />);
 fireEvent.click(screen.getByRole("button", { name: "Remove" }));
 expect(state.remove).toHaveBeenCalledOnce();
});
