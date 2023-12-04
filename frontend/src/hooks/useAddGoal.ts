import { useMutation, useQueryClient } from "@tanstack/react-query";
import goalApiService from "../services/goal/goalApiService";

export function useAddGoal() {
  const queryClient = useQueryClient();

  const { mutate: addGoal, isLoading } = useMutation({
    mutationFn: goalApiService.addGoal,
    onSuccess: () => {
      queryClient.invalidateQueries(["goals"]);
      queryClient.invalidateQueries(["userGoal"]);
    },
  });

  return { addGoal, isLoading };
}
