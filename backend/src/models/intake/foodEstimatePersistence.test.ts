import mongoose from "mongoose";
import { intakeSchema } from "./intakeModel";
import openAIService from "../../services/openAI/openAIService";
import { DailyDataModel } from "../day/dailyDataModel";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
jest.mock("../day/dailyDataModel", () => ({ DailyDataModel: { find: jest.fn() } }));
jest.mock("../../services/ALSService", () => ({ getLoggedInUserIdFromReq: jest.fn() }));
const history = jest.fn();
beforeEach(() => {
  (getLoggedInUserIdFromReq as jest.Mock).mockReturnValue("507f1f77bcf86cd799439011");
  history.mockReset().mockResolvedValue([]);
  (DailyDataModel.find as jest.Mock).mockReturnValue({ select: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis(), maxTimeMS: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(), exec: history });
});
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
  expect(DailyDataModel.find).not.toHaveBeenCalled();
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

function savedFood(overrides: any = {}) {
 return [{ intakes: [{ isRecorded: true, recordedAt: new Date(),
   items: [{ ...item, calories: 105, ...overrides }] }] }];
}
test("missing calories reuse the current user's normalized saved food without AI", async () => {
 history.mockResolvedValue(savedFood());
 const meal = new TestMeal({ items: [{ ...item, name: "  BANANA! " }] });
 await meal.validate();
 expect(meal.items[0].calories).toBe(105); expect(estimate).not.toHaveBeenCalled();
 expect((DailyDataModel.find as jest.Mock).mock.calls[0][0].userId.toString()).toBe("507f1f77bcf86cd799439011");
});
test("saved zero calories bypass AI too", async () => {
 history.mockResolvedValue(savedFood({ calories: 0 }));
 const meal = new TestMeal({ items: [item] }); await meal.validate();
 expect(meal.items[0].calories).toBe(0); expect(estimate).not.toHaveBeenCalled();
});
test("reuses an exact gram portion", async () => {
 history.mockResolvedValue(savedFood({ unit: "g", quantity: 100, calories: 89 }));
 const meal = new TestMeal({ items: [{ ...item, unit: "g", quantity: 100 }] }); await meal.validate();
 expect(meal.items[0].calories).toBe(89); expect(estimate).not.toHaveBeenCalled();
});
test.each([{ unit: "g", quantity: 100 }, { quantity: 2 }])("different portion falls back without rescaling %p", async portion => {
 history.mockResolvedValue(savedFood()); estimate.mockResolvedValue(210);
 const meal = new TestMeal({ items: [{ ...item, ...portion }] }); await meal.validate();
 expect(meal.items[0].calories).toBe(210); expect(estimate).toHaveBeenCalledTimes(1);
});
test("without authenticated identity it never searches global history", async () => {
 (getLoggedInUserIdFromReq as jest.Mock).mockReturnValue(""); estimate.mockResolvedValue(105);
 const meal = new TestMeal({ items: [item] }); await meal.validate();
 expect(DailyDataModel.find).not.toHaveBeenCalled(); expect(estimate).toHaveBeenCalledTimes(1);
});
test("query-update validation resolves history before writing", async () => {
 const Day = mongoose.model("FoodEstimateHistoryUpdateDay", new mongoose.Schema({ intakes: [intakeSchema] }));
 const write = jest.spyOn(Day.collection, "findOneAndUpdate").mockResolvedValue({ value: {} } as any);
 history.mockResolvedValue(savedFood());
 try {
  await Day.findOneAndUpdate({ _id: new mongoose.Types.ObjectId() }, { intakes: [{ items: [item] }] }, { runValidators: true });
  expect(write).toHaveBeenCalledTimes(1);
  const update = write.mock.calls[0][1] as any;
  expect(update.$set.intakes[0].items[0].calories).toBe(105);
  expect(estimate).not.toHaveBeenCalled();
 } finally { write.mockRestore(); }
});
