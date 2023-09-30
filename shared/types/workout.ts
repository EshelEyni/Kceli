interface BasicWorkout {
  readonly id: string;
  description: string;
}

export interface WorkoutAnaerobic extends BasicWorkout {
  type: "anaerobic";
  split: "FBW" | "A" | "B" | "C" | "D" | "E" | "F";
  items: CombinedWorkoutItem[];
}

export interface WorkoutAerobic extends BasicWorkout {
  type: "aerobic";
  items: WorkoutItemAerobic[];
}

export type Workout = WorkoutAnaerobic | WorkoutAerobic;

interface BasicWorkoutItem {
  readonly id: string;
  name: string;
  isCompleted?: boolean;
}

export interface WorkoutItemAnaerobic extends BasicWorkoutItem {
  type: "anaerobic";
  sets: number;
  reps: number;
  weight: number;
  weightUnit: "kg" | "lbs";
  restInSec: number;
}

export interface WorkoutItemAerobic extends BasicWorkoutItem {
  type: "aerobic";
  durationInMin: number;
}

export interface WorkoutItemSuperset extends BasicWorkoutItem {
  type: "superset";
  items: WorkoutItemAnaerobic[];
}

export type CombinedWorkoutItem =
  | WorkoutItemAerobic
  | WorkoutItemAnaerobic
  | WorkoutItemSuperset;
