import { DayData } from "./../../../shared/types/dayData";

export const demoData: DayData = {
  date: new Date(),
  foodItems: [
    {
      amount: 1,
      name: "Apple",
      calories: 100,
    },
    {
      amount: 2,
      name: "Banana",
      calories: 200,
    },
  ],
};
