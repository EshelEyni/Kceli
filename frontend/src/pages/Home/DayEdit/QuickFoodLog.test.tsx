import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QuickFoodLog } from "./QuickFoodLog";
import { useDayEdit } from "./DayEditContext";
import { estimateMeal } from "../../../services/nutrition/foodEstimateApi";
import toast from "react-hot-toast";
vi.mock("./DayEditContext", () => ({ useDayEdit: vi.fn(), DayEditTab: { IntakeEdit: "IntakeEdit" } }));
vi.mock("../../../services/nutrition/foodEstimateApi", () => ({ estimateMeal: vi.fn() }));
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn() } }));
const update = vi.fn();
const oldMeal = { id: "existing", items: [{ name: "historical", calories: 0 }] };
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useDayEdit).mockReturnValue({ dailyData: { id: "day", intakes: [oldMeal] }, updateDailyData: update, isLoadingUpdate: false, setOpenedTab: vi.fn(), setSearchParams: vi.fn() } as any);
  vi.mocked(estimateMeal).mockResolvedValue({ calories: 276, assumptions: "2 large eggs and 1 tbsp oil" });
});
afterEach(cleanup);
function describeMeal(text = "2 eggs and olive oil") { fireEvent.change(screen.getByLabelText("Describe your meal"), { target: { value: text } }); }
async function estimate() { fireEvent.click(screen.getByText("Estimate calories")); await screen.findByLabelText("Calories (kcal)"); }
describe("quick logging", () => {
  it("estimates, reviews, corrects and saves without altering history or clearing early", async () => {
    render(<QuickFoodLog />); describeMeal(); await estimate();
    expect((screen.getByLabelText("Calories (kcal)") as HTMLInputElement).value).toBe("276");
    fireEvent.change(screen.getByLabelText("Calories (kcal)"), { target: { value: "250" } });
    fireEvent.click(screen.getByText("Save meal"));
    expect(update).toHaveBeenCalledTimes(1);
    const [payload, callbacks] = update.mock.calls[0];
    expect(payload.data.intakes[0]).toBe(oldMeal);
    expect(payload.data.intakes[1].items[0]).toMatchObject({ name: "2 eggs and olive oil", calories: 250, quantity: 1, unit: "unit" });
    expect((screen.getByLabelText("Describe your meal") as HTMLTextAreaElement).value).not.toBe("");
    expect(toast.success).not.toHaveBeenCalled();
    act(() => { callbacks.onSuccess(); callbacks.onSettled(); });
    expect((screen.getByLabelText("Describe your meal") as HTMLTextAreaElement).value).toBe("");
    expect(toast.success).toHaveBeenCalledWith("Meal saved");
  });
  it("retains the estimate after save failure and retries with the same id", async () => {
    render(<QuickFoodLog />); describeMeal(); await estimate(); fireEvent.click(screen.getByText("Save meal"));
    const firstId = update.mock.calls[0][0].data.intakes[1].id;
    act(() => { update.mock.calls[0][1].onError(); update.mock.calls[0][1].onSettled(); });
    expect(screen.getByRole("alert").textContent).toContain("Couldn't save");
    fireEvent.click(screen.getByText("Save meal"));
    expect(update.mock.calls[1][0].data.intakes[1].id).toBe(firstId);
  });
  it("offers manual entry on estimation failure, including zero", async () => {
    vi.mocked(estimateMeal).mockRejectedValue(new Error("Could not estimate calories. Try again or enter calories."));
    render(<QuickFoodLog />); describeMeal("water"); fireEvent.click(screen.getByText("Estimate calories"));
    await screen.findByRole("alert");
    fireEvent.click(screen.getByText("Enter calories myself"));
    fireEvent.change(screen.getByLabelText("Calories (kcal)"), { target: { value: "0" } });
    fireEvent.click(screen.getByText("Save meal"));
    expect(update.mock.calls[0][0].data.intakes[1].items[0].calories).toBe(0);
  });
  it("invalidates the estimate when the description changes", async () => {
    render(<QuickFoodLog />); describeMeal(); await estimate(); describeMeal("3 eggs");
    expect(screen.queryByText("Save meal")).toBeNull();
    expect(screen.getByText("Estimate calories")).toBeTruthy();
  });
  it("prevents duplicate estimate requests and duplicate saves", async () => {
    let resolve: any;
    vi.mocked(estimateMeal).mockReturnValue(new Promise(r => { resolve = r; }));
    render(<QuickFoodLog />); describeMeal();
    fireEvent.submit(screen.getByText("Estimate calories").closest("form")!);
    fireEvent.submit(screen.getByText("Estimating calories…", { selector: "button" }).closest("form")!);
    expect(estimateMeal).toHaveBeenCalledTimes(1);
    await act(async () => resolve({ calories: 200, assumptions: "typical portion" }));
    fireEvent.click(screen.getByText("Save meal")); fireEvent.click(screen.getByText("Save meal"));
    expect(update).toHaveBeenCalledTimes(1);
  });
});
