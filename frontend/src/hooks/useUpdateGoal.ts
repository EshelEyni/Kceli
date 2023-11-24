import { useMutation, useQueryClient } from "@tanstack/react-query";
import goalApiService from "../services/goal/goalApiService";
import { Goal } from "../types/app";

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  const { mutate: updateGoal, isLoading } = useMutation({
    mutationFn: (data: Partial<Goal>) => goalApiService.updateGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["goals"]);
    },
  });

  return { updateGoal, isLoading };
}
