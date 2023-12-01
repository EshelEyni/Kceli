import { useQuery } from "@tanstack/react-query";
import userApiService from "../services/user/userApiService";
import { UserDailyStatsResult } from "../../../shared/types/user";
import { useAuth } from "./useAuth";

type useGetUserDailyStatsResult = {
  userDailyStats: UserDailyStatsResult[] | undefined;
  count: number | undefined;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export function useGetUserDailyStats(): useGetUserDailyStatsResult {
  const { loggedInUser } = useAuth();

  const { data, error, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["userDailyStats"],
    queryFn: () => {
      return userApiService.getUserDailyStats();
    },
    enabled: !!loggedInUser,
  });

  return { userDailyStats: data?.stats, count: data?.count, error, isLoading, isSuccess, isError };
}
