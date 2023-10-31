import { createContext, useContext, useState, useEffect, useRef } from "react";
import { UseMutateFunction } from "@tanstack/react-query";
import { useUpdateWorkout } from "../hooks/useUpdateWorkout";
import {
  Split,
  SupersetItem,
  WeightUnit,
  Workout,
  WorkoutItemSuperset,
  WorkoutType,
} from "../../../shared/types/workout";
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
  addWorkoutAerobicItem: () => void;
  addWorkoutAnaerobicItem: () => void;
  addSupersetWorkoutItem: () => void;
  addWorkoutItemToSuperset: (item: WorkoutItemSuperset) => void;
  removeWorkoutItemFromSuperset: (itemId: string, supersetItemId: string) => void;
  removeWorkoutItem: (itemId: string) => void;
  duration: number;
  currItemId: string;
  setCurrItemId: React.Dispatch<React.SetStateAction<string>>;
};

type AnaerobicWorkoutItemEditIFormInput = {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  weightUnit: WeightUnit;
  restInSec: number;
};

type WorkoutItemSupersetIFormInput = {
  name: string;
  restInSec: number;
  sets: number;
  items: SupersetItem[];
};

type AerobicWorkoutItemEditIFormInput = {
  name: string;
  durationInMin: number;
};

type CombinedWorkoutItemEditIFormInput =
  | AnaerobicWorkoutItemEditIFormInput
  | WorkoutItemSupersetIFormInput
  | AerobicWorkoutItemEditIFormInput;

export type WorkoutEditIFormInput = {
  description: string;
  type: WorkoutType;
  split?: Split;
  items: CombinedWorkoutItemEditIFormInput[];
};

const WorkoutEditContext = createContext<WorkoutEditContextType | undefined>(undefined);

function WorkoutEditProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const { id } = params as { id: string };
  const { workout, isLoading, isSuccess, isError } = useGetWorkout(id);
  const itemsLengthRef = useRef<number>(0);
  const { updateWorkout, isLoading: isLoadingUpdateWorkout } = useUpdateWorkout();
  const [currItemId, setCurrItemId] = useState<string>("");
  const navigate = useNavigate();
  const duration = workoutUtilService.calcWorkoutDuration({ workout: workout as Workout });

  function addWorkoutAerobicItem() {
    if (!workout) return;
    const item = workoutUtilService.getDefaultAerobicWorkoutItem(workout.items.length);
    const workoutToUpdate = { ...workout, items: [...workout.items, item] } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function addWorkoutAnaerobicItem() {
    if (!workout) return;
    const item = workoutUtilService.getDefaultAnaerobicWorkoutItem(workout.items.length);
    const workoutToUpdate = { ...workout, items: [...workout.items, item] } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function addSupersetWorkoutItem() {
    if (!workout) return;
    const item = workoutUtilService.getDefaultWorkoutItemSuperset(workout.items.length);
    const workoutToUpdate = { ...workout, items: [...workout.items, item] } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function removeWorkoutItem(itemId: string) {
    if (!workout) return;
    const currItemIdx = workout.items.findIndex(item => item.id === itemId);
    const prevItemId = workout.items[currItemIdx - 1]?.id;
    const nextItemId = workout.items[currItemIdx + 1]?.id;
    const items = [...workout.items];
    items.splice(currItemIdx, 1);
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
    setCurrItemId(prevItemId || nextItemId || "");
  }

  function addWorkoutItemToSuperset(item: WorkoutItemSuperset) {
    if (!workout) return;
    const defaultItem = workoutUtilService.getDefaultSupersetItem(item.items.length);
    const items = workout.items.map(i => {
      if (i.type !== "superset" || i.id !== item.id) return i;
      return { ...i, items: [...i.items, defaultItem] };
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
  useEffect(() => {
    if (currItemId !== "" || !workout) return;
    const firstItemId = workout.items[0].id;
    setCurrItemId(firstItemId);
  }, [workout, currItemId]);

  useEffect(() => {
    if (!workout) return;
    if (!itemsLengthRef.current) {
      itemsLengthRef.current = workout.items.length;
      return;
    }
    if (itemsLengthRef.current < workout.items.length)
      setCurrItemId(workout.items[workout.items.length - 1].id);
  }, [workout]);

  const value = {
    updateWorkout,
    isLoadingUpdateWorkout,
    workout,
    isLoading,
    isSuccess,
    isError,
    params,
    navigate,
    addWorkoutAerobicItem,
    addWorkoutAnaerobicItem,
    addSupersetWorkoutItem,
    addWorkoutItemToSuperset,
    removeWorkoutItemFromSuperset,
    removeWorkoutItem,
    duration,
    currItemId,
    setCurrItemId,
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
