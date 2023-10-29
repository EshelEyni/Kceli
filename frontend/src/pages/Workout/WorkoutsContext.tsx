import { createContext, useContext, useState, useEffect } from "react";
import { UseMutateFunction } from "@tanstack/react-query";
import { Workout } from "../../../../shared/types/workout";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useGetWorkouts } from "../../hooks/useGetWorkouts";
import { useCreateWorkout } from "../../hooks/useCreateWorkout";
import { useDeleteWorkout } from "../../hooks/useDeleteWorkout";
import { useAuth } from "../../hooks/useAuth";
import { UserOrNull } from "../../types/app";
import { WorkoutDay } from "../../../../shared/types/user";

type WorkoutsContextType = {
  loggedInUser: UserOrNull;
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
  workoutSchedule: WorkoutDay[] | undefined;
  setWorkoutSchedule: React.Dispatch<React.SetStateAction<WorkoutDay[] | undefined>>;
};

const WorkoutsContext = createContext<WorkoutsContextType | undefined>(undefined);

function WorkoutsProvider({ children }: { children: React.ReactNode }) {
  const { loggedInUser } = useAuth();
  const { workouts, isLoading, isSuccess, isError, isEmpty } = useGetWorkouts();
  const { createWorkout, isLoading: isLoadingCreateWorkout } = useCreateWorkout();
  const { removeWorkout, isLoading: isLoadingRemove } = useDeleteWorkout();
  const [workoutSchedule, setWorkoutSchedule] = useState<WorkoutDay[] | undefined>(
    loggedInUser?.workoutSchedule
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) return;
    setWorkoutSchedule(loggedInUser.workoutSchedule);
  }, [loggedInUser]);

  const value = {
    loggedInUser,
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
    workoutSchedule,
    setWorkoutSchedule,
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
