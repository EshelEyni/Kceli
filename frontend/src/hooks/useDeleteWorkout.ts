import { useMutation, useQueryClient } from "@tanstack/react-query";
import workoutApiService from "../services/workout/workoutApiService";

export function useDeleteWorkout() {
  const queryClient = useQueryClient();

  const { mutate: removeWorkout, isLoading } = useMutation({
    mutationFn: async (id: string) => workoutApiService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["workouts"]);
    },
  });

  return { removeWorkout, isLoading };
}
