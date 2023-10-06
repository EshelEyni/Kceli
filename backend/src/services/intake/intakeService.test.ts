/* eslint-disable @typescript-eslint/no-explicit-any */
import { MeasurementUnit } from "../../../../shared/types/intake";
import { DailyDataModel } from "../../models/day/dailyDataModel";
import openAIService from "../openAI/openAIService";
import { connectToTestDB, disconnectFromTestDB } from "../test/testDBService";
import { createTestDailyData, getMockDailyData } from "../test/testUtilService";
import intakeService from "./intakeService";

jest.mock("../openAI/openAIService");

const MOCK_CALORIES = 100;

describe("Intake Service", () => {
  beforeAll(async () => {
    (openAIService.getCaloriesForIntakeItem as jest.Mock).mockResolvedValue(MOCK_CALORIES);

    await connectToTestDB();
    await createTestDailyData();
  });

  afterAll(async () => {
    await DailyDataModel.deleteMany({});
    await disconnectFromTestDB();
  });

  describe("Get All Intake Items", () => {
    it("should retrieve all intake items and have correct properties", async () => {
      // Arrange: Create some test data if not already created
      const dailyData = getMockDailyData({});
      await DailyDataModel.create(dailyData);

      // Act: Call the function to test
      const intakeItems = await intakeService.getAllIntakeItems();

      // Assert: Check if the returned data is as expected
      expect(intakeItems.length).toBeGreaterThan(0); // Should return at least one item
      intakeItems.forEach(item => {
        expect(item).toHaveProperty("name");
        expect(item).toHaveProperty("calories");
        expect(item).toHaveProperty("unit");
        expect(item).toHaveProperty("quantity");
      });
    });
  });

  describe("Get Existing Intake Item", () => {
    it("should be true", async () => {
      const dailyData = getMockDailyData({});
      dailyData.intakes[0].items.push({
        name: "Apple",
        unit: MeasurementUnit.GRAM,
        quantity: 100,
        tempId: "123",
      });
      await DailyDataModel.create(dailyData);
      const newIntakeItem: any = {
        tempId: "123",
        name: "Apple",
        unit: MeasurementUnit.GRAM,
        quantity: 100,
      };
      const intakeItem = await intakeService.getExistingIntakeItem(newIntakeItem);

      expect(intakeItem).toBeDefined();
      expect(intakeItem).toHaveProperty("name");
      expect(intakeItem).toHaveProperty("calories");
      expect(intakeItem).toHaveProperty("unit");
    });

    it("should reutrn null if intake item does not exist", async () => {
      const newIntakeItem: any = {
        tempId: "123",
        name: "Orange",
        unit: MeasurementUnit.GRAM,
        quantity: 100,
      };
      const intakeItem = await intakeService.getExistingIntakeItem(newIntakeItem);

      expect(intakeItem).toBeNull();
    });
  });
});
