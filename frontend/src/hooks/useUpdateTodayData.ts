import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayDataApiService from "../services/dayData/dayDataApiService";
import { DayData } from "../../../shared/types/dayData";
import toast from "react-hot-toast";

export function useUpdateTodayData() {
  const queryClient = useQueryClient();

  const { mutate: updateDailyData, isLoading } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DayData> }) =>
      dayDataApiService.update(id, data),
    onSuccess: data => {
      queryClient.setQueryData(["today"], data);
      queryClient.invalidateQueries(["userDailyStats"]);
      queryClient.invalidateQueries(["calenderData"]);
    },
    onError: () => toast.error("Couldn't save your daily log. Please try again."),
  });

  return { updateDailyData, isLoading };
}
