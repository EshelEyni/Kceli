/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import {
  getMockFavoriteIntake,
  mockGetLoggedInUserIdFromReq,
} from "../../services/test/testUtilService";
import { FavoriteIntakeModel } from "../../models/intake/intakeModel";
import { createFavoriteIntake, getUserFavoriteIntakes } from "./intakeController";

jest.mock("../../services/ALSService", () => ({
  getLoggedInUserIdFromReq: jest.fn().mockReturnValue("12345"),
}));

jest.mock("../../models/intake/intakeModel", () => ({
  FavoriteIntakeModel: {
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

describe("Intake Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let userId: string;

  describe("getUserFavoriteIntakes", () => {
    beforeEach(() => {
      userId = mockGetLoggedInUserIdFromReq();
      req = {};
      res = { send: jest.fn() };
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should return the favorite intakes for the logged in user", async () => {
      const mockFavoriteIntakes = [getMockFavoriteIntake(), getMockFavoriteIntake()];
      mockFavoriteIntakeModelFind(mockFavoriteIntakes);

      // Act
      const sut = getUserFavoriteIntakes as any;
      await sut(req as Request, res as Response);

      // Assert
      expect(FavoriteIntakeModel.find).toHaveBeenCalledWith({ userId });
      expect(res.send).toHaveBeenCalledWith({
        status: "success",
        requestedAt: expect.any(String),
        results: mockFavoriteIntakes.length,
        data: mockFavoriteIntakes,
      });
    });

    it("should throw error when user id is not provided", async () => {
      // Arrange
      mockGetLoggedInUserIdFromReq("");

      // Act
      const sut = getUserFavoriteIntakes as any;
      await sut(req as Request, res as Response);

      // Assert
      expect(nextMock).toHaveBeenCalledWith(new Error("No loggedInUser id provided"));
    });
  });

  fdescribe("createFavoriteIntake", () => {
    beforeEach(() => {
      userId = mockGetLoggedInUserIdFromReq();
      req = { body: {} };
      res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should create a favorite intake for the logged in user", async () => {
      // Arrange
      const mockFavoriteIntake = getMockFavoriteIntake();
      req.body = mockFavoriteIntake;
      mockFavoriteIntakeModelCreate(mockFavoriteIntake);

      // Act
      const sut = createFavoriteIntake as any;
      await sut(req as Request, res as Response);

      // Assert
      expect(FavoriteIntakeModel.create).toHaveBeenCalledWith({
        ...req.body,
        userId,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        status: "success",
        data: mockFavoriteIntake,
      });
    });

    it("should throw error when user id is not provided", async () => {
      // Arrange
      mockGetLoggedInUserIdFromReq("");

      // Act
      const sut = createFavoriteIntake as any;
      await sut(req as Request, res as Response);

      // Assert
      expect(nextMock).toHaveBeenCalledWith(new Error("No loggedInUser id provided"));
    });
  });
});

function mockFavoriteIntakeModelFind(value: any) {
  (FavoriteIntakeModel.find as jest.Mock).mockImplementation(() => ({
    sort: jest.fn().mockResolvedValue(value),
  }));
}

function mockFavoriteIntakeModelCreate(value: any) {
  (FavoriteIntakeModel.create as jest.Mock).mockResolvedValue(value);
}
