import { Dispatch, SetStateAction, createContext, useContext, useState, useEffect } from "react";
import {
  CombinedWorkoutItem,
  Workout,
  WorkoutItemAnaerobic,
  WorkoutItemSuperset,
} from "../../../../shared/types/workout";
import { NavigateFunction, Params, useNavigate, useParams } from "react-router-dom";
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
  params: Readonly<Params<string>>;
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
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const sound = new Audio("/assets/sounds/LetsGetReadyToRumble.mp3");
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params as { id: string };
  const { workout, isLoading, isSuccess, isError } = useGetWorkout(id);
  const { dailyData } = useGetTodayData();
  const currWorkout = dailyData?.workouts.find(w => w.id === id);
  const { updateDailyData } = useUpdateTodayData();

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
    const dailyDataToUpdate = { ...dailyData };
    const isWorkoutExist = dailyDataToUpdate.workouts.some(w => w.id === workout.id);
    dailyDataToUpdate.workouts = isWorkoutExist
      ? dailyDataToUpdate.workouts.map(w => {
          if (w.id === workout.id) w = workout;
          return w;
        })
      : [...dailyDataToUpdate.workouts, workout as Workout];

    updateDailyData(dailyDataToUpdate);
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) return;
    sound.play();
  }

  function onStartItem(item: CombinedWorkoutItem) {
    if (!dailyData || !workout) return;
    updateWorkoutItemStatus(item, "isStarted", true);
    if (item.type !== "aerobic") return;
    onSetStartTimer(item);
  }

  function onCompleteItem(item: CombinedWorkoutItem) {
    if (!dailyData || !workout) return;
    updateWorkoutItemStatus(item, "isCompleted", true);
    onSetCompleteTimer();
  }

  function onSetStartTimer(item: CombinedWorkoutItem) {
    const time = getClockTimeForItem(item);
    setTime(time);
    setInitialTime(time);
    setIsRunning(true);
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
    if (!dailyData || !workout) return defaultVal;
    const currWorkOut = dailyData.workouts.find(w => w.id === workout.id);
    if (!currWorkOut) return defaultVal;

    const unCompletedItems = currWorkOut.items.filter(item => !item.isCompleted);
    const completedItems = currWorkOut.items.filter(item => item.isCompleted);

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
    if (!dailyData || !workout) return;

    workout.items = workout.items.map(i => {
      if (i.id === item.id) i[statusKey] = statusValue;
      return i;
    });

    const updatedWorkout = { ...workout };
    const updatedDailyData = { ...dailyData };

    updatedDailyData.workouts = dailyData.workouts.map(w => {
      if (w.id === updatedWorkout.id) return updatedWorkout;
      return w;
    });
    updateDailyData(updatedDailyData);
  }

  useEffect(() => {
    if (!currWorkout) return;
    const firstUncopmletedItem = currWorkout.items.find(item => !item.isCompleted);
    if (!firstUncopmletedItem) return;
    setCurrItem(firstUncopmletedItem);
  }, [currWorkout]);

  useEffect(() => {
    if (!currItem) return;
    const time = getClockTimeForItem(currItem);
    setTime(time);
    setInitialTime(time);
  }, [currItem]);

  useEffect(() => {
    if (!currWorkout) return;
    const isStartedWorkout = currWorkout.items.some(item => item.isStarted);
    if (!isStartedWorkout) return;
    setIsWorkoutStarted(isStartedWorkout);
  }, [currWorkout]);

  const value = {
    workout,
    isLoading,
    isSuccess,
    isError,
    params,
    navigate,
    duration,
    completedDuration,
    remainingDuration,
    currItem,
    setCurrItem,
    time,
    setTime,
    isRunning,
    setIsRunning,
    isWorkoutStarted,
    onStart,
    onStartItem,
    unCompletedItems,
    completedItems,
    onCompleteItem,
    onResetTimer,
    initialTime,
    setInitialTime,
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
