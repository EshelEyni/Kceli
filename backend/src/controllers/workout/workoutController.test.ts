/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { getAllWorkouts, createWorkout } from "./workoutController";
import { getMockWorkout, mockGetLoggedInUserIdFromReq } from "../../services/test/testUtilService";
import { WorkoutModel } from "../../models/workout/workoutModel";

jest.mock("../../services/ALSService", () => ({
  getLoggedInUserIdFromReq: jest.fn().mockReturnValue("12345"),
}));

jest.mock("../../models/workout/WorkoutModel", () => ({
  WorkoutModel: {
    find: jest.fn(),
    create: jest.fn(),
  },
}));

const nextMock = jest.fn() as jest.MockedFunction<NextFunction>;

jest.mock("../../services/error/errorService", () => {
  const originalModule = jest.requireActual("../../services/error/errorService");
  return {
    ...originalModule,
    asyncErrorCatcher: jest.fn().mockImplementation(fn => {
      return async (...args: unknown[]) => {
        try {
          return await fn(...args);
        } catch (error) {
          return nextMock(error);
        }
      };
    }),
  };
});

describe("Workout Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let userId: string;

  describe("getAllWorkouts", () => {
    beforeEach(() => {
      userId = mockGetLoggedInUserIdFromReq();
      req = {};
      res = { send: jest.fn() };
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it("should return today's daily data if it exists", async () => {
      // Arrange
      res = { send: jest.fn() };
      const mockWorkouts = getMockWorkout();

      mockWorkoutModelFind(mockWorkouts);
      // Act
      const sut = getAllWorkouts as any;
      await sut(req as Request, res as Response);

      // Assert
      expect(WorkoutModel.find).toHaveBeenCalledWith({ userId });

      expect(res.send).toHaveBeenCalledWith({
        status: "success",
        data: mockWorkouts,
      });
    });

    it("should throw an error if the user is not logged in", async () => {
      // Arrange
      mockGetLoggedInUserIdFromReq("");
      mockWorkoutModelFind({});
      // Act
      const sut = getAllWorkouts as any;
      await sut(req as Request, res as Response);

      // Assert
      expect(nextMock).toHaveBeenCalledWith(new Error("No loggedInUser id provided"));
    });
  });

  describe("createDay", () => {
    beforeEach(() => {
      userId = mockGetLoggedInUserIdFromReq();
      req = {};
      res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it("should create a new day", async () => {
      // Arrange
      req.body = {};

      const mockWorkout = getMockWorkout();

      mockWorkoutModelCreate(mockWorkout);

      // Act
      const sut = createWorkout as any;
      await sut(req as Request, res as Response);

      // Assert
      expect(WorkoutModel.create).toHaveBeenCalledWith({ ...req.body, userId });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        status: "success",
        data: mockWorkout,
      });
    });

    it("should throw an error if the user is not logged in", async () => {
      // Arrange
      mockGetLoggedInUserIdFromReq("");

      // Act
      const sut = createWorkout as any;
      await sut(req as Request, res as Response);

      // Assert
      expect(nextMock).toHaveBeenCalledWith(new Error("No loggedInUser id provided"));
    });
  });
});

function mockWorkoutModelFind(value: any) {
  (WorkoutModel.find as jest.Mock).mockResolvedValue(value);
}

function mockWorkoutModelCreate(value: any) {
  (WorkoutModel.create as jest.Mock).mockResolvedValue(value);
}
