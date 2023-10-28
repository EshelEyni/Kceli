/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import router from "./workoutRouter";
import { errorHandler } from "../../services/error/errorService";
import { connectToTestDB, disconnectFromTestDB } from "../../services/test/testDBService";
import {
  createTestUser,
  deleteTestUser,
  getLoginTokenStrForTest,
} from "../../services/test/testUtilService";
import setupAsyncLocalStorage from "../../middlewares/setupALS/setupALSMiddleware";
import { User } from "../../../../shared/types/user";
import { WorkoutModel } from "../../models/workout/workoutModel";
import { assertWorkout } from "../../services/test/testAssertionService";

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
    await WorkoutModel.deleteMany({});
  });

  afterAll(async () => {
    await deleteTestUser(validUser.id);
    await disconnectFromTestDB();
  });

  describe("GET /", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return 200 and an array of workouts", async () => {
      await WorkoutModel.create({ userId: validUser.id });
      const res = await request(app).get("/").set("Cookie", [token]);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        status: "success",
        requestedAt: expect.any(String),
        results: 1,
        data: expect.any(Array),
      });

      const workouts = res.body.data;
      for (const workout of workouts) {
        assertWorkout(workout);
      }
    });
  });

  describe("GET /:id", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return 200 and a workout", async () => {
      const workout = await WorkoutModel.create({ userId: validUser.id });
      const res = await request(app).get(`/${workout.id}`).set("Cookie", [token]);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        status: "success",
        data: expect.any(Object),
      });

      const returnedWorkout = res.body.data;
      assertWorkout(returnedWorkout);
    });

    it("should return 404 if workout not found", async () => {
      const res = await request(app).get(`/invalidId`).set("Cookie", [token]);
      expect(res.statusCode).toEqual(404);
    });
  });

  describe("POST /", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return 201 and a workout", async () => {
      const workout = { description: "test" };
      const res = await request(app).post(`/`).set("Cookie", [token]).send(workout);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({
        status: "success",
        data: expect.any(Object),
      });

      const returnedWorkout = res.body.data;
      assertWorkout(returnedWorkout);
    });
  });

  describe("PATCH /:id", () => {
    let workoutId: string;

    beforeAll(async () => {
      const workout = await WorkoutModel.create({ userId: validUser.id });
      workoutId = workout.id;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return 200 and a workout", async () => {
      const workout = { description: "test" };
      const res = await request(app).patch(`/${workoutId}`).set("Cookie", [token]).send(workout);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        status: "success",
        data: expect.any(Object),
      });

      const returnedWorkout = res.body.data;
      assertWorkout(returnedWorkout);
    });
  });

  describe("DELETE /:id", () => {
    let workoutId: string;

    beforeAll(async () => {
      const workout = await WorkoutModel.create({ userId: validUser.id });
      workoutId = workout.id;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return 204", async () => {
      const res = await request(app).delete(`/${workoutId}`).set("Cookie", [token]);
      expect(res.statusCode).toEqual(204);
    });
  });
});
