import { describe, it, expect, afterEach, vi, Mock } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { NutritionQuery } from "./NutritionQuery";
import { mockUseDayEdit } from "../../../../test/service/mockService";
import nutritionApiService from "../../../services/nutrition/nutritionApiService";
vi.mock("./DayEditContext");
vi.mock("../../../services/nutrition/nutritionApiService");
describe("OpenAI nutrition query", () => {
  afterEach(() => { cleanup(); vi.resetAllMocks(); });
  it("shows a single prompt and rejects empty submissions", () => {
    mockUseDayEdit({}); render(<NutritionQuery />);
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Ask OpenAI" })).toBeDisabled();
    fireEvent.submit(screen.getByTestId("nutrition-query-form"));
    expect(nutritionApiService.queryChatGPT).not.toHaveBeenCalled();
  });
  it("sends a trimmed prompt and stores the answer", async () => {
    const { setChatGPTQuery } = mockUseDayEdit({});
    (nutritionApiService.queryChatGPT as Mock).mockResolvedValue("Meal estimate");
    render(<NutritionQuery />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "  rice & beans  " } });
    fireEvent.submit(screen.getByTestId("nutrition-query-form"));
    await waitFor(() => expect(setChatGPTQuery).toHaveBeenLastCalledWith(expect.objectContaining({ status: "success", response: "Meal estimate", error: null })));
    expect(nutritionApiService.queryChatGPT).toHaveBeenCalledWith("rice & beans");
  });
  it("prefills a suggestion without sending it", () => {
    mockUseDayEdit({}); render(<NutritionQuery />);
    fireEvent.click(screen.getByRole("button", { name: "Suggest a high-protein lunch" }));
    expect(screen.getByRole("textbox")).toHaveValue("Suggest a high-protein lunch");
    expect(screen.getByRole("textbox")).toHaveFocus();
    expect(nutritionApiService.queryChatGPT).not.toHaveBeenCalled();
  });
  it("blocks duplicate requests while waiting", () => {
    mockUseDayEdit({}); (nutritionApiService.queryChatGPT as Mock).mockReturnValue(new Promise(() => {}));
    render(<NutritionQuery />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Lunch" } });
    fireEvent.submit(screen.getByTestId("nutrition-query-form"));
    fireEvent.submit(screen.getByTestId("nutrition-query-form"));
    expect(nutritionApiService.queryChatGPT).toHaveBeenCalledTimes(1);
  });
  it("records request errors for retry", async () => {
    const { setChatGPTQuery } = mockUseDayEdit({});
    (nutritionApiService.queryChatGPT as Mock).mockRejectedValue(new Error("Try again"));
    render(<NutritionQuery />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Lunch" } });
    fireEvent.submit(screen.getByTestId("nutrition-query-form"));
    await waitFor(() => expect(setChatGPTQuery).toHaveBeenLastCalledWith(expect.objectContaining({ status: "error", error: "Try again", response: null })));
  });
});
