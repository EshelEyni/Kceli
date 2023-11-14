import { FC } from "react";
import { useDayEdit } from "./DayEditContext";
import "./PreSaveCalorieCount.scss";

export const PreSaveCalorieCount: FC = () => {
  const { intake, consumedCalories, remainingCalories } = useDayEdit();

  if (!intake || !intake.isRecorded) return null;

  const intakeTotalCalorie = Math.round(
    intake.items.reduce((acc, curr) => {
      if (curr.calories === undefined) return acc;
      return acc + curr.calories;
    }, 0)
  );

  if (intakeTotalCalorie <= 0) return null;

  const preSaveConsumedCalories = consumedCalories + intakeTotalCalorie;
  const preSaveRemainingCalories = remainingCalories - intakeTotalCalorie;

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
