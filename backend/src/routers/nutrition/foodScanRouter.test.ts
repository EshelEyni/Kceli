import express from "express";
import request from "supertest";
import router from "./nutritionRouter";
import { errorHandler } from "../../services/error/errorService";
import { analyzeFoodPhoto } from "../../services/openAI/foodScanService";
jest.mock("../../middlewares/authGuards/authGuardsMiddleware", () => ({
  checkUserAuthentication: (req: any, res: any, next: any) => {
    if (req.headers.authorization === "test") next();
    else res.status(401).send({ message: "Login required" });
  },
}));
jest.mock("../../services/openAI/foodScanService", () => ({ analyzeFoodPhoto: jest.fn() }));
const app = express();
app.use("/api/nutrition", router);
app.use(errorHandler);
beforeEach(() => { process.env.NODE_ENV = "test"; });
test("requires authentication before analyzing photos", async () => {
  await request(app).post("/api/nutrition/scan-food").send({ image: "private" }).expect(401);
  expect(analyzeFoodPhoto).not.toHaveBeenCalled();
});
test("returns nutrition without image and forbids caching", async () => {
  const estimate = { items: [], assumptions: "No food visible" };
  (analyzeFoodPhoto as jest.Mock).mockResolvedValue(estimate);
  const response = await request(app).post("/api/nutrition/scan-food").set("Authorization", "test")
    .send({ image: "private-photo", context: "" }).expect(200);
  expect(response.headers["cache-control"]).toBe("no-store");
  expect(response.body).toEqual({ status: "success", data: estimate });
  expect(JSON.stringify(response.body)).not.toContain("private-photo");
});
test("malformed JSON errors do not echo the original photo body", async () => {
  const response = await request(app).post("/api/nutrition/scan-food").set("Authorization", "test")
    .set("Content-Type", "application/json").send('{"image":"private-photo",').expect(400);
  expect(JSON.stringify(response.body)).not.toContain("private-photo");
  expect(analyzeFoodPhoto).not.toHaveBeenCalled();
});
