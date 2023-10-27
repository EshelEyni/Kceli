import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayDataApiService from "../services/dayData/dayDataApiService";
import { DayData } from "../../../shared/types/dayData";

export function useUpdateTodayData() {
  const queryClient = useQueryClient();

  const { mutate: updateDailyData, isLoading } = useMutation({
    mutationFn: (data: DayData) => dayDataApiService.update(data),
    onSuccess: data => {
      queryClient.setQueryData(["today"], data);
      queryClient.invalidateQueries(["userDailyStats", "userDailyStats"]);
    },
  });

  return { updateDailyData, isLoading };
}
