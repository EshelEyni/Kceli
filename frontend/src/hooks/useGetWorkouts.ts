import { useQuery } from "@tanstack/react-query";
import { Workout } from "../../../shared/types/workout";
import workoutApiService from "../services/workout/workoutApiService";

type useGetWorkoutsResult = {
  workouts: Workout[] | undefined;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isEmpty: boolean;
};

export function useGetWorkouts(): useGetWorkoutsResult {
  const {
    data: workouts,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["workouts"],
    queryFn: () => {
      return workoutApiService.query();
    },
  });

  const isEmpty = !!workouts && workouts.length === 0;

  return { workouts, error, isLoading, isSuccess, isError, isEmpty };
}
