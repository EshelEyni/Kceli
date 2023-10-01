import { useQuery } from "@tanstack/react-query";
import userApiService from "../services/user/userApiService";
import { UserDailyStatsResult } from "../../../shared/types/user";

type useGetUserDailyStatsResult = {
  userDailyStats: UserDailyStatsResult[] | undefined;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export function useGetUserDailyStats(): useGetUserDailyStatsResult {
  const {
    data: userDailyStats,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["userDailyStats"],
    queryFn: () => {
      return userApiService.getUserDailyStats();
    },
  });

  return { userDailyStats, error, isLoading, isSuccess, isError };
}
