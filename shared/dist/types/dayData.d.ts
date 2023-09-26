import { CombinedIntake } from "./intake";
export interface BasicDayData {
    date: Date;
}
export interface DayData extends BasicDayData {
    readonly userId: string;
    readonly id: string;
    intakes: CombinedIntake[];
    weight: number;
    waist: number;
    createdAt: Date;
    updatedAt: Date;
}
