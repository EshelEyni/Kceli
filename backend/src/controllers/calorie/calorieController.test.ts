/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { getCaloriesForItem } from "./calorieController";
import { getMockNewIntakeItem } from "../../services/test/testUtilService";
import openAIService from "../../services/openAI/openAIService";
import intakeService from "../../services/intake/intakeService";
import calorieService from "../../services/calorie/calorieService";

jest.mock("../../services/openAI/openAIService");
jest.mock("../../services/intake/intakeService");
jest.mock("../../services/calorie/calorieService");

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

const MockSetter = {
  mockGetExistingIntakeItem: (res: { calories: number } | null) => {
    (intakeService.getExistingIntakeItem as jest.Mock).mockResolvedValue(res);
  },
  mockCalcCaloriesFromExistingItem: (calories: number) => {
    (calorieService.calcCaloriesFromExistingItem as jest.Mock).mockReturnValue(calories);
  },
  mockGetCaloriesForIntakeItem: (calories: number) => {
    (openAIService.getCaloriesForIntakeItem as jest.Mock).mockResolvedValue(calories);
  },
};

describe("Day Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  describe("getToday", () => {
    beforeEach(() => {
      req = {};
      res = { send: jest.fn() };
      next = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it("should return calories from existing item if it exists", async () => {
      // Arrange
      const testIntakeItem = getMockNewIntakeItem();

      MockSetter.mockGetExistingIntakeItem({ calories: 100 });
      MockSetter.mockCalcCaloriesFromExistingItem(100);

      req.body = testIntakeItem;

      // Act
      const sut = getCaloriesForItem as any;
      await sut(req as Request, res as Response, next);

      // Assert

      expect(intakeService.getExistingIntakeItem).toHaveBeenCalledWith(testIntakeItem);
      expect(openAIService.getCaloriesForIntakeItem).not.toHaveBeenCalled();
      expect(calorieService.calcCaloriesFromExistingItem).toHaveBeenCalledWith({
        existingItemData: { calories: 100 },
        intakeItem: testIntakeItem,
      });

      expect(res.send).toHaveBeenCalledWith({
        status: "success",
        data: 100,
      });
    });

    it("should return calories from openAI if existing item does not exist", async () => {
      // Arrange
      const testIntakeItem = getMockNewIntakeItem();

      MockSetter.mockGetExistingIntakeItem(null);
      MockSetter.mockGetCaloriesForIntakeItem(100);

      req.body = testIntakeItem;

      // Act
      const sut = getCaloriesForItem as any;
      await sut(req as Request, res as Response, next);

      // Assert
      expect(intakeService.getExistingIntakeItem).toHaveBeenCalledWith(testIntakeItem);
      expect(openAIService.getCaloriesForIntakeItem).toHaveBeenCalledWith(testIntakeItem);
      expect(calorieService.calcCaloriesFromExistingItem).not.toHaveBeenCalled();

      expect(res.send).toHaveBeenCalledWith({
        status: "success",
        data: 100,
      });
    });
  });
});
