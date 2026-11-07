import express from "express";
import request from "supertest";
import router from "./userRouter";
import { errorHandler } from "../../services/error/errorService";
import { getDailyMotivation } from "../../services/dailyMotivationService";
jest.mock("../../services/dailyMotivationService", () => ({ getDailyMotivation: jest.fn() }));
jest.mock("../../services/ALSService", () => ({ getLoggedInUserIdFromReq: () => "507f1f77bcf86cd799439011" }));
jest.mock("../../middlewares/authGuards/authGuardsMiddleware", () => ({
 checkUserAuthentication: (req: any, res: any, next: any) => req.headers.authorization === "test" ? next() : res.sendStatus(401),
 checkAdminAuthorization: (_req: any, _res: any, next: any) => next(),
}));
const app = express(); app.use(express.json()); app.use("/api/user", router); app.use(errorHandler);
beforeEach(() => { process.env.NODE_ENV = "test"; });
test("requires authentication before generation", async () => {
 await request(app).post("/api/user/daily-motivation").send({ timeZone: "UTC" }).expect(401);
 expect(getDailyMotivation).not.toHaveBeenCalled();
});
test("only uses authenticated identity and does not HTTP-cache personalized text", async () => {
 (getDailyMotivation as jest.Mock).mockResolvedValue({ localDate: "2026-11-07", status: "disabled", text: null });
 const result = await request(app).post("/api/user/daily-motivation").set("Authorization", "test")
  .send({ timeZone: "Asia/Jerusalem", userId: "another-user", dailyMotivationEnabled: true }).expect(200);
 expect(result.headers["cache-control"]).toBe("no-store");
 expect(getDailyMotivation).toHaveBeenCalledWith("507f1f77bcf86cd799439011", "Asia/Jerusalem");
});
test.each([undefined, 1, {}, "x".repeat(101)])("rejects malformed time zone %p", async timeZone => {
 await request(app).post("/api/user/daily-motivation").set("Authorization", "test").send({ timeZone }).expect(400);
 expect(getDailyMotivation).not.toHaveBeenCalled();
});
