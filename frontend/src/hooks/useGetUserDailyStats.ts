import { useQuery } from "@tanstack/react-query";
import userApiService from "../services/user/userApiService";
import { UserDailyStatsResult } from "../../../shared/types/user";

type useGetUserDailyStatsResult = {
  userDailyStats: UserDailyStatsResult[] | undefined;
  count: number | undefined;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export function useGetUserDailyStats(): useGetUserDailyStatsResult {
  const { data, error, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["userDailyStats"],
    queryFn: () => {
      return userApiService.getUserDailyStats();
    },
  });

  return { userDailyStats: data?.stats, count: data?.count, error, isLoading, isSuccess, isError };
}
