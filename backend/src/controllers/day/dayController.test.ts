/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
// import { asyncErrorCatcher } from "../../services/error/errorService";
import { DailyDataModel } from "../../models/day/dailyDataModel";
import { createDay, getCalenderData, getToday } from "./dayController";
import { mockGetLoggedInUserIdFromReq } from "../../services/test/testUtilService";

jest.mock("../../services/ALSService", () => ({
  getLoggedInUserIdFromReq: jest.fn().mockReturnValue("12345"),
}));

jest.mock("../../models/day/dailyDataModel", () => ({
  DailyDataModel: {
    find: jest.fn().mockImplementation(() => ({
      sort: jest.fn().mockResolvedValue({}),
    })),
    findOne: jest.fn().mockImplementation(() => ({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({}),
    })),
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

describe("Day Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let userId: string;
  describe("getCalenderData", () => {
    beforeEach(() => {
      userId = mockGetLoggedInUserIdFromReq();
      req = {};
      res = { send: jest.fn() };
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it("should return the calender data for the given month and year", async () => {
      // Arrange
      req.query = { month: "1", year: "2021" };

      const mockDailyData = {
        id: "12345",
        date: new Date(),
        userId: "12345",
        intakes: [],
      };

      mockDailyDataModelFind([mockDailyData]);

      // Act
      const sut = getCalenderData as any;
      await sut(req as Request, res as Response);

      // Assert
      expect(DailyDataModel.find).toHaveBeenCalledWith({
        userId,
        date: {
          $gte: expect.any(Date),
          $lt: expect.any(Date),
        },
      });

      expect(res.send).toHaveBeenCalledWith({
        status: "success",
        data: [mockDailyData],
      });
    });

    it("should throw an error if month or year is not provided", async () => {
      // Arrange
      req.query = { month: "1" };

      // Act
      const sut = getCalenderData as any;
      await sut(req as Request, res as Response);

      // Assert
      expect(nextMock).toHaveBeenCalledWith(new Error("Please provide month and year"));

      // Arrange
      req.query = { year: "2021" };

      // Act
      await sut(req as Request, res as Response);

      // Assert
      expect(nextMock).toHaveBeenCalledWith(new Error("Please provide month and year"));
    });

    it("should throw an error if the user is not logged in", async () => {
      // Arrange
      mockGetLoggedInUserIdFromReq("");
      // Act
      const sut = getCalenderData as any;
      await sut(req as Request, res as Response);

      // Assert
      expect(nextMock).toHaveBeenCalledWith(new Error("No loggedInUser id provided"));
    });
  });

  describe("getToday", () => {
    beforeEach(() => {
      userId = mockGetLoggedInUserIdFromReq();
      req = {};
      res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it("should return today's daily data if it exists", async () => {
      // Arrange
      res = { send: jest.fn() };
      const mockDailyData = {
        id: "12345",
        date: new Date(),
        userId: "12345",
        intakes: [],
      };

      mockDailyDataModelFindOne(mockDailyData);
      // Act
      const sut = getToday as any;
      await sut(req as Request, res as Response);

      // Assert
      expect(DailyDataModel.findOne).toHaveBeenCalledWith({ userId });

      expect(res.send).toHaveBeenCalledWith({
        status: "success",
        data: mockDailyData,
      });
    });

    it("should throw an error if the user is not logged in", async () => {
      // Arrange
      mockGetLoggedInUserIdFromReq("");
      mockDailyDataModelFindOne({});
      // Act
      const sut = getToday as any;
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

      const mockDailyData = {
        id: "12345",
        date: new Date(),
        userId: "12345",
        intakes: [],
      };

      (DailyDataModel.create as jest.Mock).mockResolvedValue(mockDailyData);

      // Act
      const sut = createDay as any;
      await sut(req as Request, res as Response);

      // Assert
      expect(DailyDataModel.create).toHaveBeenCalledWith({ ...req.body, userId });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        status: "success",
        data: mockDailyData,
      });
    });

    it("should throw an error if the user is not logged in", async () => {
      // Arrange
      mockGetLoggedInUserIdFromReq("");
      // Act
      const sut = createDay as any;
      await sut(req as Request, res as Response);

      // Assert
      expect(nextMock).toHaveBeenCalledWith(new Error("No loggedInUser id provided"));
    });
  });
});

function mockDailyDataModelFindOne(value: any) {
  (DailyDataModel.findOne as jest.Mock).mockImplementation(() => ({
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(value),
  }));
}

function mockDailyDataModelFind(value: any) {
  (DailyDataModel.find as jest.Mock).mockImplementation(() => ({
    sort: jest.fn().mockResolvedValue(value),
  }));
}
