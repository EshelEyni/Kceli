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

export type MockUseDayEdit = {
  dailyData?: any;
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
  const state = {
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

  (useDayEdit as Mock).mockReturnValue(state);

  return state;
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
};
