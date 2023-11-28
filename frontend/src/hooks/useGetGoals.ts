import { useQuery } from "@tanstack/react-query";
import { Goal } from "../types/app";
import goalApiService from "../services/goal/goalApiService";

type useGetGoalsResult = {
  goals: Goal[] | undefined;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isEmpty: boolean;
};

export function useGetGoals(queryStr: string): useGetGoalsResult {
  const {
    data: goals,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["goals", queryStr],
    queryFn: async () => {
      if (!queryStr) return;
      return goalApiService.getGoals(queryStr);
    },
    enabled: !!queryStr,
  });

  const isEmpty = !!goals && goals.length === 0;

  return { goals, error, isLoading, isSuccess, isError, isEmpty };
}
