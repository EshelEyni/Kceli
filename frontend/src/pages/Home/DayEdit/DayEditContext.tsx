import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { useGetTodayData } from "../../../hooks/useGetTodayData";
import { useUpdateTodayData } from "../../../hooks/useUpdateTodayData";
import calorieUtilService from "../../../services/calorieUtil/calorieUtilService";
import { DayData } from "../../../../../shared/types/dayData";
import { UseMutateFunction } from "@tanstack/react-query";
import { CombinedIntake, FavoriteIntake, Intake } from "../../../../../shared/types/intake";
import intakeUtilService from "../../../services/intake/intakeUtilService";
import { useAuth } from "../../../hooks/useAuth";
import nutritionUtilService from "../../../services/nutrition/nutritionUtilService";
import { Goal, NutritionQueryState } from "../../../types/app";
import { useGetUserFavoriteIntakes } from "../../../hooks/useGetUserFavoriteIntakes";
import { useSearchParams } from "react-router-dom";
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
  consumedCalories: number;
  targetCaloricIntakePerDay: number;
  openedTab: DayEditTab;
  setOpenedTab: (element: DayEditTab) => void;
  intake: CombinedIntake;
  setIntake: Dispatch<SetStateAction<CombinedIntake>>;
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
  WeightWaistInput = "WeightWaistInput",
  Query = "Query",
  Goals = "Goals",
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
  const backgroundColor = "transparent";
  const color = "#254e3c";
  const btnStyle = {};
  const {
    favoriteIntakes,
    isLoading: isLoadingFavoriteIntakes,
    isSuccess: isSuccessFavoriteIntakes,
    isError: isErrorFavoriteIntakes,
    isEmpty: isEmptyFavoriteIntakes,
  } = useGetUserFavoriteIntakes();

  const [searchParams, setSearchParams] = useSearchParams();
  const [openedTab, setOpenedTab] = useState<DayEditTab>(
    Object.values(DayEditTab).includes(searchParams.get("tab") as DayEditTab)
      ? (searchParams.get("tab") as DayEditTab)
      : DayEditTab.IntakeList
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
    openedTab,
    setOpenedTab,
    intake,
    setIntake,
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
