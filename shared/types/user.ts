import { Gender } from "./system";

export interface UserCredenitials {
  username: string;
  fullname: string;
  password: string;
  passwordConfirm: string;
  email: string;
  weight: number;
  height: number;
  gender: Gender;
  birthdate: Date;
}

export interface UserCredenitialsWithId extends UserCredenitials {
  readonly id: string;
}

export interface User {
  readonly id: string;
  username: string;
  fullname: string;
  email: string;
  imgUrl: string;
  isAdmin: boolean;
  weight: number;
  height: number;
  gender: Gender;
  birthdate: Date;
  totalDailyEnergyExpenditure: number;
  targetCaloricIntakePerDay: number;
  currentWeightLossGoal: number;
  createdAt: string;
}

export type UserDailyStatsResult = {
  date: Date;
  weight: number;
  waist: number;
};
