import React from "react";
import { beforeEach, afterEach, expect, test, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FoodScanner } from "./FoodScanner";
import { scanFoodPhoto } from "../../../services/nutrition/foodScanApi";
import { FoodScanResult } from "../../../../../shared/types/foodScan";

const state = vi.hoisted(() => ({ setIntake: vi.fn(), setCurrIntakeItemId: vi.fn(), stop: vi.fn() }));
vi.mock("./DayEditContext", () => ({ useDayEdit: () => state }));
vi.mock("../../../services/nutrition/foodScanApi", () => ({ scanFoodPhoto: vi.fn() }));
beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) { this.setAttribute("open", ""); });
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: {
    getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop: state.stop }] }),
  } });
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({ drawImage: vi.fn() });
  HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue("data:image/jpeg;base64,/9j/2Q==");
  Object.defineProperty(HTMLVideoElement.prototype, "videoWidth", { configurable: true, value: 640 });
  Object.defineProperty(HTMLVideoElement.prototype, "videoHeight", { configurable: true, value: 480 });
});
afterEach(cleanup);
async function capture() {
  render(<FoodScanner />);
  fireEvent.click(screen.getByText(/Scan food/));
  await waitFor(() => expect((screen.getByText("Take photo") as HTMLButtonElement).disabled).toBe(false));
  fireEvent.click(screen.getByText("Take photo"));
}
test("review scales calories with portions, preserves manual items, and requires explicit confirmation", async () => {
  vi.mocked(scanFoodPhoto).mockResolvedValue({ items: [{ name: "Rice", unit: "g", quantity: 100, calories: 130 }], assumptions: "Estimate" });
  await capture();
  expect(state.stop).toHaveBeenCalled();
  fireEvent.click(screen.getByText("Analyze"));
  await screen.findByText("Use these items");
  expect(screen.queryByAltText("Meal photo preview")).toBeNull();
  expect(state.setIntake).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText("Grams"), { target: { value: "" } });
  fireEvent.change(screen.getByLabelText("Grams"), { target: { value: "200" } });
  expect((screen.getByLabelText("Calories") as HTMLInputElement).value).toBe("260");
  fireEvent.click(screen.getByText("Use these items"));
  const manual = { id: "manual", name: "Egg", quantity: 1, unit: "unit", calories: 80 };
  const updated = state.setIntake.mock.calls[0][0]({ items: [manual, { name: "" }] });
  expect(updated.items[0]).toEqual(manual);
  expect(updated.items[1]).toMatchObject({ name: "Rice", quantity: 200, calories: 260, caloriesPer100g: 130 });
  expect(screen.queryByRole("dialog")).toBeNull();
});
test("cancel aborts analysis and never adds a late response", async () => {
  let resolve!: (value: any) => void;
  vi.mocked(scanFoodPhoto).mockImplementation(() => new Promise<FoodScanResult>(r => { resolve = r; }));
  await capture(); fireEvent.click(screen.getByText("Analyze"));
  const signal = vi.mocked(scanFoodPhoto).mock.calls[0][2];
  fireEvent.click(screen.getByLabelText("Close"));
  expect(signal.aborted).toBe(true);
  await act(async () => resolve({ items: [], assumptions: "late" }));
  expect(state.setIntake).not.toHaveBeenCalled();
  expect(screen.queryByRole("dialog")).toBeNull();
});
test("denied camera offers photo selection and close remains available", async () => {
  vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(new Error("denied"));
  render(<FoodScanner />); fireEvent.click(screen.getByText(/Scan food/));
  await screen.findByRole("alert");
  expect(screen.getByText("Choose photo")).toBeTruthy();
  fireEvent.click(screen.getByLabelText("Close"));
  expect(state.setIntake).not.toHaveBeenCalled();
});
test("HTTP explains HTTPS is required without requesting camera permission", async () => {
  Object.defineProperty(window, "isSecureContext", { configurable: true, value: false });
  render(<FoodScanner />); fireEvent.click(screen.getByText(/Scan food/));
  await screen.findByText("Camera access requires HTTPS. Open a secure address or choose a photo.");
  expect(navigator.mediaDevices.getUserMedia).not.toHaveBeenCalled();
  expect(screen.getByText("Choose photo")).toBeTruthy();
});
test("no-food results cannot be added to the meal", async () => {
  vi.mocked(scanFoodPhoto).mockResolvedValue({ items: [], assumptions: "No food visible" });
  await capture(); fireEvent.click(screen.getByText("Analyze"));
  await screen.findByText("No food identified. Please try another photo.");
  expect((screen.getByText("Use these items") as HTMLButtonElement).disabled).toBe(true);
  expect(state.setIntake).not.toHaveBeenCalled();
});
test("analysis failure clears the photo and does not change the meal", async () => {
  vi.mocked(scanFoodPhoto).mockRejectedValue(new Error("Could not analyze the photo. Please try again."));
  await capture(); fireEvent.click(screen.getByText("Analyze"));
  await screen.findByRole("alert");
  expect(screen.queryByAltText("Meal photo preview")).toBeNull();
  expect(state.setIntake).not.toHaveBeenCalled();
});
