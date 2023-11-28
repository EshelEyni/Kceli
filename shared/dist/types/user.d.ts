import { Gender } from "./system";
import { Workout } from "./workout";
export type WorkoutDay = {
    name: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
    value: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    workouts: Workout[];
};
export type UserWorkoutSchedule = WorkoutDay[];
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
    workoutSchedule: UserWorkoutSchedule;
    createdAt: string;
}
export type UserDailyStatsResult = {
    date: Date;
    weight: number;
    waist: number;
};
export type WeightLossGoal = {
    startingWeight: number;
    weightGoal: number;
};
