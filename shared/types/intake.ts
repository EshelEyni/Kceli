export type IntakeItem = {
  id: string;
  unit: "g" | "ml" | "unit";
  amount: number;
  name: string;
  calories: number;
};

export type Intake = {
  id: string;
  items: IntakeItem[];
  createdAt: Date;
  updatedAt: Date;
};
