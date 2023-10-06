import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { useGetTodayData } from "../../../hooks/useGetTodayData";
import { useUpdateTodayData } from "../../../hooks/useUpdateTodayData";
import calorieUtilService from "../../../services/calorieUtil/calorieUtilService";
import { DayData } from "../../../../../shared/types/dayData";
import { UseMutateFunction } from "@tanstack/react-query";
import { Intake, NewIntake } from "../../../../../shared/types/intake";
import intakeUtilService from "../../../services/intakeUtil/intakeUtilService";
import { useAuth } from "../../../hooks/useAuth";
import waterConsumptionService from "../../../services/waterConsumption/waterConsumptionService";

export type DayEditContextType = {
  dailyData: DayData | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  updateDailyData: UseMutateFunction<DayData, unknown, DayData, unknown>;
  isLoadingUpdate: boolean;
  recordedIntakes: Intake[];
  unrecordedIntakes: Intake[];
  remainingCalories: number;
  estimatedKGChange: number;
  consumedCalories: number;
  targetCaloricIntakePerDay: number;
  backgroundColor: string;
  openedElement: ToggledElement;
  setOpenedElement: (element: ToggledElement) => void;
  recommendedWaterIntake: number;
  intake: NewIntake;
  setIntake: Dispatch<SetStateAction<NewIntake>>;
  calConsumedPct: number;
  calRemainingPct: number;
};

export enum ToggledElement {
  IntakeEdit = "IntakeEdit",
  IntakeList = "IntakeList",
  UnRecordedIntakeList = "UnRecordedIntakeList",
  WeightWaistInput = "WeightWaistInput",
  Workouts = "Workouts",
  Query = "Query",
}

const DayEditContext = createContext<DayEditContextType | undefined>(undefined);

function DayEditProvider({ children }: { children: React.ReactNode }) {
  const { loggedInUser } = useAuth();
  const { dailyData, isLoading, isSuccess, isError } = useGetTodayData();
  const { updateDailyData, isLoading: isLoadingUpdate } = useUpdateTodayData();

  const [openedElement, setOpenedElement] = useState<ToggledElement>(ToggledElement.IntakeEdit);
  const [intake, setIntake] = useState<NewIntake>(intakeUtilService.getDefaultIntake());

  const recordedIntakes = (dailyData?.intakes.filter(i => i.isRecorded) as Intake[]) || [];
  const unrecordedIntakes = (dailyData?.intakes.filter(i => !i.isRecorded) as Intake[]) || [];

  const consumedCalories = calorieUtilService.getTotalCalories(dailyData);
  const remainingCalories = calorieUtilService.calcRemainingCalories(loggedInUser, dailyData);

  const targetCaloricIntakePerDay =
    dailyData?.targetCaloricIntake ?? loggedInUser?.targetCaloricIntakePerDay ?? 0;

  const estimatedKGChange = calorieUtilService.calcEstimatedBodyFatStatusPerDay(
    loggedInUser,
    dailyData
  );

  const calConsumedPct = Math.round((consumedCalories / targetCaloricIntakePerDay) * 100);

  const calRemainingPct = Math.round((remainingCalories / targetCaloricIntakePerDay) * 100);

  const recommendedWaterIntake = waterConsumptionService.calcRecommendedWaterIntake(
    loggedInUser,
    dailyData
  );

  const backgroundColor = calorieUtilService.getBcgByCosumedCalories({
    consumedCalories,
    targetCalorie: targetCaloricIntakePerDay,
  });

  useEffect(() => {
    if (!isSuccess || !dailyData || !!dailyData?.weight) return;
    setOpenedElement(ToggledElement.WeightWaistInput);
  }, [dailyData, isSuccess]);

  const value = {
    dailyData,
    isLoading,
    isSuccess,
    isError,
    updateDailyData,
    isLoadingUpdate,
    recordedIntakes,
    unrecordedIntakes,
    remainingCalories,
    consumedCalories,
    targetCaloricIntakePerDay,
    estimatedKGChange,
    backgroundColor,
    openedElement,
    setOpenedElement,
    recommendedWaterIntake,
    intake,
    setIntake,
    calConsumedPct,
    calRemainingPct,
  };

  return <DayEditContext.Provider value={value}>{children}</DayEditContext.Provider>;
}

function useDayEdit() {
  const context = useContext(DayEditContext);
  if (context === undefined) {
    throw new Error("useDayEdit must be used within a DayEditProvider");
  }
  return context;
}

export { DayEditProvider, useDayEdit };
