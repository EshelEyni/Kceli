import { useQuery } from "@tanstack/react-query";
import { DayData } from "../../../shared/types/dayData";
import dayDataApiService from "../services/dayData/dayDataApiService";
import { useAuth } from "./useAuth";

type useGetTodayDataResult = {
  dailyData: DayData | undefined;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export function useGetTodayData(): useGetTodayDataResult {
  const { loggedInUser } = useAuth();

  const {
    data: dailyData,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["today"],
    queryFn: dayDataApiService.getToday,
    enabled: !!loggedInUser,
  });

  return { dailyData, error, isLoading, isSuccess, isError };
}
