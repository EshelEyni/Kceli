import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { CombinedWorkoutItem, Workout, WorkoutItemAnaerobic } from "../../../shared/types/workout";
import { NavigateFunction, Params, useNavigate, useParams } from "react-router-dom";
import { useGetWorkout } from "../hooks/useGetWorkout";
import workoutUtilService from "../services/workout/workoutUtilService";
import { useGetTodayData } from "../hooks/useGetTodayData";
import { useUpdateTodayData } from "../hooks/useUpdateTodayData";

export type onCompleteAnaerobicSetParams = {
  item: WorkoutItemAnaerobic;
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
  remainingDuration: number;
  currTime: number;
  setCurrTime: Dispatch<SetStateAction<number>>;
  isRunning: boolean;
  setIsRunning: Dispatch<SetStateAction<boolean>>;
  isWorkoutStarted: boolean;
  onStart: () => void;
  onStartItem: (item: CombinedWorkoutItem) => void;
  onCompletedItem: (item: CombinedWorkoutItem) => void;
  unCompletedItems: CombinedWorkoutItem[];
  completedItems: CombinedWorkoutItem[];
  onCompleteAnaerobicSet: ({ item, setIdx }: onCompleteAnaerobicSetParams) => void;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const { id } = params as { id: string };
  const { workout, isLoading, isSuccess, isError } = useGetWorkout(id);
  const { dailyData } = useGetTodayData();
  const { updateDailyData } = useUpdateTodayData();

  const firstUncopmletedItem = _getFirstUncopmletedItem();
  const duration = workoutUtilService.calcDuration({ workout: workout as Workout });
  const remainingDuration = workoutUtilService.calcDuration({
    workout: workout as Workout,
    type: "remaining",
  });
  const navigate = useNavigate();
  const [currTime, setCurrTime] = useState(
    _getItemDuration(firstUncopmletedItem as CombinedWorkoutItem)
  );
  const [isRunning, setIsRunning] = useState(false);
  const sound = new Audio("/assets/sounds/LetsGetReadyToRumble.mp3");
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(
    workout?.items.some(item => item.isCompleted) || false
  );

  const { unCompletedItems, completedItems } = getDailyDataItems();

  function _getFirstUncopmletedItem(): CombinedWorkoutItem | undefined {
    if (!workout) return undefined;
    return workout.items.find(item => !item.isCompleted);
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

  function updateWorkoutInDailyData() {
    if (!dailyData || !workout) return;
    const dailyDataToUpdate = {
      ...dailyData,
      // workouts: [...dailyData.workouts, workout as Workout],
    };
    const isWorkoutExist = dailyDataToUpdate.workouts.some(w => w.id === workout.id);
    dailyDataToUpdate.workouts = isWorkoutExist
      ? dailyDataToUpdate.workouts.map(w => {
          if (w.id === workout.id) w = workout;
          return w;
        })
      : [...dailyDataToUpdate.workouts, workout as Workout];

    updateDailyData(dailyDataToUpdate);
  }

  function onStart() {
    if (!dailyData || !workout) return;
    setIsWorkoutStarted(true);
    updateWorkoutInDailyData();
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) return;
    sound.play();
  }

  // TODO: move to workoutUtilService
  function _getItemDuration(item: CombinedWorkoutItem | undefined): number {
    if (!item) return 0;
    switch (item.type) {
      case "aerobic":
        return item.durationInMin;
      case "anaerobic":
        return workoutUtilService.calcDurationForAnaerobicItem(item);
      case "superset":
        return workoutUtilService.calcDurationForSupersetItem(item);
      default:
        return 0;
    }
  }

  function _updateWorkoutItemStatus(
    item: CombinedWorkoutItem,
    statusKey: "isStarted" | "isCompleted",
    statusValue: boolean
  ) {
    if (!dailyData || !workout) return;

    workout.items = workout.items.map(i => {
      if (i.id === item.id) i[statusKey] = statusValue;
      // if (i.type === "superset") {
      //   i.items = i.items.map(i => {
      //     if (i.id === item.id) i[statusKey] = statusValue;
      //     return i;
      //   });
      // }
      return i;
    });

    const updatedWorkout = { ...workout };

    dailyData.workouts = dailyData.workouts.map(w => {
      if (w.id === updatedWorkout.id) w = updatedWorkout;
      return w;
    });
  }

  function onStartItem(item: CombinedWorkoutItem) {
    if (!dailyData || !workout) return;
    setIsWorkoutStarted(true);
    _updateWorkoutItemStatus(item, "isStarted", true);
    updateWorkoutInDailyData();
    if (item.type !== "aerobic") return;
    _onSetStartTimer(item);
  }

  function onCompletedItem(item: CombinedWorkoutItem) {
    if (!dailyData || !workout) return;
    _updateWorkoutItemStatus(item, "isCompleted", true);
    updateWorkoutInDailyData();
    _onSetCompleteTimer();
  }

  function _onSetStartTimer(item: CombinedWorkoutItem) {
    switch (item.type) {
      case "aerobic": {
        const time = _getItemDuration(item);
        setCurrTime(time);
        break;
      }
      case "anaerobic": {
        const { restInSec } = item;
        const restInMin = restInSec / 60;
        setCurrTime(restInMin);
        break;
      }
      case "superset": {
        const { restInSec } = item;
        const restInMin = restInSec / 60;
        setCurrTime(restInMin);
        break;
      }
      default:
        break;
    }

    setIsRunning(true);
  }

  function _onSetCompleteTimer() {
    const item = _getFirstUncopmletedItem();
    if (!item) return;

    switch (item.type) {
      case "aerobic": {
        const time = _getItemDuration(item);
        setCurrTime(time);
        break;
      }
      case "anaerobic": {
        const { restInSec } = item;
        const restInMin = restInSec / 60;
        setCurrTime(restInMin);
        break;
      }
      case "superset":
        break;
      default:
        break;
    }

    setIsRunning(false);
  }

  function onCompleteAnaerobicSet({ item, setIdx }: onCompleteAnaerobicSetParams) {
    if (!dailyData || !workout) return;
    const updatedWorkout = { ...workout };

    const updatedItem =
      (updatedWorkout.items.find(i => i.id === item.id) as WorkoutItemAnaerobic) ??
      (updatedWorkout.items
        .filter(i => i.type === "superset")
        .find(i => i.id === item.id) as WorkoutItemAnaerobic);

    if (!updatedItem) return;
    updatedItem.setCompletedStatus[setIdx] = true;
    const { setCompletedStatus, sets } = updatedItem;
    if (setCompletedStatus.length === sets && setCompletedStatus.every(s => s === true))
      updatedItem.isCompleted = true;
    dailyData.workouts = dailyData.workouts.map(w => {
      if (w.id === updatedWorkout.id) w = updatedWorkout;
      return w;
    });

    updateDailyData(dailyData);
  }

  const value = {
    workout,
    isLoading,
    isSuccess,
    isError,
    params,
    navigate,
    duration,
    remainingDuration,
    currTime,
    setCurrTime,
    isRunning,
    setIsRunning,
    isWorkoutStarted,
    onStart,
    onStartItem,
    unCompletedItems,
    completedItems,
    onCompletedItem,
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
