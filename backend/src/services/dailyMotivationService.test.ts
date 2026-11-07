import { getDailyMotivation, parseMotivation, resolveMotivationTone } from "./dailyMotivationService";
import { DailyMotivationModel } from "../models/motivation/dailyMotivationModel";
import { UserModel } from "../models/user/userModel";
import { requestFoodResponse } from "./openAI/foodEstimateService";
jest.mock("../models/motivation/dailyMotivationModel", () => ({ DailyMotivationModel: {
 collection: { createIndex: jest.fn().mockResolvedValue("index") }, findOne: jest.fn(), create: jest.fn(), find: jest.fn(), updateOne: jest.fn(),
} }));
jest.mock("../models/user/userModel", () => ({ UserModel: { findById: jest.fn() } }));
jest.mock("./openAI/foodEstimateService", () => ({ requestFoodResponse: jest.fn() }));
const uid = "507f1f77bcf86cd799439011", now = new Date("2026-11-07T10:00:00Z");
let user: any;
let records: Map<string, any>;
const key = (value: any) => value.userId.toString() + "/" + value.localDate;
const response = (text = "בחר היום הרגל קטן שתוכל להתמיד בו. גם צעד פשוט הוא התקדמות.") => ({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ text }) }] }] });
const query = (result: () => any) => { const q: any = { exec: async () => result() }; for (const method of ["select", "lean", "sort", "limit"]) q[method] = () => q; return q; };
beforeEach(() => {
 user = { dailyMotivationEnabled: true, dailyMotivationTone: "auto", language: "he", gender: "male" };
 records = new Map();
 (UserModel.findById as jest.Mock).mockImplementation(() => query(() => ({ ...user })));
 (DailyMotivationModel.findOne as jest.Mock).mockImplementation(k => query(() => records.get(key(k))));
 (DailyMotivationModel.find as jest.Mock).mockImplementation(k => query(() => [...records.values()].filter(r => r.userId.toString() === k.userId.toString() && r.status === "ready" && r.localDate < k.localDate.$lt).sort((a,b) => b.localDate.localeCompare(a.localDate)).slice(0,14)));
 (DailyMotivationModel.create as jest.Mock).mockImplementation(async doc => {
  if (records.has(key(doc))) throw { code: 11000 };
  records.set(key(doc), { ...doc }); return doc;
 });
 (DailyMotivationModel.updateOne as jest.Mock).mockImplementation(async (k, change) => { Object.assign(records.get(key(k)), change.$set); return {}; });
 (requestFoodResponse as jest.Mock).mockReset().mockResolvedValue(response());
});
test.each([false, undefined, null, "true"])("strict opt-in: %p never claims a day or calls AI", async value => {
 user.dailyMotivationEnabled = value;
 expect(await getDailyMotivation(uid, "Asia/Jerusalem", now)).toMatchObject({ status: "disabled", text: null });
 expect(DailyMotivationModel.create).not.toHaveBeenCalled(); expect(requestFoodResponse).not.toHaveBeenCalled();
});
test("one reservation and AI call across simultaneous requests and later refreshes", async () => {
 const results = await Promise.all(Array.from({ length: 12 }, () => getDailyMotivation(uid, "Asia/Jerusalem", now)));
 expect(requestFoodResponse).toHaveBeenCalledTimes(1); expect(records.size).toBe(1);
 expect(results.some(r => r.status === "ready")).toBe(true);
 const again = await getDailyMotivation(uid, "Asia/Jerusalem", now);
 expect(again.status).toBe("ready"); expect(requestFoodResponse).toHaveBeenCalledTimes(1);
 expect(DailyMotivationModel.collection.createIndex).toHaveBeenCalledWith({ userId: 1, localDate: 1 }, expect.objectContaining({ unique: true }));
});
test("calendar dates follow device timezone, not server midnight; caches are user-scoped", async () => {
 const instant = new Date("2026-11-07T22:30:00Z");
 expect((await getDailyMotivation(uid, "Asia/Jerusalem", instant)).localDate).toBe("2026-11-08");
 const other = "507f1f77bcf86cd799439012";
 expect((await getDailyMotivation(other, "America/Los_Angeles", instant)).localDate).toBe("2026-11-07");
 expect(requestFoodResponse).toHaveBeenCalledTimes(2);
});
test("new day generates once and supplies recent messages to avoid repetition", async () => {
 await getDailyMotivation(uid, "Asia/Jerusalem", now);
 (requestFoodResponse as jest.Mock).mockResolvedValue(response("אפשר לפנות רגע לארוחה רגועה ולהקשיב לתחושת השובע שלך."));
 const next = await getDailyMotivation(uid, "Asia/Jerusalem", new Date("2026-11-08T10:00:00Z"));
 expect(next.status).toBe("ready"); expect(requestFoodResponse).toHaveBeenCalledTimes(2);
 const body = (requestFoodResponse as jest.Mock).mock.calls[1][0];
 expect(JSON.parse(body.input).recentMessages).toHaveLength(1); expect(body.max_output_tokens).toBe(200);
});
test("failure is remembered for the day and retried only on the next day", async () => {
 (requestFoodResponse as jest.Mock).mockRejectedValue(new Error("unavailable"));
 expect((await getDailyMotivation(uid, "Asia/Jerusalem", now)).status).toBe("failed");
 await getDailyMotivation(uid, "Asia/Jerusalem", now); expect(requestFoodResponse).toHaveBeenCalledTimes(1);
 (requestFoodResponse as jest.Mock).mockResolvedValue(response());
 expect((await getDailyMotivation(uid, "Asia/Jerusalem", new Date("2026-11-08T10:00:00Z"))).status).toBe("ready");
});
test("a crashed pending attempt is not regenerated", async () => {
 records.set(uid + "/2026-11-07", { userId: uid, localDate: "2026-11-07", language: "he", status: "pending", attemptedAt: new Date(now.getTime()-61000) });
 expect((await getDailyMotivation(uid, "Asia/Jerusalem", now)).status).toBe("failed"); expect(requestFoodResponse).not.toHaveBeenCalled();
});
test("disabling prevents returning an existing cached message", async () => {
 await getDailyMotivation(uid, "Asia/Jerusalem", now); user.dailyMotivationEnabled = false;
 expect((await getDailyMotivation(uid, "Asia/Jerusalem", now)).status).toBe("disabled"); expect(requestFoodResponse).toHaveBeenCalledTimes(1);
});
test("disabling while generation is in flight discards the output", async () => {
 (requestFoodResponse as jest.Mock).mockImplementation(async () => { user.dailyMotivationEnabled = false; return response(); });
 expect((await getDailyMotivation(uid, "Asia/Jerusalem", now)).text).toBeNull();
 expect([...records.values()][0].status).toBe("failed");
});
test("language changes never show the old-language message or call AI again that day", async () => {
 await getDailyMotivation(uid, "Asia/Jerusalem", now); user.language = "en";
 expect((await getDailyMotivation(uid, "Asia/Jerusalem", now)).text).toBeNull(); expect(requestFoodResponse).toHaveBeenCalledTimes(1);
});
test("explicit tone overrides gender; only selected gender is sent for grammar", async () => {
 expect(resolveMotivationTone("auto", "female")).toBe("warm"); expect(resolveMotivationTone("auto", "male")).toBe("direct");
 expect(resolveMotivationTone()).toBe("neutral"); expect(resolveMotivationTone("warm", "male")).toBe("warm");
 user.dailyMotivationTone = "warm"; await getDailyMotivation(uid, "Asia/Jerusalem", now);
 const body = (requestFoodResponse as jest.Mock).mock.calls[0][0];
 expect(body.instructions).toContain("Warm, empathetic"); expect(body.instructions).toContain("Hebrew");
 expect(JSON.parse(body.input).gender).toBe("male"); expect(body.input).not.toContain(uid);
});
test("English preference is respected", async () => {
 user.language = "en"; (requestFoodResponse as jest.Mock).mockResolvedValue(response("Choose one small habit you can repeat today. Steady effort counts."));
 expect((await getDailyMotivation(uid, "Asia/Jerusalem", now)).status).toBe("ready");
 expect((requestFoodResponse as jest.Mock).mock.calls[0][0].instructions).toContain("English");
});
test.each(["", "x".repeat(241), "Eat 500 calories today", "https://example.com", "English instead of Hebrew"])("invalid text falls back: %s", text => {
 expect(() => parseMotivation(response(text), "he", [])).toThrow();
});
test("refusals and repeated text are rejected", () => {
 const text = "בחר היום הרגל קטן שתוכל להתמיד בו.";
 expect(() => parseMotivation(response(text), "he", [text])).toThrow("Repeated");
 expect(() => parseMotivation({ status: "completed", output: [{ type: "message", content: [{ type: "refusal" }] }] }, "he", [])).toThrow();
});
test("invalid timezone/identity never calls AI", async () => {
 await expect(getDailyMotivation(uid, "Bad/Zone", now)).rejects.toMatchObject({ statusCode: 400 });
 await expect(getDailyMotivation("", "UTC", now)).rejects.toMatchObject({ statusCode: 401 });
 expect(requestFoodResponse).not.toHaveBeenCalled();
});
