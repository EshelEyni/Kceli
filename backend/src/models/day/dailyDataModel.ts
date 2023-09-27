import { Document, Schema, model } from "mongoose";
import { intakeSchema } from "./dailyDataSubSchema";
import { IDailyData } from "../../types/iTypes";
import calorieService from "../../services/calorie/calorieService";
import { UserModel } from "../user/userModel";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
import { getIsraeliDate } from "../../services/util/utilService";

const dailyDataSchema = new Schema<IDailyData>(
  {
    date: {
      type: Date,
      default: getIsraeliDate(),
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

dailyDataSchema.index({ userId: 1, date: 1 }, { unique: true });

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
  const TDEE = calorieService.calculateTotalDailyEnergyExpenditure({
    weight,
    height,
    age,
    gender,
  });
  const targetCaloricIntake = calorieService.calculateTargetCaloricIntakePerDay({ TDEE });
  this.setOptions({ runValidators: true });
  this.updateOne({ totalDailyEnergyExpenditure: TDEE, targetCaloricIntake });
  next();
});

const DailyDataModel = model("DailyData", dailyDataSchema, "daily_data");

export { DailyDataModel };

// Path: src/models/day/dailyDataSubSchema.ts
