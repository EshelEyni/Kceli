import { DayData } from "./../../../shared/types/dayData";

export const demoData: DayData = {
  date: new Date(),
  intakes: [
    {
      id: "1",
      items: [
        {
          id: "1",
          name: "Milk",
          amount: 200,
          unit: "ml",
          calories: 100,
        },
        {
          id: "2",
          name: "Bread",
          amount: 100,
          unit: "g",
          calories: 250,
        },
        {
          id: "3",
          name: "Butter",
          amount: 10,
          unit: "g",
          calories: 100,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};
