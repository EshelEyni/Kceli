import { Schema, model } from "mongoose";

const dailyMotivationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  localDate: { type: String, required: true },
  timeZone: { type: String, required: true },
  language: { type: String, enum: ["en", "he"], required: true },
  status: { type: String, enum: ["pending", "ready", "failed"], required: true },
  text: { type: String, maxlength: 240 },
  attemptedAt: { type: Date, required: true },
}, { timestamps: true });
dailyMotivationSchema.index({ userId: 1, localDate: 1 }, { unique: true, name: "unique_user_motivation_date" });
export const DailyMotivationModel = model("DailyMotivation", dailyMotivationSchema, "daily_motivation");
