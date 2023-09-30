import { useEffect } from "react";
import { useGetTodayData } from "./useGetTodayData";
import calorieUtilService from "../services/calorieUtil/calorieUtilService";
import { useSelector } from "react-redux";
import { RootState } from "../types/app";

export function useAppColors() {
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
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
