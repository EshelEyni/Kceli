import { DailyDataModel } from "../../models/day/dailyDataModel";
import { estimateFood } from "../openAI/foodEstimateService";
import { estimateFoodWithHistory, normalizeFoodDescription } from "./foodEstimateHistoryService";
jest.mock("../../models/day/dailyDataModel", () => ({ DailyDataModel: { find: jest.fn() } }));
jest.mock("../openAI/foodEstimateService", () => ({ ...jest.requireActual("../openAI/foodEstimateService"), estimateFood: jest.fn() }));
const userId = "507f1f77bcf86cd799439011";
const ai = estimateFood as jest.Mock, find = DailyDataModel.find as jest.Mock, exec = jest.fn();
const query = { select: jest.fn().mockReturnThis(), sort: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis(), maxTimeMS: jest.fn().mockReturnThis(), lean: jest.fn().mockReturnThis(), exec };
function day(item: any = {}, intake: any = {}) { return { intakes: [{ isRecorded: true, recordedAt: new Date(), items: [{ name: "הפוך רגיל", calories: 120, quantity: 1, unit: "unit", ...item }], ...intake }] }; }
beforeEach(() => { find.mockReturnValue(query); exec.mockReset().mockResolvedValue([]); ai.mockResolvedValue({ calories: 200, assumptions: "AI estimate" }); });
test("normalized Hebrew hit avoids AI and query is scoped, indexed and bounded", async () => {
 exec.mockResolvedValue([day()]);
 expect(await estimateFoodWithHistory("  הָפוּך   רגיל!  ", userId)).toMatchObject({ calories: 120 });
 expect(ai).not.toHaveBeenCalled();
 const filter = find.mock.calls[0][0]; expect(filter.userId.toString()).toBe(userId);
 expect(filter.date.$gte).toBeInstanceOf(Date); expect(filter.date.$lte).toBeInstanceOf(Date);
 expect(query.limit).toHaveBeenCalledWith(101); expect(query.maxTimeMS).toHaveBeenCalledWith(1500);
});
test("another user's request cannot reuse this user's history", async () => {
 find.mockImplementation(filter => ({ ...query, exec: async () => filter.userId.toString() === userId ? [day()] : [] }));
 await estimateFoodWithHistory("הפוך רגיל", "507f1f77bcf86cd799439012"); expect(ai).toHaveBeenCalledTimes(1);
});
test.each(["2 הפוך רגיל", "הפוך גדול", "הפוך רגיל עם סוכר", "הפוך רגיל בלי חלב"])("changed portions/ingredients fall back: %s", async text => {
 exec.mockResolvedValue([day()]); await estimateFoodWithHistory(text, userId); expect(ai).toHaveBeenCalledWith(text, undefined);
});
test("normalizes case and spacing while retaining decimal quantities", () => {
 expect(normalizeFoodDescription("  BLACK\nCoffee. ")).toBe("black coffee");
 expect(normalizeFoodDescription("1.5 cups milk")).not.toBe(normalizeFoodDescription("15 cups milk"));
});
test.each([{ quantity: 2 }, { unit: "g", quantity: 100 }, { unit: "cup" }])("rejects incompatible portion %p", async item => {
 exec.mockResolvedValue([day(item)]); await estimateFoodWithHistory("הפוך רגיל", userId); expect(ai).toHaveBeenCalledTimes(1);
});
test.each([{ isRecorded: false }, { recordedAt: null }, { recordedAt: new Date(Date.now()-91*86400000) }, { recordedAt: new Date(Date.now()+86400000) }])("rejects unreliable recording %p", async intake => {
 exec.mockResolvedValue([day({}, intake)]); await estimateFoodWithHistory("הפוך רגיל", userId); expect(ai).toHaveBeenCalledTimes(1);
});
test.each([undefined, null, -1, NaN, Infinity, "120", 20001])("rejects invalid saved calories %p", async calories => {
 exec.mockResolvedValue([day({ calories })]); await estimateFoodWithHistory("הפוך רגיל", userId); expect(ai).toHaveBeenCalledTimes(1);
});
test("conflicting estimates use AI instead of guessing", async () => {
 exec.mockResolvedValue([day(), day({ calories: 150 })]); await estimateFoodWithHistory("הפוך רגיל", userId); expect(ai).toHaveBeenCalledTimes(1);
});
test("zero calorie entries remain valid and reviewable", async () => {
 exec.mockResolvedValue([day({ name: "water", calories: 0 })]);
 const result = await estimateFoodWithHistory("Water", userId); expect(result.calories).toBe(0); expect(result.assumptions).toContain("Review"); expect(ai).not.toHaveBeenCalled();
});
test("miss and database failure preserve fallback", async () => {
 await estimateFoodWithHistory("banana", userId); exec.mockRejectedValue(new Error("timeout"));
 await estimateFoodWithHistory("banana", userId); expect(ai).toHaveBeenCalledTimes(2);
});
test("truncated history falls back", async () => {
 exec.mockResolvedValue(Array.from({ length: 101 }, () => day()));
 await estimateFoodWithHistory("הפוך רגיל", userId); expect(ai).toHaveBeenCalledTimes(1);
});
test("invalid input and missing identity do not access data or AI", async () => {
 await expect(estimateFoodWithHistory("", userId)).rejects.toMatchObject({ statusCode: 400 });
 await expect(estimateFoodWithHistory("banana", "")).rejects.toMatchObject({ statusCode: 401 });
 expect(find).not.toHaveBeenCalled(); expect(ai).not.toHaveBeenCalled();
});
test("disconnect during lookup prevents a paid request", async () => {
 const controller = new AbortController(); controller.abort();
 await expect(estimateFoodWithHistory("banana", userId, controller.signal)).rejects.toMatchObject({ statusCode: 499 }); expect(ai).not.toHaveBeenCalled();
});
