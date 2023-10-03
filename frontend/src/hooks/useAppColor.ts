import { useEffect } from "react";
import { useGetTodayData } from "./useGetTodayData";
import calorieUtilService from "../services/calorieUtil/calorieUtilService";
import { useAuth } from "./useAuth";

export function useAppColors() {
  const { loggedInUser } = useAuth();
  const { dailyData } = useGetTodayData();

  const consumedCalories = calorieUtilService.getTotalCalories(dailyData);
  const targetCaloricIntakePerDay =
    dailyData?.targetCaloricIntake ?? loggedInUser?.targetCaloricIntakePerDay ?? 0;

  const backgroundColor = calorieUtilService.getBcgByCosumedCalories({
    targetCalorie: targetCaloricIntakePerDay,
    consumedCalories,
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--color-primary", backgroundColor);
  }, [backgroundColor]);
}
