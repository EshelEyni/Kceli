/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "../../src/hooks/useAuth";
import { useUpdateTodayData } from "../../src/hooks/useUpdateTodayData";
import { useGetTodayData } from "../../src/hooks/useGetTodayData";
import { Mock, vi } from "vitest";
import { useCreateDay } from "../../src/hooks/useCreateDay";
import { ToggledElement, useDayEdit } from "../../src/pages/Home/DayEdit/DayEditContext";
import testService from "./testService";
import { useDeleteWorkout } from "../../src/hooks/useDeleteWorkout";
import { useNavigate } from "react-router-dom";
import { DayData } from "../../../shared/types/dayData";
import { NewIntakeItem } from "../../../shared/types/intake";
import { SpellingSuggestion } from "../../src/types/app";
import { useIntakeItemEdit } from "../../src/pages/Home/DayEdit/IntakeItemEditContext";

export type MockUseDayEdit = {
  dailyData?: DayData;
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
  openedElement?: any;
  setOpenedElement?: any;
  recommendedWaterIntake?: any;
  intake?: any;
  setIntake?: any;
  calConsumedPct?: any;
  calRemainingPct?: any;
  currIntakeItemId?: any;
  setCurrIntakeItemId?: any;
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
  dailyData,
  isLoading,
  isSuccess,
  isError,
}: {
  dailyData?: any;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
}) {
  (useGetTodayData as Mock).mockReturnValue({ dailyData, isLoading, isSuccess, isError });
}

function mockUseCreateDay(value: { createDay: () => any; isLoading: boolean }) {
  (useCreateDay as Mock).mockReturnValue(value);
}

function mockUseDayEdit({
  dailyData = testService.createTestDailyData(),
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
  openedElement = ToggledElement.IntakeEdit,
  setOpenedElement = vi.fn(),
  recommendedWaterIntake = 0,
  intake = testService.createTestIntake(),
  setIntake = vi.fn(),
  calConsumedPct = 0,
  calRemainingPct = 0,
  currIntakeItemId = "",
  setCurrIntakeItemId = vi.fn(),
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
    openedElement,
    setOpenedElement,
    recommendedWaterIntake,
    intake,
    setIntake,
    calConsumedPct,
    calRemainingPct,
    currIntakeItemId: currIntakeItemId || intake.items[0].id,
    setCurrIntakeItemId,
  };

  (useDayEdit as Mock).mockReturnValue(value);

  return value;
}

function mockUseIntakeItemEdit({
  intakeItem = testService.createTestIntakeItem(),
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
};
