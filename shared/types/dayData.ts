import { CombinedIntake } from "./intake";
import { Workout } from "./workout";

export interface BasicDayData {
  localDate?: string;
  timeZone?: string;
  date: Date;
}

export interface DayData extends BasicDayData {
  readonly userId: string;
  readonly id: string;
  intakes: CombinedIntake[];
  workouts: Workout[];
  weight: number;
  waist: number;
  isWeightWaistIgnored: boolean;
  totalDailyEnergyExpenditure: number;
  targetCaloricIntake: number;
  createdAt: Date;
  updatedAt: Date;
}
