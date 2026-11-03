import express from "express";
import request from "supertest";
import router from "./nutritionRouter";
import { errorHandler, AppError } from "../../services/error/errorService";
import { estimateFood } from "../../services/openAI/foodEstimateService";
jest.mock("../../middlewares/authGuards/authGuardsMiddleware", () => ({ checkUserAuthentication: (req: any, res: any, next: any) => {
  if (req.headers.authorization === "test") next(); else res.sendStatus(401);
} }));
jest.mock("../../services/openAI/foodEstimateService", () => ({ estimateFood: jest.fn() }));
const app = express(); app.use(express.json()); app.use("/api/nutrition", router); app.use(errorHandler);
beforeEach(() => { process.env.NODE_ENV = "test"; });
test("requires login before paid estimation", async () => {
  await request(app).post("/api/nutrition/estimate-food").send({ description: "banana" }).expect(401);
  expect(estimateFood).not.toHaveBeenCalled();
});
test("returns structured estimate without storing or caching it", async () => {
  (estimateFood as jest.Mock).mockResolvedValue({ calories: 105, assumptions: "medium banana" });
  const result = await request(app).post("/api/nutrition/estimate-food").set("Authorization", "test").send({ description: "banana" }).expect(200);
  expect(result.headers["cache-control"]).toBe("no-store");
  expect(result.body.data.calories).toBe(105);
});
test("propagates actionable failures", async () => {
  (estimateFood as jest.Mock).mockRejectedValue(new AppError("Calorie estimation is busy. Try later or enter calories.", 429));
  const result = await request(app).post("/api/nutrition/estimate-food").set("Authorization", "test").send({ description: "banana" }).expect(429);
  expect(result.body.message).toContain("enter calories");
});
