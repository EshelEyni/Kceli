export type Split = "FBW" | "A" | "B" | "C" | "D" | "E" | "F";
export type WorkoutType = "anaerobic" | "aerobic";
export type WeightUnit = "kg" | "lbs";

interface BasicWorkout {
  readonly id: string;
  description: string;
}

export interface WorkoutAnaerobic extends BasicWorkout {
  type: "anaerobic";
  split: Split;
  items: CombinedWorkoutItem[];
}

export interface WorkoutAerobic extends BasicWorkout {
  type: "aerobic";
  items: WorkoutItemAerobic[];
}

export type Workout = WorkoutAnaerobic | WorkoutAerobic;

export interface BasicWorkoutItem {
  readonly id: string;
  name: string;
  isStarted: boolean;
  isCompleted: boolean;
}

export interface WorkoutItemAerobic extends BasicWorkoutItem {
  type: "aerobic";
  durationInMin: number;
}

export type WorkoutSet = { isCompleted: boolean };

export interface WorkoutItemAnaerobic extends BasicWorkoutItem {
  type: "anaerobic";
  sets: WorkoutSet[];
  reps: number;
  weight: number;
  weightUnit: WeightUnit;
  restInSec: number;
}

export type SupersetItem = {
  id: string;
  name: string;
  reps: number;
  weight: number;
  weightUnit: WeightUnit;
};

export interface WorkoutItemSuperset extends BasicWorkoutItem {
  type: "superset";
  items: SupersetItem[];
  sets: WorkoutSet[];
  restInSec: number;
}

export type CombinedWorkoutItem =
  | WorkoutItemAerobic
  | WorkoutItemAnaerobic
  | WorkoutItemSuperset;
