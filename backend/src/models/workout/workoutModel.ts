import mongoose, { Document, Schema } from "mongoose";
import {
  IWorkout,
  IWorkoutItemAerobic,
  IWorkoutItemAnaerobic,
  IWorkoutItemSuperset,
} from "../../types/iTypes";

const workoutItemAnaerobicSchema = new Schema<IWorkoutItemAnaerobic>(
  {
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    weightUnit: {
      type: String,
      enum: ["kg", "lbs"],
    },
    isStarted: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    setCompletedStatus: {
      type: [Boolean],
      default: [],
    },
    restInSec: Number,
  },
  {
    toObject: {
      virtuals: true,
      transform: (_: Document, ret: Record<string, unknown>) => {
        delete ret._id;
        return ret;
      },
    },
    toJSON: {
      virtuals: true,
      transform: (_: Document, ret: Record<string, unknown>) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const workoutItemAerobicSchema = new Schema<IWorkoutItemAerobic>(
  {
    name: String,
    durationInMin: Number,
    isStarted: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toObject: {
      virtuals: true,
      transform: (_: Document, ret: Record<string, unknown>) => {
        delete ret._id;
        return ret;
      },
    },
    toJSON: {
      virtuals: true,
      transform: (_: Document, ret: Record<string, unknown>) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const workoutItemSupersetSchema = new Schema<IWorkoutItemSuperset>(
  {
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    weightUnit: {
      type: String,
      enum: ["kg", "lbs"],
    },
    restInSec: Number,
    isStarted: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    superset: [workoutItemAnaerobicSchema],
  },
  {
    toObject: {
      virtuals: true,
      transform: (_: Document, ret: Record<string, unknown>) => {
        delete ret._id;
        return ret;
      },
    },
    toJSON: {
      virtuals: true,
      transform: (_: Document, ret: Record<string, unknown>) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

const workoutSchema = new Schema<IWorkout>(
  {
    type: {
      type: String,
      enum: ["aerobic", "anaerobic"],
      default: "anaerobic",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide a userId"],
    },
    split: {
      type: String,
      enum: ["FBW", "A", "B", "C", "D", "E", "F"],
      default: "FBW",
    },
    description: {
      type: String,
      trim: true,
      default: "no description",
    },
    items: [
      {
        type: mongoose.Schema.Types.Mixed,
        enum: [workoutItemAnaerobicSchema, workoutItemAerobicSchema, workoutItemSupersetSchema],
      },
    ],
  },
  {
    toObject: {
      virtuals: true,
      transform: (_: Document, ret: Record<string, unknown>) => {
        delete ret._id;
        return ret;
      },
    },
    toJSON: {
      virtuals: true,
      transform: (_: Document, ret: Record<string, unknown>) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

const WorkoutModel = mongoose.model("workouts", workoutSchema);

export { workoutSchema, WorkoutModel };
