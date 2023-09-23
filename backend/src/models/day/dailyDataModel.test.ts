/* eslint-disable @typescript-eslint/no-explicit-any */
import { MeasurementUnit, NewIntakeItem } from "../../../../shared/types/intake";
import intakeService from "../../services/intake/intakeService";
import openAIService from "../../services/openAI/openAIService";
import { connectToTestDB, disconnectFromTestDB } from "../../services/test/testDBService";
import { getMockDailyData, getMongoId } from "../../services/test/testUtilService";
import { DailyDataModel } from "./dailyDataModel";

jest.mock("../../services/openAI/openAIService");
jest.mock("../../services/intake/intakeService");

const MOCK_CALORIES = 100;

describe("User Model", () => {
  beforeAll(async () => {
    (openAIService.getCaloriesForIntakeItem as jest.Mock).mockResolvedValue(MOCK_CALORIES);
    await connectToTestDB();
  });

  afterAll(async () => {
    await DailyDataModel.deleteMany({});
    await disconnectFromTestDB();
  });

  describe("Daily Data Schema", () => {
    const dailyData = getMockDailyData();

    afterEach(async () => {
      await DailyDataModel.deleteMany({});
    });

    fit("should create a new daily data", async () => {
      const validDailyData = new DailyDataModel(dailyData);
      const savedDailyData = (await validDailyData.save()).toObject();
      expect(savedDailyData._id).toBeDefined();
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

    it("should not allow duplicate dates for same userId", async () => {
      const firstDailyData = new DailyDataModel(dailyData);
      await firstDailyData.save();

      const secondDailyData = new DailyDataModel(dailyData);
      await expect(secondDailyData.save()).rejects.toThrow();
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

  describe("intakeItemSchema", () => {
    const mockIntakeItem: NewIntakeItem = {
      tempId: "tempId",
      name: "Apple",
      unit: MeasurementUnit.UNIT,
      quantity: 1,
    };

    const dailyData = getMockDailyData();
    dailyData.intakes = [
      {
        tempId: "tempId",
        name: "test",
        items: [{ ...mockIntakeItem, quantity: 2 }],
      },
    ];

    it("should correctly calculate calories based on existing intake item", async () => {
      const existingIntakeItem = { ...mockIntakeItem, calories: 50 };
      intakeService.getExistingIntakeItem = jest.fn().mockResolvedValue(existingIntakeItem);

      const intakeModel = new DailyDataModel(dailyData);

      await intakeModel.validate();

      expect(intakeModel.intakes[0].items[0].calories).toEqual(existingIntakeItem.calories * 2);
    });

    it("should fetch calories from openAIService when no existing intake item is found", async () => {
      intakeService.getExistingIntakeItem = jest.fn().mockResolvedValue(null);

      const intakeModel = new DailyDataModel({
        ...dailyData,
        intakes: [{ ...dailyData.intakes[0], items: [mockIntakeItem] }],
      });

      await intakeModel.validate();

      expect(intakeModel.intakes[0].items[0].calories).toEqual(MOCK_CALORIES);
    });
  });
});
