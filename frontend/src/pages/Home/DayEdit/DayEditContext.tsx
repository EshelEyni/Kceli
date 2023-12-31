import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { useGetTodayData } from "../../../hooks/useGetTodayData";
import { useUpdateTodayData } from "../../../hooks/useUpdateTodayData";
import calorieUtilService from "../../../services/calorieUtil/calorieUtilService";
import { DayData } from "../../../../../shared/types/dayData";
import { UseMutateFunction } from "@tanstack/react-query";
import { CombinedIntake, FavoriteIntake, Intake } from "../../../../../shared/types/intake";
import intakeUtilService from "../../../services/intake/intakeUtilService";
import { useAuth } from "../../../hooks/useAuth";
import waterConsumptionService from "../../../services/waterConsumption/waterConsumptionService";
import nutritionUtilService from "../../../services/nutrition/nutritionUtilService";
import { Goal, NutritionQueryState } from "../../../types/app";
import { useGetUserFavoriteIntakes } from "../../../hooks/useGetUserFavoriteIntakes";
import { useSearchParams } from "react-router-dom";
import { useGetColorByCalories } from "../../../hooks/useGetColorByCalories";
import { useGetGoals } from "../../../hooks/useGetGoals";

export type DayEditContextType = {
  dailyData: DayData | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  updateDailyData: UseMutateFunction<
    DayData,
    unknown,
    { id: string; data: Partial<DayData> },
    unknown
  >;
  isLoadingUpdate: boolean;
  recordedIntakes: Intake[];
  unrecordedIntakes: Intake[];
  remainingCalories: number;
  estimatedKGChange: number;
  consumedCalories: number;
  targetCaloricIntakePerDay: number;
  openedTab: DayEditTab;
  setOpenedTab: (element: DayEditTab) => void;
  recommendedWaterIntake: number;
  intake: CombinedIntake;
  setIntake: Dispatch<SetStateAction<CombinedIntake>>;
  calConsumedPct: number;
  calRemainingPct: number;
  chatGPTQuery: NutritionQueryState;
  setChatGPTQuery: Dispatch<SetStateAction<NutritionQueryState>>;
  ninjaAPIQuery: NutritionQueryState;
  setNinjaAPIQuery: Dispatch<SetStateAction<NutritionQueryState>>;
  USDAAPIQuery: NutritionQueryState;
  setUSDAAPIQuery: Dispatch<SetStateAction<NutritionQueryState>>;
  currIntakeItemId: string;
  setCurrIntakeItemId: Dispatch<SetStateAction<string>>;
  favoriteIntakes: FavoriteIntake[] | undefined;
  isLoadingFavoriteIntakes: boolean;
  isSuccessFavoriteIntakes: boolean;
  isErrorFavoriteIntakes: boolean;
  isEmptyFavoriteIntakes: boolean;
  setSearchParams: (params: URLSearchParams) => void;
  backgroundColor: string;
  color: string;
  btnStyle: React.CSSProperties;
  goals: Goal[] | undefined;
  isLoadingGoals: boolean;
  isSuccessGoals: boolean;
  isErrorGoals: boolean;
  isEmptyGoals: boolean;
};

export enum DayEditTab {
  IntakeEdit = "IntakeEdit",
  IntakeList = "IntakeList",
  UnRecordedIntakeList = "UnRecordedIntakeList",
  FavoriteIntake = "FavoriteIntake",
  Water = "Water",
  WeightWaistInput = "WeightWaistInput",
  Workouts = "Workouts",
  Query = "Query",
  Goals = "Goals",
  HungerMeter = "HungerMeter",
}

const DayEditContext = createContext<DayEditContextType | undefined>(undefined);

function DayEditProvider({ children }: { children: React.ReactNode }) {
  const { loggedInUser } = useAuth();
  const { dailyData, isLoading, isSuccess, isError } = useGetTodayData();
  const { updateDailyData, isLoading: isLoadingUpdate } = useUpdateTodayData();
  const {
    goals,
    isLoading: isLoadingGoals,
    isSuccess: isSuccessGoals,
    isError: isErrorGoals,
    isEmpty: isEmptyGoals,
  } = useGetGoals(getDayGoalsQueryStr());
  const { backgroundColor, color } = useGetColorByCalories();
  const btnStyle = { color, border: `1px solid ${color}` };
  const {
    favoriteIntakes,
    isLoading: isLoadingFavoriteIntakes,
    isSuccess: isSuccessFavoriteIntakes,
    isError: isErrorFavoriteIntakes,
    isEmpty: isEmptyFavoriteIntakes,
  } = useGetUserFavoriteIntakes();

  const [searchParams, setSearchParams] = useSearchParams();
  const [openedTab, setOpenedTab] = useState<DayEditTab>(
    (searchParams.get("tab") as DayEditTab) || DayEditTab.IntakeEdit
  );

  const [intake, setIntake] = useState<CombinedIntake>(intakeUtilService.getDefaultIntake());
  const [currIntakeItemId, setCurrIntakeItemId] = useState<string>(intake.items[0].id);
  const [chatGPTQuery, setChatGPTQuery] = useState<NutritionQueryState>(
    nutritionUtilService.getDefaultNutritionQuery("chatGPT")
  );
  const [ninjaAPIQuery, setNinjaAPIQuery] = useState<NutritionQueryState>(
    nutritionUtilService.getDefaultNutritionQuery("ninjaAPI")
  );
  const [USDAAPIQuery, setUSDAAPIQuery] = useState<NutritionQueryState>(
    nutritionUtilService.getDefaultNutritionQuery("usdaAPI")
  );
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

  function getDayGoalsQueryStr() {
    if (!dailyData) return "";
    const start = new Date(dailyData.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dailyData.date);
    end.setHours(23, 59, 59, 999);
    const queryStr = `?type=day&date[gte]=${start.toISOString()}&date[lte]=${end.toISOString()}`;
    return queryStr;
  }

  useEffect(() => {
    if (!isSuccess || !dailyData || !!dailyData?.weight || dailyData?.isWeightWaistIgnored) return;
    setOpenedTab(DayEditTab.WeightWaistInput);
    const searchParams = new URLSearchParams({ tab: DayEditTab.WeightWaistInput });
    setSearchParams(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    openedTab,
    setOpenedTab,
    recommendedWaterIntake,
    intake,
    setIntake,
    calConsumedPct,
    calRemainingPct,
    chatGPTQuery,
    setChatGPTQuery,
    ninjaAPIQuery,
    setNinjaAPIQuery,
    USDAAPIQuery,
    setUSDAAPIQuery,
    currIntakeItemId,
    setCurrIntakeItemId,
    favoriteIntakes,
    isLoadingFavoriteIntakes,
    isSuccessFavoriteIntakes,
    isErrorFavoriteIntakes,
    isEmptyFavoriteIntakes,
    setSearchParams,
    backgroundColor,
    color,
    btnStyle,
    goals,
    isLoadingGoals,
    isSuccessGoals,
    isErrorGoals,
    isEmptyGoals,
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
