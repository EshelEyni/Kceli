/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "../../src/hooks/useAuth";
import { useUpdateTodayData } from "../../src/hooks/useUpdateTodayData";
import { useGetTodayData } from "../../src/hooks/useGetTodayData";
import { Mock, vi } from "vitest";
import { useCreateDay } from "../../src/hooks/useCreateDay";
import { DayEditTab, useDayEdit } from "../../src/pages/Home/DayEdit/DayEditContext";
import testService from "./testService";
import { useDeleteWorkout } from "../../src/hooks/useDeleteWorkout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DayData } from "../../../shared/types/dayData";
import { Intake, NewIntakeItem } from "../../../shared/types/intake";
import { NutritionQueryState, SpellingSuggestion } from "../../src/types/app";
import { useIntakeItemEdit } from "../../src/pages/Home/DayEdit/IntakeItemEditContext";
import { useAddFavoriteIntake } from "../../src/hooks/useAddFavoriteIntake";
import { useGetUserFavoriteIntakes } from "../../src/hooks/useGetUserFavoriteIntakes";
import { useUpdateFavoriteIntake } from "../../src/hooks/useUpdateFavoriteIntake";
import { useGetColorByCalories } from "../../src/hooks/useGetColorByCalories";
import { useDeleteFavoriteIntake } from "../../src/hooks/useDeleteFavoriteIntake";

export type MockUseDayEdit = {
  dailyData?: DayData | null;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  updateDailyData?: any;
  isLoadingUpdate?: boolean;
  recordedIntakes?: any;
  unrecordedIntakes?: any;
  remainingCalories?: any;
  estimatedKGChange?: any;
  consumedCalories?: any;
  targetCaloricIntakePerDay?: any;
  backgroundColor?: any;
  openedTab?: any;
  setOpenedTab?: any;
  recommendedWaterIntake?: any;
  intake?: any;
  setIntake?: any;
  calConsumedPct?: any;
  calRemainingPct?: any;
  currIntakeItemId?: any;
  setCurrIntakeItemId?: any;
  chatGPTQuery?: NutritionQueryState;
  setChatGPTQuery?: any;
  ninjaAPIQuery?: NutritionQueryState;
  setNinjaAPIQuery?: any;
  USDAAPIQuery?: NutritionQueryState;
  setUSDAAPIQuery?: any;
  favoriteIntakes?: Intake[] | undefined;
  isLoadingFavoriteIntakes?: boolean;
  isSuccessFavoriteIntakes?: boolean;
  isErrorFavoriteIntakes?: boolean;
  isEmptyFavoriteIntakes?: boolean;
  setSearchParams?: any;
};

export type MockUseIntakeItemEdit = {
  intakeItem?: NewIntakeItem;
  isOneItem?: boolean;
  isCurrIntakeItem?: boolean;
  isManual?: boolean;
  inputFaded?: string;
  setInputFaded?: any;
  isLoadingCal?: boolean;
  suggestions?: SpellingSuggestion[];
  setSuggestions?: any;
  isSuggestionListShown?: boolean;
  handleNameInputClick?: any;
  handleInputChange?: any;
  decreaseQuantity?: any;
  increaseQuantity?: any;
  handleUnitBtnClick?: any;
  handleToggleManual?: any;
  handleCalcBtnClick?: any;
  handleSuggestionClick?: any;
  handleIgnoreSuggestionClick?: any;
  handleAddButtonClick?: any;
  handleRemoveButtonClick?: any;
};

function mockUseAuth(loggedInUser: any) {
  (useAuth as Mock).mockReturnValue({ loggedInUser });
}

function mockUseUpdateTodayData({
  updateDailyData,
  isLoading,
}: {
  updateDailyData?: any;
  isLoading?: boolean;
}) {
  (useUpdateTodayData as Mock).mockReturnValue({
    updateDailyData,
    isLoading,
  });
}

function mockUseGetTodayData({
  dailyData = testService.createDailyData({}),
  isLoading = false,
  isSuccess = true,
  isError = false,
}: {
  dailyData?: any;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
}) {
  (useGetTodayData as Mock).mockReturnValue({ dailyData, isLoading, isSuccess, isError });

  return { dailyData, isLoading, isSuccess, isError };
}

function mockUseAddFavoriteIntake({
  addFavoriteIntake = vi.fn(),
  isLoading = false,
}: {
  addFavoriteIntake?: any;
  isLoading?: boolean;
}) {
  (useAddFavoriteIntake as Mock).mockReturnValue({
    addFavoriteIntake,
    isLoading,
  });

  return { addFavoriteIntake, isLoading };
}

function mockUseDeleteFavoriteIntake({
  removeFavoriteIntake = vi.fn(),
  isLoading = false,
}: {
  removeFavoriteIntake?: any;
  isLoading?: boolean;
}) {
  (useDeleteFavoriteIntake as Mock).mockReturnValue({
    removeFavoriteIntake,
    isLoading,
  });

  return { removeFavoriteIntake, isLoading };
}

function mockUseCreateDay(value: { createDay: () => any; isLoading: boolean }) {
  (useCreateDay as Mock).mockReturnValue(value);
}

function mockUseDayEdit({
  dailyData = testService.createDailyData({}),
  isLoading = false,
  isSuccess = true,
  isError = false,
  updateDailyData = vi.fn(),
  isLoadingUpdate = false,
  recordedIntakes = [],
  unrecordedIntakes = [],
  remainingCalories = 0,
  estimatedKGChange = 0,
  consumedCalories = 0,
  targetCaloricIntakePerDay = 0,
  backgroundColor = "white",
  openedTab = DayEditTab.IntakeEdit,
  setOpenedTab = vi.fn(),
  recommendedWaterIntake = 0,
  intake = testService.createIntake({}),
  setIntake = vi.fn(),
  calConsumedPct = 0,
  calRemainingPct = 0,
  currIntakeItemId = "",
  setCurrIntakeItemId = vi.fn(),
  chatGPTQuery = testService.createNutritionQuery({ type: "chatGPT" }),
  setChatGPTQuery = vi.fn(),
  ninjaAPIQuery = testService.createNutritionQuery({ type: "ninjaAPI" }),
  setNinjaAPIQuery = vi.fn(),
  USDAAPIQuery = testService.createNutritionQuery({ type: "usdaAPI" }),
  setUSDAAPIQuery = vi.fn(),
  favoriteIntakes = [testService.createIntake({}), testService.createIntake({})] as Intake[],
  isLoadingFavoriteIntakes = false,
  isSuccessFavoriteIntakes = false,
  isErrorFavoriteIntakes = false,
  isEmptyFavoriteIntakes = false,
  setSearchParams = vi.fn(),
}: MockUseDayEdit): MockUseDayEdit {
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
    estimatedKGChange,
    consumedCalories,
    targetCaloricIntakePerDay,
    backgroundColor,
    openedTab,
    setOpenedTab,
    recommendedWaterIntake,
    intake,
    setIntake,
    calConsumedPct,
    calRemainingPct,
    currIntakeItemId: currIntakeItemId ?? intake.items[0].id,
    setCurrIntakeItemId,
    chatGPTQuery,
    setChatGPTQuery,
    ninjaAPIQuery,
    setNinjaAPIQuery,
    USDAAPIQuery,
    setUSDAAPIQuery,
    favoriteIntakes,
    isLoadingFavoriteIntakes,
    isSuccessFavoriteIntakes,
    isErrorFavoriteIntakes,
    isEmptyFavoriteIntakes,
    setSearchParams,
  };

  (useDayEdit as Mock).mockReturnValue(value);

  return value;
}

function mockUseIntakeItemEdit({
  intakeItem = testService.createIntakeItem({}),
  isOneItem = false,
  isCurrIntakeItem = false,
  isManual = false,
  inputFaded = "",
  setInputFaded = vi.fn(),
  isLoadingCal = false,
  suggestions = [],
  setSuggestions = vi.fn(),
  isSuggestionListShown = false,
  handleNameInputClick = vi.fn(),
  handleInputChange = vi.fn(),
  decreaseQuantity = vi.fn(),
  increaseQuantity = vi.fn(),
  handleUnitBtnClick = vi.fn(),
  handleToggleManual = vi.fn(),
  handleCalcBtnClick = vi.fn(),
  handleSuggestionClick = vi.fn(),
  handleIgnoreSuggestionClick = vi.fn(),
  handleAddButtonClick = vi.fn(),
  handleRemoveButtonClick = vi.fn(),
}: MockUseIntakeItemEdit): MockUseIntakeItemEdit {
  const value = {
    intakeItem,
    isOneItem,
    isCurrIntakeItem,
    isManual,
    inputFaded,
    setInputFaded,
    isLoadingCal,
    suggestions,
    setSuggestions,
    isSuggestionListShown,
    handleNameInputClick,
    handleInputChange,
    decreaseQuantity,
    increaseQuantity,
    handleUnitBtnClick,
    handleToggleManual,
    handleCalcBtnClick,
    handleSuggestionClick,
    handleIgnoreSuggestionClick,
    handleAddButtonClick,
    handleRemoveButtonClick,
  };

  (useIntakeItemEdit as Mock).mockReturnValue(value);

  return value;
}

function mockUseDeleteWorkout({
  removeWorkout = vi.fn(),
  isLoading = false,
}: {
  removeWorkout?: any;
  isLoading?: boolean;
}) {
  (useDeleteWorkout as Mock).mockReturnValue({
    removeWorkout,
    isLoading,
  });
}

function mockUseNavigate(navigate = vi.fn()) {
  (useNavigate as Mock).mockImplementation(() => navigate);
  return navigate;
}

function mockUseSearchParams({
  searchParams = { get: vi.fn() },
  setSearchParams = vi.fn(),
}: {
  searchParams?: any;
  setSearchParams?: any;
}) {
  (useSearchParams as Mock).mockImplementation(() => [searchParams, setSearchParams]);
  return { searchParams, setSearchParams };
}

function mockUseGetUserFavoriteIntakes({
  favoriteIntakes = [testService.createIntake({}), testService.createIntake({})] as Intake[],
  error = null,
  isLoading = false,
  isSuccess = false,
  isError = false,
  isEmpty = false,
}: {
  favoriteIntakes?: Intake[];
  error?: unknown;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
}) {
  (useGetUserFavoriteIntakes as Mock).mockReturnValue({
    favoriteIntakes,
    error,
    isLoading,
    isSuccess,
    isError,
    isEmpty,
  });

  return { favoriteIntakes, error, isLoading, isSuccess, isError };
}

function mockUseUpdateFavoriteIntake({
  updateFavoriteIntake = vi.fn(),
  isLoading = false,
}: {
  updateFavoriteIntake?: any;
  isLoading?: boolean;
}) {
  (useUpdateFavoriteIntake as Mock).mockReturnValue({
    updateFavoriteIntake,
    isLoading,
  });

  return { updateFavoriteIntake, isLoading };
}

function mockUseGetColorByCalories({ backgroundColor = "white" }: { backgroundColor?: string }) {
  (useGetColorByCalories as Mock).mockReturnValue(backgroundColor);
  return { backgroundColor };
}

export {
  mockUseAuth,
  mockUseUpdateTodayData,
  mockUseGetTodayData,
  mockUseCreateDay,
  mockUseDayEdit,
  mockUseDeleteWorkout,
  mockUseNavigate,
  mockUseIntakeItemEdit,
  mockUseAddFavoriteIntake,
  mockUseGetUserFavoriteIntakes,
  mockUseUpdateFavoriteIntake,
  mockUseGetColorByCalories,
  mockUseDeleteFavoriteIntake,
  mockUseSearchParams,
};
