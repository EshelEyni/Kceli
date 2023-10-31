import {
  WorkoutSet,
  BasicWorkoutItem,
  Split,
  SupersetItem,
  Workout,
  WorkoutItemAerobic,
  WorkoutItemAnaerobic,
  WorkoutItemSuperset,
  WeightUnit,
  CombinedWorkoutItem,
} from "../../../../shared/types/workout";
import { createId } from "../util/utilService";

const SPLIT_TYPES: Split[] = ["FBW", "A", "B", "C", "D", "E", "F"];

function getDefaultWorkout(): Workout {
  return {
    id: createId(),
    userId: "",
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

function getDefaultAerobicWorkoutItem(idx: number): WorkoutItemAerobic {
  return {
    ...getBasicDefaultWorkoutItem(),
    name: `exercise ${idx + 1}`,
    type: "aerobic",
    durationInMin: 30,
  };
}

function getAnaerobicSet(): WorkoutSet {
  return { isCompleted: false };
}

function getDefaultAnaerobicWorkoutItem(idx: number): WorkoutItemAnaerobic {
  return {
    ...getBasicDefaultWorkoutItem(),
    name: `exercise ${idx + 1}`,
    type: "anaerobic",
    sets: Array.from({ length: 3 }, () => getAnaerobicSet()),
    reps: 10,
    weight: 10,
    weightUnit: WeightUnit.KG,
    restInSec: 60,
  };
}

function getDefaultWorkoutItemSuperset(idx: number): WorkoutItemSuperset {
  return {
    ...getBasicDefaultWorkoutItem(),
    name: `superset ${idx + 1}`,
    type: "superset",
    restInSec: 60,
    sets: Array.from({ length: 3 }, () => getAnaerobicSet()),
    items: [],
  };
}

function getDefaultSupersetItem(idx: number): SupersetItem {
  return {
    id: createId(),
    name: `item ${idx + 1}`,
    reps: 10,
    weight: 10,
    weightUnit: WeightUnit.KG,
  };
}

function calcDurationForAnaerobicItem(item: WorkoutItemAnaerobic) {
  const numOfSets = _getNumOfSets(item);
  const setDuration = (numOfSets * 30) / 60;
  const restBetweenSets = (item.restInSec * numOfSets) / 60;
  return Math.round(setDuration + restBetweenSets);
}

function calcDurationForSupersetItem(item: WorkoutItemSuperset) {
  const numOfSets = _getNumOfSets(item);
  const setDuration = (numOfSets * 30) / 60 + item.items.length;
  const restBetweenSets = (item.restInSec * numOfSets) / 60;
  return Math.round(setDuration + restBetweenSets);
}

function calcWorkoutDuration({
  workout,
  type = "all",
}: {
  workout: Workout;
  type?: "all" | "remaining" | "completed";
}) {
  if (!workout) return 0;
  const duration = workout?.items
    .filter(item => {
      if (type === "all") return true;
      if (type === "remaining") return !item.isCompleted;
      if (type === "completed") return item.isCompleted;
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

  return Math.round(duration);
}

function calcItemDuration(item: CombinedWorkoutItem) {
  switch (item.type) {
    case "anaerobic":
      return calcDurationForAnaerobicItem(item);
    case "aerobic":
      return item.durationInMin;
    case "superset":
      return calcDurationForSupersetItem(item);
    default:
      return 0;
  }
}

function _getNumOfSets(item: WorkoutItemAnaerobic | WorkoutItemSuperset) {
  if (!item.sets) return 0;
  const { length: setLength } = item.sets;
  return Number(setLength);
}

export default {
  SPLIT_TYPES,
  getDefaultWorkout,
  getDefaultAerobicWorkoutItem,
  getDefaultAnaerobicWorkoutItem,
  getDefaultWorkoutItemSuperset,
  getDefaultSupersetItem,
  calcWorkoutDuration,
  calcItemDuration,
  calcDurationForAnaerobicItem,
  calcDurationForSupersetItem,
  getAnaerobicSet,
};
