/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import { User } from "../../../../shared/types/user";
import router from "./dayRouter";
import { errorHandler } from "../../services/error/errorService";
import { connectToTestDB, disconnectFromTestDB } from "../../services/test/testDBService";
import {
  createTestUser,
  deleteTestUser,
  getLoginTokenStrForTest,
  getMongoId,
  getNewMockIntake,
} from "../../services/test/testUtilService";
import setupAsyncLocalStorage from "../../middlewares/setupALS/setupALSMiddleware";
import { assertDailyData } from "../../services/test/testAssertionService";
import { DailyDataModel } from "../../models/day/dailyDataModel";
import openAIService from "../../services/openAI/openAIService";
jest.mock("../../services/openAI/openAIService");

(openAIService.getCaloriesForIntakeItem as jest.Mock).mockResolvedValue(100);

const app = express();
app.use(cookieParser());
app.use(express.json());
app.all("*", setupAsyncLocalStorage);
app.use(router);
app.use(errorHandler);

describe("Day Router: GET Actions", () => {
  let validUser: User, token: string;

  beforeAll(async () => {
    await connectToTestDB();
    validUser = await createTestUser({});
    token = getLoginTokenStrForTest(validUser.id);
  });

  afterEach(async () => {
    await DailyDataModel.deleteMany({});
  });

  afterAll(async () => {
    await deleteTestUser(validUser.id);
    await disconnectFromTestDB();
  });

  describe("GET /", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return 200 and an array of days if days match the query", async () => {
      await DailyDataModel.create({ userId: validUser.id });
      const res = await request(app).get("/").set("Cookie", [token]);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        status: "success",
        requestedAt: expect.any(String),
        results: expect.any(Number),
        data: expect.any(Array),
      });
      const days = res.body.data;
      expect(days.length).toBeGreaterThan(0);
      days.forEach(assertDailyData);
    });
  });

  describe("GET /:id", () => {
    let dailtDataId: string;

    beforeAll(async () => {
      const dailyData = await DailyDataModel.create({ userId: validUser.id });
      dailtDataId = dailyData.id;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return 200 and a day if a day with the given ID exists", async () => {
      const res = await request(app).get(`/${dailtDataId}`).set("Cookie", [token]);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        status: "success",
        data: expect.any(Object),
      });
      assertDailyData(res.body.data);
    });

    it("should return 404 if a day with the given ID does not exist", async () => {
      await DailyDataModel.findByIdAndDelete(dailtDataId);
      const res = await request(app).get(`/${dailtDataId}`).set("Cookie", [token]);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: "fail",
          message: `No daily data was found with the id: ${dailtDataId}`,
        })
      );
    });
  });

  describe("GET /today", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return 200 and today's day if a day with the given ID exists", async () => {
      await DailyDataModel.create({ userId: validUser.id });
      const res = await request(app).get(`/today`).set("Cookie", [token]);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        status: "success",
        data: expect.any(Object),
      });
      assertDailyData(res.body.data);
      await DailyDataModel.deleteMany({});
    });

    it("should return 201 if a day with the given ID does not exist", async () => {
      const res = await request(app).get(`/today`).set("Cookie", [token]);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({
        status: "success",
        data: expect.any(Object),
      });
      assertDailyData(res.body.data);
      await DailyDataModel.deleteMany({});
    });

    it("should return 404 if the user is not logged in", async () => {
      const res = await request(app).get(`/today`);
      expect(res.statusCode).toEqual(401);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: "fail",
          message: "You are not logged in! Please log in to get access.",
        })
      );
    });

    it("should return 404 if the user is not found", async () => {
      const res = await request(app)
        .get(`/today`)
        .set("Cookie", [getLoginTokenStrForTest(getMongoId())]);
      expect(res.statusCode).toEqual(401);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: "fail",
          message: "The user belonging to this token does not exist.",
        })
      );
    });
  });

  describe("PATCH /:id", () => {
    let dailtDataId: string;

    beforeAll(async () => {
      const dailyData = await DailyDataModel.create({ userId: validUser.id });
      dailtDataId = dailyData.id;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return 200 and the updated day if a day with the given ID exists", async () => {
      const res = await request(app)
        .patch(`/${dailtDataId}`)
        .set("Cookie", [token])
        .send({ intakes: [getNewMockIntake()] });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        status: "success",
        data: expect.any(Object),
      });
      assertDailyData(res.body.data);
    });

    it("should return 404 if a day with the given ID does not exist", async () => {
      await DailyDataModel.findByIdAndDelete(dailtDataId);
      const res = await request(app)
        .patch(`/${dailtDataId}`)
        .set("Cookie", [token])
        .send({ intakes: [{ food: "test food" }] });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: "fail",
          message: `No daily data was found with the id: ${dailtDataId}`,
        })
      );
    });
  });
});
