import {
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

function getDefaultWormupItem(): WorkoutItemAerobic {
  return {
    id: createId(),
    type: "aerobic",
    name: "wormup",
    durationInMin: 10,
  };
}

function getDefaultAerobicWorkoutItem(): WorkoutItemAerobic {
  return {
    id: createId(),
    type: "aerobic",
    name: "",
    durationInMin: 30,
  };
}

function getDefaultAnaerobicWorkoutItem(): WorkoutItemAnaerobic {
  return {
    id: createId(),
    type: "anaerobic",
    name: "",
    sets: 3,
    reps: 10,
    weight: 0,
    weightUnit: "kg",
    restInSec: 60,
  };
}

function getDefaultWorkoutItemSuperset(): WorkoutItemSuperset {
  return {
    id: createId(),
    type: "superset",
    name: "",
    items: [],
  };
}

function calcDuration({ workout, type = "all" }: { workout: Workout; type?: "all" | "remaining" }) {
  if (!workout) return 0;
  function calcDurationForAnaerobic(item: WorkoutItemAnaerobic) {
    const minuteMultiplySet = item.sets;
    const restBetweenSets = (item.restInSec * item.sets) / 60;
    return minuteMultiplySet + restBetweenSets;
  }

  const duration = workout?.items
    .filter(item => {
      if (type === "all") return true;
      if (type === "remaining") return !item.isCompleted;
      return false;
    })
    .reduce((acc, item) => {
      switch (item.type) {
        case "anaerobic":
          return acc + calcDurationForAnaerobic(item);
        case "aerobic":
          return acc + item.durationInMin;
        case "superset":
          return acc + item.items.reduce((acc, item) => acc + calcDurationForAnaerobic(item), 0);
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
};
