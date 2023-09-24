export enum MeasurementUnit {
  UNIT = "unit",
  GRAM = "g",
  CUP = "cup",
  TABLE_SPOON = "tbsp",
  TEA_SPOON = "tsp",
  MILLILITER = "ml",
}

export interface BasicIntakeItem {
  unit: MeasurementUnit;
  quantity: number;
  name: string;
}

export interface ExistingIntakeItemData extends BasicIntakeItem {
  calories: number;
}

export interface NewIntakeItem extends BasicIntakeItem {
  tempId: string;
  calories?: number;
  caloriesPer100g?: number;
}

export interface IntakeItem extends BasicIntakeItem {
  id: string;
  calories: number;
}

export interface BasicIntake {
  name: string;
  isRecorded: boolean;
}

export interface NewIntake extends BasicIntake {
  items: NewIntakeItem[];
  tempId: string;
}

export interface Intake extends BasicIntake {
  id: string;
  items: IntakeItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type CombinedIntake = NewIntake | Intake;
