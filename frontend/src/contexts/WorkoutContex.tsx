import { createContext, useContext } from "react";
import { Workout } from "../../../shared/types/workout";
import { NavigateFunction, Params, useNavigate, useParams } from "react-router-dom";
import { useGetWorkout } from "../hooks/useGetWorkout";
import workoutUtilService from "../services/workout/workoutUtilService";

type WorkoutContextType = {
  workout: Workout | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  params: Readonly<Params<string>>;
  navigate: NavigateFunction;
  duration: number;
  remainingDuration: number;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const { id } = params as { id: string };
  const { workout, isLoading, isSuccess, isError } = useGetWorkout(id);
  const duration = workoutUtilService.calcDuration({ workout: workout as Workout });
  const remainingDuration = workoutUtilService.calcDuration({
    workout: workout as Workout,
    type: "remaining",
  });
  const navigate = useNavigate();

  const value = {
    workout,
    isLoading,
    isSuccess,
    isError,
    params,
    navigate,
    duration,
    remainingDuration,
  };
  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
}

function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error("useWorkoutItemEdit must be used within a WorkoutProvider");
  }
  return context;
}

export { WorkoutProvider, useWorkout };
