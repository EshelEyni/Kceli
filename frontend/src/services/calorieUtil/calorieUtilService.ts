import { GetBcgByCosumedCaloriesParams } from "./../../types/app";
import { DayData } from "../../../../shared/types/dayData";
import { User } from "../../../../shared/types/user";

function calcRemainingCalories(loggedInUser: User | null, dailyData: DayData | undefined): number {
  if (!loggedInUser || !dailyData) return 0;
  const remainingCalories = loggedInUser.targetCaloricIntakePerDay - getCosumedCalories(dailyData);
  return remainingCalories;
}

function getCosumedCalories(dailyData: DayData | undefined): number {
  if (!dailyData) return 0;
  return dailyData.intakes.reduce(
    (acc, curr) => curr.items.reduce((acc, curr) => acc + curr.calories, acc),
    0
  );
}

function getBcgByCosumedCalories({
  targetCalorie,
  consumedCalories,
}: GetBcgByCosumedCaloriesParams): string {
  const calorieColorPalette = [
    { excessRate: 0, color: "#2d46ff" },
    { excessRate: 10, color: "#4682B4" },
    { excessRate: 20, color: "#FFFF99" },
    { excessRate: 30, color: "#FFFF00" },
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
  const bcg = calorieColorPalette.find(item => item.excessRate >= exceededPercentage);

  return bcg?.color || "#3030FF";
}

export default { calcRemainingCalories, getBcgByCosumedCalories, getCosumedCalories };
