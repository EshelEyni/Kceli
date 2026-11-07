import { t } from "../i18n";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayDataApiService from "../services/dayData/dayDataApiService";
import { DayData } from "../../../shared/types/dayData";
import toast from "react-hot-toast";

export function useUpdateTodayData() {
  const queryClient = useQueryClient();

  const { mutate: updateDailyData, isLoading } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DayData> }) =>
      dayDataApiService.update(id, data),
    onSuccess: savedDay => {
      // Show saved additions, edits and deletions immediately, without a second request.
      // Match the record so a late response cannot overwrite the new day after midnight.
      queryClient.setQueriesData<DayData>(["today"], current =>
        current?.id === savedDay.id ? savedDay : current
      );
      queryClient.invalidateQueries(["today"]);
      queryClient.invalidateQueries(["userDailyStats"]);
      queryClient.invalidateQueries(["calenderData"]);
    },
    onError: () => toast.error(t("Couldn't save your daily log. Please try again.")),
  });

  return { updateDailyData, isLoading };
}
