import { Dispatch, SetStateAction, createContext, useContext, useState, useEffect } from "react";
import {
  CombinedWorkoutItem,
  Workout,
  WorkoutItemAnaerobic,
  WorkoutItemSuperset,
} from "../../../../shared/types/workout";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { useGetWorkout } from "../../hooks/useGetWorkout";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { useGetTodayData } from "../../hooks/useGetTodayData";
import { useUpdateTodayData } from "../../hooks/useUpdateTodayData";

export type onCompleteAnaerobicSetParams = {
  item: WorkoutItemAnaerobic | WorkoutItemSuperset;
  setIdx: number;
};

type WorkoutContextType = {
  workout: Workout | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  navigate: NavigateFunction;
  duration: number;
  completedDuration: number;
  remainingDuration: number;
  currItem: CombinedWorkoutItem | null;
  setCurrItem: Dispatch<SetStateAction<CombinedWorkoutItem | null>>;
  isRunning: boolean;
  setIsRunning: Dispatch<SetStateAction<boolean>>;
  isWorkoutStarted: boolean;
  onStart: () => void;
  onStartItem: (item: CombinedWorkoutItem) => void;
  onResetTimer: () => void;
  onCompleteItem: (item: CombinedWorkoutItem) => void;
  unCompletedItems: CombinedWorkoutItem[];
  completedItems: CombinedWorkoutItem[];
  time: number;
  setTime: Dispatch<SetStateAction<number>>;
  initialTime: number;
  setInitialTime: Dispatch<SetStateAction<number>>;
  isLoadingUpdateDailyData: boolean;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params as { id: string };
  const { workout, isLoading, isSuccess, isError } = useGetWorkout(id);
  const { dailyData } = useGetTodayData();
  const currWorkout = dailyData?.workouts.find(w => w.id === id);
  const { updateDailyData, isLoading: isLoadingUpdateDailyData } = useUpdateTodayData();

  const [currItem, setCurrItem] = useState<CombinedWorkoutItem | null>(null);
  const [initialTime, setInitialTime] = useState(0);
  const [time, setTime] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);

  const duration = workoutUtilService.calcWorkoutDuration({ workout: currWorkout as Workout });
  const completedDuration = workoutUtilService.calcWorkoutDuration({
    workout: currWorkout as Workout,
    type: "completed",
  });
  const remainingDuration = workoutUtilService.calcWorkoutDuration({
    workout: currWorkout as Workout,
    type: "remaining",
  });

  const { unCompletedItems, completedItems } = getDailyDataItems();

  function onStart() {
    if (!dailyData || !workout) return;
    setIsWorkoutStarted(true);

    const isWorkoutExist = dailyData.workouts.some(w => w.id === workout.id);

    if (!isWorkoutExist) {
      const dailyDataToUpdate = { ...dailyData };
      const workouts = [...dailyDataToUpdate.workouts, workout as Workout];
      updateDailyData({ id: dailyDataToUpdate.id, data: { workouts } });
    }
  }

  function onStartItem(item: CombinedWorkoutItem) {
    if (!dailyData || !workout) return;
    updateWorkoutItemStatus(item, "isStarted", true);
  }

  function onCompleteItem(item: CombinedWorkoutItem) {
    if (!dailyData || !workout) return;
    updateWorkoutItemStatus(item, "isCompleted", true);
    onSetCompleteTimer();
  }

  function onResetTimer() {
    if (!currItem) return;
    const time = getClockTimeForItem(currItem);
    setTime(time);
    setInitialTime(time);
    setIsRunning(false);
  }

  function onSetCompleteTimer() {
    const item = currWorkout?.items.find(item => !item.isCompleted);
    if (!item) return;
    const time = getClockTimeForItem(item);
    setTime(time);
    setInitialTime(time);
    setIsRunning(false);
  }

  function getDailyDataItems() {
    const defaultVal = { unCompletedItems: [], completedItems: [] };
    if (!dailyData || !workout || !currWorkout) return defaultVal;
    const unCompletedItems = currWorkout.items.filter(item => !item.isCompleted);
    const completedItems = currWorkout.items.filter(item => item.isCompleted);
    return { unCompletedItems, completedItems };
  }

  function getClockTimeForItem(item: CombinedWorkoutItem | undefined): number {
    if (!item) return 0;
    if (item.type === "aerobic") return item.durationInMin * 60;
    return (item.restInSec / 60) * 60;
  }

  function updateWorkoutItemStatus(
    item: CombinedWorkoutItem,
    statusKey: "isStarted" | "isCompleted",
    statusValue: boolean
  ) {
    if (!dailyData || !workout || !currWorkout) return;

    const updatedWorkout = { ...currWorkout };
    updatedWorkout.items = updatedWorkout.items.map(i => {
      if (i.id === item.id) i[statusKey] = statusValue;
      return i;
    });

    const updatedDailyData = { ...dailyData };
    const workouts = dailyData.workouts.map(w => {
      if (w.id === updatedWorkout.id) return updatedWorkout;
      return w;
    });

    updateDailyData({ id: updatedDailyData.id, data: { workouts } });
    if (statusKey === "isCompleted") goToNextItem(item.id);
  }

  function goToNextItem(itemId: string) {
    if (!dailyData || !workout || !currWorkout) return;
    const currIdx = currWorkout.items.findIndex(item => item.id === itemId);
    const currLength = currWorkout.items.filter(i => !i.isCompleted).length;
    const nextIdx = currIdx + 1;
    const nextItem =
      nextIdx > currLength
        ? currWorkout.items.find(i => !i.isCompleted)
        : currWorkout.items[nextIdx];
    if (!nextItem) return;
    setCurrItem(nextItem);
  }

  useEffect(() => {
    if (!currItem) return setCurrItem(unCompletedItems[0]);
  }, [unCompletedItems, currItem]);

  useEffect(() => {
    if (!currItem) return;
    const time = getClockTimeForItem(currItem);
    setTime(time);
    setInitialTime(time);
  }, [currItem]);

  const value = {
    workout,
    isLoading,
    isSuccess,
    isError,
    isLoadingUpdateDailyData,
    navigate,
    duration,
    completedDuration,
    remainingDuration,
    currItem,
    setCurrItem,
    time,
    setTime,
    initialTime,
    setInitialTime,
    isRunning,
    setIsRunning,
    isWorkoutStarted,
    unCompletedItems,
    completedItems,
    onStart,
    onStartItem,
    onCompleteItem,
    onResetTimer,
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
