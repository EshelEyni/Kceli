import {
  BasicWorkoutItem,
  WorkoutItemAerobic,
  WorkoutItemAnaerobic,
  WorkoutItemSuperset,
} from "../../../../shared/types/workout";

function validateBasicWorkoutItem(item: unknown): item is BasicWorkoutItem {
  if (typeof item !== "object" || item === null) return false;

  return (
    "name" in item &&
    typeof (item as BasicWorkoutItem).name === "string" &&
    "isStarted" in item &&
    typeof (item as BasicWorkoutItem).isStarted === "boolean" &&
    "isCompleted" in item &&
    typeof (item as BasicWorkoutItem).isCompleted === "boolean"
  );
}

function validateWorkoutItemAerobic(item: unknown): item is WorkoutItemAerobic {
  return (
    validateBasicWorkoutItem(item) &&
    "type" in item &&
    (item as WorkoutItemAerobic).type === "aerobic" &&
    "durationInMin" in item &&
    typeof (item as WorkoutItemAerobic).durationInMin === "number"
  );
}

function validateWorkoutItemAnaerobic(item: unknown): item is WorkoutItemAnaerobic {
  if (typeof item !== "object" || item === null) return false;

  return (
    validateBasicWorkoutItem(item) &&
    "type" in item &&
    (item as WorkoutItemAnaerobic).type === "anaerobic" &&
    "sets" in item &&
    Array.isArray((item as WorkoutItemAnaerobic).sets) &&
    (item as WorkoutItemAnaerobic).sets.every(set => typeof set.isCompleted === "boolean") &&
    "reps" in item &&
    typeof (item as WorkoutItemAnaerobic).reps === "number" &&
    "weight" in item &&
    typeof (item as WorkoutItemAnaerobic).weight === "number" &&
    "weightUnit" in item &&
    ((item as WorkoutItemAnaerobic).weightUnit === "kg" ||
      (item as WorkoutItemAnaerobic).weightUnit === "lbs") &&
    "restInSec" in item &&
    typeof (item as WorkoutItemAnaerobic).restInSec === "number"
  );
}

function validateWorkoutItemSuperset(item: unknown): item is WorkoutItemSuperset {
  if (typeof item !== "object" || item === null) return false;

  return (
    validateBasicWorkoutItem(item) &&
    "type" in item &&
    (item as WorkoutItemSuperset).type === "superset" &&
    "items" in item &&
    Array.isArray((item as WorkoutItemSuperset).items) &&
    (item as WorkoutItemSuperset).items.every(
      subItem =>
        typeof subItem.id === "string" &&
        typeof subItem.name === "string" &&
        typeof subItem.reps === "number" &&
        typeof subItem.weight === "number" &&
        (subItem.weightUnit === "kg" || subItem.weightUnit === "lbs")
    ) &&
    "sets" in item &&
    Array.isArray((item as WorkoutItemSuperset).sets) &&
    (item as WorkoutItemSuperset).sets.every(set => typeof set.isCompleted === "boolean") &&
    "restInSec" in item &&
    typeof (item as WorkoutItemSuperset).restInSec === "number"
  );
}

export default {
  validateBasicWorkoutItem,
  validateWorkoutItemAerobic,
  validateWorkoutItemAnaerobic,
  validateWorkoutItemSuperset,
};
