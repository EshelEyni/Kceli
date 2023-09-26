export enum MeasurementUnit {
  UNIT = "unit",
  GRAM = "g",
  CUP = "cup",
  TABLE_SPOON = "tbsp",
  TEA_SPOON = "tsp",
  MILLILITER = "ml",
}

export interface BasicIntakeItem {
  id: string;
  unit: MeasurementUnit;
  quantity: number;
  name: string;
}

export interface ExistingIntakeItemData extends BasicIntakeItem {
  calories: number;
}

export interface NewIntakeItem extends BasicIntakeItem {
  calories?: number;
  caloriesPer100g?: number;
}

export interface IntakeItem extends BasicIntakeItem {
  calories: number;
}

export interface BasicIntake {
  id: string;
  name: string;
  isRecorded: boolean;
}

export interface NewIntake extends BasicIntake {
  items: NewIntakeItem[];
}

export interface Intake extends BasicIntake {
  items: IntakeItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type CombinedIntake = NewIntake | Intake;
