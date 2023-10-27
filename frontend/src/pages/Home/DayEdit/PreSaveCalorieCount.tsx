import { FC } from "react";
import { useDayEdit } from "./DayEditContext";
import "./PreSaveCalorieCount.scss";

export const PreSaveCalorieCount: FC = () => {
  const { intake, consumedCalories, remainingCalories } = useDayEdit();
  const intakeTotalCalorie = intake.items.reduce((acc, curr) => {
    if (curr.calories === undefined) return acc;
    return acc + curr.calories;
  }, 0);

  const preSaveConsumedCalories = consumedCalories + intakeTotalCalorie;
  const preSaveRemainingCalories = remainingCalories - intakeTotalCalorie;

  if (intakeTotalCalorie <= 0) return null;
  return (
    <section className="pre-save-calorie-count">
      <p>
        <strong>Total:</strong> <span>{intakeTotalCalorie}</span>
      </p>
      <p>
        <strong>Consumed:</strong> <span>{preSaveConsumedCalories}</span>
      </p>
      <p>
        <strong>Remaining:</strong> <span>{preSaveRemainingCalories}</span>
      </p>
    </section>
  );
};
