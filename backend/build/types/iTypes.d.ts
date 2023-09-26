import mongoose, { Document } from "mongoose";
import { Gender } from "../../../shared/types/system";
import { MeasurementUnit } from "../../../shared/types/intake";
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
    weight?: number;
    waist?: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface IIntake extends Document {
    name: string;
    items: IIntakeItem[];
    isRecorded: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IIntakeItem extends Document {
    name: string;
    unit: MeasurementUnit;
    quantity: number;
    calories: number;
    _caloriesPer100g?: number;
}
