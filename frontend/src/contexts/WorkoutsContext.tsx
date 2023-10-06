import { createContext, useContext } from "react";
import { UseMutateFunction } from "@tanstack/react-query";
import { Workout } from "../../../shared/types/workout";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useGetWorkouts } from "../hooks/useGetWorkouts";
import { useCreateWorkout } from "../hooks/useCreateWorkout";
import { useDeleteWorkout } from "../hooks/useDeleteWorkout";

type WorkoutsContextType = {
  workouts: Workout[] | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isEmpty: boolean;
  createWorkout: UseMutateFunction<Workout, unknown, object | Workout, unknown>;
  isLoadingCreateWorkout: boolean;
  navigate: NavigateFunction;
  removeWorkout: UseMutateFunction<void, unknown, string, unknown>;
  isLoadingRemove: boolean;
};

const WorkoutsContext = createContext<WorkoutsContextType | undefined>(undefined);

function WorkoutsProvider({ children }: { children: React.ReactNode }) {
  const { workouts, isLoading, isSuccess, isError, isEmpty } = useGetWorkouts();
  const { createWorkout, isLoading: isLoadingCreateWorkout } = useCreateWorkout();
  const { removeWorkout, isLoading: isLoadingRemove } = useDeleteWorkout();
  const navigate = useNavigate();

  const value = {
    workouts,
    isLoading,
    isSuccess,
    isError,
    isEmpty,
    createWorkout,
    isLoadingCreateWorkout,
    navigate,
    removeWorkout,
    isLoadingRemove,
  };
  return <WorkoutsContext.Provider value={value}>{children}</WorkoutsContext.Provider>;
}

function useWorkouts() {
  const context = useContext(WorkoutsContext);
  if (context === undefined) {
    throw new Error("useWorkouts must be used within a WorkoutsProvider");
  }
  return context;
}

export { WorkoutsProvider, useWorkouts };
