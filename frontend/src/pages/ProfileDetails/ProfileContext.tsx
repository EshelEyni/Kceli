import { createContext, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetUser } from "../../hooks/useGetUser";
import { User, UserDailyStatsResult } from "../../../../shared/types/user";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import { UseMutateFunction } from "@tanstack/react-query";
import userUtilService from "../../services/user/userUtilService";
import { RecommendedWeight, TimeToWeightGoal, UserGoal } from "../../types/app";
import { useGetUserDailyStats } from "../../hooks/useGetUserDailyStats";
import { useGetUserGoal } from "../../hooks/useGetUserGoal";

type ProfileContextType = {
  user: User | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  updateUser: UseMutateFunction<User, unknown, User, unknown>;
  userDailyStats: UserDailyStatsResult[] | undefined;
  count: number | undefined;
  isLoadingUpdateUser: boolean;
  recommendedWeight: RecommendedWeight | null;
  currWeight: number | null;
  weightToLose: RecommendedWeight | null;
  timeToMaxRecommendedWeight: TimeToWeightGoal | null;
  timeToCurrentWeightLossGoal: TimeToWeightGoal | null;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  userGoal: UserGoal | undefined;
  isGoalEditing: boolean;
  setIsGoalEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

function ProfileProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const { id } = params as { id: string };
  const { user, isLoading, isSuccess, isError } = useGetUser(id);
  const { updateUser, isLoading: isLoadingUpdateUser } = useUpdateUser();
  const { userDailyStats, count } = useGetUserDailyStats();
  const { userGoal } = useGetUserGoal();
  const [isEditing, setIsEditing] = useState(false);
  const [isGoalEditing, setIsGoalEditing] = useState(false);

  const recommendedWeight = user ? userUtilService.calcRecommendedWeight(user?.height) : null;
  const currWeight = userDailyStats?.at(-1)?.weight || user?.weight || null;
  const weightToLose = _calcWeightToLose();
  const DAILY_RECOMMENDED_WEIGHT_LOSS = 0.075;
  const timeToMaxRecommendedWeight = _calcTimeToMaxRecommendedWeight();
  const timeToCurrentWeightLossGoal = _calcTimeToCurrentWeightLossGoal();

  function _calcWeightToLose(): RecommendedWeight | null {
    const weight = user?.weight;
    if (!weight || !recommendedWeight) return null;

    return {
      min: +(weight - recommendedWeight?.min).toFixed(2),
      avg: +(weight - recommendedWeight?.avg).toFixed(2),
      max: +(weight - recommendedWeight?.max).toFixed(2),
    };
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
    if (!userGoal) return null;
    const { startingWeight, weightGoal } = userGoal.userWeightLossGoal;
    const goalDiff = startingWeight - weightGoal;
    const days = Math.round(goalDiff / DAILY_RECOMMENDED_WEIGHT_LOSS);
    const weeks = Math.round(days / 7);
    const months = Math.round(days / 30);
    return { days, weeks, months };
  }

  const value = {
    user,
    userDailyStats,
    count,
    isLoading,
    isSuccess,
    isError,
    updateUser,
    userGoal,
    isLoadingUpdateUser,
    recommendedWeight,
    currWeight,
    weightToLose,
    timeToMaxRecommendedWeight,
    timeToCurrentWeightLossGoal,
    isEditing,
    setIsEditing,
    isGoalEditing,
    setIsGoalEditing,
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
