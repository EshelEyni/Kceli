import { UserCaloricData } from "../../../../shared/types/system";
import calorieService from "./calorieService";

describe("calcTargetCaloricIntakePerDay", () => {
  it("should return a rounded number", () => {
    const userCaloricData: UserCaloricData = {
      weight: 65,
      height: 165,
      age: 28,
      gender: "female",
    };
    const result = calorieService.calcTargetCaloricIntakePerDay(userCaloricData);
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
