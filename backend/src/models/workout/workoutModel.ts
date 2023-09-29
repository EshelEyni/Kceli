import mongoose, { Document, Schema } from "mongoose";

const workoutItemAnaerobicSchema = new Schema(
  {
    workoutId: String,
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    weightUnit: {
      type: String,
      enum: ["kg", "lbs"],
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
const workoutItemAerobicSchema = new Schema(
  {
    workoutId: String,
    name: String,
    durationInMin: Number,
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
const workoutItemSupersetSchema = new Schema(
  {
    workoutId: String,
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    weightUnit: {
      type: String,
      enum: ["kg", "lbs"],
    },
    restInSec: Number,
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

const combinedAnaerobicWorkoutItemSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["workoutItemAnaerobic", "workoutItemSuperset"],
    },
    data: Schema.Types.Mixed,
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

const workoutSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["aerobic", "anaerobic"],
      required: [true, "Please provide a type"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide a userId"],
    },
    splits: {
      type: Number,
      enum: ["FBW", "A", "B", "C", "D", "E", "F"],
    },
    items: [combinedAnaerobicWorkoutItemSchema],
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

export { WorkoutModel };
