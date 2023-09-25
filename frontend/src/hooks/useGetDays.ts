import { useQuery } from "@tanstack/react-query";
import { DayData } from "../../../shared/types/dayData";
import dayDataApiService from "../services/dayDataApi/dayDataApiService";

type useDaysResult = {
  days: DayData[] | undefined;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isEmpty: boolean;
};

type useDaysParams = {
  startDate: Date;
  endDate: Date;
};

export function useGetDays({ startDate, endDate }: useDaysParams): useDaysResult {
  const {
    data: days,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["days"],
    queryFn: () => {
      const queryObj = {
        "date[gte]": startDate.toISOString(),
        "date[lte]": endDate.toISOString(),
      };
      return dayDataApiService.query(queryObj);
    },
  });

  const isEmpty = !!days && days.length === 0;

  return { days, error, isLoading, isSuccess, isError, isEmpty };
}
