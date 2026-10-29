import express from "express";
import request from "supertest";
import { Types } from "mongoose";
import dayRouter from "../../routers/day/dayRouter";
import { DailyDataModel } from "../../models/day/dailyDataModel";
import { errorHandler } from "../../services/error/errorService";

jest.mock("../../services/openAI/openAIService", () => ({ __esModule: true, default: {} }));
jest.mock("../../middlewares/authGuards/authGuardsMiddleware", () => ({
  checkUserAuthentication: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

const app = express();
app.use(express.json());
app.use("/api/day", dayRouter);
app.use(errorHandler);
const id = new Types.ObjectId().toString();
afterEach(() => jest.restoreAllMocks());

describe("Retired hunger tracking", () => {
  it("does not define or accept hunger events in new daily documents", () => {
    expect(DailyDataModel.schema.path("hungerEvents")).toBeUndefined();
    const day = new DailyDataModel({ userId: id, hungerEvents: [{ level: 3, date: new Date() }] });
    expect(day.get("hungerEvents")).toBeUndefined();
  });

  it("continues to accept ordinary drink entries and workout progress", async () => {
    const intakes = [{ type: "drink", name: "Tea", items: [], isRecorded: true }];
    const workouts: unknown[] = [];
    const update = jest
      .spyOn(DailyDataModel, "findByIdAndUpdate")
      .mockResolvedValue({ id, intakes, workouts } as never);
    const response = await request(app).patch(`/api/day/${id}`).send({ intakes, workouts });
    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith(
      id,
      { intakes, workouts },
      { new: true, runValidators: true }
    );
  });
});
