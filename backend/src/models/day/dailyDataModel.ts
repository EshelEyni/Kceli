import { Document, Schema, model } from "mongoose";
import { intakeSchema } from "./intakeSchema";
import { IDailyData } from "../../types/iTypes";
import calorieService from "../../services/calorie/calorieService";
import { UserModel } from "../user/userModel";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
import { getIsraeliDate } from "../../services/util/utilService";
import { workoutSchema } from "../workout/workoutModel";

const dailyDataSchema = new Schema<IDailyData>(
  {
    date: {
      type: Date,
      default: getIsraeliDate(),
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: [true, "Please provide a user id"],
    },
    weight: {
      type: Number,
    },
    waist: {
      type: Number,
    },
    totalDailyEnergyExpenditure: {
      type: Number,
    },
    targetCaloricIntake: {
      type: Number,
    },
    intakes: {
      type: [intakeSchema],
      default: [],
    },
    workouts: {
      type: [workoutSchema],
      default: [],
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
    timestamps: true,
  }
);

// // Pre-save middleware
// dailyDataSchema.pre("save", async function (next) {
//   // 'this' refers to the document being saved
//   const currentDate = this.date;
//   const { userId } = this;

//   // Find the most recent record for this user
//   const lastRecord = await this.constructor
//     .findOne({
//       userId: userId,
//     })
//     .sort({ date: -1 });

//   if (lastRecord) {
//     const lastDate = lastRecord.date;
//     const timeDifference = currentDate.getTime() - lastDate.getTime();

//     // Check if the time difference is less than 24 hours (in milliseconds)
//     if (timeDifference < 24 * 60 * 60 * 1000) {
//       // Throw an error or call next() with an error
//       next(new Error("Date should be more than 24 hours from the last saved data for this user."));
//       return;
//     }
//   }

//   // If validation passes, proceed to save
//   next();
// });

dailyDataSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const isWeightUpdated = update && "weight" in update;

  if (!isWeightUpdated) return next();

  const loggedInUserId = getLoggedInUserIdFromReq();
  if (!loggedInUserId) return next();
  const user = await UserModel.findById(loggedInUserId);
  if (!user) return next();
  const { height, gender, birthdate } = user;
  const { weight } = update;
  const age = new Date().getFullYear() - birthdate.getFullYear();
  const TDEE = calorieService.calcTotalDailyEnergyExpenditure({
    weight,
    height,
    age,
    gender,
  });
  const targetCaloricIntake = calorieService.calcTargetCaloricIntakePerDay({ TDEE });
  this.setOptions({ runValidators: true });
  this.updateOne({ totalDailyEnergyExpenditure: TDEE, targetCaloricIntake });
  next();
});

const DailyDataModel = model("DailyData", dailyDataSchema, "daily_data");

export { DailyDataModel };

// Path: src/models/day/dailyDataSubSchema.ts
