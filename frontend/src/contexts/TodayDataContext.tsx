import { createContext, useContext, useState } from "react";
import { useGetTodayData } from "../hooks/useGetTodayData";
import { useUpdateTodayData } from "../hooks/useUpdateTodayData";
import { useSelector } from "react-redux";
import { AddIntakeParams, RootState } from "../types/app";
import calorieUtilService from "../services/calorieUtil/calorieUtilService";
import { DayData } from "../../../shared/types/dayData";
import { UseMutateFunction } from "@tanstack/react-query";
import { useAddIntake } from "../hooks/useAddIntake";
import { Intake } from "../../../shared/types/intake";

type TodayDataContextType = {
  dailyData: DayData | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  updateDailyData: UseMutateFunction<DayData, unknown, DayData, unknown>;
  isLoadingUpdate: boolean;
  addIntake: UseMutateFunction<DayData, unknown, AddIntakeParams, unknown>;
  isLoadingIntake: boolean;
  recordedIntakes: Intake[];
  unrecordedIntakes: Intake[];
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
  UnRecordedIntakeList = "UnRecordedIntakeList",
}

const TodayDataContext = createContext<TodayDataContextType | undefined>(undefined);

function TodayDataProvider({ children }: { children: React.ReactNode }) {
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const { dailyData, isLoading, isSuccess, isError } = useGetTodayData();
  const { updateDailyData, isLoading: isLoadingUpdate } = useUpdateTodayData();
  const { addIntake, isLoading: isLoadingIntake } = useAddIntake();
  const [openedElement, setOpenedElement] = useState<ToggledElement>(ToggledElement.IntakeEdit);
  const recordedIntakes = dailyData?.intakes.filter(i => i.isRecorded) || [];
  const unrecordedIntakes = dailyData?.intakes.filter(i => !i.isRecorded) || [];
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
    recordedIntakes,
    unrecordedIntakes,
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
