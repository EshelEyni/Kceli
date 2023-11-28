import calorieUtilService from "../services/calorieUtil/calorieUtilService";
import { useAuth } from "./useAuth";
import { useGetTodayData } from "./useGetTodayData";

export function useGetColorByCalories() {
  const { loggedInUser } = useAuth();
  const { dailyData } = useGetTodayData();

  const consumedCalories = calorieUtilService.getTotalCalories(dailyData);
  const targetCaloricIntakePerDay =
    dailyData?.targetCaloricIntake ?? loggedInUser?.targetCaloricIntakePerDay ?? 0;

  const { backgroundColor, color } = calorieUtilService.getBcgByCosumedCalories({
    consumedCalories,
    targetCalorie: targetCaloricIntakePerDay,
  });
  return { backgroundColor, color };
}
