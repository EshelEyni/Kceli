"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyDataModel = void 0;
const mongoose_1 = require("mongoose");
const dailyDataSubSchema_1 = require("./dailyDataSubSchema");
const dailyDataSchema = new mongoose_1.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user id"],
    },
    weight: {
      type: Number,
    },
    waist: {
      type: Number,
    },
    intakes: {
      type: [dailyDataSubSchema_1.intakeSchema],
      default: [],
    },
  },
  {
    toObject: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
        return ret;
      },
    },
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
        return ret;
      },
    },
    timestamps: true,
  }
);
dailyDataSchema.index({ userId: 1, date: 1 }, { unique: true });
const DailyDataModel = (0, mongoose_1.model)("DailyData", dailyDataSchema, "daily_data");
exports.DailyDataModel = DailyDataModel;
// Path: src/models/day/dailyDataSubSchema.ts
//# sourceMappingURL=dailyDataModel.js.map
