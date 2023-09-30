import { useMutation, useQueryClient } from "@tanstack/react-query";
import workoutApiService from "../services/workout/workoutApiService";
import { useNavigate } from "react-router-dom";
import { Workout } from "../../../shared/types/workout";

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createWorkout, isLoading } = useMutation({
    mutationFn: workoutApiService.create,
    onSuccess: (data: Workout) => {
      queryClient.invalidateQueries(["workouts"]);
      navigate(`/workouts/edit/${data.id}`);
    },
  });

  return { createWorkout, isLoading };
}
