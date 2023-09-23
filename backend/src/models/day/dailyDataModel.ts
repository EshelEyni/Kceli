import { Schema, model } from "mongoose";
import { intakeSchema } from "./dailyDataSubSchema";

const dailyDataSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a user id"],
  },
  intakes: {
    type: [intakeSchema],
    default: [],
  },
});

dailyDataSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyDataModel = model("DailyData", dailyDataSchema, "daily_data");

export { DailyDataModel };

// Path: src/models/day/dailyDataSubSchema.ts
