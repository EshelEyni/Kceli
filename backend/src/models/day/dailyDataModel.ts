import { Schema } from "mongoose";

const dailyDataSchema = new Schema({
  date: {
    type: Date,
    required: [true, "Please provide a date"],
    unique: true,
  },
  dailyData: {
    type: Array,
    required: [true, "Please provide daily data"],
  },
});
