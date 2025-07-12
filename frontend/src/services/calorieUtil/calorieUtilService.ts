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

function calcRemainingCaloriesFromDayData(dailyData: DayData | undefined): number {
  if (!dailyData) return 0;
  const targetCaloricIntakePerDay = dailyData.targetCaloricIntake;
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

function getTotalCalories(entity: DayData[] | DayData | Intake | undefined): number {
  switch (true) {
    case !entity:
      return 0;
    case Array.isArray(entity):
      return (entity as DayData[]).reduce((acc, curr) => acc + getTotalCalories(curr), 0);
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
  return Math.round(intake.items.reduce((acc, curr) => acc + curr.calories, 0));
}

function getBcgByCosumedCalories({
  targetCalorie,
  consumedCalories,
}: GetBcgByCosumedCaloriesParams): {
  backgroundColor: string;
  color: string;
} {
  if (!targetCalorie || !consumedCalories)
    return { backgroundColor: "#005FB3", color: "var( --color-secondary)" };
  const calorieColorPalette = [
    { excessRate: 0, bcg: "#005FB3", color: "var(--color-secondary)" },
    { excessRate: 25, bcg: "#ffea00", color: "var(--color-text)" },
    { excessRate: 50, bcg: "#FF0000", color: "var(--color-secondary)" },
    { excessRate: 100, bcg: "#171717", color: "var(--color-secondary)" },
  ];

  const consumedPercentage = (consumedCalories / targetCalorie) * 100;
  const exceededPercentage = consumedPercentage - 100;
  const colors = calorieColorPalette.find(
    item =>
      item.excessRate >= exceededPercentage || (exceededPercentage > 100 && item.excessRate === 100)
  );

  return {
    backgroundColor: colors?.bcg ?? "#005FB3",
    color: colors?.color ?? "var( --color-secondary)",
  };
}

function getDailyExcessRate({
  remainingCalories,
  targetCaloricIntake,
}: {
  remainingCalories: number;
  targetCaloricIntake: number;
}) {
  if (remainingCalories > 0) return 0;
  return Math.round((Math.abs(remainingCalories) / targetCaloricIntake) * 100) || 0;
}

function getWeeklyExcessRateCalories(data: DayData[]) {
  const totalCalories = data.reduce((acc, curr) => {
    const remainingCalories = calcRemainingCaloriesFromDayData(curr);
    if (remainingCalories < 0) return acc + Math.abs(remainingCalories);
    return acc;
  }, 0);
  return totalCalories;
}

function getDayCaloriesIntake({
  currDayData,
  data,
}: {
  currDayData: DayData;
  data: DayData[] | undefined;
}) {
  if (!data) return 0;
  if (currDayData.targetCaloricIntake) return currDayData.targetCaloricIntake;
  const avgDayTargetCalories = Math.round(
    data.reduce((acc, day) => {
      if (!day.targetCaloricIntake) return acc;
      return acc + day.targetCaloricIntake;
    }, 0) / data.filter(day => day.targetCaloricIntake).length
  );

  return avgDayTargetCalories;
}

export default {
  calcRemainingCalories,
  getBcgByCosumedCalories,
  getTotalCalories,
  calcEstimatedBodyFatStatusPerDay,
  getTotalCaloriesFromDailyData,
  calcRemainingCaloriesFromDayData,
  getDailyExcessRate,
  getDayCaloriesIntake,
  getWeeklyExcessRateCalories,
};
