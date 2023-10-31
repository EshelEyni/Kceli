import { Dispatch, SetStateAction, createContext, useContext, useState, useEffect } from "react";
import {
  CombinedWorkoutItem,
  Workout,
  WorkoutItemAnaerobic,
  WorkoutItemSuperset,
} from "../../../shared/types/workout";
import { NavigateFunction, Params, useNavigate, useParams } from "react-router-dom";
import { useGetWorkout } from "../hooks/useGetWorkout";
import workoutUtilService from "../services/workout/workoutUtilService";
import { useGetTodayData } from "../hooks/useGetTodayData";
import { useUpdateTodayData } from "../hooks/useUpdateTodayData";

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
  currTime: number;
  setCurrTime: Dispatch<SetStateAction<number>>;
  isRunning: boolean;
  setIsRunning: Dispatch<SetStateAction<boolean>>;
  isWorkoutStarted: boolean;
  onStart: () => void;
  onStartItem: (item: CombinedWorkoutItem) => void;
  onCompleteAeorbicItem: (item: CombinedWorkoutItem) => void;
  unCompletedItems: CombinedWorkoutItem[];
  completedItems: CombinedWorkoutItem[];
  onCompleteAnaerobicSet: ({ item, setIdx }: onCompleteAnaerobicSetParams) => void;
  time: number;
  setTime: Dispatch<SetStateAction<number>>;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const sound = new Audio("/assets/sounds/LetsGetReadyToRumble.mp3");
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params as { id: string };
  const { workout, isLoading, isSuccess, isError } = useGetWorkout(id);
  const { dailyData } = useGetTodayData();
  const { updateDailyData } = useUpdateTodayData();

  const [currTime, setCurrTime] = useState(0);
  const [time, setTime] = useState(currTime * 60);

  const [isRunning, setIsRunning] = useState(false);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(
    workout?.items.some(item => item.isStarted) || false
  );

  const duration = workoutUtilService.calcWorkoutDuration({ workout: workout as Workout });
  const completedDuration = workoutUtilService.calcWorkoutDuration({
    workout: workout as Workout,
    type: "completed",
  });
  const remainingDuration = workoutUtilService.calcWorkoutDuration({
    workout: workout as Workout,
    type: "remaining",
  });

  const { unCompletedItems, completedItems } = _getDailyDataItems();

  function onStart() {
    if (!dailyData || !workout) return;
    setIsWorkoutStarted(true);
    _updateWorkoutInDailyData();
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) return;
    sound.play();
  }

  function onStartItem(item: CombinedWorkoutItem) {
    if (!dailyData || !workout) return;
    _updateWorkoutItemStatus(item, "isStarted", true);
    _updateWorkoutInDailyData();
    if (item.type !== "aerobic") return;
    _onSetStartTimer(item);
  }

  function onCompleteAeorbicItem(item: CombinedWorkoutItem) {
    if (!dailyData || !workout) return;
    _updateWorkoutItemStatus(item, "isCompleted", true);
    _updateWorkoutInDailyData();
    _onSetCompleteTimer();
  }

  function onCompleteAnaerobicSet({ item, setIdx }: onCompleteAnaerobicSetParams) {
    if (!dailyData || !workout) return;

    const updatedWorkout = { ...workout };

    const updatedItem = updatedWorkout.items.find(i => i.id === item.id) as WorkoutItemAnaerobic;
    if (!updatedItem) return;

    updatedItem.sets[setIdx] = { ...updatedItem.sets[setIdx], isCompleted: true };
    updatedItem.isCompleted = updatedItem.sets.every(set => set.isCompleted);

    dailyData.workouts = dailyData.workouts.map(w => {
      if (w.id === updatedWorkout.id) w = updatedWorkout;
      return w;
    });

    updateDailyData(dailyData);
  }

  function _onSetStartTimer(item: CombinedWorkoutItem) {
    const time = _getClockTimeForItem(item);
    setCurrTime(time);
    setIsRunning(true);
  }

  function _onSetCompleteTimer() {
    const item = workout?.items.find(item => !item.isCompleted);
    if (!item) return;
    const time = _getClockTimeForItem(item);
    setCurrTime(time);
    setIsRunning(false);
  }

  function _getDailyDataItems() {
    const defaultVal = { unCompletedItems: [], completedItems: [] };
    if (!dailyData || !workout) return defaultVal;
    const currWorkOut = dailyData.workouts.find(w => w.id === workout.id);
    if (!currWorkOut) return defaultVal;

    const unCompletedItems = currWorkOut.items.filter(item => !item.isCompleted);
    const completedItems = currWorkOut.items.filter(item => item.isCompleted);

    return { unCompletedItems, completedItems };
  }

  // function _getFirstUncopmletedItem(): CombinedWorkoutItem | undefined {
  //   if (!workout) return undefined;
  //   return workout.items.find(item => !item.isCompleted);
  // }

  function _updateWorkoutInDailyData() {
    if (!dailyData || !workout) return;
    const dailyDataToUpdate = { ...dailyData };
    const isWorkoutExist = dailyDataToUpdate.workouts.some(w => w.id === workout.id);
    dailyDataToUpdate.workouts = isWorkoutExist
      ? dailyDataToUpdate.workouts.map(w => {
          if (w.id === workout.id) w = workout;
          return w;
        })
      : [...dailyDataToUpdate.workouts, workout as Workout];

    updateDailyData(dailyDataToUpdate);
  }

  function _getClockTimeForItem(item: CombinedWorkoutItem | undefined): number {
    if (!item) return 0;
    if (item.type === "aerobic") return item.durationInMin;
    return item.restInSec / 60;
  }

  function _updateWorkoutItemStatus(
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

    dailyData.workouts = dailyData.workouts.map(w => {
      if (w.id === updatedWorkout.id) return updatedWorkout;
      return w;
    });
  }

  useEffect(() => {
    if (!workout) return;
    const firstUncopmletedItem = workout.items.find(item => !item.isCompleted);
    setCurrTime(_getClockTimeForItem(firstUncopmletedItem));
  }, [workout]);

  useEffect(() => {
    setTime(currTime * 60);
  }, [currTime]);

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
    currTime,
    setCurrTime,
    time,
    setTime,
    isRunning,
    setIsRunning,
    isWorkoutStarted,
    onStart,
    onStartItem,
    unCompletedItems,
    completedItems,
    onCompleteAeorbicItem,
    onCompleteAnaerobicSet,
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
