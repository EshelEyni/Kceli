import { CombinedIntake } from "./intake";
import { Workout } from "./workout";
export interface BasicDayData {
    date: Date;
}
export interface DayData extends BasicDayData {
    readonly userId: string;
    readonly id: string;
    intakes: CombinedIntake[];
    workouts: Workout[];
    hungerEvents: HungerEvent[];
    weight: number;
    waist: number;
    isWeightWaistIgnored: boolean;
    totalDailyEnergyExpenditure: number;
    targetCaloricIntake: number;
    createdAt: Date;
    updatedAt: Date;
}
export type HungerEvent = {
    date: Date;
    level: number;
};
