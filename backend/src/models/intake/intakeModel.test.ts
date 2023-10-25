/* eslint-disable @typescript-eslint/no-explicit-any */
import intakeService from "../../services/intake/intakeService";
import openAIService from "../../services/openAI/openAIService";
import { connectToTestDB, disconnectFromTestDB } from "../../services/test/testDBService";
import { getMockDailyData, getNewMockIntake } from "../../services/test/testUtilService";
import { UserModel } from "../user/userModel";
import { DailyDataModel } from "../day/dailyDataModel";
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
