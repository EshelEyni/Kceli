import { createContext, useContext } from "react";
import { UseMutateFunction } from "@tanstack/react-query";
import { useUpdateWorkout } from "../hooks/useUpdateWorkout";
import { Workout } from "../../../shared/types/workout";
import { NavigateFunction, Params, useNavigate, useParams } from "react-router-dom";
import { useGetWorkout } from "../hooks/useGetWorkout";
import workoutUtilService from "../services/workout/workoutUtilService";

type WorkoutEditContextType = {
  workout: Workout | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  params: Readonly<Params<string>>;
  updateWorkout: UseMutateFunction<Workout, unknown, Workout, unknown>;
  isLoadingUpdateWorkout: boolean;
  navigate: NavigateFunction;
  addWorkoutItem: () => void;
  addSupersetWorkoutItem: () => void;
  addWorkoutItemToSuperset: (itemId: string) => void;
  removeWorkoutItemFromSuperset: (itemId: string, supersetItemId: string) => void;
  removeWorkoutItem: (itemId: string) => void;
  duration: number;
};

const WorkoutEditContext = createContext<WorkoutEditContextType | undefined>(undefined);

function WorkoutEditProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const { id } = params as { id: string };
  const { workout, isLoading, isSuccess, isError } = useGetWorkout(id);
  const { updateWorkout, isLoading: isLoadingUpdateWorkout } = useUpdateWorkout();
  const navigate = useNavigate();
  const duration = workoutUtilService.calcDuration({ workout: workout as Workout });

  function addWorkoutItem() {
    if (!workout) return;
    const { type } = workout;
    if (type === "anaerobic") {
      const workoutToUpdate: Workout = {
        ...workout,
        items: [...workout.items, workoutUtilService.getDefaultAnaerobicWorkoutItem()],
      };

      updateWorkout(workoutToUpdate);
    } else if (type === "aerobic") {
      const workoutToUpdate: Workout = {
        ...workout,
        items: [...workout.items, workoutUtilService.getDefaultAerobicWorkoutItem()],
      };

      updateWorkout(workoutToUpdate);
    }
  }

  function addSupersetWorkoutItem() {
    if (!workout) return;
    const workoutToUpdate = {
      ...workout,
      items: [...workout.items, workoutUtilService.getDefaultWorkoutItemSuperset()],
    } as Workout;

    updateWorkout(workoutToUpdate);
  }

  function removeWorkoutItem(itemId: string) {
    if (!workout) return;
    const workoutToUpdate = {
      ...workout,
      items: workout.items.filter(item => item.id !== itemId),
    } as Workout;

    updateWorkout(workoutToUpdate);
  }

  function addWorkoutItemToSuperset(itemId: string) {
    if (!workout) return;
    const defaultItem = workoutUtilService.getDefaultSupersetItem();
    const items = workout.items.map(item => {
      if (item.type !== "superset" || item.id !== itemId) return item;
      return { ...item, items: [...item.items, defaultItem] };
    });

    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function removeWorkoutItemFromSuperset(itemId: string, supersetItemId: string) {
    if (!workout) return;
    const items = workout.items.map(item => {
      if (item.type !== "superset" || item.id !== itemId) return item;
      return { ...item, items: item.items.filter(item => item.id !== supersetItemId) };
    });
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  const value = {
    updateWorkout,
    isLoadingUpdateWorkout,
    workout,
    isLoading,
    isSuccess,
    isError,
    params,
    navigate,
    addWorkoutItem,
    addSupersetWorkoutItem,
    addWorkoutItemToSuperset,
    removeWorkoutItemFromSuperset,
    removeWorkoutItem,
    duration,
  };
  return <WorkoutEditContext.Provider value={value}>{children}</WorkoutEditContext.Provider>;
}

function useWorkoutEdit() {
  const context = useContext(WorkoutEditContext);
  if (context === undefined) {
    throw new Error("useWorkoutItemEdit must be used within a WorkoutEditProvider");
  }
  return context;
}

export { WorkoutEditProvider, useWorkoutEdit };
