/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExistingIntakeItemData } from "../../../../shared/types/intake";
import { UserCaloricData } from "../../../../shared/types/system";
import calorieService from "./calorieService";

describe("calcTargetCaloricIntakePerDay", () => {
  it("should return a rounded number", () => {
    const result = calorieService.calcTargetCaloricIntakePerDay({ TDEE: 2650 });
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe("calcTotalDailyEnergyExpenditure", () => {
  it("should return a rounded number", () => {
    const userCaloricData: UserCaloricData = {
      weight: 65,
      height: 165,
      age: 28,
      gender: "female",
    };
    const result = calorieService.calcTotalDailyEnergyExpenditure(userCaloricData);
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe("calcCaloriesFromExistingItem", () => {
  it("should return a rounded number", () => {
    const existingItemData = { calories: 100, quantity: 100 } as ExistingIntakeItemData;

    const intakeItem = { quantity: 50 } as any;

    const result = calorieService.calcCaloriesFromExistingItem({
      existingItemData,
      intakeItem,
    });
    expect(Number.isInteger(result)).toBe(true);
  });
});
