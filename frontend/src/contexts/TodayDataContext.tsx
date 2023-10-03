import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { useGetTodayData } from "../hooks/useGetTodayData";
import { useUpdateTodayData } from "../hooks/useUpdateTodayData";
import calorieUtilService from "../services/calorieUtil/calorieUtilService";
import { DayData } from "../../../shared/types/dayData";
import { UseMutateFunction } from "@tanstack/react-query";
import { Intake, NewIntake } from "../../../shared/types/intake";
import { User } from "../../../shared/types/user";
import intakeUtilServiceTest from "../services/intakeUtil/intakeUtilService";
import { useAuth } from "../hooks/useAuth";

type TodayDataContextType = {
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
  isCurrValidIntake: boolean;
  setCurrIsValidIntake: (isValid: boolean) => void;
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
}

const TodayDataContext = createContext<TodayDataContextType | undefined>(undefined);

function TodayDataProvider({ children }: { children: React.ReactNode }) {
  const { loggedInUser } = useAuth();
  const { dailyData, isLoading, isSuccess, isError } = useGetTodayData();
  const { updateDailyData, isLoading: isLoadingUpdate } = useUpdateTodayData();
  const [openedElement, setOpenedElement] = useState<ToggledElement>(
    !dailyData?.weight ? ToggledElement.IntakeEdit : ToggledElement.WeightWaistInput
  );
  const [intake, setIntake] = useState<NewIntake>(intakeUtilServiceTest.getDefaultIntake());
  const [isCurrValidIntake, setCurrIsValidIntake] = useState(true);
  const recordedIntakes = (dailyData?.intakes.filter(i => i.isRecorded) as Intake[]) || [];
  const unrecordedIntakes = (dailyData?.intakes.filter(i => !i.isRecorded) as Intake[]) || [];
  const remainingCalories = calorieUtilService.calcRemainingCalories(loggedInUser, dailyData);
  const consumedCalories = calorieUtilService.getTotalCalories(dailyData);

  const targetCaloricIntakePerDay =
    dailyData?.targetCaloricIntake ?? loggedInUser?.targetCaloricIntakePerDay ?? 0;
  const estimatedKGChange = calorieUtilService.calcEstimatedBodyFatStatusPerDay(
    loggedInUser,
    dailyData
  );

  const calConsumedPct = Math.round((consumedCalories / targetCaloricIntakePerDay) * 100);

  const calRemainingPct = Math.round((remainingCalories / targetCaloricIntakePerDay) * 100);

  const recommendedWaterIntake = _calcRecommendedWaterIntake(loggedInUser, dailyData);

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
    recordedIntakes,
    unrecordedIntakes,
    remainingCalories,
    consumedCalories,
    targetCaloricIntakePerDay,
    estimatedKGChange,
    backgroundColor,
    openedElement,
    setOpenedElement,
    isCurrValidIntake,
    setCurrIsValidIntake,
    recommendedWaterIntake,
    intake,
    setIntake,
    calConsumedPct,
    calRemainingPct,
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

function _calcRecommendedWaterIntake(loggedInUser: User | null, dailyData: DayData | undefined) {
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

export { TodayDataProvider, useTodayData };
