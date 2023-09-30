import { useMutation, useQueryClient } from "@tanstack/react-query";
import workoutApiService from "../services/workout/workoutApiService";
import { Workout } from "../../../shared/types/workout";

export function useUpdateWorkout() {
  const queryClient = useQueryClient();

  const { mutate: updateWorkout, isLoading } = useMutation({
    mutationFn: (data: Workout) => workoutApiService.update(data),
    onSuccess: data => {
      queryClient.setQueryData([`workouts/${data.id}`], data);
      queryClient.invalidateQueries([`workouts/${data.id}`]);
    },
  });

  return { updateWorkout, isLoading };
}
