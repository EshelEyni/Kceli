import { useMutation, useQueryClient } from "@tanstack/react-query";
import goalApiService from "../services/goal/goalApiService";

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  const { mutate: deleteGoal, isLoading } = useMutation({
    mutationFn: goalApiService.deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries(["goals"]);
    },
  });

  return { deleteGoal, isLoading };
}
