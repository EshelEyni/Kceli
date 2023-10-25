/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "supertest";
import cookieParser from "cookie-parser";
import express from "express";
import setupAsyncLocalStorage from "../../middlewares/setupALS/setupALSMiddleware";
import router from "../intake/intakeRouter";
import { errorHandler } from "../../services/error/errorService";
import { User } from "../../../../shared/types/user";
import { connectToTestDB, disconnectFromTestDB } from "../../services/test/testDBService";
import {
  createTestUser,
  deleteTestUser,
  getLoginTokenStrForTest,
} from "../../services/test/testUtilService";
import { FavoriteIntakeModel } from "../../models/intake/intakeModel";
import { getMockNewIntakeItem } from "../../services/test/testUtilService";
import { assertIntake } from "../../services/test/testAssertionService";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.all("*", setupAsyncLocalStorage);
app.use(router);
app.use(errorHandler);

describe("Intake Router", () => {
  let validUser: User, token: string;

  beforeAll(async () => {
    await connectToTestDB();
    validUser = await createTestUser({});
    token = getLoginTokenStrForTest(validUser.id);
  });

  afterAll(async () => {
    await deleteTestUser(validUser.id);
    await disconnectFromTestDB();
  });

  describe(" GET /", () => {
    afterEach(async () => {
      await FavoriteIntakeModel.deleteMany({});
    });

    it("should return 200 and an array of favorite intakes", async () => {
      const intakes = [
        { ...getMockNewIntakeItem(), userId: validUser.id },
        { ...getMockNewIntakeItem(), userId: validUser.id },
      ];

      await FavoriteIntakeModel.create(intakes);

      const res = await request(app).get("/favorite").set("Cookie", [token]);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        status: "success",
        requestedAt: expect.any(String),
        results: expect.any(Number),
        data: expect.any(Array),
      });

      const { data: retrievedIntakes } = res.body;
      expect(retrievedIntakes.length).toEqual(2);

      for (const intake of retrievedIntakes) {
        assertIntake(intake);
        expect(intake.userId).toEqual(validUser.id);
      }
    });
  });

  describe("POST /", () => {
    afterEach(async () => {
      await FavoriteIntakeModel.deleteMany({});
    });

    it("should return 201 and the created favorite intake", async () => {
      const intake = { ...getMockNewIntakeItem(), userId: validUser.id };

      const res = await request(app).post("/favorite").set("Cookie", [token]).send(intake);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({
        status: "success",
        data: expect.any(Object),
      });

      const { data: retrievedIntake } = res.body;
      assertIntake(retrievedIntake);
      expect(retrievedIntake.userId).toEqual(validUser.id);
    });
  });

  describe("PATCH /", () => {
    afterEach(async () => {
      await FavoriteIntakeModel.deleteMany({});
    });

    it("should return 200 and the updated favorite intake", async () => {
      const intake = await FavoriteIntakeModel.create({
        ...getMockNewIntakeItem(),
        id: undefined,
        userId: validUser.id,
      });

      const update = { items: [] };

      const res = await request(app)
        .patch(`/favorite/${intake.id}`)
        .set("Cookie", [token])
        .send(update);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        status: "success",
        data: expect.any(Object),
      });

      const { data: retrievedIntake } = res.body;
      assertIntake(retrievedIntake);
      expect(retrievedIntake.userId).toEqual(validUser.id);
      expect(retrievedIntake.items.length).toEqual(0);
    });
  });

  describe("DELETE /", () => {
    afterEach(async () => {
      await FavoriteIntakeModel.deleteMany({});
    });

    it("should return 204 and no content", async () => {
      const intake = await FavoriteIntakeModel.create({
        ...getMockNewIntakeItem(),
        id: undefined,
        userId: validUser.id,
      });

      const res = await request(app).delete(`/favorite/${intake.id}`).set("Cookie", [token]);

      expect(res.statusCode).toEqual(204);
      expect(res.body).toEqual({});
    });
  });
});
