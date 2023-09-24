import { UserCaloricData } from "../../../../shared/types/system";
import calorieService from "./calorieService";

describe("calculateTargetCaloricIntakePerDay", () => {
  it("should return a rounded number", () => {
    const userCaloricData: UserCaloricData = {
      weight: 65,
      height: 165,
      age: 28,
      gender: "female",
    };
    const result = calorieService.calculateTargetCaloricIntakePerDay(userCaloricData);
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe("calculateTotalDailyEnergyExpenditure", () => {
  it("should return a rounded number", () => {
    const userCaloricData: UserCaloricData = {
      weight: 65,
      height: 165,
      age: 28,
      gender: "female",
    };
    const result = calorieService.calculateTotalDailyEnergyExpenditure(userCaloricData);
    expect(Number.isInteger(result)).toBe(true);
  });
});
