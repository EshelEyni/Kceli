import { createContext, useContext, useState } from "react";
import { useGetTodayData } from "../hooks/useGetTodayData";
import { useUpdateTodayData } from "../hooks/useUpdateTodayData";
import { useSelector } from "react-redux";
import { AddIntakeParams, RootState } from "../types/app";
import calorieUtilService from "../services/calorieUtil/calorieUtilService";
import { DayData } from "../../../shared/types/dayData";
import { UseMutateFunction } from "@tanstack/react-query";
import { useAddIntake } from "../hooks/useAddIntake";

type TodayDataContextType = {
  dailyData: DayData | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  updateDailyData: UseMutateFunction<DayData, unknown, DayData, unknown>;
  isLoadingUpdate: boolean;
  addIntake: UseMutateFunction<DayData, unknown, AddIntakeParams, unknown>;
  isLoadingIntake: boolean;
  remainingCalories: number;
  estimatedKGChange: number;
  consumedCalories: number;
  targetCaloricIntakePerDay: number;
  backgroundColor: string;
  openedElement: ToggledElement;
  setOpenedElement: (element: ToggledElement) => void;
};

export enum ToggledElement {
  IntakeEdit = "IntakeEdit",
  IntakeList = "IntakeList",
}

const TodayDataContext = createContext<TodayDataContextType | undefined>(undefined);

function TodayDataProvider({ children }: { children: React.ReactNode }) {
  const { dailyData, isLoading, isSuccess, isError } = useGetTodayData();
  const { updateDailyData, isLoading: isLoadingUpdate } = useUpdateTodayData();
  const { addIntake, isLoading: isLoadingIntake } = useAddIntake();
  const [openedElement, setOpenedElement] = useState<ToggledElement>(ToggledElement.IntakeEdit);
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const remainingCalories = calorieUtilService.calcRemainingCalories(loggedInUser, dailyData);
  const consumedCalories = calorieUtilService.getTotalCalories(dailyData);
  const targetCaloricIntakePerDay = loggedInUser?.targetCaloricIntakePerDay || 0;
  const estimatedKGChange = calorieUtilService.calcEstimatedBodyFatStatusPerDay(
    loggedInUser,
    dailyData
  );
  const backgroundColor = calorieUtilService.getBcgByCosumedCalories({
    consumedCalories,
    targetCalorie: targetCaloricIntakePerDay,
  });

  const value = {
    dailyData,
    isLoading,
    isSuccess,
    isError,
    updateDailyData,
    isLoadingUpdate,
    addIntake,
    isLoadingIntake,
    remainingCalories,
    consumedCalories,
    targetCaloricIntakePerDay,
    estimatedKGChange,
    backgroundColor,
    openedElement,
    setOpenedElement,
  };
  return <TodayDataContext.Provider value={value}>{children}</TodayDataContext.Provider>;
}

function useTodayData() {
  const context = useContext(TodayDataContext);
  if (context === undefined) {
    throw new Error("useTodayData must be used within a TodayDataProvider");
  }
  return context;
}

export { TodayDataProvider, useTodayData };
