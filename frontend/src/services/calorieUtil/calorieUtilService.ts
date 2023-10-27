import { GetBcgByCosumedCaloriesParams } from "./../../types/app";
import { DayData } from "../../../../shared/types/dayData";
import { User } from "../../../../shared/types/user";
import { Intake } from "../../../../shared/types/intake";

export const CALORIES_PER_KG_BODY_FAT = 7700;

function calcRemainingCalories(loggedInUser: User | null, dailyData: DayData | undefined): number {
  if (!loggedInUser || !dailyData) return 0;
  const targetCaloricIntakePerDay =
    dailyData.targetCaloricIntake || loggedInUser.targetCaloricIntakePerDay;
  const remainingCalories = Math.round(targetCaloricIntakePerDay - getTotalCalories(dailyData));

  return remainingCalories;
}

function calcEstimatedBodyFatStatusPerDay(
  loggedInUser: User | null,
  dailyData: DayData | undefined
): number {
  if (!loggedInUser || !dailyData) return 0;
  const totalDailyEnergyExpenditure =
    dailyData.totalDailyEnergyExpenditure || loggedInUser.totalDailyEnergyExpenditure;
  const caloricDifference = getTotalCalories(dailyData) - totalDailyEnergyExpenditure;
  const ONE_KG_OF_BODY_FAT_CALORIES = 7700;
  const estimatedBodyFatChangePerDay = caloricDifference / ONE_KG_OF_BODY_FAT_CALORIES;

  return Number(estimatedBodyFatChangePerDay.toFixed(2));
}

function getTotalCalories(entity: DayData | Intake | undefined): number {
  switch (true) {
    case !entity:
      return 0;
    case entity && "intakes" in entity:
      return getTotalCaloriesFromDailyData({ dailyData: entity as DayData });
    case entity && "items" in entity:
      return _getTotalCaloriesFromIntake(entity as Intake);
    default:
      return 0;
  }
}

function getTotalCaloriesFromDailyData({
  dailyData,
  isRecorded = true,
}: {
  dailyData: DayData;
  isRecorded?: boolean;
}): number {
  return Math.round(
    (dailyData.intakes as Intake[])
      .filter(i => i.isRecorded === isRecorded)
      .reduce((acc, curr) => curr.items.reduce((acc, curr) => acc + (curr.calories ?? 0), acc), 0)
  );
}

function _getTotalCaloriesFromIntake(intake: Intake): number {
  return intake.items.reduce((acc, curr) => acc + curr.calories, 0);
}

function getBcgByCosumedCalories({
  targetCalorie,
  consumedCalories,
}: GetBcgByCosumedCaloriesParams): string {
  if (!targetCalorie || !consumedCalories) return "#005FB3";
  const calorieColorPalette = [
    { excessRate: 0, color: "#005FB3" },
    { excessRate: 10, color: "#4682B4" },
    { excessRate: 20, color: "#feef63" },
    { excessRate: 30, color: "#ffea00" },
    { excessRate: 40, color: "#FF7F7F" },
    { excessRate: 50, color: "#FF0000" },
    { excessRate: 60, color: "#8B0000" },
    { excessRate: 70, color: "#800000" },
    { excessRate: 80, color: "#660000" },
    { excessRate: 90, color: "#330000" },
    { excessRate: 100, color: "#171717" },
  ];

  const consumedPercentage = (consumedCalories / targetCalorie) * 100;
  const exceededPercentage = consumedPercentage - 100;
  const bcg = calorieColorPalette.find(
    item =>
      item.excessRate >= exceededPercentage || (exceededPercentage > 100 && item.excessRate === 100)
  );

  return bcg?.color || "#005FB3";
}

export default {
  calcRemainingCalories,
  getBcgByCosumedCalories,
  getTotalCalories,
  calcEstimatedBodyFatStatusPerDay,
  getTotalCaloriesFromDailyData,
};
