import { Intake } from "./intake";

export interface BasicDayData {
  date: Date;
  intakes: Intake[];
}

export interface DayData extends BasicDayData {
  readonly userId: string;
  readonly id: string;
}
