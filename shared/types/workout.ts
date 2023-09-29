export interface WorkoutAnaerobic {
  readonly id: string;
  type: "anaerobic";
  split: "FBW" | "A" | "B" | "C" | "D" | "E" | "F";
  items: CombinedAnaerobicWorkoutItem[];
}

export interface WorkoutAerobic {
  readonly id: string;
  type: "aerobic";
  items: WorkoutItemAerobic[];
}

export type Workout = WorkoutAnaerobic | WorkoutAerobic;

export interface WorkoutItemAnaerobic {
  readonly id: string;
  workoutId: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  weightUnit: "kg" | "lbs";
  restInSec: number;
}

export interface WorkoutItemAerobic {
  readonly id: string;
  workoutId: string;
  name: string;
  durationInMin: number;
}

export interface WorkoutItemSuperset {
  readonly id: string;
  workoutId: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  weightUnit: "kg" | "lbs";
  restInSec: number;
  superset: WorkoutItemAnaerobic[];
}

export type CombinedAnaerobicWorkoutItem =
  | WorkoutItemAnaerobic
  | WorkoutItemSuperset;
