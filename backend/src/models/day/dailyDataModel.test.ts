/* eslint-disable @typescript-eslint/no-explicit-any */
import intakeService from "../../services/intake/intakeService";
import openAIService from "../../services/openAI/openAIService";
import { connectToTestDB, disconnectFromTestDB } from "../../services/test/testDBService";
import {
  createValidUserCreds,
  getMockDailyData,
  getMongoId,
  getNewMockIntake,
  mockGetLoggedInUserIdFromReq,
} from "../../services/test/testUtilService";
import { UserModel } from "../user/userModel";
import { DailyDataModel } from "./dailyDataModel";
import { DayData } from "../../../../shared/types/dayData";

jest.mock("../../services/openAI/openAIService");
jest.mock("../../services/intake/intakeService");
jest.mock("../../services/ALSService");

const MOCK_CALORIES = 100;

describe("Daily Data Model", () => {
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

  describe("Daily Data Schema", () => {
    const dailyData = getMockDailyData({});

    afterEach(async () => {
      await DailyDataModel.deleteMany({});
    });

    it("should create a new daily data", async () => {
      const validDailyData = new DailyDataModel(dailyData);
      const savedDailyData = (await validDailyData.save()).toObject();
      expect(savedDailyData.id).toBeDefined();
      expect(savedDailyData.date).toEqual(dailyData.date);

      savedDailyData.intakes.forEach((intake: any, index: number) => {
        expect(intake.name).toEqual(dailyData.intakes[index].name);
        intake.items.forEach((item: any, itemIndex: number) => {
          expect(item.name).toEqual(dailyData.intakes[index].items[itemIndex].name);
          expect(item.quantity).toEqual(dailyData.intakes[index].items[itemIndex].quantity);
          expect(item.unit).toEqual(dailyData.intakes[index].items[itemIndex].unit);
        });
      });
    });

    it("should throw an error if userId is missing", async () => {
      const invalidData = { ...dailyData } as any;
      delete invalidData.userId;

      const invalidDailyData = new DailyDataModel(invalidData);
      await expect(invalidDailyData.save()).rejects.toThrow();
    });

    it("should allow duplicate dates for different userIds", async () => {
      const firstDailyData = new DailyDataModel(dailyData);
      await firstDailyData.save();

      const secondDailyData = new DailyDataModel({
        ...dailyData,
        userId: getMongoId(),
      });
      await expect(secondDailyData.save()).resolves.toBeDefined();
    });

    it("should correctly calculate and save calories", async () => {
      const validDailyData = new DailyDataModel(dailyData);
      const savedDailyData = (await validDailyData.save()).toObject();

      savedDailyData.intakes.forEach((intake: any) => {
        intake.items.forEach((item: any) => {
          expect(item.calories).toEqual(MOCK_CALORIES);
        });
      });
    });

    it("should handle correctly when openAI service throws an error", async () => {
      (openAIService.getCaloriesForIntakeItem as jest.Mock).mockRejectedValueOnce(
        new Error("test error")
      );

      const validDailyData = new DailyDataModel(dailyData);
      const savedDailyData = (await validDailyData.save()).toObject();

      savedDailyData.intakes.forEach((intake: any) => {
        intake.items.forEach((item: any) => {
          expect(item.calories).toEqual(0);
        });
      });
    });

    it("should correctly associate a user ID", async () => {
      const validDailyData = new DailyDataModel(dailyData);
      const savedDailyData = (await validDailyData.save()).toObject();

      expect(savedDailyData.userId.toString()).toEqual(dailyData.userId);
    });
  });

  fdescribe("Daily Data Schema Hooks", () => {
    const dailyData = getMockDailyData({});

    afterEach(async () => {
      await DailyDataModel.deleteMany({});
    });

    it("should set the date to next day if the date is equal to the last saved entry", async () => {
      const user = await UserModel.create(createValidUserCreds());
      const validDailyData1 = new DailyDataModel({
        ...dailyData,
        userId: user.id,
        date: new Date(),
      });
      await validDailyData1.save();

      // Create second entry for the user without explicitly setting the date
      const validDailyData2 = new DailyDataModel({ ...dailyData, userId: user.id });
      const savedDailyData2 = (await validDailyData2.save()).toObject();

      // Check that the date in the new entry is one day after the last saved entry
      const expectedNextDay = new Date();
      expectedNextDay.setDate(expectedNextDay.getDate() + 1);
      expect(new Date(savedDailyData2.date).toDateString()).toEqual(expectedNextDay.toDateString());
    });

    it("should not set the date to next day if there is no last entry", async () => {
      const user = await UserModel.create(createValidUserCreds());
      const validDailyData = new DailyDataModel({ ...dailyData, userId: user.id });
      const savedDailyData = (await validDailyData.save()).toObject();

      expect(new Date(savedDailyData.date).toDateString()).toEqual(new Date().toDateString());
    });

    it("should not set the date to next day if the date is not equal to the last saved entry", async () => {
      const user = await UserModel.create(createValidUserCreds());
      const validDailyData1 = new DailyDataModel({
        ...dailyData,
        userId: user.id,
        date: new Date(),
      });
      await validDailyData1.save();

      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);

      // Create second entry for the user without explicitly setting the date
      const validDailyData2 = new DailyDataModel({
        ...dailyData,
        userId: user.id,
        date: nextDay,
      });
      const savedDailyData2 = (await validDailyData2.save()).toObject();

      // Check that the date in the new entry is one day after the last saved entry
      expect(new Date(savedDailyData2.date).toDateString()).toEqual(nextDay.toDateString());
    });

    it("should correctly calculate TDEE and target caloric intake when updating weight", async () => {
      const user = await UserModel.create(createValidUserCreds());
      mockGetLoggedInUserIdFromReq(user.id);
      const validDailyData = new DailyDataModel({ ...dailyData, userId: user.id });
      const savedDailyData = (await validDailyData.save()).toObject();
      expect(savedDailyData.totalDailyEnergyExpenditure).toBeUndefined();
      expect(savedDailyData.targetCaloricIntake).toBeUndefined();

      const updatedDailyData = (await DailyDataModel.findOneAndUpdate(
        { _id: savedDailyData.id },
        { weight: 200 },
        { new: true }
      )) as any;

      expect(updatedDailyData.totalDailyEnergyExpenditure).toBeDefined();
      expect(updatedDailyData.targetCaloricIntake).toBeDefined();
    });
  });

  describe("intake Item Schema", () => {
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
      expect(openAIService.getCaloriesForIntakeItem).not.toHaveBeenCalled();
      savedDailyData.intakes.forEach((intake: any) => {
        intake.items.forEach((item: any) => {
          expect(item.calories).toEqual(100);
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

      expect(validDailyData.intakes[0].items[0].calories).toEqual(existingItemData.calories * 2);
    });

    it("should fetch calories from openAIService when no existing intake item is found", async () => {
      const dailyData = getMockDailyData({});
      intakeService.getExistingIntakeItem = jest.fn().mockResolvedValue(null);

      const intakeModel = new DailyDataModel(dailyData);

      await intakeModel.save();

      expect(intakeModel.intakes[0].items[0].calories).toEqual(MOCK_CALORIES);
    });
  });
});
