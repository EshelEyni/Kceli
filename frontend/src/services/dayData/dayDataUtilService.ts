import { DayData } from "../../../../shared/types/dayData";

function calcAverageTimeBetweenMeals(dayData: DayData | undefined): string {
  if (!dayData || dayData.intakes.length === 0) return "No data";

  let totalDifference = 0;
  let validIntakeCount = 0;
  let prevIntakeTime;

  for (const intake of dayData.intakes) {
    if (!intake.recordedAt || intake.type !== "food") continue;

    const recordedAt = new Date(intake.recordedAt).getTime();
    if (prevIntakeTime !== undefined) {
      totalDifference += recordedAt - prevIntakeTime;
      validIntakeCount++;
    }
    prevIntakeTime = recordedAt;
  }

  if (validIntakeCount === 0) return "No data";

  const averageTimeBetweenMealsMS = totalDifference / validIntakeCount;
  const averageTimeInHours = averageTimeBetweenMealsMS / 1000 / 60 / 60;

  return averageTimeInHours >= 1
    ? `${Math.round(averageTimeInHours)} hours`
    : `${Math.round(averageTimeInHours * 60)} minutes`;
}

export default { calcAverageTimeBetweenMeals };
