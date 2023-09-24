import { Intake, NewIntake } from "./intake";

export interface BasicDayData {
  date: Date;
}

export interface TodayData extends BasicDayData {
  intakes: NewIntake[];
}

export interface DayData extends BasicDayData {
  readonly userId: string;
  readonly id: string;
  intakes: Intake[];
  createdAt: Date;
  updatedAt: Date;
}
