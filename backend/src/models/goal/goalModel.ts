import mongoose, { Document, Schema } from "mongoose";
import { IGoal } from "../../types/iTypes";

const schemaOptions = {
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
};

const goalSchema = new Schema<IGoal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user id"],
    },
    date: {
      type: Date,
      required: [true, "Please provide a date"],
    },
    type: {
      type: String,
      enum: ["user", "week", "month"],
      required: [true, "Please provide a type"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions
);

goalSchema.pre("save", async function (next) {
  this._id = new mongoose.Types.ObjectId();
  next();
});

const GoalModel = mongoose.model<IGoal>("goal", goalSchema);

export default GoalModel;
