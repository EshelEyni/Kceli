import mongoose from "mongoose";
import { intakeSchema } from "./intakeModel";
import openAIService from "../../services/openAI/openAIService";
jest.mock("../../services/openAI/openAIService", () => ({ __esModule: true, default: { getCaloriesForIntakeItem: jest.fn() } }));
const TestMeal = mongoose.model("FoodEstimateTestMeal", intakeSchema);
const estimate = openAIService.getCaloriesForIntakeItem as jest.Mock;
const item = { name: "banana", quantity: 1, unit: "unit" };
test("missing calories must be estimated, and failure stops validation", async () => {
  estimate.mockRejectedValue(new Error("provider unavailable"));
  const meal = new TestMeal({ items: [item] });
  await expect(meal.validate()).rejects.toThrow("provider unavailable");
  expect(meal.items[0].calories).toBeUndefined();
});
test("preserves historical and manually entered calories, including zero", async () => {
  const meal = new TestMeal({ items: [{ ...item, calories: 0 }, { ...item, calories: 123 }] });
  await meal.validate();
  expect(meal.items.map(i => i.calories)).toEqual([0, 123]);
  expect(estimate).not.toHaveBeenCalled();
});
test("estimates missing values without rewriting existing ones", async () => {
  estimate.mockResolvedValue(105);
  const meal = new TestMeal({ items: [item, { ...item, calories: 150 }] });
  await meal.validate();
  expect(meal.items.map(i => i.calories)).toEqual([105, 150]);
  expect(estimate).toHaveBeenCalledTimes(1);
});

test("a day update cannot reach the database when food estimation fails", async () => {
  const Day = mongoose.model("FoodEstimateTestDay", new mongoose.Schema({ intakes: [intakeSchema] }));
  const write = jest.spyOn(Day.collection, "findOneAndUpdate").mockResolvedValue({ value: {} } as any);
  estimate.mockRejectedValue(new Error("provider unavailable"));
  await expect(Day.findOneAndUpdate({ _id: new mongoose.Types.ObjectId() },
    { intakes: [{ items: [item] }] }, { runValidators: true })).rejects.toThrow("provider unavailable");
  expect(write).not.toHaveBeenCalled();
  write.mockRestore();
});
