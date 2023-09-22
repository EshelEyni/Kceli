export type IntakeItem = {
  amount: number;
  name: string;
  calories: number;
};

export type IntakeEntry = {
  id: string;
  items: IntakeItem[];
  createdAt: string;
  updatedAt: string;
};
