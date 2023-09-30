import { useQuery } from "@tanstack/react-query";
import { Workout } from "../../../shared/types/workout";
import workoutApiService from "../services/workout/workoutApiService";

type useGetWorkoutResult = {
  workout: Workout | undefined;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export function useGetWorkout(id: string): useGetWorkoutResult {
  const {
    data: workout,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: [`workouts/${id}`],
    queryFn: async () => {
      if (!id) throw new Error("Workout ID is required");
      return workoutApiService.getById(id);
    },
  });

  return { workout, error, isLoading, isSuccess, isError };
}
