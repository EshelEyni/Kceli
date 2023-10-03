import mongoose, { Document } from "mongoose";
import { Gender } from "../../../shared/types/system";
import { MeasurementUnit } from "../../../shared/types/intake";
import { WeightLossGoal } from "../../../shared/types/user";

export interface IUser extends Document {
  username: string;
  password: string;
  passwordConfirm: string;
  email: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  fullname: string;
  imgUrl: string;
  weight: number;
  height: number;
  gender: Gender;
  birthdate: Date;
  totalDailyEnergyExpenditure: number;
  targetCaloricIntakePerDay: number;
  weightLossGoal: WeightLossGoal;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  // eslint-disable-next-line no-unused-vars
  checkPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  changedPasswordAfter: (JWTTimestamp: number) => boolean;
  createPasswordResetToken: () => string;
  loginAttempts: number;
  lockedUntil: number;
  bio: string;
}

export interface IDailyData extends Document {
  date: Date;
  userId: mongoose.Types.ObjectId;
  intakes: IIntake[];
  workouts: IWorkout[];
  weight?: number;
  waist?: number;
  totalDailyEnergyExpenditure?: number;
  targetCaloricIntake?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IIntake extends Document {
  items: IIntakeItem[];
  isRecorded: boolean;
  recordedAt?: Date;
}

export interface IIntakeItem extends Document {
  name: string;
  unit: MeasurementUnit;
  quantity: number;
  calories: number;
  _caloriesPer100g?: number;
}

interface BasicIWokoutItem {
  name: string;
  isStarted: boolean;
  isCompleted: boolean;
}

export interface IWorkoutItemAnaerobic extends Document, BasicIWokoutItem {
  sets: number;
  reps: number;
  weight: number;
  weightUnit: "kg" | "lbs";
  restInSec: number;
  setCompletedStatus: boolean[];
}

export interface IWorkoutItemAerobic extends Document, BasicIWokoutItem {
  durationInMin: number;
}

export interface IWorkoutItemSuperset extends Document, BasicIWokoutItem {
  sets: number;
  reps: number;
  weight: number;
  weightUnit: "kg" | "lbs";
  restInSec: number;
  superset: IWorkoutItemAnaerobic[];
}

export interface IWorkout extends Document {
  type: "aerobic" | "anaerobic";
  userId: mongoose.Types.ObjectId;
  split: "FBW" | "A" | "B" | "C" | "D" | "E" | "F";
  description: string;
  items: Array<IWorkoutItemAnaerobic | IWorkoutItemAerobic | IWorkoutItemSuperset>;
}
