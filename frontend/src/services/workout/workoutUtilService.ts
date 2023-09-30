import {
  BasicWorkoutItem,
  Workout,
  WorkoutItemAerobic,
  WorkoutItemAnaerobic,
  WorkoutItemSuperset,
} from "../../../../shared/types/workout";
import { createId } from "../util/utilService";

function getDefaultWorkout(): Workout {
  return {
    id: createId(),
    description: "no description",
    type: "anaerobic",
    split: "FBW",
    items: [getDefaultWormupItem()],
  };
}

function getBasicDefaultWorkoutItem(): BasicWorkoutItem {
  return {
    id: createId(),
    name: "",
    isStarted: false,
    isCompleted: false,
  };
}

function getDefaultWormupItem(): WorkoutItemAerobic {
  return {
    ...getBasicDefaultWorkoutItem(),
    type: "aerobic",
    name: "wormup",
    durationInMin: 10,
  };
}

function getDefaultAerobicWorkoutItem(): WorkoutItemAerobic {
  return {
    ...getBasicDefaultWorkoutItem(),
    type: "aerobic",
    durationInMin: 30,
  };
}

function getDefaultAnaerobicWorkoutItem(): WorkoutItemAnaerobic {
  return {
    ...getBasicDefaultWorkoutItem(),
    type: "anaerobic",
    sets: 3,
    reps: 10,
    weight: 0,
    weightUnit: "kg",
    restInSec: 60,
    setCompletedStatus: [],
  };
}

function getDefaultWorkoutItemSuperset(): WorkoutItemSuperset {
  return {
    ...getBasicDefaultWorkoutItem(),
    type: "superset",
    items: [],
  };
}
function calcDurationForAnaerobicItem(item: WorkoutItemAnaerobic) {
  const minuteMultiplySet = item.sets;
  const restBetweenSets = (item.restInSec * item.sets) / 60;
  return minuteMultiplySet + restBetweenSets;
}

function calcDurationForSupersetItem(item: WorkoutItemSuperset) {
  return item.items.reduce((acc, item) => acc + calcDurationForAnaerobicItem(item), 0);
}

function calcDuration({ workout, type = "all" }: { workout: Workout; type?: "all" | "remaining" }) {
  if (!workout) return 0;

  const duration = workout?.items
    .filter(item => {
      if (type === "all") return true;
      if (type === "remaining") return !item.isCompleted;
      return false;
    })
    .reduce((acc, item) => {
      switch (item.type) {
        case "anaerobic":
          return acc + calcDurationForAnaerobicItem(item);
        case "aerobic":
          return acc + item.durationInMin;
        case "superset":
          return acc + calcDurationForSupersetItem(item);
        default:
          return acc;
      }
    }, 0);

  return duration;
}

export default {
  getDefaultWorkout,
  getDefaultAerobicWorkoutItem,
  getDefaultAnaerobicWorkoutItem,
  getDefaultWorkoutItemSuperset,
  calcDuration,
  calcDurationForAnaerobicItem,
  calcDurationForSupersetItem,
};
