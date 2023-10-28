import mongoose, { Document, Schema } from "mongoose";
import { IWorkout, IWorkoutItem } from "../../types/iTypes";
import { WeightUnit } from "../../../../shared/types/workout";

function validateAerobicFields(this: IWorkoutItem, value: string) {
  if (value !== "aerobic") return true;
  if (!this.durationInMin) throw new Error("Duration is required for aerobic type");
  return true;
}

function validateAnaerobicFields(this: IWorkoutItem, value: string) {
  if (value !== "anaerobic") return true;

  if (!this.sets) throw new Error("Sets are required for anaerobic type");
  if (!this.reps) throw new Error("Reps are required for anaerobic type");
  if (!this.weight) throw new Error("Weight is required for anaerobic type");
  if (!this.weightUnit) throw new Error("WeightUnit is required for anaerobic type");
  if (!this.restInSec) throw new Error("RestInSec is required for anaerobic type");

  return true;
}

function validateSupersetFields(this: IWorkoutItem, value: string) {
  if (value !== "superset") return true;

  if (!this.sets) throw new Error("Sets are required for superset type");
  if (!this.restInSec) throw new Error("RestInSec is required for superset type");
  if (!this.items) throw new Error("Items are required for superset type");

  return true;
}

const workoutItemSchema = new Schema<IWorkoutItem>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for the workout item"],
    },
    isStarted: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: {
        values: ["aerobic", "anaerobic", "superset"],
        message: "type must be either aerobic, anaerobic or superset",
      },
      default: "anaerobic",
      validate: [
        { validator: validateAerobicFields },
        { validator: validateAnaerobicFields },
        { validator: validateSupersetFields },
      ],
    },
    durationInMin: Number,
    sets: {
      type: [{ isCompleted: { type: Boolean } }],
      default: undefined,
    },
    reps: {
      type: Number,
      default: undefined,
    },
    weight: {
      type: Number,
      default: undefined,
    },
    weightUnit: {
      type: String,
      enum: {
        values: Object.values(WeightUnit),
        message: "weightUnit must be either kg or lbs",
      },
      default: undefined,
    },
    restInSec: {
      type: Number,
      default: undefined,
    },
    items: {
      type: [
        {
          name: {
            type: String,
            required: [true, "Please provide a name for the superset item"],
          },
          reps: {
            type: Number,
            required: [true, "Please provide a reps for the superset item"],
          },
          weight: {
            type: Number,
            required: [true, "Please provide a weight for the superset item"],
          },
          weightUnit: {
            type: String,
            enum: {
              values: Object.values(WeightUnit),
              message: "weightUnit must be either kg or lbs",
            },
            required: [true, "Please provide a weightUnit for the superset item"],
          },
        },
      ],
      default: undefined,
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

const workoutSchema = new Schema<IWorkout>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide a userId"],
    },
    type: {
      type: String,
      enum: {
        values: ["aerobic", "anaerobic"],
        message: "type must be either aerobic or anaerobic",
      },
      default: "anaerobic",
    },
    split: {
      type: String,
      enum: {
        values: ["FBW", "A", "B", "C", "D", "E", "F"],
        message: "split must be either FBW, A, B, C, D, E or F",
      },
      default: "FBW",
    },
    description: {
      type: String,
      trim: true,
      default: "no description",
    },
    items: [workoutItemSchema],
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
