import { DayData } from "../../../../shared/types/dayData";
import { Intake } from "../../../../shared/types/intake";
import { User } from "../../../../shared/types/user";

function calcRecommendedWaterIntake(loggedInUser: User | null, dailyData: DayData | undefined) {
  if (!loggedInUser || !dailyData) return 0;
  const weight = dailyData.weight || loggedInUser.weight;
  const targetWaterConsumptionPerDay = Number((weight * 33).toFixed(2));
  const waterConsumption =
    (dailyData.intakes as Intake[])
      .filter(i => i.isRecorded)
      .reduce(
        (acc, curr) =>
          curr.items.reduce((acc, curr) => {
            if (curr.name.toLocaleLowerCase() === "water") {
              switch (curr.unit) {
                case "ml":
                  return acc + curr.quantity;
                case "cup":
                  return acc + curr.quantity * 250;
                default:
                  return acc;
              }
            }
            return acc;
          }, acc),
        0
      ) || 0;

  return Number(((targetWaterConsumptionPerDay - waterConsumption) / 1000).toFixed(2));
}

export default { calcRecommendedWaterIntake };
