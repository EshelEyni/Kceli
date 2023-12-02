import { Document, Schema, model } from "mongoose";
import { intakeSchema } from "../intake/intakeModel";
import { IDailyData, IHungerEvent } from "../../types/iTypes";
import calorieService from "../../services/calorie/calorieService";
import { UserModel } from "../user/userModel";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
import { workoutSchema } from "../workout/workoutModel";

const hungerEventSchema = new Schema<IHungerEvent>(
  {
    date: {
      type: Date,
      default: new Date(),
    },
    level: {
      type: Number,
      min: 1,
      max: 5,
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

const dailyDataSchema = new Schema<IDailyData>(
  {
    date: {
      type: Date,
      default: new Date(),
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
    isWeightWaistIgnored: {
      type: Boolean,
      default: false,
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
    hungerEvents: {
      type: [hungerEventSchema],
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

dailyDataSchema.pre("save", async function (next) {
  const userId = this.get("userId");
  const prevDayTargetCaloricIntake = await DailyDataModel.findOne({
    userId,
  })
    .select("targetCaloricIntake")
    .sort({ date: -1 })
    .limit(1);

  if (!prevDayTargetCaloricIntake) return next();
  const { targetCaloricIntake } = prevDayTargetCaloricIntake;
  this.set("targetCaloricIntake", targetCaloricIntake);
  next();
});

dailyDataSchema.pre("save", async function (next) {
  const day = new Date(this.get("date")).getDay();
  const userId = this.get("userId");
  const lastUncompletedWorkout = await DailyDataModel.findOne({
    userId,
    "workouts.items": { $not: { $elemMatch: { isStarted: true } } },
  }).select("workouts");

  if (lastUncompletedWorkout && lastUncompletedWorkout.workouts.length > 0) {
    const workouts =
      lastUncompletedWorkout?.workouts.map(workout => {
        workout.items = workout.items.map(item => {
          (item.isStarted = false), (item.isCompleted = false);
          return item;
        });
        return workout;
      }) ?? [];

    this.set("workouts", workouts);
    return next();
  }

  const user = await UserModel.findById(userId);
  if (!user) return next();
  const { workoutSchedule } = user;
  const workoutFromSchedule = workoutSchedule.find(workout => workout.value === day);
  this.set("workouts", workoutFromSchedule?.workouts ?? []);
});

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
