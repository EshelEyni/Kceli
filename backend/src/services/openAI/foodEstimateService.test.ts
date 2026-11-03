import axios from "axios";
import { estimateFood, parseFoodEstimate, validateFoodItem } from "./foodEstimateService";
jest.mock("axios");
const post = axios.post as jest.Mock;
const response = (value: any, status = "completed") => ({ status, output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(value) }] }] });
const meal = { isFood: true, assumptions: "Two eggs and one tablespoon oil", items: [{ name: "eggs", calories: 156 }, { name: "oil", calories: 120 }] };
beforeEach(() => { process.env.OPENAI_API_KEY = "test-key"; post.mockReset(); });
test("sums component calories; uses configured model and strict non-stored response", async () => {
  process.env.FOOD_ESTIMATE_MODEL = "configured-model";
  post.mockResolvedValue({ data: response(meal) });
  expect(await estimateFood("two eggs and oil")).toEqual({ calories: 276, assumptions: meal.assumptions });
  expect(post.mock.calls[0][1]).toMatchObject({ model: "configured-model", store: false, text: { format: { strict: true } } });
  delete process.env.FOOD_ESTIMATE_MODEL;
});
test("accepts genuinely zero-calorie drinks", () => {
  expect(parseFoodEstimate(response({ ...meal, items: [{ name: "water", calories: 0 }] })).calories).toBe(0);
});
test.each([undefined, "", "  ", 123, "x".repeat(1001)])("rejects invalid descriptions without an API call: %p", async description => {
  await expect(estimateFood(description as any)).rejects.toMatchObject({ statusCode: 400 });
  expect(post).not.toHaveBeenCalled();
});
test.each([-1, Infinity, NaN, "100", 1.5, 20001])("rejects invalid provider calories: %p", calories => {
  expect(() => parseFoodEstimate(response({ ...meal, items: [{ name: "food", calories }] }))).toThrow();
});
test.each([{}, { status: "incomplete", output: [] }, { status: "completed", output: {} },
  { status: "completed", output: [{ type: "message", content: [{ type: "refusal" }] }] },
  { status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: "About 1,200 calories" }] }] }])("rejects incomplete/refused/malformed responses", data => {
  expect(() => parseFoodEstimate(data)).toThrow();
});
test("rejects non-food rather than inventing zero calories", () => {
  expect(() => parseFoodEstimate(response({ ...meal, isFood: false, items: [] }))).toThrow("Please describe a food");
});
test.each([[401, 503], [403, 503], [404, 503], [429, 429], [500, 502]])("sanitizes provider error %i", async (status, expected) => {
  (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);
  post.mockRejectedValue({ response: { status }, config: { headers: { Authorization: "secret" } } });
  await expect(estimateFood("banana")).rejects.toMatchObject({ statusCode: expected });
  await expect(estimateFood("banana")).rejects.not.toHaveProperty("config");
});
test("bounds timeout and missing configuration", async () => {
  (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);
  post.mockRejectedValue({ code: "ECONNABORTED" });
  await expect(estimateFood("banana")).rejects.toMatchObject({ statusCode: 504 });
  delete process.env.OPENAI_API_KEY;
  await expect(estimateFood("banana")).rejects.toMatchObject({ statusCode: 503 });
});
test.each([null, {}, { name: "banana", quantity: 0, unit: "unit" }, { name: "banana", quantity: 1, unit: "kg" }])("validates legacy item requests", item => {
  expect(() => validateFoodItem(item)).toThrow();
});
