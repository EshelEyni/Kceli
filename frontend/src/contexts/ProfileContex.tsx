import { createContext, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetUser } from "../hooks/useGetUser";
import { User } from "../../../shared/types/user";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { UseMutateFunction } from "@tanstack/react-query";
import userUtilService from "../services/user/userUtilService";
import { CaloriesToLose, RecommendedWeight, TimeToWeightGoal } from "../types/app";
import { useGetUserDailyStats } from "../hooks/useGetUserDailyStats";
import { formatNumToK } from "../services/util/utilService";

type ProfileContextType = {
  user: User | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  updateUser: UseMutateFunction<User, unknown, User, unknown>;
  isLoadingUpdateUser: boolean;
  recommendedWeight: RecommendedWeight | null;
  currWeight: number | null;
  caloriesToLose: CaloriesToLose | null;
  timeToMaxRecommendedWeight: TimeToWeightGoal | null;
  timeToCurrentWeightLossGoal: TimeToWeightGoal | null;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

function ProfileProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const { id } = params as { id: string };
  const { user, isLoading, isSuccess, isError } = useGetUser(id);
  const { updateUser, isLoading: isLoadingUpdateUser } = useUpdateUser();
  const { userDailyStats } = useGetUserDailyStats();
  const [isEditing, setIsEditing] = useState(false);

  const recommendedWeight = user ? userUtilService.calcRecommendedWeight(user?.height) : null;
  const currWeight = userDailyStats?.at(-1)?.weight || user?.weight || null;
  const caloriesToLose = _calcCaloriesToLose();
  const DAILY_RECOMMENDED_WEIGHT_LOSS = 0.075;
  const timeToMaxRecommendedWeight = _calcTimeToMaxRecommendedWeight();
  const timeToCurrentWeightLossGoal = _calcTimeToCurrentWeightLossGoal();

  function _calcCaloriesToLose(): CaloriesToLose | null {
    const weight = user?.weight;
    const maxRecommendedWeight = recommendedWeight?.max;
    if (!weight || !maxRecommendedWeight) return null;

    const CALORIES_PER_KG_BODY_FAT = 7700;
    const count = Math.round((weight - maxRecommendedWeight) * CALORIES_PER_KG_BODY_FAT);
    const calories = formatNumToK(count);
    const perTDEE = Math.round(count / user.totalDailyEnergyExpenditure);
    return { calories, dailyIntakes: perTDEE.toString() };
  }

  function _calcTimeToMaxRecommendedWeight(): TimeToWeightGoal | null {
    if (!user || !recommendedWeight) return null;

    const deficit = user?.weight - recommendedWeight.max;
    const days = Math.round(deficit / DAILY_RECOMMENDED_WEIGHT_LOSS);
    const weeks = Math.round(days / 7);
    const months = Math.round(days / 30);

    return { days, weeks, months };
  }

  function _calcTimeToCurrentWeightLossGoal(): TimeToWeightGoal | null {
    if (!user) return null;

    const days = Math.round(user.weightLossGoal.weightGoal / DAILY_RECOMMENDED_WEIGHT_LOSS);
    const weeks = Math.round(days / 7);
    const months = Math.round(days / 30);

    return { days, weeks, months };
  }

  const value = {
    user,
    isLoading,
    isSuccess,
    isError,
    updateUser,
    isLoadingUpdateUser,
    recommendedWeight,
    currWeight,
    caloriesToLose,
    timeToMaxRecommendedWeight,
    timeToCurrentWeightLossGoal,
    isEditing,
    setIsEditing,
  };
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a WorkoutsProvider");
  }
  return context;
}

export { ProfileProvider, useProfile };
