import { useQuery } from "@tanstack/react-query";
import { UserGoal } from "../types/app";
import goalApiService from "../services/goal/goalApiService";
import { useAuth } from "./useAuth";

type useGetGoalsResult = {
  userGoal: UserGoal | undefined;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export function useGetUserGoal(): useGetGoalsResult {
  const { loggedInUser } = useAuth();
  const {
    data: userGoal,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["userGoal"],
    queryFn: goalApiService.getUserGoal,
    enabled: !!loggedInUser,
  });

  return { userGoal, error, isLoading, isSuccess, isError };
}
