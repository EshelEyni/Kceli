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
  targetCaloricIntakePerDay: number;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface IIntake extends Document {
  name: string;
  items: IIntakeItem[];
}

export interface IIntakeItem extends Document {
  name: string;
  unit: MeasurementUnit;
  quantity: number;
  calories: number;
}
