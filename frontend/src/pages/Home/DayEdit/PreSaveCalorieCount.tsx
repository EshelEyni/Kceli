import { FC } from "react";
import { useDayEdit } from "./DayEditContext";
import "./PreSaveCalorieCount.scss";
import { useAuth } from "../../../hooks/useAuth";
import calorieUtilService from "../../../services/calorieUtil/calorieUtilService";

export const PreSaveCalorieCount: FC = () => {
  const { loggedInUser } = useAuth();
  const { intake, dailyData, color } = useDayEdit();
  if (!dailyData || !intake || !intake.isRecorded) return null;
  const intakeTotalCalorie = Math.round(
    intake.items.reduce((acc, curr) => {
      if (curr.calories === undefined) return acc;
      return acc + curr.calories;
    }, 0)
  );
  if (intakeTotalCalorie <= 0) return null;

  const data = {
    ...dailyData,
    intakes: dailyData?.intakes.filter(i => i.id !== intake.id),
  };

  const consumedCalories = calorieUtilService.getTotalCalories(data);
  const remainingCalories = calorieUtilService.calcRemainingCalories(loggedInUser, data);

  const preSaveConsumedCalories = consumedCalories + intakeTotalCalorie;
  const preSaveRemainingCalories = remainingCalories - intakeTotalCalorie;

  return (
    <section className="pre-save-calorie-count" style={{ color }}>
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
