import { createContext, useContext, useState, useEffect } from "react";
import { UseMutateFunction } from "@tanstack/react-query";
import { useUpdateWorkout } from "../../hooks/useUpdateWorkout";
import {
  CombinedWorkoutItem,
  Split,
  SupersetItem,
  WeightUnit,
  WorkOutItemTypes,
  Workout,
  WorkoutItemSuperset,
  WorkoutType,
} from "../../../../shared/types/workout";
import { NavigateFunction, Params, useNavigate, useParams } from "react-router-dom";
import { useGetWorkout } from "../../hooks/useGetWorkout";
import workoutUtilService from "../../services/workout/workoutUtilService";

type WorkoutEditContextType = {
  workout: Workout | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  params: Readonly<Params<string>>;
  updateWorkout: UseMutateFunction<Workout, unknown, Workout, unknown>;
  isLoadingUpdateWorkout: boolean;
  navigate: NavigateFunction;
  addWorkoutItem: (type: WorkOutItemTypes) => void;
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
  const [currItemId, setCurrItemId] = useState<string>("");
  const { updateWorkout, isLoading: isLoadingUpdateWorkout } = useUpdateWorkout();
  const navigate = useNavigate();
  const duration = workoutUtilService.calcWorkoutDuration({ workout: workout as Workout });

  function addWorkoutItem(type: WorkOutItemTypes) {
    if (!workout) return;

    let item: CombinedWorkoutItem | null = null;
    const idx = workout.items.length;

    switch (type) {
      case "aerobic":
        item = workoutUtilService.getDefaultAerobicWorkoutItem(idx);
        break;
      case "anaerobic":
        item = workoutUtilService.getDefaultAnaerobicWorkoutItem(idx);
        break;
      case "superset":
        item = workoutUtilService.getDefaultWorkoutItemSuperset(idx);
        break;
    }

    if (!item) return;

    const workoutToUpdate = { ...workout, items: [...workout.items, item] } as Workout;
    updateWorkout(workoutToUpdate, {
      onSuccess: (data: Workout) => setCurrItemId(data.items.at(-1)?.id || ""),
    });
  }

  function removeWorkoutItem(itemId: string) {
    if (!workout) return;
    const currItemIdx = workout.items.findIndex(i => i.id === itemId);
    if (currItemIdx === -1) return;
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
    const defaultSupersetItem = workoutUtilService.getDefaultSupersetItem(item.items.length);
    const updatedItem = { ...item, items: [...item.items, defaultSupersetItem] };
    const items = workout.items.map(i => (i.id !== item.id ? i : updatedItem));
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function removeWorkoutItemFromSuperset(itemId: string, supersetItemId: string) {
    if (!workout) return;
    const items = workout.items.map(i => {
      if (i.type !== "superset" || i.id !== itemId) return i;
      return { ...i, items: i.items.filter(item => item.id !== supersetItemId) };
    });
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  useEffect(() => {
    if (!currItemId && workout?.items.length) setCurrItemId(workout.items[0].id);
  }, [workout, currItemId]);

  const value = {
    updateWorkout,
    isLoadingUpdateWorkout,
    workout,
    isLoading,
    isSuccess,
    isError,
    params,
    navigate,
    duration,
    currItemId,
    setCurrItemId,
    addWorkoutItem,
    removeWorkoutItem,
    addWorkoutItemToSuperset,
    removeWorkoutItemFromSuperset,
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
