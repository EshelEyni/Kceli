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
    weight: number;
    waist: number;
    totalDailyEnergyExpenditure: number;
    targetCaloricIntake: number;
    createdAt: Date;
    updatedAt: Date;
}
