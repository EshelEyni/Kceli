/* eslint-disable @typescript-eslint/no-explicit-any */
import intakeService from "../../services/intake/intakeService";
import openAIService from "../../services/openAI/openAIService";
import { connectToTestDB, disconnectFromTestDB } from "../../services/test/testDBService";
import {
  getMockDailyData,
  getMockFavoriteIntake,
  getMongoId,
  getNewMockIntake,
} from "../../services/test/testUtilService";
import { UserModel } from "../user/userModel";
import { DailyDataModel } from "../day/dailyDataModel";
import { DayData } from "../../../../shared/types/dayData";
import { FavoriteIntakeModel } from "./intakeModel";
import { assertFavoriteIntake } from "../../services/test/testAssertionService";

jest.mock("../../services/openAI/openAIService");
jest.mock("../../services/intake/intakeService");
jest.mock("../../services/ALSService");

const MOCK_CALORIES = 100;

describe("Intake Model (Schema's and Favorite Intake)", () => {
  beforeAll(async () => {
    (openAIService.getCaloriesForIntakeItem as jest.Mock).mockResolvedValue(MOCK_CALORIES);
    await connectToTestDB();
  });

  afterAll(async () => {
    await DailyDataModel.deleteMany({});
    await UserModel.deleteMany({});
    await disconnectFromTestDB();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("intake Item Schema", () => {
    afterEach(async () => {
      jest.clearAllMocks();
      await DailyDataModel.deleteMany({});
    });

    it("should throw error when name is not provided", async () => {
      const dailyData = getMockDailyData({});
      dailyData.intakes[0].items[0].name = "";

      const invalidDailyData = new DailyDataModel(dailyData);
      await expect(invalidDailyData.save()).rejects.toThrowError("Please provide a name");
    });

    it("should throw error when unit is not provided", async () => {
      const dailyData = getMockDailyData({});
      dailyData.intakes[0].items[0].unit = null as any;

      const invalidDailyData = new DailyDataModel(dailyData);
      await expect(invalidDailyData.save()).rejects.toThrowError("Please provide a unit");
    });

    it("should throw error when quantity is not provided", async () => {
      const dailyData = getMockDailyData({});
      dailyData.intakes[0].items[0].quantity = null as any;

      const invalidDailyData = new DailyDataModel(dailyData);
      await expect(invalidDailyData.save()).rejects.toThrowError("Please provide a quantity");
    });
  });

  describe("Intake Item Hooks", () => {
    afterEach(async () => {
      jest.clearAllMocks();
      await DailyDataModel.deleteMany({});
    });

    it("should add calories manually if provided", async () => {
      const intake = getNewMockIntake();
      intake.items[0].calories = 100;
      const dailyData: DayData = {
        ...getMockDailyData({}),
        intakes: [intake],
      };

      const validDailyData = new DailyDataModel(dailyData);
      const savedDailyData = (await validDailyData.save()).toObject();
      expect(intakeService.getExistingIntakeItem).not.toHaveBeenCalled();
      expect(openAIService.getCaloriesForIntakeItem).not.toHaveBeenCalled();
      savedDailyData.intakes.forEach((intake: any) => {
        intake.items.forEach((item: any) => {
          expect(item.calories).toEqual(100);
        });
      });
    });

    it("should default calorie count for water intake item", async () => {
      const intake = getNewMockIntake();
      intake.items[0].name = "water";
      const dailyData: DayData = {
        ...getMockDailyData({}),
        intakes: [intake],
      };

      const validDailyData = new DailyDataModel(dailyData);
      const savedDailyData = (await validDailyData.save()).toObject();
      expect(intakeService.getExistingIntakeItem).not.toHaveBeenCalled();
      expect(openAIService.getCaloriesForIntakeItem).not.toHaveBeenCalled();
      savedDailyData.intakes.forEach((intake: any) => {
        intake.items.forEach((item: any) => {
          expect(item.calories).toEqual(0);
        });
      });
    });

    it("should correctly calculate calories based on existing intake item", async () => {
      const dailyData = getMockDailyData({});

      dailyData.intakes[0].items[0].quantity = 2;

      const existingItemData = { calories: 50, quantity: 1 };
      intakeService.getExistingIntakeItem = jest.fn().mockResolvedValue(existingItemData);

      const validDailyData = new DailyDataModel(dailyData);

      await validDailyData.save();
      expect(intakeService.getExistingIntakeItem).toHaveBeenCalledWith(
        expect.objectContaining(dailyData.intakes[0].items[0])
      );
      expect(openAIService.getCaloriesForIntakeItem).not.toHaveBeenCalled();
      expect(validDailyData.intakes[0].items[0].calories).toEqual(existingItemData.calories * 2);
    });

    it("should fetch calories from openAIService when no existing intake item is found", async () => {
      const dailyData = getMockDailyData({});
      intakeService.getExistingIntakeItem = jest.fn().mockResolvedValue(null);

      const intakeModel = new DailyDataModel(dailyData);

      await intakeModel.save();
      expect(intakeService.getExistingIntakeItem).toHaveBeenCalledWith(
        expect.objectContaining(dailyData.intakes[0].items[0])
      );
      expect(openAIService.getCaloriesForIntakeItem).toHaveBeenCalledWith(
        expect.objectContaining(dailyData.intakes[0].items[0])
      );
      expect(intakeModel.intakes[0].items[0].calories).toEqual(MOCK_CALORIES);
    });
  });

  describe("Intake Schema", () => {
    afterEach(async () => {
      jest.clearAllMocks();
      await DailyDataModel.deleteMany({});
    });

    it("should throw error when items are not provided", async () => {
      const dailyData = getMockDailyData({});
      dailyData.intakes[0].items = null as any;

      const invalidDailyData = new DailyDataModel(dailyData);
      await expect(invalidDailyData.save()).rejects.toThrowError("Please provide intake items");
    });

    it("should have default value for isRecorded", async () => {
      const dailyData = getMockDailyData({});
      delete dailyData.intakes[0].isRecorded;

      const validDailyData = new DailyDataModel(dailyData);
      const savedDailyData = (await validDailyData.save()).toObject();
      expect(savedDailyData.intakes[0].isRecorded).toEqual(true);
    });
  });

  describe("Favorite Intake", () => {
    afterEach(async () => {
      jest.clearAllMocks();
      await DailyDataModel.deleteMany({});
    });

    it("should return favorite intake", async () => {
      const intake = getMockFavoriteIntake();
      intake.userId = getMongoId();
      const favoriteIntake = await FavoriteIntakeModel.create(intake);
      assertFavoriteIntake(favoriteIntake.toObject());
    });

    it("should throw error when user is not provided", async () => {
      const intake = getMockFavoriteIntake();
      intake.userId = null as any;
      const favoriteIntake = new FavoriteIntakeModel(intake);
      await expect(favoriteIntake.save()).rejects.toThrowError("Please provide a user id");
    });

    it("should set default value for sortOrder", async () => {
      const intake = getMockFavoriteIntake();
      intake.userId = getMongoId();
      intake.sortOrder = undefined as any;
      const favoriteIntake = await FavoriteIntakeModel.create(intake);
      expect(favoriteIntake.sortOrder).toEqual(0);
    });
  });
});
