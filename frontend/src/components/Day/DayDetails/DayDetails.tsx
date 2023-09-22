import React from "react";
import { demoData } from "../../../data/data";
import { CaloriePie } from "../../Charts/CaloriePie/CaloriePie";
import { RemainingCaloriesTitle } from "../../Calories/RemainingCaloriesTitle/RemainingCaloriesTitle";
import { FoodItemEdit } from "../../FoodItem/FoodItemEdit/FoodItemEdit";
import { useSelector } from "react-redux";
import { RootState } from "../../../types/app";

export const DayDetails = () => {
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const data = demoData;
  if (!loggedInUser) return null;

  const remainingCalories =
    loggedInUser.targetCaloricIntakePerDay -
    data.intakes.reduce(
      (acc, curr) => curr.items.reduce((acc, curr) => acc + curr.calories, acc),
      0
    );

  return (
    <section>
      <CaloriePie intakes={data.intakes} remainingCalories={remainingCalories} />
      <RemainingCaloriesTitle remainingCalories={remainingCalories} />
      <FoodItemEdit />
    </section>
  );
};
