import mongoose, { Document } from "mongoose";
import { Gender } from "../../../shared/types/system";
import { MeasurementUnit } from "../../../shared/types/intake";
import { UserWorkoutSchedule, WeightLossGoal } from "../../../shared/types/user";
import { CombinedWorkoutItem, WeightUnit } from "../../../shared/types/workout";
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
    workoutSchedule: UserWorkoutSchedule;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
    active: boolean;
    checkPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
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
    isWeightWaistIgnored?: boolean;
    totalDailyEnergyExpenditure?: number;
    targetCaloricIntake?: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface IIntake extends Document {
    name: string;
    items: IIntakeItem[];
    isRecorded: boolean;
    recordedAt?: Date;
    type: "food" | "drink";
}
export interface IFavoriteIntake extends IIntake {
    userId: mongoose.Types.ObjectId;
    sortOrder: number;
}
export interface IIntakeItem extends Document {
    name: string;
    unit: MeasurementUnit;
    quantity: number;
    calories: number;
    _caloriesPer100g?: number;
}
export interface IWorkoutItem extends Document {
    name: string;
    isStarted: boolean;
    isCompleted: boolean;
    type: "aerobic" | "anaerobic" | "superset";
    durationInMin?: number;
    sets?: number;
    reps?: number;
    weight?: number;
    weightUnit?: WeightUnit;
    restInSec?: number;
    items?: Array<{
        name: string;
        reps: number;
        weight: number;
        weightUnit: WeightUnit;
    }>;
    caloriesBurned?: number;
}
export interface IWorkout extends Document {
    type: "aerobic" | "anaerobic";
    userId: mongoose.Types.ObjectId;
    split: "FBW" | "A" | "B" | "C" | "D" | "E" | "F";
    description: string;
    items: Array<CombinedWorkoutItem>;
    durationInMin?: number;
}
